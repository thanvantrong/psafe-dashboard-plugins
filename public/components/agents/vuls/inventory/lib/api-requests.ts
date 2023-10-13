/*
 * Psafe app - Agent vulnerabilities requests
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { PaRequest } from '../../../../../react-services/pa-request';

export async function getAggregation(agentId: string, field: string = 'severity', limit: number | null = null) {
  const result = await PaRequest.apiReq('GET', `/vulnerability/${agentId}/summary/${field}`, limit ? { params: { limit } } : {});
  return result?.data?.data;
}

export async function getFilterValues(field, value, agentId, filters = {}, format = (item) => item) {

  const filter = {
    ...filters,
    distinct: true,
    select: field,
    limit: 30,
  };
  if (value) {
    filter['search'] = value;
  }
  const result = await PaRequest.apiReq('GET', `/vulnerability/${agentId}`, { params: filter });
  return result?.data?.data?.affected_items?.map((item) => { return format(item[field]) }) || [];
}

export async function getLastScan(agentId: string = '000') {
  const response = await PaRequest.apiReq(
    'GET',
    `/vulnerability/${agentId}/last_scan`,
    {}
  );
  return response?.data?.data?.affected_items[0] || {};
}
