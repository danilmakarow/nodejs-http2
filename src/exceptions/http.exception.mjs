export class HttpException {
  /**
   * @param {string} name
   * @param {string} message
   * @param {number} statusCode
   * @param {(object | array)?} data
   */
  constructor(name, message, statusCode, data) {
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}
