/*
 * Psafe app - Check APIs service
 *
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 *
 */

import { getToasts } from '../../../kibana-services';
import { ApiCheck, AppState, GenericRequest } from '../../../react-services';
import { CheckLogger } from '../types/check_logger';

const trySetDefault = async (checkLogger: CheckLogger) => {
  try {
    checkLogger.info(`Getting API hosts...`);
    const response = await GenericRequest.request('GET', '/hosts/apis');
    checkLogger.info(`API hosts found: ${response.data.length}`);
    const hosts = response.data;
    const errors = [];

    if (hosts.length) {
      for (var i = 0; i < hosts.length; i++) {
        try {
          checkLogger.info(`Checking API host id [${hosts[i].id}]...`);
          const API = await ApiCheck.checkApi(hosts[i], true);
          if (API && API.data) {
            return hosts[i].id;
          }
        } catch (err) {
          checkLogger.info(`Could not connect to API id [${hosts[i].id}]: ${err.message || err}`);
          errors.push(`Could not connect to API id [${hosts[i].id}]: ${err.message || err}`);
        }
      }
      if (errors.length) {
        return Promise.reject('No API available to connect');
      }
    }
    return Promise.reject('No API configuration found');
  } catch (error) {
    checkLogger.error(`Error connecting to API: ${error}`);
    return Promise.reject(`Error connecting to API: ${error}`);
  }
};

export const checkApiService = (appInfo: any) => async (checkLogger: CheckLogger) => {
  let apiChanged = false;
  try {
    let currentApi = JSON.parse(AppState.getCurrentAPI() || '{}');
    if(!currentApi.id){
      checkLogger.info(`No current API selected`);
      currentApi.id = await trySetDefault(checkLogger);
      apiChanged = true;
    }

    checkLogger.info(`Current API id [${currentApi.id}]`);
    checkLogger.info(`Checking current API id [${currentApi.id}]...`);
    const data = await ApiCheck.checkStored(currentApi.id).catch(async (err) => {
      checkLogger.info(`Current API id [${currentApi.id}] has some problem: ${err.message || err}`);
      const newApi = await trySetDefault(checkLogger);
      if (newApi.error) {
        return { error: newApi.error };
      }
      apiChanged = true;
      checkLogger.info(`API host id [${newApi}] available`);
      return await ApiCheck.checkStored(newApi, true);
    });

    if (apiChanged) {
      const api = ((data || {}).data || {}).data || {};
      const name = (api.cluster_info || {}).manager || false;
      AppState.setCurrentAPI(JSON.stringify({ name: name, id: api.id }));
      checkLogger.info(`Set current API in cookie: id [${api.id}], name [${name}]`);
      getToasts().add({
        color: 'warning',
        title: 'Selected Psafe API has been updated',
        text: '',
        toastLifeTimeMs: 3000,
      });
    }
    //update cluster info
    const cluster_info = (((data || {}).data || {}).data || {}).cluster_info;
    if (cluster_info) {
      AppState.setClusterInfo(cluster_info);
      checkLogger.info(`Set cluster info in cookie`);
    }
    if (data === 3099) {
      checkLogger.error('Psafe not ready yet');
    } else if (data.data.error || data.data.data.apiIsDown) {
      const errorMessage = data.data.data.apiIsDown
      ? 'Psafe API is down'
      : `Error connecting to the API: ${
          data.data.error && data.data.error.message ? ` ${data.data.error.message}` : ''
        }`;
      checkLogger.error(errorMessage);
    }
  } catch (error) {
    AppState.removeNavigation();
    checkLogger.info('Removed [navigate] cookie');
    throw error;
  }
};
