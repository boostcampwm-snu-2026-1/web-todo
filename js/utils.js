/**
 * Generates a unique ID string.
 * @returns {string}
 */
export function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Parses a raw multi-line string into an array of trimmed, non-empty lines.
 * @param {string} raw
 * @returns {string[]}
 */
export function parseInboxDump(raw) {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Returns the current time as an ISO string.
 * @returns {string}
 */
export function nowISO() {
  return new Date().toISOString();
}
