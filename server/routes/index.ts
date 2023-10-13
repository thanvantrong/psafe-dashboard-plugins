import { IRouter } from 'kibana/server';
import { PsafeApiRoutes } from './psafe-api';
import { PsafeElasticRoutes } from "./psafe-elastic";
import { PsafeHostsRoutes } from "./psafe-hosts";
import { PsafeUtilsRoutes, UiLogsRoutes } from './psafe-utils'
import { PsafeReportingRoutes } from "./psafe-reporting";

export const setupRoutes = (router: IRouter) => {
    PsafeApiRoutes(router);
    PsafeElasticRoutes(router);
    PsafeHostsRoutes(router);
    PsafeUtilsRoutes(router);
    PsafeReportingRoutes(router);
    UiLogsRoutes(router);
};
