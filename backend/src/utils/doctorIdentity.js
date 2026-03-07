const DOCTOR_DIRECTORY = [
  { key: 'sureka', displayName: 'Dr. Sureka', aliases: ['drsureka', 'sureka', 'surekar'] },
  { key: 'soniya', displayName: 'Dr. Soniya', aliases: ['soniya', 'sonia', 'soniyav'] }
];

function normalizeText(value = '') {
  return String(value).toLowerCase().replace(/[^a-z]/g, '');
}

function resolveDoctorByInput(input = '') {
  const normalized = normalizeText(input);
  if (!normalized) return null;

  return (
    DOCTOR_DIRECTORY.find((doc) => doc.aliases.some((alias) => normalized.includes(alias))) || null
  );
}

function resolveDoctorFromUser(user = {}) {
  const byName = resolveDoctorByInput(user.name || '');
  if (byName) return byName;

  const emailLocal = String(user.email || '').split('@')[0];
  return resolveDoctorByInput(emailLocal);
}

module.exports = {
  DOCTOR_DIRECTORY,
  resolveDoctorByInput,
  resolveDoctorFromUser
};
