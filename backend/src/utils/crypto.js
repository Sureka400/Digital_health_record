const crypto = require('crypto');

// AES-256-GCM helpers for encrypting sensitive fields
const keyBase64 = process.env.ENC_KEY_BASE64 || '';
const KEY = keyBase64 ? Buffer.from(keyBase64, 'base64') : null;

function ensureKey() {
  if (!KEY || KEY.length !== 32) throw new Error('ENC_KEY_BASE64 must be a base64 32-byte key');
}

function encryptField(plain) {
  if (!plain) return null;
  ensureKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const encrypted = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

function decryptField(ciphertext) {
  if (!ciphertext) return null;
  ensureKey();
  const data = Buffer.from(ciphertext, 'base64');
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const encrypted = data.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return out.toString('utf8');
}

module.exports = { encryptField, decryptField };
