/*
 * Psafe app - Add User Roles Service
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import { User } from '../types/user.type';
import { PaRequest } from '../../../../react-services/pa-request';
import IApiResponse from '../../../../react-services/interfaces/api-response.interface';

const AddUserRolesService = async (userId: number, roles: number[]): Promise<User> => {
  const response = (await PaRequest.apiReq(
    'POST',
    `/security/users/${userId}/roles?role_ids=${roles.join(',')}`,
    {}
  )) as IApiResponse<User>;
  const users = ((response.data || {}).data || {}).affected_items || [{}];
  return users[0];
};

export default AddUserRolesService;
