const Consent = require('../models/Consent');
const Patient = require('../models/Patient');
const HealthRecord = require('../models/HealthRecord');

// Grant consent to a grantee
exports.grantConsent = async (req, res, next) => {
  try {
    const { grantee, granteeType, records, purpose, expiresAt } = req.body;
    const patientId = req.user.id;

    // Check if grantee exists (if DOCTOR, check Patient model with role DOCTOR)
    if (granteeType === 'DOCTOR') {
      const doctor = await Patient.findOne({ _id: grantee, role: 'DOCTOR' });
      if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    }

    // If specific records are provided, verify they belong to the patient
    if (records && records.length > 0) {
      const recordCount = await HealthRecord.countDocuments({
        _id: { $in: records },
        patient: patientId
      });
      if (recordCount !== records.length) {
        return res.status(400).json({ error: 'One or more record IDs are invalid or do not belong to you' });
      }
    }

    const consent = new Consent({
      patient: patientId,
      grantee,
      granteeType: granteeType || 'DOCTOR',
      records: records || [],
      purpose,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
      granted: true
    });

    await consent.save();
    res.status(201).json({ consent });
  } catch (err) { next(err); }
};

// Get consents for the logged-in user
exports.getConsents = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};
    if (userRole === 'PATIENT') {
      query = { patient: userId };
    } else if (userRole === 'DOCTOR') {
      query = { grantee: userId, granted: true, expiresAt: { $gt: new Date() } };
    } else if (userRole === 'ADMIN') {
      query = {};
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const consents = await Consent.find(query)
      .populate('patient', 'name email')
      .populate('records', 'title createdAt')
      .sort({ createdAt: -1 });

    res.json({ consents });
  } catch (err) { next(err); }
};

// Revoke consent
exports.revokeConsent = async (req, res, next) => {
  try {
    const { consentId } = req.params;
    const userId = req.user.id;

    const consent = await Consent.findById(consentId);
    if (!consent) return res.status(404).json({ error: 'Consent not found' });

    // Only the patient who granted the consent or an admin can revoke it
    if (String(consent.patient) !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    consent.granted = false;
    await consent.save();
    res.json({ ok: true, message: 'Consent revoked' });
  } catch (err) { next(err); }
};

// Get consent by ID
exports.getConsentById = async (req, res, next) => {
  try {
    const { consentId } = req.params;
    const consent = await Consent.findById(consentId)
      .populate('patient', 'name email')
      .populate('records', 'title createdAt');

    if (!consent) return res.status(404).json({ error: 'Consent not found' });

    const userId = req.user.id;
    const userRole = req.user.role;

    // Authorization
    const isOwner = String(consent.patient) === userId;
    const isGrantee = String(consent.grantee) === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isGrantee && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ consent });
  } catch (err) { next(err); }
};
