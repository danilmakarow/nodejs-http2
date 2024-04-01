/**
 * @typedef {Object} TPostEmployersCursorOptionsBody
 * @property {number?} limit
 * @property {number?} take
 * @property {boolean?} reset
 * @property {Object.<string, -1 | 1>?} sort
 * @property {Object.<string, unknown>?} filters
 */

/**
 * @typedef {Object} TParsedEmployersCursorOptions
 * @property {number?} take
 * @property {boolean?} reset
 * @property {import("mongodb").Filter?} filters
 * @property {import("mongodb").Sort?} sort
 */

module.exports = {
  TPostEmployersCursorOptionsBody,
  TParsedEmployersCursorOptions,
};
