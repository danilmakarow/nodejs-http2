import { HttpException } from "./http.exception.mjs";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from "../constants/http2-constants.mjs";

export class InternalServerErrorException extends HttpException {
  constructor(message) {
    const name = "Internal Server Error!";
    super(name, message || name, HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
}
