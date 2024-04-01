import { HttpException } from "./http.exception.mjs";
import { HTTP_STATUS_BAD_REQUEST } from "../constants/http2-constants.mjs";

export class BadRequestException extends HttpException {
  constructor(message, data) {
    const name = "Bad Request!";
    super(name, message || name, HTTP_STATUS_BAD_REQUEST, data);
  }
}
