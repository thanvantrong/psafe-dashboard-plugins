/*
 * Psafe app - API status check service
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { PsafeConfig } from './psafe-config';
import axios from 'axios';
import { AppState } from './app-state';
import { PaMisc } from '../factories/misc';
import { getHttp } from '../kibana-services';
import { PLUGIN_PLATFORM_REQUEST_HEADERS } from '../../common/constants';

export class ApiCheck {
  static async checkStored(data, idChanged = false) {
    try {
      const psafeConfig = new PsafeConfig();
      const configuration = psafeConfig.getConfig();
      const timeout = configuration ? configuration.timeout : 20000;
      const payload = { id: data };
      if (idChanged) {
        payload.idChanged = data;
      }

      const url = getHttp().basePath.prepend('/api/check-stored-api');
      const options = {
        method: 'POST',
        headers: { ...PLUGIN_PLATFORM_REQUEST_HEADERS, 'content-type': 'application/json' },
        url: url,
        data: payload,
        timeout: timeout || 20000
      };

      if (Object.keys(configuration).length) {
        AppState.setPatternSelector(configuration['ip.selector']);
      }

      const response = await axios(options);

      if (response.error) {
        return Promise.reject(response);
      }

      return response;
    } catch (err) {
      if (err.response) {
        const paMisc = new PaMisc();
        paMisc.setApiIsDown(true);
        const response = (err.response.data || {}).message || err.message;
        return Promise.reject(response);
      } else {
        return (err || {}).message || false
          ? Promise.reject(err.message)
          : Promise.reject(err || 'Server did not respond');
      }
    }
  }

  /**
   * Check the status of an API entry
   * @param {String} apiObject
   */
  static async checkApi(apiEntry, forceRefresh=false) {
    try {
      const psafeConfig = new PsafeConfig();
      const { timeout } = psafeConfig.getConfig();
      const url = getHttp().basePath.prepend('/api/check-api');

      const options = {
        method: 'POST',
        headers: { ...PLUGIN_PLATFORM_REQUEST_HEADERS, 'content-type': 'application/json' },
        url: url,
        data: {...apiEntry, forceRefresh},
        timeout: timeout || 20000
      };

      const response = await axios(options);

      if (response.error) {
        return Promise.reject(response);
      }

      return response;
    } catch (err) {
      if (err.response) {
        const response = (err.response.data || {}).message || err.message;
        return Promise.reject(response);
      } else {
        return (err || {}).message || false
          ? Promise.reject(err.message)
          : Promise.reject(err || 'Server did not respond');
      }
    }
  }
}
