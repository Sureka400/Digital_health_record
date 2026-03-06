const Appointment = require('../models/Appointment');

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('patient', 'name email abhaId')
      .sort({ date: 1, time: 1 });
    res.json({ appointments });
  } catch (err) { next(err); }
};

exports.getDoctorAppointments = async (req, res, next) => {
  try {
    // TODO: Replace with doctorId linkage. For now, allow doctor-role access.
    const query = req.user.role === 'DOCTOR' ? {} : { doctor: req.user.name };
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email abhaId dob gender chronicConditions')
      .sort({ date: 1, time: 1 });
    res.json({ appointments: appointments.filter((a) => !!a.patient) });
  } catch (err) { next(err); }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const { doctor, specialty, hospital, date, time, type } = req.body;
    const appointment = new Appointment({
      patient: req.user.id,
      doctor,
      specialty,
      hospital,
      date,
      time,
      type
    });
    await appointment.save();
    res.status(201).json({ appointment });
  } catch (err) { next(err); }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    // Patient can update their own appointment
    let query = { _id: id, patient: req.user.id };
    // TODO: Replace with doctorId linkage. For now, allow doctor-role updates.
    if (req.user.role === 'DOCTOR') {
      query = { _id: id };
    }
    const appointment = await Appointment.findOneAndUpdate(
      query,
      updateFields,
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ appointment });
  } catch (err) { next(err); }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, summary, clinicalNotes, prescriptions } = req.body;
    
    let query = { _id: id };
    if (req.user.role !== 'DOCTOR') {
      query.patient = req.user.id;
    }

    const update = { status, summary };
    if (clinicalNotes) update.clinicalNotes = clinicalNotes;
    if (prescriptions) update.prescriptions = prescriptions;

    const appointment = await Appointment.findOneAndUpdate(
      query,
      update,
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ appointment });
  } catch (err) { next(err); }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, patient: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
};
