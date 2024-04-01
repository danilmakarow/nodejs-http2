import { BadRequestException } from "../exceptions/bad-request.exception.mjs";
import { Errors } from "../constants/errors-constants.mjs";

/**
 * @param {import("ajv").ValidateFunction} validator
 * @param {(arg1: ConnectionContext) => object} dataExtractor
 */
export const validateTransportWithValidator =
  (validator, dataExtractor) => (dataTransport, context) => {
    const data = dataExtractor(context);
    const validateResult = validator(data);

    if (!validateResult) {
      const parsedErrors = validator.errors.map((error) => ({
        property: error.instancePath || error.schemaPath,
        message: error.message,
      }));

      throw new BadRequestException(Errors.BODY_VALIDATION, parsedErrors);
    }
  };
