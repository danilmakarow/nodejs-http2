import { Http2RouterService } from "../services/http2-router.service.mjs";
import { RoutePaths } from "../constants/route-paths-constants.mjs";
import { sendOkResponse } from "../responses/ok-response.mjs";

const http2Router = new Http2RouterService();

http2Router.get(RoutePaths.EMPLOYERS, { handler: sendOkResponse });
http2Router.post(RoutePaths.EMPLOYERS, { handler: sendOkResponse });

export { http2Router };
