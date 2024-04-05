import http2 from "node:http2";
import fs from "fs";
import EventEmitter from "node:events";
import { constants as CRYPTO_CONSTANTS } from "crypto";
import { Multiplexer } from "./multiplexer.mjs";
import { handler } from "./handler.mjs";
import {Env} from "./constants/env.mjs";

let wsModule = null;
try {
  wsModule = await import("ws");
} catch (e) {
  console.warn("no ws");
}

/**
 * The H2 Server will be created and hold the management of the incoming connections both Websocket and HTTP1.1 and 2.0
 * All service selection is made on a convention basis.
 * For the HTTP1.1 and HTTP/2 the service selection is going to be based around the HTTPS dictated subdomain and the path,
 * meanwhile the selection for the websocket will be made based around a structure which will be managed by the multiplexor
 * in much the same way as the HTTP/2 does multiplexing itself.
 */
export class H2Server extends EventEmitter {
  /**
   *
   * @type {Http2SecureServer}
   */
  #http2Server = null;
  /**
   *
   * @type {WebSocketServer}
   */
  #wsServer = null;

  #services = {};

  #outStreams = {};
  #inStreams = {};

  /**
   * Constructs an HTTP2 server and adds all event listeners.
   * @param {Http2SecureServer | Object} options
   * @param {Object<string, any>} options.ssl SSL Options
   * @param {Buffer} options.ssl.key SSL Key
   * @param {Buffer} options.ssl.cert SSL Certificate
   * @param {boolean} options.allowHTTP1
   * @param {boolean} options.useWebSockets
   */
  constructor(options) {
    super();
    if (typeof options?.listen === "function") {
      this.#http2Server = options;
      return;
    }

    if (
      !(
        (typeof options?.ssl?.key === "string" &&
          typeof options?.ssl?.cert === "string") ||
        !(
          (typeof options?.ssl?.key) instanceof Buffer &&
          (typeof options?.ssl?.cert) instanceof Buffer
        )
      )
    ) {
      console.error(
        "HTTP2 REQUIRES a certificate to be able to be used in a browser setting.",
      );
      throw new Error("HTTP2 Certificate Required.");
    }

    if (options.useWebSockets && !wsModule) {
      throw new Error(
        "ws module wasn't found. Please install using `npm install ws`",
      );
    }
    if (options.useWebSockets && !options.allowHTTP1) {
      console.warn(`AllowHTTP1 will be enabled to allow for websockets. 
			HTTP/2 websockets draft never got enough traction as can be read on: 
			"https://datatracker.ietf.org/doc/html/draft-hirano-httpbis-websocket-over-http2-01"`);
    }

    if (options.useWebSockets) {
      this.#wsServer = new wsModule.WebSocketServer({ noServer: true });
      this.#wsServer.on("connection", (ws) => {
        const wsSession = {};
        this.emit("wsConn", ws, wsSession); // should be doing the multiplexing here so that it passes everything to the oncoming services.
      });
    }

    this.#http2Server = http2.createSecureServer({
      key: options.ssl.key,
      cert: options.ssl.cert,
      secureOptions:
        CRYPTO_CONSTANTS.SSL_OP_NO_SSLv3 |
        CRYPTO_CONSTANTS.SSL_OP_NO_SSLv2 |
        CRYPTO_CONSTANTS.SSL_OP_NO_TLSv1 |
        CRYPTO_CONSTANTS.SSL_OP_NO_TLSv1_1,
      allowHTTP1: options.allowHTTP1 || options.useWebSockets,
      ...(options.ssl.passphrase && { passphrase: options.ssl.passphrase }),
    });

    this.#http2Server.on("request", (req, res) => {
      if (req.httpVersion !== "2.0") {
        this.emit("h1req", req, res);
      }
    });

    this.#http2Server.on("upgrade", (req, socket, head) => {
      this.#wsServer.handleUpgrade(req, socket, head, (ws) => {
        this.#wsServer.emit("connection", ws, req);
      });
    });

    this.#http2Server.on("stream", (stream) => {
      this.emit("h2Stream", stream);
    });

    this.#http2Server.on("session", (session) => {
      this.emit("h2Session", session);
    });

    this.#http2Server.on("connection", (socket) => {
      return this.emit("h2Connection", socket);
    });

    this.#http2Server.on("secureConnection", (socket) => {
      return this.emit("h2SecureConnection", socket);
    });

    this.#http2Server.on("close", () => {
      return this.emit("h2Close");
    });

    this.#http2Server.on("error", (err) => {
      return this.emit("h2Error", err);
    });

    this.#http2Server.on("tlsClientError", (err) => {
      return this.emit("h2TlsClientError", err);
    });
  }

  listen(port, host) {
    this.#http2Server.listen(port, host, () => {
      console.info(`Listening on https://${host}:${port}`);
    });

    new Multiplexer(this, handler);
  }
}

const server = new H2Server({
  ssl: {
    key: fs.readFileSync(Env.CERTIFICATE_KEY_PATH),
    cert: fs.readFileSync(Env.CERTIFICATE_PATH),
  },
  allowHTTP1: true,
  useWebSockets: false,
});

server.listen(Env.API_PORT, Env.API_URL);
