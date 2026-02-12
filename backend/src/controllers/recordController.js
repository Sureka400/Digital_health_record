const HealthRecord = require('../models/HealthRecord');
const Consent = require('../models/Consent');
const Patient = require('../models/Patient');
const { signToken, verifyToken } = require('../utils/jwt');

// Get all records for the logged-in patient (their own or shared with them)
exports.getRecords = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    if (userRole === 'PATIENT') {
      // Patients see only their own records
      const records = await HealthRecord.find({ patient: userId }).sort({ createdAt: -1 });
      return res.json({ records });
    }
    
    if (userRole === 'ADMIN') {
      // Admins see all records
      const records = await HealthRecord.find().sort({ createdAt: -1 });
      return res.json({ records });
    }
    
    if (userRole === 'DOCTOR') {
      // 1. Get all consents for this doctor
      const consents = await Consent.find({ 
        grantee: userId, 
        granted: true, 
        expiresAt: { $gt: new Date() } 
      });

      // 2. Separate patients where doctor has full access vs limited access
      const fullAccessPatientIds = [];
      const specificRecordIds = [];

      consents.forEach(c => {
        if (!c.records || c.records.length === 0) {
          fullAccessPatientIds.push(c.patient);
        } else {
          specificRecordIds.push(...c.records);
        }
      });

      // 3. Find records
      const records = await HealthRecord.find({
        $or: [
          { createdBy: userId },
          { patient: { $in: fullAccessPatientIds } },
          { _id: { $in: specificRecordIds } }
        ]
      }).sort({ createdAt: -1 });

      return res.json({ records });
    }
    
    res.status(403).json({ error: 'Forbidden' });
  } catch (err) { next(err); }
};

// Get a single record by ID
exports.getRecordById = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const record = await HealthRecord.findById(recordId);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Authorization: owner, admin, or consented doctor
    const isOwner = String(record.patient) === userId;
    const isAdmin = userRole === 'ADMIN';
    const isCreator = String(record.createdBy) === userId;
    
    if (!isOwner && !isAdmin && !isCreator) {
      if (userRole === 'DOCTOR') {
        const consent = await Consent.findOne({
          patient: record.patient,
          grantee: userId,
          granted: true,
          expiresAt: { $gt: new Date() }
        });
        if (!consent) return res.status(403).json({ error: 'No consent granted' });
        
        // If consent is limited to specific records, check if this record is included
        if (consent.records && consent.records.length > 0) {
          if (!consent.records.includes(record._id)) {
            return res.status(403).json({ error: 'Access to this specific record not granted' });
          }
        }
      } else {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
    
    res.json({ record });
  } catch (err) { next(err); }
};

// Get record by QR token (public endpoint)
exports.getRecordByQR = async (req, res, next) => {
  try {
    const { qrId } = req.params;
    const payload = verifyToken(qrId);
    if (!payload || payload.type !== 'qr') return res.status(401).json({ error: 'Invalid QR token' });
    
    const record = await HealthRecord.findById(payload.recordId).select('-__v');
    if (!record) return res.status(404).json({ error: 'Record not found' });
    
    res.json({ record });
  } catch (err) { next(err); }
};

// Create a new health record (metadata only). Only patient owner or doctor can create.
exports.createRecord = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Only PATIENT and DOCTOR can create records
    if (!['PATIENT', 'DOCTOR'].includes(userRole)) {
      return res.status(403).json({ error: 'Only patients and doctors can create records' });
    }
    
    // Patients can only create for themselves; doctors can create for any patient
    let patientId = req.body.patientId || userId;
    if (userRole === 'PATIENT' && patientId !== userId) {
      return res.status(403).json({ error: 'Patients can only create records for themselves' });
    }
    
    // Verify patient exists
    const patientExists = await Patient.exists({ _id: patientId });
    if (!patientExists) return res.status(404).json({ error: 'Patient not found' });

    const payload = { 
      patient: patientId, 
      title: req.body.title || 'Untitled', 
      description: req.body.description || '', 
      category: req.body.category || '',
      hospital: req.body.hospital || '',
      doctor: req.body.doctor || '',
      metadata: req.body.metadata || {}, 
      fileUrl: req.file ? req.file.filename : (req.body.fileUrl || null),
      createdBy: userId, 
      createdByRole: userRole
    };
    const rec = new HealthRecord(payload);
    await rec.save();
    res.status(201).json({ record: rec });
  } catch (err) { next(err); }
};

