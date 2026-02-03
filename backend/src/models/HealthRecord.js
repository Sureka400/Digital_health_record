const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  hospital: { type: String },
  doctor: { type: String },
  metadata: { type: Object, default: {} },
  fileUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  createdByRole: { type: String, enum: ['PATIENT','DOCTOR','ADMIN'], default: 'PATIENT' },
  visibility: { type: String, enum: ['private','shared','public'], default: 'private' },
  consentEnabled: { type: Boolean, default: false },
  // AI-ready fields
  aiSummary: { type: String },
  embedding: { type: [Number] }
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', HealthRecordSchema);
