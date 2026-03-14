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

// Derived, data-driven policy insights for the admin portal
exports.getPolicyInsights = async (_req, res, next) => {
  try {
    const now = new Date();
    const start30 = new Date(now);
    start30.setDate(now.getDate() - 29); // inclusive of today -> 30 day window
    const start60 = new Date(now);
    start60.setDate(now.getDate() - 59); // previous 30 days

    const [
      totalPatients,
      totalRecords,
      patientsWithRecords,
      hospitalsRaw,
      categoriesAll,
      categoriesLast30,
      last30RecordsAgg,
      prev30RecordsAgg,
      last30ByDay,
    ] = await Promise.all([
      Patient.countDocuments({}),
      HealthRecord.countDocuments({}),
      HealthRecord.distinct('patient'),
      HealthRecord.aggregate([
        { $match: { hospital: { $exists: true, $ne: '' } } },
        { $group: { _id: '$hospital', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      HealthRecord.aggregate([
        { $group: { _id: { $ifNull: ['$category', 'Uncategorized'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      HealthRecord.aggregate([
        { $match: { createdAt: { $gte: start30 } } },
        { $group: { _id: { $ifNull: ['$category', 'Uncategorized'] }, count: { $sum: 1 } } },
      ]),
      HealthRecord.aggregate([
        { $match: { createdAt: { $gte: start30 } } },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]),
      HealthRecord.aggregate([
        { $match: { createdAt: { $gte: start60, $lt: start30 } } },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]),
      HealthRecord.aggregate([
        { $match: { createdAt: { $gte: start30 } } },
        {
          $project: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
        },
        { $group: { _id: '$day', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const patientsWithRecordsCount = patientsWithRecords.length;
    const coveragePercent = totalPatients
      ? Math.round((patientsWithRecordsCount / totalPatients) * 100)
      : 0;

    const last30Records = last30RecordsAgg?.[0]?.count || 0;
    const prev30Records = prev30RecordsAgg?.[0]?.count || 0;
    const growth30d = prev30Records === 0
      ? (last30Records > 0 ? 100 : 0)
      : Math.round(((last30Records - prev30Records) / prev30Records) * 100);

    const categoryLast30Map = categoriesLast30.reduce((acc, c) => {
      acc[c._id || 'Uncategorized'] = c.count;
      return acc;
    }, {});

    const topCategories = categoriesAll
      .map((c) => ({
        category: c._id || 'Uncategorized',
        total: c.count,
        last30: categoryLast30Map[c._id || 'Uncategorized'] || 0,
      }))
      .slice(0, 5);

    const hotspots = hospitalsRaw.map((h) => ({
      hospital: h._id,
      count: h.count,
    }));

    // Build a fixed-length trend array for the last 30 days (fills missing days with 0)
    const trendMap = last30ByDay.reduce((acc, row) => {
      acc[row._id] = row.count;
      return acc;
    }, {});
    const coverageTrend = [];
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      coverageTrend.push({ day: key, total: trendMap[key] || 0 });
    }

    const recommendations = [];
    if (coveragePercent < 80) {
      recommendations.push({
        title: 'Accelerate onboarding & QR distribution',
        category: 'Coverage',
        expectedImpact: `Raise record coverage to ${Math.min(coveragePercent + 10, 100)}%`,
        action: 'Prioritize outreach to low-coverage districts and mandate record creation at hospital intake.',
        priority: 'high',
      });
    }

    const topCategory = topCategories[0];
    if (topCategory && topCategory.total > 0) {
      recommendations.push({
        title: `Targeted program for ${topCategory.category}`,
        category: 'Disease Burden',
        expectedImpact: 'Reduce repeat cases by 15% through screening + education',
        action: `Allocate screening camps in facilities handling ${topCategory.category} cases (${topCategory.total} records).`,
        priority: 'medium',
      });
    }

    if (growth30d > 15) {
      recommendations.push({
        title: 'Temporary surge response',
        category: 'Trend',
        expectedImpact: 'Stabilize month-on-month growth within two weeks',
        action: 'Deploy mobile units and reinforce triage at high-volume hospitals.',
        priority: 'high',
      });
    }

    if (!recommendations.length) {
      recommendations.push({
        title: 'Maintain current policy mix',
        category: 'Steady State',
        expectedImpact: 'Sustain performance while monitoring weekly trends',
        action: 'No immediate changes required; continue observing leading indicators.',
        priority: 'low',
      });
    }

    const alerts = [];
    topCategories.forEach((c) => {
      if (c.last30 > 0 && c.last30 / Math.max(1, last30Records) >= 0.35) {
        alerts.push({
          title: `High share: ${c.category}`,
          severity: 'warning',
          detail: `${Math.round((c.last30 / Math.max(1, last30Records)) * 100)}% of last 30-day records.`,
        });
      }
    });
    if (growth30d > 25) {
      alerts.push({
        title: 'Record volume rising quickly',
        severity: 'danger',
        detail: `Last 30 days up ${growth30d}% vs prior period.`,
      });
    }

    res.json({
      summary: {
        totalPatients,
        totalRecords,
        patientsWithRecords: patientsWithRecordsCount,
        coveragePercent,
        uniqueHospitals: hospitalsRaw.length,
        last30Records,
        prev30Records,
        growth30d,
      },
      topCategories,
      hotspots,
      coverageTrend,
      recommendations,
      alerts,
    });
  } catch (err) {
    next(err);
  }
};

// Operational/system monitoring derived from actual records and consent data
exports.getSystemMonitoring = async (_req, res, next) => {
  try {
    const now = new Date();
    const start7d = new Date(now);
    start7d.setDate(now.getDate() - 6); // include today
    const start24h = new Date(now);
    start24h.setDate(now.getDate() - 1);

    const [
      totalRecords,
      totalPatients,
      uploads7d,
      uploads24h,
      uploadsByDay,
      latestUploads,
      consentCounts,
      consentRecent,
      hospitals,
    ] = await Promise.all([
      HealthRecord.countDocuments({}),
      Patient.countDocuments({}),
      HealthRecord.countDocuments({ createdAt: { $gte: start7d } }),
      HealthRecord.countDocuments({ createdAt: { $gte: start24h } }),
      HealthRecord.aggregate([
        { $match: { createdAt: { $gte: start7d } } },
        {
          $project: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            role: '$createdByRole',
          },
        },
        { $group: { _id: { day: '$day', role: '$role' }, count: { $sum: 1 } } },
        { $sort: { '_id.day': 1 } },
      ]),
      HealthRecord.find({}).sort({ createdAt: -1 }).limit(8).select('title category hospital doctor createdByRole createdAt'),
      Consent.aggregate([
        { $group: { _id: '$granted', count: { $sum: 1 } } },
      ]),
      Consent.find({}).sort({ updatedAt: -1 }).limit(10).select('patient grantee granteeType granted purpose updatedAt'),
      HealthRecord.aggregate([
        { $match: { hospital: { $exists: true, $ne: '' } } },
        { $group: { _id: '$hospital', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const uploadsByDayNormalized = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(start7d);
      d.setDate(start7d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const roles = uploadsByDay.filter((r) => r._id.day === key);
      const dayEntry = { day: key, patient: 0, doctor: 0, admin: 0, other: 0, total: 0 };
      roles.forEach((r) => {
        const role = (r._id.role || 'other').toLowerCase();
        if (role === 'patient') dayEntry.patient += r.count;
        else if (role === 'doctor') dayEntry.doctor += r.count;
        else if (role === 'admin') dayEntry.admin += r.count;
        else dayEntry.other += r.count;
        dayEntry.total += r.count;
      });
      uploadsByDayNormalized.push(dayEntry);
    }

    const consentStats = consentCounts.reduce(
      (acc, row) => {
        if (row._id === true) acc.granted = row.count;
        if (row._id === false) acc.revoked = row.count;
        return acc;
      },
      { granted: 0, revoked: 0 },
    );

    const recentConsentLogs = consentRecent.map((c) => ({
      id: String(c._id),
      granted: c.granted,
      purpose: c.purpose || '',
      updatedAt: c.updatedAt,
      granteeType: c.granteeType,
    }));

    const uptimeApprox = Math.min(99.9, 95 + (uploads7d > 0 ? 3 : 0) + (consentStats.revoked === 0 ? 1 : 0)); // heuristic
    const apiLatencyMs = Math.max(120, 800 - uploads24h); // crude proxy from load
    const storageUsage = Math.min(95, Math.round((totalRecords / Math.max(1, totalPatients * 50)) * 100));

    res.json({
      summary: {
        totalRecords,
        totalPatients,
        uploads7d,
        uploads24h,
        uptimePercent: Number(uptimeApprox.toFixed(1)),
        apiLatencyMs,
        storageUsagePercent: storageUsage,
      },
      uploadsByDay: uploadsByDayNormalized,
      latestUploads: latestUploads.map((u) => ({
        title: u.title,
        category: u.category || 'Uncategorized',
        hospital: u.hospital || '',
        doctor: u.doctor || '',
        role: u.createdByRole || 'PATIENT',
        createdAt: u.createdAt,
      })),
      consent: {
        stats: consentStats,
        recent: recentConsentLogs,
      },
      hotspots: hospitals.map((h) => ({ hospital: h._id, count: h.count })),
    });
  } catch (err) {
    next(err);
  }
};
