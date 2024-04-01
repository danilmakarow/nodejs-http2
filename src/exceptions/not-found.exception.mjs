import { HttpException } from "./http.exception.mjs";
import { HTTP_STATUS_NOT_FOUND } from "../constants/http2-constants.mjs";

export class NotFoundException extends HttpException {
  constructor(message) {
    const name = "Not Found!";
    super(name, message || name, HTTP_STATUS_NOT_FOUND);
  }
}
