/*
 * Psafe app - File for routes definition
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

// Require routes
//import routes from 'ui/routes';
import 'angular-route';

// Functions to be executed before loading certain routes
import {
  settingsWizard,
  getSavedSearch,
  getIp,
  getPaConfig,
} from './resolves';

// HTML templates
import healthCheckTemplate from '../templates/health-check/health-check.html';
import agentsTemplate from '../templates/agents/dashboards.html';
import agentsPrevTemplate from '../templates/agents-prev/agents-prev.html';
import managementTemplate from '../templates/management/management.html';
import overviewTemplate from '../templates/visualize/dashboards.html';
import settingsTemplate from '../templates/settings/settings.html';
import securityTemplate from '../templates/security/security.html';
import blankScreenTemplate from '../templates/error-handler/blank-screen.html';
import toolsTemplate from '../templates/tools/tools.html';
import { PsafeConfig } from '../react-services/psafe-config';
import { GenericRequest } from '../react-services/generic-request';
import { PaMisc } from '../factories/misc';
import { ApiCheck } from '../react-services/pa-api-check';
import { AppState } from '../react-services/app-state';
import { getAngularModule } from '../kibana-services';

const assignPreviousLocation = ($rootScope, $location) => {
  const path = $location.path();
  const params = $location.search();
  // Save current location if we aren't performing a health-check, to later be able to come back to the same tab
  if (!path.includes('/health-check')) {
    $rootScope.previousLocation = path;
    $rootScope.previousParams = params;
  }
};

function ip($q, $rootScope, $window, $location) {
  const paMisc = new PaMisc();
  assignPreviousLocation($rootScope, $location);
  return getIp(
    $q,
    $window,
    $location,
    paMisc
  );
}

ip.$inject = ['$q', '$rootScope', '$window', '$location'];

function nestedResolve($q, errorHandler, $rootScope, $location, $window) {
  const paMisc = new PaMisc();
  const healthCheckStatus = $window.sessionStorage.getItem('healthCheck');
  if (!healthCheckStatus) return;
  const psafeConfig = new PsafeConfig();
  assignPreviousLocation($rootScope, $location);
  const location = $location.path();
  return getPaConfig($q, GenericRequest, psafeConfig).then(() =>
    settingsWizard(
      $location,
      $q,
      $window,
      ApiCheck,
      AppState,
      GenericRequest,
      errorHandler,
      paMisc,
      location && location.includes('/health-check')
    )
  );
}

nestedResolve.$inject = ['$q', 'errorHandler', '$rootScope', '$location', '$window'];

function savedSearch(
  $location,
  $window,
  $rootScope,
  $route
) {
  const healthCheckStatus = $window.sessionStorage.getItem('healthCheck');
  if (!healthCheckStatus) return;
  assignPreviousLocation($rootScope, $location);
  return getSavedSearch(
    $location,
    $window,
    $route
  );
}

savedSearch.$inject = ['$location', '$window', '$rootScope', '$route'];

function paConfig($q, $rootScope, $location) {
  assignPreviousLocation($rootScope, $location);
  const psafeConfig = new PsafeConfig();
  return getPaConfig($q, GenericRequest, psafeConfig);
}

paConfig.$inject = ['$q', '$rootScope', '$location'];

function clearRuleId(commonData) {
  commonData.removeRuleId();
  return Promise.resolve();
}

clearRuleId.$inject = ['commonData'];

function enablePaMenu($rootScope, $location) {
  const location = $location.path();
  $rootScope.hidePaMenu = location.includes('/health-check');
  if(!$rootScope.hidePaMenu){
    AppState.setPaMenu();
  }
}

enablePaMenu.$inject = ['$rootScope', '$location'];

//Routes
const app = getAngularModule();

app.config(['$routeProvider',($routeProvider) => {
  $routeProvider
  .when('/health-check', {
    template: healthCheckTemplate,
    resolve: { paConfig, ip },
    outerAngularWrapperRoute: true
  })
  .when('/agents/:agent?/:tab?/:tabView?', {
    template: agentsTemplate,
    resolve: { enablePaMenu, nestedResolve, ip, savedSearch },
    reloadOnSearch: false,
    outerAngularWrapperRoute: true
  })
  .when('/agents-preview/', {
    template: agentsPrevTemplate,
    resolve: { enablePaMenu, nestedResolve, ip, savedSearch },
    reloadOnSearch: false,
    outerAngularWrapperRoute: true
  })
  .when('/manager/', {
    template: managementTemplate,
    resolve: { enablePaMenu, nestedResolve, ip, savedSearch, clearRuleId },
    reloadOnSearch: false,
    outerAngularWrapperRoute: true
  })
  .when('/manager/:tab?', {
    template: managementTemplate,
    resolve: { enablePaMenu, nestedResolve, ip, savedSearch, clearRuleId },
    outerAngularWrapperRoute: true
  })
  .when('/overview/', {
    template: overviewTemplate,
    resolve: { enablePaMenu, nestedResolve, ip, savedSearch },
    reloadOnSearch: false,
    outerAngularWrapperRoute: true
  })
  .when('/settings', {
    template: settingsTemplate,
    resolve: { enablePaMenu, nestedResolve, ip, savedSearch },
    reloadOnSearch: false,
    outerAngularWrapperRoute: true
  })
  .when('/security', {
    template: securityTemplate,
    resolve: { enablePaMenu, nestedResolve, ip, savedSearch },
    outerAngularWrapperRoute: true
  })
  .when('/psafe-dev', {
    template: toolsTemplate,
    resolve: { enablePaMenu, nestedResolve, ip, savedSearch },
    outerAngularWrapperRoute: true
  })
  .when('/blank-screen', {
    template: blankScreenTemplate,
    resolve: { enablePaMenu },
    outerAngularWrapperRoute: true
  })
  .when('/', {
    redirectTo: '/overview/',
    outerAngularWrapperRoute: true
  })
  .when('', {
    redirectTo: '/overview/',
    outerAngularWrapperRoute: true
  })
  .otherwise({
    redirectTo: '/overview',
    outerAngularWrapperRoute: true
  });
}]);
