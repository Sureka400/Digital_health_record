const mongoose = require('mongoose');

const ConsentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  grantee: { type: mongoose.Schema.Types.ObjectId, required: true },
  granteeType: { type: String, enum: ['DOCTOR','ORG','SYSTEM'], default: 'DOCTOR' },
  records: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HealthRecord' }],
  purpose: { type: String },
  expiresAt: { type: Date },
  granted: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Consent', ConsentSchema);
