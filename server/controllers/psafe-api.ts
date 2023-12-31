/*
 * Psafe app - Class for Psafe-API functions
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

// Require some libraries
import { ErrorResponse } from '../lib/error-response';
import { Parser } from 'json2csv';
import { log } from '../lib/logger';
import { KeyEquivalence } from '../../common/csv-key-equivalence';
import { ApiErrorEquivalence } from '../lib/api-errors-equivalence';
import apiRequestList from '../../common/api-info/endpoints';
import { addJobToQueue } from '../start/queue';
import fs from 'fs';
import { ManageHosts } from '../lib/manage-hosts';
import { UpdateRegistry } from '../lib/update-registry';
import jwtDecode from 'jwt-decode';
import { KibanaRequest, RequestHandlerContext, KibanaResponseFactory } from 'src/core/server';
import { APIUserAllowRunAs, CacheInMemoryAPIUserAllowRunAs, API_USER_STATUS_RUN_AS } from '../lib/cache-api-user-has-run-as';
import { getCookieValueByName } from '../lib/cookie';
import { SecurityObj } from '../lib/security-factory';
import { getConfiguration } from '../lib/get-configuration';

export class PsafeApiCtrl {
  manageHosts: ManageHosts
  updateRegistry: UpdateRegistry

  constructor() {
    this.manageHosts = new ManageHosts();
    this.updateRegistry = new UpdateRegistry();
  }

  async getToken(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    try {
      const { force, idHost } = request.body;
      const { username } = await context.psafe.security.getCurrentUser(request, context);
      if (!force && request.headers.cookie && username === getCookieValueByName(request.headers.cookie, 'pa-user') && idHost === getCookieValueByName(request.headers.cookie,'pa-api')) {
        const paToken = getCookieValueByName(request.headers.cookie, 'pa-token');
        if (paToken) {
          try { // if the current token is not a valid jwt token we ask for a new one
            const decodedToken = jwtDecode(paToken);
            const expirationTime = (decodedToken.exp - (Date.now() / 1000));
            if (paToken && expirationTime > 0) {
              return response.ok({
                body: { token: paToken }
              });
            }
          } catch (error) {
            log('psafe-api:getToken', error.message || error);
          }
        }
      }
      let token;
      if (await APIUserAllowRunAs.canUse(idHost) == API_USER_STATUS_RUN_AS.ENABLED) {
        token = await context.psafe.api.client.asCurrentUser.authenticate(idHost);
      } else {
        token = await context.psafe.api.client.asInternalUser.authenticate(idHost);
      };

      let textSecure='';
      if(context.psafe.server.info.protocol === 'https'){
        textSecure = ';Secure';
      }

      return response.ok({
        headers: {
          'set-cookie': [
            `pa-token=${token};Path=/;HttpOnly${textSecure}`,
            `pa-user=${username};Path=/;HttpOnly${textSecure}`,
            `pa-api=${idHost};Path=/;HttpOnly`,
          ],
        },
        body: { token }
      });
    } catch (error) {
      const errorMessage = ((error.response || {}).data || {}).detail || error.message || error;
      log('psafe-api:getToken', errorMessage);
      return ErrorResponse(
        `Error getting the authorization token: ${errorMessage}`,
        3000,
        500,
        response
      );
    }
  }

  /**
   * Returns if the psafe-api configuration is working
   * @param {Object} context
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} status obj or ErrorResponse
   */
  async checkStoredAPI(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    try {
      // Get config from psafe.yml
      const id = request.body.id;
      const api = await this.manageHosts.getHostById(id);
      // Check Manage Hosts
      if (!Object.keys(api).length) {
        throw new Error('Could not find Psafe API entry on psafe.yml');
      }

      log('psafe-api:checkStoredAPI', `${id} exists`, 'debug');

      // Fetch needed information about the cluster and the manager itself
      const responseManagerInfo = await context.psafe.api.client.asInternalUser.request(
        'get',
        `/manager/info`,
        {},
        { apiHostID: id, forceRefresh: true }
      );

      // Look for socket-related errors
      if (this.checkResponseIsDown(responseManagerInfo)) {
        return ErrorResponse(
          `ERROR3099 - ${responseManagerInfo.data.detail || 'Psafe not ready yet'}`,
          3099,
          500,
          response
        );
      }

      // If we have a valid response from the Psafe API
      if (responseManagerInfo.status === 200 && responseManagerInfo.data) {
        // Clear and update cluster information before being sent back to frontend
        delete api.cluster_info;
        const responseAgents = await context.psafe.api.client.asInternalUser.request(
          'GET',
          `/agents`,
          { params: { agents_list: '000' } },
          { apiHostID: id }
        );

        if (responseAgents.status === 200) {
          const managerName = responseAgents.data.data.affected_items[0].manager;

          const responseClusterStatus = await context.psafe.api.client.asInternalUser.request(
            'GET',
            `/cluster/status`,
            {},
            { apiHostID: id }
          );
          if (responseClusterStatus.status === 200) {
            if (responseClusterStatus.data.data.enabled === 'yes') {
              const responseClusterLocalInfo = await context.psafe.api.client.asInternalUser.request(
                'GET',
                `/cluster/local/info`,
                {},
                { apiHostID: id }
              );
              if (responseClusterLocalInfo.status === 200) {
                const clusterEnabled = responseClusterStatus.data.data.enabled === 'yes';
                api.cluster_info = {
                  status: clusterEnabled ? 'enabled' : 'disabled',
                  manager: managerName,
                  node: responseClusterLocalInfo.data.data.affected_items[0].node,
                  cluster: clusterEnabled
                    ? responseClusterLocalInfo.data.data.affected_items[0].cluster
                    : 'Disabled',
                };
              }
            } else {
              // Cluster mode is not active
              api.cluster_info = {
                status: 'disabled',
                manager: managerName,
                cluster: 'Disabled',
              };
            }
          } else {
            // Cluster mode is not active
            api.cluster_info = {
              status: 'disabled',
              manager: managerName,
              cluster: 'Disabled',
            };
          }

          if (api.cluster_info) {
            // Update cluster information in the psafe-registry.json
            await this.updateRegistry.updateClusterInfo(id, api.cluster_info);

            // Hide Psafe API secret, username, password
            const copied = { ...api };
            copied.secret = '****';
            copied.password = '****';

            return response.ok({
              body: {
                statusCode: 200,
                data: copied,
                idChanged: request.body.idChanged || null,
              }
            });
          }
        }
      }

      // If we have an invalid response from the Psafe API
      throw new Error(responseManagerInfo.data.detail || `${api.url}:${api.port} is unreachable`);
    } catch (error) {
      if (error.code === 'EPROTO') {
        return response.ok({
          body: {
            statusCode: 200,
            data: { apiIsDown: true },
          }
        });
      } else if (error.code === 'ECONNREFUSED') {
        return response.ok({
          body: {
            statusCode: 200,
            data: { apiIsDown: true },
          }
        });
      } else {
        try {
          const apis = await this.manageHosts.getHosts();
          for (const api of apis) {
            try {
              const id = Object.keys(api)[0];

              const responseManagerInfo = await context.psafe.api.client.asInternalUser.request(
                'GET',
                `/manager/info`,
                {},
                { apiHostID: id }
              );

              if (this.checkResponseIsDown(responseManagerInfo)) {
                return ErrorResponse(
                  `ERROR3099 - ${response.data.detail || 'Psafe not ready yet'}`,
                  3099,
                  500,
                  response
                );
              }
              if (responseManagerInfo.status === 200) {
                request.body.id = id;
                request.body.idChanged = id;
                return await this.checkStoredAPI(context, request, response);
              }
            } catch (error) { } // eslint-disable-line
          }
        } catch (error) {
          log('psafe-api:checkStoredAPI', error.message || error);
          return ErrorResponse(error.message || error, 3020, 500, response);
        }
        log('psafe-api:checkStoredAPI', error.message || error);
        return ErrorResponse(error.message || error, 3002, 500, response);
      }
    }
  }

  /**
   * This perfoms a validation of API params
   * @param {Object} body API params
   */
  validateCheckApiParams(body) {
    if (!('username' in body)) {
      return 'Missing param: API USERNAME';
    }

    if (!('password' in body) && !('id' in body)) {
      return 'Missing param: API PASSWORD';
    }

    if (!('url' in body)) {
      return 'Missing param: API URL';
    }

    if (!('port' in body)) {
      return 'Missing param: API PORT';
    }

    if (!body.url.includes('https://') && !body.url.includes('http://')) {
      return 'protocol_error';
    }

    return false;
  }

  /**
   * This check the psafe-api configuration received in the POST body will work
   * @param {Object} context
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} status obj or ErrorResponse
   */
  async checkAPI(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    try {
      let apiAvailable = null;
      // const notValid = this.validateCheckApiParams(request.body);
      // if (notValid) return ErrorResponse(notValid, 3003, 500, response);
      log('psafe-api:checkAPI', `${request.body.id} is valid`, 'debug');
      // Check if a Psafe API id is given (already stored API)
      const data = await this.manageHosts.getHostById(request.body.id);
      if (data) {
        apiAvailable = data;
      } else {
        log('psafe-api:checkAPI', `API ${request.body.id} not found`);
        return ErrorResponse(`The API ${request.body.id} was not found`, 3029, 500, response);
      }
      const options = { apiHostID: request.body.id };
      if (request.body.forceRefresh) {
        options["forceRefresh"] = request.body.forceRefresh;
      }
      let responseManagerInfo;
      try{
        responseManagerInfo = await context.psafe.api.client.asInternalUser.request(
          'GET',
          `/manager/info`,
          {},
          options
        );
      }catch(error){
        return ErrorResponse(
          `ERROR3099 - ${error.response?.data?.detail || 'Psafe not ready yet'}`,
          3099,
          500,
          response
        );
      }

      log('psafe-api:checkAPI', `${request.body.id} credentials are valid`, 'debug');
      if (responseManagerInfo.status === 200 && responseManagerInfo.data) {
        let responseAgents = await context.psafe.api.client.asInternalUser.request(
          'GET',
          `/agents`,
          { params: { agents_list: '000' } },
          { apiHostID: request.body.id }
        );

        if (responseAgents.status === 200) {
          const managerName = responseAgents.data.data.affected_items[0].manager;

          let responseCluster = await context.psafe.api.client.asInternalUser.request(
            'GET',
            `/cluster/status`,
            {},
            { apiHostID: request.body.id }
          );

          // Check the run_as for the API user and update it
          let apiUserAllowRunAs = API_USER_STATUS_RUN_AS.ALL_DISABLED;
          const responseApiUserAllowRunAs = await context.psafe.api.client.asInternalUser.request(
            'GET',
            `/security/users/me`,
            {},
            { apiHostID: request.body.id }
          );
          if (responseApiUserAllowRunAs.status === 200) {
            const allow_run_as = responseApiUserAllowRunAs.data.data.affected_items[0].allow_run_as;

            if (allow_run_as && apiAvailable && apiAvailable.run_as) // HOST AND USER ENABLED
              apiUserAllowRunAs = API_USER_STATUS_RUN_AS.ENABLED;

            else if (!allow_run_as && apiAvailable && apiAvailable.run_as)// HOST ENABLED AND USER DISABLED
              apiUserAllowRunAs = API_USER_STATUS_RUN_AS.USER_NOT_ALLOWED;

            else if (allow_run_as && ( !apiAvailable || !apiAvailable.run_as )) // USER ENABLED AND HOST DISABLED
              apiUserAllowRunAs = API_USER_STATUS_RUN_AS.HOST_DISABLED;

            else if (!allow_run_as && ( !apiAvailable || !apiAvailable.run_as )) // HOST AND USER DISABLED
              apiUserAllowRunAs = API_USER_STATUS_RUN_AS.ALL_DISABLED;
          }
          CacheInMemoryAPIUserAllowRunAs.set(
            request.body.id,
            apiAvailable.username,
            apiUserAllowRunAs
          );

          if (responseCluster.status === 200) {
            log('psafe-api:checkStoredAPI', `Psafe API response is valid`, 'debug');
            if (responseCluster.data.data.enabled === 'yes') {
              // If cluster mode is active
              let responseClusterLocal = await context.psafe.api.client.asInternalUser.request(
                'GET',
                `/cluster/local/info`,
                {},
                { apiHostID: request.body.id }
              );

              if (responseClusterLocal.status === 200) {
                return response.ok({
                  body: {
                    manager: managerName,
                    node: responseClusterLocal.data.data.affected_items[0].node,
                    cluster: responseClusterLocal.data.data.affected_items[0].cluster,
                    status: 'enabled',
                    allow_run_as: apiUserAllowRunAs,
                  },
                });
              }
            } else {
              // Cluster mode is not active
              return response.ok({
                body: {
                  manager: managerName,
                  cluster: 'Disabled',
                  status: 'disabled',
                  allow_run_as: apiUserAllowRunAs,
                },
              });
            }
          }
        }
      }
    } catch (error) {
      log('psafe-api:checkAPI', error.message || error);

      if (error && error.response && error.response.status === 401) {
        return ErrorResponse(
          `Unathorized. Please check API credentials. ${error.response.data.message}`,
          401,
          401,
          response
        );
      }
      if (error && error.response && error.response.data && error.response.data.detail) {
        return ErrorResponse(
          error.response.data.detail,
          error.response.status || 500,
          error.response.status || 500,
          response
        );
      }
      if (error.code === 'EPROTO') {
        return ErrorResponse(
          'Wrong protocol being used to connect to the Psafe API',
          3005,
          500,
          response
        );
      }
      return ErrorResponse(error.message || error, 3005, 500, response);
    }
  }

  checkResponseIsDown(response) {
    if (response.status !== 200) {
      // Avoid "Error communicating with socket" like errors
      const socketErrorCodes = [1013, 1014, 1017, 1018, 1019];
      const status = (response.data || {}).status || 1
      const isDown = socketErrorCodes.includes(status);

      isDown && log('psafe-api:makeRequest', 'Psafe API is online but Psafe is not ready yet');

      return isDown;
    }
    return false;
  }

  /**
   * Check main Psafe daemons status
   * @param {*} context Endpoint context
   * @param {*} api API entry stored in .psafe
   * @param {*} path Optional. Psafe API target path.
   */
  async checkDaemons(context, api, path) {
    try {
      const response = await context.psafe.api.client.asInternalUser.request(
        'GET',
        '/manager/status',
        {},
        { apiHostID: api.id }
      );

      const daemons = ((((response || {}).data || {}).data || {}).affected_items || [])[0] || {};

      const isCluster =
        ((api || {}).cluster_info || {}).status === 'enabled' &&
        typeof daemons['psafe-clusterd'] !== 'undefined';
      const psafedbExists = typeof daemons['psafe-db'] !== 'undefined';

      const execd = daemons['psafe-execd'] === 'running';
      const modulesd = daemons['psafe-modulesd'] === 'running';
      const psafedb = psafedbExists ? daemons['psafe-db'] === 'running' : true;
      const clusterd = isCluster ? daemons['psafe-clusterd'] === 'running' : true;

      const isValid = execd && modulesd && psafedb && clusterd;

      isValid && log('psafe-api:checkDaemons', `Psafe is ready`, 'debug');

      if (path === '/ping') {
        return { isValid };
      }

      if (!isValid) {
        throw new Error('Psafe not ready yet');
      }
    } catch (error) {
      log('psafe-api:checkDaemons', error.message || error);
      return Promise.reject(error);
    }
  }

  sleep(timeMs) {
    // eslint-disable-next-line
    return new Promise((resolve, reject) => {
      setTimeout(resolve, timeMs);
    });
  }

  /**
   * Helper method for Dev Tools.
   * https://documentation.psafe.com/current/user-manual/api/reference.html
   * Depending on the method and the path some parameters should be an array or not.
   * Since we allow the user to write the request using both comma-separated and array as well,
   * we need to check if it should be transformed or not.
   * @param {*} method The request method
   * @param {*} path The Psafe API path
   */
  shouldKeepArrayAsIt(method, path) {
    // Methods that we must respect a do not transform them
    const isAgentsRestart = method === 'POST' && path === '/agents/restart';
    const isActiveResponse = method === 'PUT' && path.startsWith('/active-response');
    const isAddingAgentsToGroup = method === 'POST' && path.startsWith('/agents/group/');

    // Returns true only if one of the above conditions is true
    return isAgentsRestart || isActiveResponse || isAddingAgentsToGroup;
  }

  /**
   * This performs a request over Psafe API and returns its response
   * @param {String} method Method: GET, PUT, POST, DELETE
   * @param {String} path API route
   * @param {Object} data data and params to perform the request
   * @param {String} id API id
   * @param {Object} response
   * @returns {Object} API response or ErrorResponse
   */
  async makeRequest(context, method, path, data, id, response) {
    
    const devTools = !!(data || {}).devTools;
    try {
      const api = await this.manageHosts.getHostById(id);
      if (devTools) {
        delete data.devTools;
      }

      if (!Object.keys(api).length) {
        log('psafe-api:makeRequest', 'Could not get host credentials');
        //Can not get credentials from psafe-hosts
        return ErrorResponse('Could not get host credentials', 3011, 404, response);
      }

      if (!data) {
        data = {};
      };

      if (!data.headers) {
        data.headers = {};
      };

      const options = {
        apiHostID: id
      };

      // Set content type application/xml if needed
      if (typeof (data || {}).body === 'string' && (data || {}).origin === 'xmleditor') {
        data.headers['content-type'] = 'application/xml';
        delete data.origin;
      }

      if (typeof (data || {}).body === 'string' && (data || {}).origin === 'json') {
        data.headers['content-type'] = 'application/json';
        delete data.origin;
      }

      if (typeof (data || {}).body === 'string' && (data || {}).origin === 'raw') {
        data.headers['content-type'] = 'application/octet-stream';
        delete data.origin;
      }
      const delay = (data || {}).delay || 0;
      if (delay) {
        addJobToQueue({
          startAt: new Date(Date.now() + delay),
          run: async () => {
            try{
              await context.psafe.api.client.asCurrentUser.request(method, path, data, options);
            }catch(error){
              log('queue:delayApiRequest',`An error ocurred in the delayed request: "${method} ${path}": ${error.message || error}`);
            };
          }
        });
        return response.ok({
          body: { error: 0, message: 'Success' }
        });
      }

      if (path === '/ping') {
        try {
          const check = await this.checkDaemons(context, api, path);
          return check;
        } catch (error) {
          const isDown = (error || {}).code === 'ECONNREFUSED';
          if (!isDown) {
            log('psafe-api:makeRequest', 'Psafe API is online but Psafe is not ready yet');
            return ErrorResponse(
              `ERROR3099 - ${error.message || 'Psafe not ready yet'}`,
              3099,
              500,
              response
            );
          }
        }
      }

      log('psafe-api:makeRequest', `${method} ${path}`, 'debug');

      // Extract keys from parameters
      const dataProperties = Object.keys(data);

      // Transform arrays into comma-separated string if applicable.
      // The reason is that we are accepting arrays for comma-separated
      // parameters in the Dev Tools
      if (!this.shouldKeepArrayAsIt(method, path)) {
        for (const key of dataProperties) {
          if (Array.isArray(data[key])) {
            data[key] = data[key].join();
          }
        }
      }

      const responseToken = await context.psafe.api.client.asCurrentUser.request(method, path, data, options);
      const responseIsDown = this.checkResponseIsDown(responseToken);
      if (responseIsDown) {
        return ErrorResponse(
          `ERROR3099 - ${response.body.message || 'Psafe not ready yet'}`,
          3099,
          500,
          response
        );
      }
      let responseBody = (responseToken || {}).data || {};
      if (!responseBody) {
        responseBody =
          typeof responseBody === 'string' && path.includes('/files') && method === 'GET'
            ? ' '
            : false;
        response.data = responseBody;
      }
      const responseError = response.status !== 200 ? response.status : false;

      if (!responseError && responseBody) {
        //cleanKeys(response);
        return response.ok({
          body: responseToken.data
        });
      }

      if (responseError && devTools) {
        return response.ok({
          body: response.data
        });
      }
      throw responseError && responseBody.detail
        ? { message: responseBody.detail, code: responseError }
        : new Error('Unexpected error fetching data from the Psafe API');
    } catch (error) {
      if (error && error.response && error.response.status === 401) {
        return ErrorResponse(
          error.message || error,
          error.code ? `Psafe API error: ${error.code}` : 3013,
          401,
          response
        );
      }
      const errorMsg = (error.response || {}).data || error.message
      log('psafe-api:makeRequest', errorMsg || error);
      if (devTools) {
        return response.ok({
          body: { error: '3013', message: errorMsg || error }
        });
      } else {
        if ((error || {}).code && ApiErrorEquivalence[error.code]) {
          error.message = ApiErrorEquivalence[error.code];
        }
        return ErrorResponse(
          errorMsg.detail || error,
          error.code ? `Psafe API error: ${error.code}` : 3013,
          500,
          response
        );
      }
    }
  }

  /**
   * This make a request to API
   * @param {Object} context
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} api response or ErrorResponse
   */
  requestApi(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {

    const idApi = getCookieValueByName(request.headers.cookie, 'pa-api');
    if (idApi !== request.body.id) { // if the current token belongs to a different API id, we relogin to obtain a new token
      return ErrorResponse(
        'status code 401',
        401,
        401,
        response
      );
    }
    if (!request.body.method) {
      return ErrorResponse('Missing param: method', 3015, 400, response);
    } else if (!request.body.method.match(/^(?:GET|PUT|POST|DELETE)$/)) {
      log('psafe-api:makeRequest', 'Request method is not valid.');
      //Method is not a valid HTTP request method
      return ErrorResponse('Request method is not valid.', 3015, 400, response);
    } else if (!request.body.path) {
      return ErrorResponse('Missing param: path', 3016, 400, response);
    } else if (!request.body.path.startsWith('/')) {
      log('psafe-api:makeRequest', 'Request path is not valid.');
      //Path doesn't start with '/'
      return ErrorResponse('Request path is not valid.', 3015, 400, response);
    } else {

      return this.makeRequest(
        context,
        request.body.method,
        request.body.path,
        request.body.body,
        request.body.id,
        response
      );
    }
  }

  /**
   * Get full data on CSV format from a list Psafe API endpoint
   * @param {Object} ctx
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} csv or ErrorResponse
   */
  async csv(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    try {
      if (!request.body || !request.body.path) throw new Error('Field path is required');
      if (!request.body.id) throw new Error('Field id is required');

      const filters = Array.isArray(((request || {}).body || {}).filters) ? request.body.filters : [];

      let tmpPath = request.body.path;

      if (tmpPath && typeof tmpPath === 'string') {
        tmpPath = tmpPath[0] === '/' ? tmpPath.substr(1) : tmpPath;
      }

      if (!tmpPath) throw new Error('An error occurred parsing path field');

      log('psafe-api:csv', `Report ${tmpPath}`, 'debug');
      // Real limit, regardless the user query
      const params = { limit: 500 };

      if (filters.length) {
        for (const filter of filters) {
          if (!filter.name || !filter.value) continue;
          params[filter.name] = filter.value;
        }
      }

      let itemsArray = [];

      const output = await context.psafe.api.client.asCurrentUser.request(
        'GET',
        `/${tmpPath}`,
        { params: params },
        { apiHostID: request.body.id }
      );

      const isList = request.body.path.includes('/lists') && request.body.filters && request.body.filters.length && request.body.filters.find(filter => filter._isCDBList);

      const totalItems = (((output || {}).data || {}).data || {}).total_affected_items;

      if (totalItems && !isList) {
        params.offset = 0;
        itemsArray.push(...output.data.data.affected_items);
        while (itemsArray.length < totalItems && params.offset < totalItems) {
          params.offset += params.limit;
          const tmpData = await context.psafe.api.client.asCurrentUser.request(
            'GET',
            `/${tmpPath}`,
            { params: params },
            { apiHostID: request.body.id }
          );
          itemsArray.push(...tmpData.data.data.affected_items);
        }
      }

      if (totalItems) {
        const { path, filters } = request.body;
        const isArrayOfLists =
          path.includes('/lists') && !isList;
        const isAgents = path.includes('/agents') && !path.includes('groups');
        const isAgentsOfGroup = path.startsWith('/agents/groups/');
        const isFiles = path.endsWith('/files');
        let fields = Object.keys(output.data.data.affected_items[0]);

        if (isAgents || isAgentsOfGroup) {
          if (isFiles) {
            fields = ['filename', 'hash'];
          } else {
            fields = [
              'id',
              'status',
              'name',
              'ip',
              'group',
              'manager',
              'node_name',
              'dateAdd',
              'version',
              'lastKeepAlive',
              'os.arch',
              'os.build',
              'os.codename',
              'os.major',
              'os.minor',
              'os.name',
              'os.platform',
              'os.uname',
              'os.version',
            ];
          }
        }

        if (isArrayOfLists) {
          const flatLists = [];
          for (const list of itemsArray) {
            const { relative_dirname, items } = list;
            flatLists.push(...items.map(item => ({ relative_dirname, key: item.key, value: item.value })));
          }
          fields = ['relative_dirname', 'key', 'value'];
          itemsArray = [...flatLists];
        }

        if (isList) {
          fields = ['key', 'value'];
          itemsArray = output.data.data.affected_items[0].items;
        }
        fields = fields.map(item => ({ value: item, default: '-' }));

        const json2csvParser = new Parser({ fields });

        let csv = json2csvParser.parse(itemsArray);
        for (const field of fields) {
          const { value } = field;
          if (csv.includes(value)) {
            csv = csv.replace(value, KeyEquivalence[value] || value);
          }
        }

        return response.ok({
          headers: { 'Content-Type': 'text/csv' },
          body: csv
        });
      } else if (output && output.data && output.data.data && !output.data.data.total_affected_items) {
        throw new Error('No results');
      } else {
        throw new Error(`An error occurred fetching data from the Psafe API${output && output.data && output.data.detail ? `: ${output.body.detail}` : ''}`);
      }
    } catch (error) {
      log('psafe-api:csv', error.message || error);
      return ErrorResponse(error.message || error, 3034, 500, response);
    }
  }

  // Get de list of available requests in the API
  getRequestList(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    //Read a static JSON until the api call has implemented
    return response.ok({
      body: apiRequestList
    });
  }

  /**
   * This get the timestamp field
   * @param {Object} context
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} timestamp field or ErrorResponse
   */
  getTimeStamp(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    try {
      const source = JSON.parse(fs.readFileSync(this.updateRegistry.file, 'utf8'));
      if (source.installationDate && source.lastRestart) {
        log(
          'psafe-api:getTimeStamp',
          `Installation date: ${source.installationDate}. Last restart: ${source.lastRestart}`,
          'debug'
        );
        return response.ok({
          body: {
            installationDate: source.installationDate,
            lastRestart: source.lastRestart,
          }
        });
      } else {
        throw new Error('Could not fetch psafe-version registry');
      }
    } catch (error) {
      log('psafe-api:getTimeStamp', error.message || error);
      return ErrorResponse(
        error.message || 'Could not fetch psafe-version registry',
        4001,
        500,
        response
      );
    }
  }

  /**
   * This get the extensions
   * @param {Object} context
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} extensions object or ErrorResponse
   */
  async setExtensions(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    try {
      const { id, extensions } = request.body;
      // Update cluster information in the psafe-registry.json
      await this.updateRegistry.updateAPIExtensions(id, extensions);
      return response.ok({
        body: {
          statusCode: 200
        }
      });
    } catch (error) {
      log('psafe-api:setExtensions', error.message || error);
      return ErrorResponse(
        error.message || 'Could not set extensions',
        4001,
        500,
        response
      );
    }
  }

  /**
   * This get the extensions
   * @param {Object} context
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} extensions object or ErrorResponse
   */
  getExtensions(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    try {
      const source = JSON.parse(
        fs.readFileSync(this.updateRegistry.file, 'utf8')
      );
      return response.ok({
        body: {
          extensions: (source.hosts[request.params.id] || {}).extensions || {}
        }
      });
    } catch (error) {
      log('psafe-api:getExtensions', error.message || error);
      return ErrorResponse(
        error.message || 'Could not fetch psafe-version registry',
        4001,
        500,
        response
      );
    }
  }

  /**
   * This get the psafe setup settings
   * @param {Object} context
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} setup info or ErrorResponse
   */
  async getSetupInfo(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    try {
      const source = JSON.parse(fs.readFileSync(this.updateRegistry.file, 'utf8'));
      return response.ok({
        body: {
          statusCode: 200,
          data: !Object.values(source).length ? '' : source
        }
      });
    } catch (error) {
      log('psafe-api:getSetupInfo', error.message || error);
      return ErrorResponse(
        `Could not get data from psafe-version registry due to ${error.message || error}`,
        4005,
        500,
        response
      );
    }
  }

  /**
   * Get basic syscollector information for given agent.
   * @param {Object} context
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} Basic syscollector information
   */
  async getSyscollector(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    try {
      const apiHostID = getCookieValueByName(request.headers.cookie,'pa-api');
      if (!request.params || !apiHostID || !request.params.agent) {
        throw new Error('Agent ID and API ID are required');
      }

      const { agent } = request.params;

      const data = await Promise.all([
        context.psafe.api.client.asInternalUser.request('GET', `/syscollector/${agent}/hardware`, {}, { apiHostID }),
        context.psafe.api.client.asInternalUser.request('GET', `/syscollector/${agent}/os`, {}, { apiHostID })
      ]);

      const result = data.map(item => (item.data || {}).data || []);
      const [hardwareResponse, osResponse] = result;

      // Fill syscollector object
      const syscollector = {
        hardware:
          typeof hardwareResponse === 'object' && Object.keys(hardwareResponse).length
            ? { ...hardwareResponse.affected_items[0] }
            : false,
        os:
          typeof osResponse === 'object' && Object.keys(osResponse).length
            ? { ...osResponse.affected_items[0] }
            : false,
      };

      return response.ok({
        body: syscollector
      });
    } catch (error) {
      log('psafe-api:getSyscollector', error.message || error);
      return ErrorResponse(error.message || error, 3035, 500, response);
    }
  }
  /**
   * Check if user assigned roles disable Psafe Plugin
   * @param context 
   * @param request 
   * @param response 
   * @returns {object} Returns { isPsafeDisabled: boolean parsed integer } 
   */
  async isPsafeDisabled(context: RequestHandlerContext, request: KibanaRequest, response: KibanaResponseFactory) {
    try {
      
      const disabledRoles = ( await getConfiguration() )['disabled_roles'] || [];
      const logoSidebar = ( await getConfiguration() )['customization.logo.sidebar'];
      const data = (await context.psafe.security.getCurrentUser(request, context)).authContext;

      const isPsafeDisabled = +(data.roles || []).some((role) => disabledRoles.includes(role));

      return response.ok({
        body: { isPsafeDisabled, logoSidebar }
      });
    } catch (error) {
      log('psafe-api:isPsafeDisabled', error.message || error);
      return ErrorResponse(error.message || error, 3035, 500, response);
    }
    
  }
}
