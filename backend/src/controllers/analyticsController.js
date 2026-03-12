const HealthRecord = require('../models/HealthRecord');
const Patient = require('../models/Patient');
const Consent = require('../models/Consent');

function buildMonthKeys(monthsBack) {
  const keys = [];
  const today = new Date();
  const cursor = new Date(today.getFullYear(), today.getMonth() - monthsBack + 1, 1);
  while (cursor <= today) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
    keys.push(key);
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return keys;
}

function upsertRoleCount(target, role, count) {
  const normalized = String(role || 'OTHER').toUpperCase();
  if (normalized === 'PATIENT') target.patient += count;
  else if (normalized === 'DOCTOR') target.doctor += count;
  else if (normalized === 'ADMIN') target.admin += count;
  else target.other += count;
}

exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 29);

    const monthKeys = buildMonthKeys(6);

    const summaryPromise = Promise.all([
      Patient.countDocuments({}),
      Patient.countDocuments({ role: 'DOCTOR' }),
      Patient.countDocuments({ role: 'ADMIN' }),
      HealthRecord.countDocuments({}),
      Consent.countDocuments({ granted: true }),
      HealthRecord.distinct('patient'),
      HealthRecord.distinct('hospital'),
    ]).then(([
      totalPatients,
      totalDoctors,
      totalAdmins,
      totalRecords,
      consentsGranted,
      patientsWithRecords,
      hospitals,
    ]) => ({
      totalPatients,
      totalDoctors,
      totalAdmins,
      totalRecords,
      consentsGranted,
      patientsWithRecords: patientsWithRecords.length,
      uniqueHospitals: hospitals.filter(Boolean).length,
    }));

    const uploadsByRolePromise = HealthRecord.aggregate([
      { $group: { _id: '$createdByRole', count: { $sum: 1 } } },
    ]);

    const uploadsByMonthPromise = HealthRecord.aggregate([
      {
        $project: {
          month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          role: '$createdByRole',
        },
      },
      { $group: { _id: { month: '$month', role: '$role' }, count: { $sum: 1 } } },
      { $sort: { '_id.month': 1 } },
    ]);

    const uploadsByDayPromise = HealthRecord.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $project: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          role: '$createdByRole',
        },
      },
      { $group: { _id: { day: '$day', role: '$role' }, count: { $sum: 1 } } },
      { $sort: { '_id.day': 1 } },
    ]);

    const categoryPromise = HealthRecord.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$category', 'Uncategorized'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const hospitalPromise = HealthRecord.aggregate([
      { $match: { hospital: { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: '$hospital',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const latestUploadsPromise = HealthRecord.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .select('title category hospital doctor createdByRole createdAt');

    const [
      summary,
      uploadsByRoleRaw,
      uploadsByMonthRaw,
      uploadsByDayRaw,
      recordsByCategory,
      recordsByHospital,
      latestUploads,
    ] = await Promise.all([
      summaryPromise,
      uploadsByRolePromise,
      uploadsByMonthPromise,
      uploadsByDayPromise,
      categoryPromise,
      hospitalPromise,
      latestUploadsPromise,
    ]);

    const uploadsByRole = uploadsByRoleRaw.reduce(
      (acc, row) => {
        upsertRoleCount(acc, row._id, row.count);
        return acc;
      },
      { patient: 0, doctor: 0, admin: 0, other: 0 },
    );

    const uploadsByMonth = monthKeys.map((month) => ({
      month,
      patient: 0,
      doctor: 0,
      admin: 0,
      other: 0,
    }));
    uploadsByMonthRaw.forEach(({ _id, count }) => {
      const target = uploadsByMonth.find((m) => m.month === _id.month);
      if (target) {
        upsertRoleCount(target, _id.role, count);
      }
    });

    const uploadsByDay = [];
    uploadsByDayRaw.forEach(({ _id, count }) => {
      let entry = uploadsByDay.find((d) => d.day === _id.day);
      if (!entry) {
        entry = { day: _id.day, patient: 0, doctor: 0, admin: 0, other: 0 };
        uploadsByDay.push(entry);
      }
      upsertRoleCount(entry, _id.role, count);
    });

    res.json({
      summary,
      uploadsByRole,
      uploadsByMonth,
      uploadsByDay,
      recordsByCategory: recordsByCategory.map((c) => ({ category: c._id, count: c.count })),
      recordsByHospital: recordsByHospital.map((h) => ({ hospital: h._id, count: h.count })),
      latestUploads,
    });
  } catch (err) {
    next(err);
  }
};
