// Simple logger that redacts sensitive fields when running in production.

const DEFAULT_SENSITIVE_KEYS = ['pass', 'password', 'secret', 'token', 'ssn', 'credential'];

function isProduction() {
  return (process.env.ADDICT_ENV || process.env.NODE_ENV || '').toLowerCase() === 'production';
}

function redactObject(obj, seen = new WeakSet()) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (seen.has(obj)) return '[Circular]';
  seen.add(obj);
  if (Array.isArray(obj)) return obj.map(x => redactObject(x, seen));
  const out = {};
  for (const key of Object.keys(obj)) {
    if (DEFAULT_SENSITIVE_KEYS.includes(key.toLowerCase())) {
      out[key] = '[REDACTED]';
    } else {
      out[key] = redactObject(obj[key], seen);
    }
  }
  return out;
}

function redactString(str) {
  if (typeof str !== 'string') return str;
  // try to catch patterns like "pass: <value>" or 'password=...'
  return str
    // redact lines like: AUTH USER <user> <password>  => keep first three tokens, redact fourth
    .replace(/(^|\n)(\s*)auth\s+user\s+([^\s]+)\s+([^\s\n]+)(?=$|\s|\n)/gim, "$1$2AUTH USER $3 [REDACTED]")
    .replace(/(pass(word)?\s*[:=]\s*)([^\s,;]+)/gi, '$1[REDACTED]')
    .replace(/(token\s*[:=]\s*)([^\s,;]+)/gi, '$1[REDACTED]')
    .replace(/(secret\s*[:=]\s*)([^\s,;]+)/gi, '$1[REDACTED]');
}

function sanitize(value) {
  if (!isProduction()) return value;
  if (value instanceof Error) {
    // redact message
    const msg = redactString(value.message || '');
    const err = new Error(msg);
    err.stack = value.stack ? redactString(value.stack) : undefined;
    return err;
  }
  if (typeof value === 'string') return redactString(value);
  if (typeof value === 'object') return redactObject(value);
  return value;
}

function logVorpal(vorpal, value) {
  const safe = sanitize(value);
  if (typeof safe === 'object') {
    try {
      vorpal.log(JSON.stringify(safe, null, 2));
      return;
    } catch (e) {
      // fallthrough
    }
  }
  vorpal.log(safe);
}

function logContext(ctx, value) {
  const safe = sanitize(value);
  if (typeof safe === 'object') {
    try {
      ctx.log(JSON.stringify(safe, null, 2));
      return;
    } catch (e) {
      // fallthrough
    }
  }
  ctx.log(safe);
}

module.exports = {
  isProduction,
  sanitize,
  logVorpal,
  logContext
};
