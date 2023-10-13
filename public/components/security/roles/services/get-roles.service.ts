import IApiResponse from '../../../../react-services/interfaces/api-response.interface';
/*
 * Psafe app - Get Roles Service
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
import { Role } from '../types/role.type';

const GetRolesService = async (): Promise<Role[]> => {
  const response = (await PaRequest.apiReq(
    'GET',
    '/security/roles?sort=name',
    {}
  )) as IApiResponse<Role>;
  const roles = ((response.data || {}).data || {}).affected_items || [];
  return roles;
};

export default GetRolesService;
