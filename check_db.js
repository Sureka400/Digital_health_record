const mongoose = require('mongoose');
const HealthRecord = require('./backend/src/models/HealthRecord');
const Patient = require('./backend/src/models/Patient');
require('dotenv').config({ path: './backend/.env' });

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  
  const patients = await Patient.find().limit(5);
  console.log('Patients found:', patients.length);
  
  for (const p of patients) {
    const records = await HealthRecord.find({ patient: p._id });
    console.log(`Patient ${p.name} (${p.role}) ID: ${p._id} has ${records.length} records`);
    for (const r of records) {
        console.log(` - Record: ${r.title}, QR: ${r.qrToken ? 'Yes' : 'No'}`);
    }
  }
  
  await mongoose.disconnect();
}

check().catch(console.error);
