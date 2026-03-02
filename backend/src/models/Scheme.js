const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  benefits: [{ type: String }],
  eligibilityCriteria: {
    minAge: { type: Number },
    maxAge: { type: Number },
    incomeLimit: { type: Number },
    isBPLRequired: { type: Boolean, default: false },
    requiredConditions: [{ type: String }], // e.g. 'Diabetes'
    homeState: { type: String }, // For migrant schemes
    employmentType: { type: String } // e.g. 'Migrant Worker'
  },
  applicationUrl: { type: String },
  provider: { type: String, default: 'Government of Kerala' }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', SchemeSchema);
