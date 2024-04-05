import { sendOkResponse } from "../responses/ok-response.mjs";
import { cursorService } from "./cursor.service.mjs";
import { employersCollection } from "../collections/employers.collection.mjs";
import { BadRequestException } from "../exceptions/bad-request.exception.mjs";
import { Errors } from "../constants/errors-constants.mjs";

export class EmployersService {
  /** @type {CursorService} */
  #cursorService;
  /** @type {EmployersCollection} */
  #employersCollection;

  /**
   * @param {CursorService} cursorService
   * @param {EmployersCollection} employersCollection
   */
  constructor(cursorService, employersCollection) {
    this.#cursorService = cursorService;
    this.#employersCollection = employersCollection;
  }

  /**
   * @param {DataTransport} dataTransport
   * @param {ConnectionContext} context
   */
  async loadEmployers(dataTransport, context) {
    if (!context.sessionContext.cursor) {
      throw new BadRequestException(Errors.NO_CURSOR);
    }

    const data = await this.#cursorService.takeFromCursor(
      context.sessionContext.cursor,
      context.requestContext.query.take,
    );

    sendOkResponse(dataTransport, { data });
  }

  /**
   * @param {DataTransport} dataTransport
   * @param {ConnectionContext} context
   */
  async postLoadEmployersOptions(dataTransport, context) {
    const cursorConfig = { ...context.requestContext.body };

    if (context.sessionContext.cursor && Object.keys(cursorConfig)) {
      context.sessionContext.cursor =
        this.#employersCollection.updateEmployersCursor(
          context.sessionContext.cursor,
          cursorConfig,
        );
    }

    if (
      !context.sessionContext.cursor ||
      context.sessionContext.cursor.closed
    ) {
      context.sessionContext.cursor =
        this.#employersCollection.createEmployersCursor(cursorConfig);
    }

    const data = await this.#cursorService.takeFromCursor(
      context.sessionContext.cursor,
      cursorConfig.take,
    );

    sendOkResponse(dataTransport, { data });
  }
}

export const employersService = new EmployersService(
  cursorService,
  employersCollection,
);
