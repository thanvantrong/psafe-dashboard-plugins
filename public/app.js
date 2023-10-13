/*
 * Psafe app - File for app requirements and set up
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { checkPluginVersion } from './utils';
import 'angular-sanitize';

// Require CSS
import './styles';
// Require lib to dashboards PDFs
require('./utils/dom-to-image.js');

// EUI React components wrapper
import './components';

// angular-charts.js
import 'angular-chart.js';

// Font Awesome, plugin platform framework and others
import './utils/fontawesome/scss/font-awesome.scss';

// Dev tools
import './utils/codemirror';

import './utils/jquery-ui';

// Material
import 'angular-material/angular-material.css';
import 'angular-aria/angular-aria';
import 'angular-animate/angular-animate';
import 'angular-material/angular-material';

// Set up Psafe app
import './setup';

//App imports
import './kibana-integrations';
import './services';
import './controllers';
import './factories';

// Imports to update currentPlatform when app starts
import { checkCurrentSecurityPlatform } from './controllers/management/components/management/configuration/utils/pa-fetch';
import store from './redux/store';
import { updateCurrentPlatform } from './redux/actions/appStateActions';
import { PaAuthentication, loadAppConfig } from './react-services';

import { getAngularModule, getHttp } from './kibana-services';
import { addHelpMenuToAppChrome } from './utils';

const app = getAngularModule();

app.config([
  '$compileProvider',
  function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|blob):/);
  },
]);

app.config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.useApplyAsync(true);
  },
]);

app.run([
  '$injector',
  function (_$injector) {
    app.$injector = _$injector;

    // Set currentSecurity platform in Redux when app starts.
    checkCurrentSecurityPlatform()
      .then((item) => {
        store.dispatch(updateCurrentPlatform(item));
      })
      .catch(() => {});

    // Init the process of refreshing the user's token when app start.
    checkPluginVersion().finally(PaAuthentication.refresh);

    // Load the app state
    loadAppConfig();
  },
]);

/**
 * Set trigger for logout
 */
app.run(['$rootElement', function ($rootElement) {
    $rootElement.append(`
    <div>
      <div class="psafeNotReadyYet"></div>
      <div ng-view class="mainView"></div>
      <react-component name="PaMenuWrapper" props=""></react-component>
      <react-component name="PaAgentSelectorWrapper" props=""></react-component>
      <react-component name="ToastNotificationsModal" props=""></react-component>
    </div>`);

  // Add plugin help links as extension to plugin platform help menu
  addHelpMenuToAppChrome();

  // Bind deleteExistentToken on Log out component.
  $('.euiHeaderSectionItem__button, .euiHeaderSectionItemButton').on('mouseleave', function () {
    // opendistro
    $('button:contains(Log out)').on('click', function () {
      PaAuthentication.deleteExistentToken();
    });
    // x-pack
    $('a:contains(Log out)').on('click', function (event) {
      // Override href's behaviour and navigate programatically
      // to the logout path once the token has been deleted.
      event.preventDefault();
      PaAuthentication.deleteExistentToken()
        .catch((err) => {
          console.error('[ERROR] - User token could not be deprecated - ', err);
        })
        .finally(() => {
          window.location = event.currentTarget.href;        
        });
    });
  });
}]);
