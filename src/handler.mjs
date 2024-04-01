import url from "url";
import {
  HttpCommandHeader,
  HttpHeaders,
} from "./constants/http-headers-constants.mjs";
import { readWholeHttp2Transporter } from "./utils/read-whole-http2-transporter.mjs";
import { bufferToJson } from "./utils/buffer-to-json.mjs";
import {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
} from "./constants/http2-constants.mjs";
import {router} from "./services/router.service.mjs";

export class Handler {
  /**
   * @type {RouterService}
   */
  #routerService;

  /**
   * @param {RouterService} routerService
   */
  constructor(routerService) {
    this.#routerService = routerService
  }

  /**
   * @param {Http2Transport} streamTransport
   */
  async handleHttp2Stream(streamTransport) {
    const headers = streamTransport.incomingHeaders;

    if (headers[HttpHeaders.COMMAND] === HttpCommandHeader.NOTIFY) {
      const bufferData = await readWholeHttp2Transporter(streamTransport);
      const data = bufferToJson(bufferData);

      if (Object.keys(data)) {
        streamTransport.context.requestContext.body = data;
      }
    }

    const serviceHeader = headers[HttpHeaders.SERVICE];
    const rawPath = headers[HTTP2_HEADER_PATH];
    const method = headers[HTTP2_HEADER_METHOD];
    const { pathname: path, query } = url.parse(rawPath, true);

    if (Object.keys(query)) {
      streamTransport.context.requestContext.query = query;
    }

    const streamData = { serviceHeader, path, method };

    await this.#routerService.routeHttp2Stream(streamData, streamTransport)
  }

  handleWs() {}
}

export const handler = new Handler(router)
