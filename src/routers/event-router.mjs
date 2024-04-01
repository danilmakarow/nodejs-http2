import { EventRouterService } from "../services/event-router.service.mjs";
import { HttpServiceHeader } from "../constants/http-headers-constants.mjs";
import { validateTransportWithValidator } from "../utils/validate-transport-with-validator.mjs";
import { postLoadEmployersOptionsBodyValidator } from "../validators/post-load-employers-options-body-validator.mjs";
import { employersService } from "../services/employers.service.mjs";
import { loadEmployersQueryValidator } from "../validators/load-employes-query-validator.mjs";

const eventRouter = new EventRouterService();

eventRouter.event(HttpServiceHeader.POST_LOAD_EMPLOYERS_OPTIONS, {
  preHandlers: [
    validateTransportWithValidator(
      postLoadEmployersOptionsBodyValidator,
      (context) => context.requestContext.body,
    ),
  ],
  handler: employersService.postLoadEmployersOptions.bind(employersService),
});

eventRouter.event(HttpServiceHeader.LOAD_EMPLOYERS, {
  preHandlers: [
    validateTransportWithValidator(
      loadEmployersQueryValidator,
      (context) => context.requestContext.query,
    ),
  ],
  handler: employersService.loadEmployers.bind(employersService),
});

export { eventRouter };
