import { eventRouter } from "../routers/event-router.mjs";
import { http2Router } from "../routers/http2-router.mjs";
import {
  HTTP2_HEADER_ACCESS_CONTROL_REQUEST_METHOD,
  HTTP2_METHOD_OPTIONS,
} from "../constants/http2-constants.mjs";

export class RouterService {
  /**
   * @type {Http2RouterService}
   */
  #http2Router;

  /**
   * @type {EventRouterService}
   */
  #eventRouter;

  /**
   * @param {EventRouterService} eventRouter
   * @param {Http2RouterService} http2Router
   */
  constructor(eventRouter, http2Router) {
    this.#http2Router = http2Router;
    this.#eventRouter = eventRouter;
  }

  /**
   * @param {{ serviceHeader: string, path: string, method: string }} http2StreamData
   * @param {Http2Transport} streamTransport
   */
  async routeHttp2Stream(http2StreamData, streamTransport) {
    if (http2StreamData.method === HTTP2_METHOD_OPTIONS) {
      const optionsMethod =
        streamTransport.incomingHeaders[
          HTTP2_HEADER_ACCESS_CONTROL_REQUEST_METHOD
        ];

      await this.#http2Router.navigate(optionsMethod, http2StreamData.path, streamTransport);
      return;
    }

    await this.#eventRouter.navigate(
      http2StreamData.serviceHeader,
      streamTransport,
    );
  }
}

export const router = new RouterService(eventRouter, http2Router);
