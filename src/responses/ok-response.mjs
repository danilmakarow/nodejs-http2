import { HTTP_STATUS_OK } from "../constants/http2-constants.mjs";
import { sendResponse } from "./response.mjs";

/**
 * @param {DataTransport} dataTransport
 * @param {(object | array)?} responseBody
 */
export const sendOkResponse = (dataTransport, responseBody) => {
  return sendResponse(dataTransport, { body: responseBody }, HTTP_STATUS_OK);
};
