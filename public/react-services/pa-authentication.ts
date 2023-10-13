/*
 * Psafe app - Authentication service for Psafe
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import { PaRequest } from './pa-request';
import { AppState } from './app-state';
import jwtDecode from 'jwt-decode';
import store from '../redux/store';
import {
  updateUserPermissions,
  updateUserRoles,
  updateWithUserLogged,
  updateAllowedAgents,
} from '../redux/actions/appStateActions';
import { UI_LOGGER_LEVELS, PSAFE_ROLE_ADMINISTRATOR_ID, PSAFE_ROLE_ADMINISTRATOR_NAME } from '../../common/constants';
import { getToasts } from '../kibana-services';
import { getAuthorizedAgents } from '../react-services/pa-agents';
import { UI_ERROR_SEVERITIES, UIErrorLog, UIErrorSeverity, UILogLevel } from './error-orchestrator/types';
import { getErrorOrchestrator } from './common-services';

/**
 * Psafe user authentication class
 */
export class PaAuthentication {
  /**
   * Requests and returns an user token to the API.
   *
   * @param {boolean} force
   * @returns {string} token as string or Promise.reject error
   */
  private static async login(force = false) {
    try {
      var idHost = JSON.parse(AppState.getCurrentAPI()).id;
      while (!idHost) {
        await new Promise((r) => setTimeout(r, 500));
        idHost = JSON.parse(AppState.getCurrentAPI()).id;
      }

      const response = await PaRequest.genericReq('POST', '/api/login', { idHost, force });

      const token = ((response || {}).data || {}).token;
      return token as string;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Refreshes the user's token
   *
   * @param {boolean} force
   * @returns {void} nothing or Promise.reject error
   */
  static async refresh(force = false) {
    try {
      // Get user token
      const token: string = await PaAuthentication.login(force);
      if (!token) {
        // Remove old existent token
        await PaAuthentication.deleteExistentToken();
        return;
      }

      // Decode token and get expiration time
      const jwtPayload = jwtDecode(token);

      // Get user Policies
      const userPolicies = await PaAuthentication.getUserPolicies();

      //Get allowed agents for the current user
      let allowedAgents: any = [];
      if (PaAuthentication.userHasAgentsPermissions(userPolicies)) {
        allowedAgents = await getAuthorizedAgents();
        // users without read:agent police should not view info about any agent
        allowedAgents = allowedAgents.length ? allowedAgents : ['-1'];
      }
      store.dispatch(updateAllowedAgents(allowedAgents));

      // Dispatch actions to set permissions and roles
      store.dispatch(updateUserPermissions(userPolicies));
      store.dispatch(
        updateUserRoles(
          PaAuthentication.mapUserRolesIDToAdministratorRole(jwtPayload.rbac_roles || [])
        )
      );
      store.dispatch(updateWithUserLogged(true));
    } catch (error) {
      const options: UIErrorLog = {
        context: `${PaAuthentication.name}.refresh`,
        level: UI_LOGGER_LEVELS.ERROR as UILogLevel,
        severity: UI_ERROR_SEVERITIES.BUSINESS as UIErrorSeverity,
        error: {
          error: error,
          message: error.message || error,
          title: `${error.name}: Error getting the authorization token`,
        },
      };
      getErrorOrchestrator().handleError(options);
      store.dispatch(updateWithUserLogged(true));
      return Promise.reject(error);
    }
  }

  /**
   * Get current user's policies
   *
   * @returns {Object} user's policies or Promise.reject error
   */
  private static async getUserPolicies() {
    try {
      var idHost = JSON.parse(AppState.getCurrentAPI()).id;
      while (!idHost) {
        await new Promise((r) => setTimeout(r, 500));
        idHost = JSON.parse(AppState.getCurrentAPI()).id;
      }
      const response = await PaRequest.apiReq('GET', '/security/users/me/policies', { idHost });
      const policies = ((response || {}).data || {}).data || {};
      return policies;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Map the current user to admin roles
   *
   * @param {Object} roles
   * @returns {Object} modified roles.
   */
  private static mapUserRolesIDToAdministratorRole(roles) {
    return roles.map((role: number) =>
      role === PSAFE_ROLE_ADMINISTRATOR_ID ? PSAFE_ROLE_ADMINISTRATOR_NAME : role
    );
  }

  /**
   * Sends a request to the Psafe's API to delete the user's token.
   *
   * @returns {Object}
   */
  static async deleteExistentToken() {
    try {
      const response = await PaRequest.apiReq('DELETE', '/security/user/authenticate', {delay: 5000});

      return ((response || {}).data || {}).data || {};
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * This function returns true only if the user has some police that need be filtered.
   * Returns false if the user has permission for all agents.
   * Returns true if the user has no one police for agent:read.
   *
   * @param policies
   * @returns boolean
   */
  static userHasAgentsPermissions(policies) {
    const agentReadPolicies = policies['agent:read'];
    if (agentReadPolicies) {
      const allIds = agentReadPolicies['agent:id:*'] == 'allow';
      const allGroups = agentReadPolicies['agent:group:*'] == 'allow';
      const denyAgents = Object.keys(agentReadPolicies).some(
        (k) => !k.includes('*') && agentReadPolicies[k] == 'deny'
      );
      return !((allIds || allGroups) && !denyAgents);
    }
    // users without read:agent police should not view info about any agent
    return true;
  }
}