// Create a QR token for a record (short-lived)
exports.createQrToken = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const record = await HealthRecord.findById(recordId);
    if (!record) return res.status(404).json({ error: 'Not found' });
    if (req.user.role === 'PATIENT' && req.user.id !== String(record.patient)) return res.status(403).json({ error: 'Forbidden' });
    const token = signToken({ type: 'qr', recordId: record._id, patientId: record.patient }, { expiresIn: '15m' });
    res.json({ qrToken: token });
  } catch (err) { next(err); }
};

// Toggle consentEnabled for a record
exports.toggleConsent = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const record = await HealthRecord.findById(recordId);
    if (!record) return res.status(404).json({ error: 'Record not found' });

    // Only owner can toggle
    if (String(record.patient) !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    record.consentEnabled = !record.consentEnabled;
    record.visibility = record.consentEnabled ? 'shared' : 'private';
    await record.save();

    res.json({ record });
  } catch (err) { next(err); }
};

// Access via QR token (public endpoint)
exports.qrAccess = async (req, res, next) => {
  try {
    const { token } = req.query;
    const payload = verifyToken(token);
    if (!payload || payload.type !== 'qr') return res.status(401).json({ error: 'Invalid token' });
    const record = await HealthRecord.findById(payload.recordId).select('-__v');
    if (!record) return res.status(404).json({ error: 'Not found' });
    res.json({ record });
  } catch (err) { next(err); }
};

// Download or return the file URL for a record
exports.downloadRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const record = await HealthRecord.findById(recordId);
    if (!record) return res.status(404).json({ error: 'Not found' });
    // permission: owner or admin or consented doctor
    const user = req.user || {};
    const isOwner = user.id && String(record.patient) === String(user.id);
    if (user.role === 'ADMIN' || isOwner) {
      // allowed
    } else if (user.role === 'DOCTOR') {
      const consent = await Consent.findOne({ patient: record.patient, grantee: user.id, granted: true, expiresAt: { $gt: new Date() } });
      if (!consent) return res.status(403).json({ error: 'No consent' });
      if (consent.records && consent.records.length && !consent.records.includes(record._id)) return res.status(403).json({ error: 'Not allowed for this record' });
    } else if (user.role === 'EMERGENCY') {
      // emergency tokens may allow limited access; allow download of record metadata and fileUrl only
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!record.fileUrl) return res.status(404).json({ error: 'No file attached' });

    // If fileUrl is an http(s) link, redirect the client to it so browser downloads from origin
    if (/^https?:\/\//i.test(record.fileUrl)) {
      return res.redirect(record.fileUrl);
    }

    // If fileUrl is local path inside server, stream it
    const path = require('path');
    const fs = require('fs');
    const localPath = path.join(__dirname, '..', '..', 'uploads', record.fileUrl);
    if (!fs.existsSync(localPath)) return res.status(404).json({ error: 'File missing on server' });
    res.download(localPath, `${record.title || 'record'}${path.extname(localPath)}`);
  } catch (err) { next(err); }
};

// AI Chat endpoint (Mock implementation)
exports.aiChat = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    
    // Fetch user records to provide "context"
    const records = await HealthRecord.find({ patient: userId });
    const recordsSummary = records.map(r => `${r.title} (${r.category}): ${r.description}`).join('\n');

    let response = "";
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('report') || lowerMsg.includes('summary')) {
      response = `Based on your ${records.length} records, you have: \n` + 
                 records.map(r => `- ${r.title} at ${r.hospital}`).join('\n') +
                 `\n\nYour health seems to be well documented. Is there a specific report you want me to explain?`;
    } else if (lowerMsg.includes('risk')) {
      response = "I've analyzed your medical history. Currently, your vital signs and lab results from " + 
                 (records[0] ? records[0].hospital : "your visits") + 
                 " show low risk for acute conditions. However, I recommend regular checkups for your " + 
                 (records.find(r => r.category === 'lab') ? "blood parameters." : "general health.");
    } else {
      response = "I am your AI Health Assistant. I can see you have " + records.length + " medical records. I can help you summarize them, explain medical terms, or track your health trends. What would you like to know?";
    }

    res.json({ response });
  } catch (err) { next(err); }
};
