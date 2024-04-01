import {
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_HEADERS,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN,
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_STATUS,
} from "../constants/http2-constants.mjs";
import { InternalServerErrorException } from "../exceptions/internal-server-error.exception.mjs";
import {Errors} from "../constants/errors-constants.mjs";

const defaultHeaders = {
  [HTTP2_HEADER_CONTENT_TYPE]: "application/json",
  [HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN]: "*",
  [HTTP2_HEADER_ACCESS_CONTROL_ALLOW_HEADERS]: "*",
};

/**
 * @param {DataTransport} dataTransport
 * @param {{headers?: OutgoingHttpHeaders, body?: object | array}?} responseData
 * @param {number} status
 */
export const sendResponse = (dataTransport, responseData = {}, status) => {
  if (!status && !responseData.headers[HTTP2_HEADER_STATUS]) {
    throw new InternalServerErrorException(Errors.NO_STATUS);
  }

  dataTransport.respond({
    [HTTP2_HEADER_STATUS]: status,
    ...defaultHeaders,
    ...responseData.headers,
  });

  if (responseData.body) {
    dataTransport.sendData(JSON.stringify(responseData.body));
  }
  return dataTransport.end();
};
