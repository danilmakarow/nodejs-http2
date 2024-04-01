import {HTTP2_METHOD_GET, HTTP2_METHOD_POST} from "../constants/http2-constants.mjs";
import {NotFoundException} from "../exceptions/not-found.exception.mjs";
import {Errors} from "../constants/errors-constants.mjs";
import {Command} from "../command.mjs";

export class Http2RouterService {
  #savedHandlers = {
    [HTTP2_METHOD_POST]: {},
    [HTTP2_METHOD_GET]: {},
  }

  #addRoute(method, path, handlers) {
    this.#savedHandlers[method][path] = new Command(handlers)
  }

  /**
   * @param {string} path
   * @param {CommandConfig} handlers
   */
  get(path, handlers) {
    this.#addRoute(HTTP2_METHOD_GET, path, handlers)
  }

  /**
   * @param {string} path
   * @param {CommandConfig} handlers
   */
  post(path, handlers) {
    this.#addRoute(HTTP2_METHOD_POST, path, handlers)
  }

  /**
   * Route an incoming request.
   * @param {string} method
   * @param {string} path
   * @param {DataTransport} dataTransport
   */
  async navigate(method, path, dataTransport) {
    const handler = this.#savedHandlers[method][path]

    if(!handler) {
      throw new NotFoundException(Errors.NO_HTTP_ROUTE)
    }

    await handler.handle(dataTransport, dataTransport.context)
  }
}
