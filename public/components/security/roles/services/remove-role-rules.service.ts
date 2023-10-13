/*
 * Psafe app - Remove Role Rules Service
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import { PaRequest } from '../../../../react-services/pa-request';
import IApiResponse from '../../../../react-services/interfaces/api-response.interface';
import { Role } from '../types/role.type';

const RemoveRoleRulesService = async (
  roleId: number,
  rulesIds: number[],
  removeAll: boolean = false
): Promise<Role> => {
  const response = (await PaRequest.apiReq(
    'DELETE',
    `/security/roles/${roleId}/rules?rule_ids=${removeAll ? 'all' : rulesIds.join(',')}`,
    {}
  )) as IApiResponse<Role>;
  const roles = ((response.data || {}).data || {}).affected_items || [{}];
  return roles[0];
};

export default RemoveRoleRulesService;
