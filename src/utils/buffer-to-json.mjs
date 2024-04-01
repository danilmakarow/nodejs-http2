import {BadRequestException} from "../exceptions/bad-request.exception.mjs";
import {Errors} from "../constants/errors-constants.mjs";

/**
 * @param {Buffer} buffer
 * @returns {Promise<object | array>}
 */
export const bufferToJson = (buffer) => {
  try {
    const json = buffer.toString()
    if (!json) {
      return null
    }
    return JSON.parse(json)
  } catch (e) {
    throw new BadRequestException(Errors.INVALID_JSON)
  }
};
