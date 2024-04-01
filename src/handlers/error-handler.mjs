import { HttpException } from "../exceptions/http.exception.mjs";
import { sendResponse } from "../responses/response.mjs";
import { InternalServerErrorException } from "../exceptions/internal-server-error.exception.mjs";

/**
 * Handle an thrown error.
 * @param {DataTransport} dataTransport
 * @param {ConnectionContext} context
 * @param {unknown} error
 */
export const errorHandler = (dataTransport, context, error) => {
  let exception = error;

  if (!(exception instanceof HttpException)) {
    console.error(error)
    exception = new InternalServerErrorException(error.message);
  }

  const responseBody = {
    name: exception.name,
    message: exception.message,
    ...(error.data && { data: error.data }),
  };
  sendResponse(dataTransport, { body: responseBody }, exception.statusCode);
};
