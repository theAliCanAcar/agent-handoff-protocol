const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };

/** Validate an untrusted agent assignment without throwing. Handoffs never grant tool permissions.
 * @param {object} value
 * @returns {{valid:boolean,errors:string[]}}
 */
export function validateHandoff(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, errors: ['Handoff must be an object'] };
  for (const key of ['id', 'contractId', 'from', 'to', 'task']) if (typeof value[key] !== 'string' || !value[key].trim()) errors.push(`${key} must be a nonempty string`);
  if (value.version !== 1) errors.push('version must be 1');
  for (const key of ['criterionIds', 'evidenceIds']) {
    if (!Array.isArray(value[key]) || value[key].some(item => typeof item !== 'string' || !item.trim()) || new Set(value[key]).size !== value[key].length) errors.push(`${key} must contain unique nonempty strings`);
  }
  if (Array.isArray(value.criterionIds) && value.criterionIds.length === 0) errors.push('At least one criterion is required');
  if (!Number.isSafeInteger(value.attempt) || value.attempt < 1) errors.push('attempt must be a positive integer');
  return { valid: errors.length === 0, errors };
}

/** Create an immutable versioned assignment. IDs are supplied by the caller for deterministic replay.
 * @param {{id:string,contractId:string,from:string,to:string,task:string,criterionIds:string[],evidenceIds?:string[],attempt?:number}} input
 * @returns {Readonly<object>}
 */
export function createHandoff({ id, contractId, from, to, task, criterionIds, evidenceIds = [], attempt = 1 } = {}) {
  const handoff = { version: 1, id, contractId, from, to, task, criterionIds, evidenceIds, attempt };
  const result = validateHandoff(handoff);
  if (!result.valid) throw new TypeError(result.errors.join('; '));
  return freeze(clone(handoff));
}
