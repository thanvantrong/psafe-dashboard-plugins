/*
 * Psafe app - Reporting handler service
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import { PaRequest } from '../../../../../../react-services/pa-request';

export default class ReportingHandler {
  /**
   * Get list reports
   * @param {String} name
   */
  static async listReports() {
    try {
      const result = await PaRequest.genericReq('GET', '/reports');
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete report
   * @param {String} name
   */
  static async deleteReport(name) {
    try {
      const result = await PaRequest.genericReq(
        'DELETE',
        `/reports/${name}`
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
