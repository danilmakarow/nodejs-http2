import { Command } from "../command.mjs";
import {NotFoundException} from "../exceptions/not-found.exception.mjs";
import {Errors} from "../constants/errors-constants.mjs";
import {InternalServerErrorException} from "../exceptions/internal-server-error.exception.mjs";

export class EventRouterService {
  eventHandlers = {};

  /**
   * Add handler to event.
   * @param {string} eventName
   * @param {CommandConfig} handlers
   */
  event(eventName, handlers) {
    if (this.eventHandlers[eventName]) {
      throw new InternalServerErrorException(Errors.HANDLER_EXISTS);
    }
    this.eventHandlers[eventName] = new Command(handlers);
  }

  /**
   * Route an incoming event.
   * @param {string} eventName
   * @param {DataTransport} dataTransport
   */
  async navigate(eventName, dataTransport) {
    const handler = this.eventHandlers[eventName];

    if (!handler) {
      throw new NotFoundException(Errors.NO_EVENT_ROUTE)
    }

    await handler.handle(
      dataTransport,
      dataTransport.context,
    );
  }
}
