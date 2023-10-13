/*
 * Psafe app - Delete Users Service
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

const DeleteUsersService = async (
  userIds: number[],
  deleteAll: boolean = false
): Promise<User[]> => {
  const response = (await PaRequest.apiReq(
    'DELETE',
    `/security/users?user_ids=${deleteAll ? 'all' : userIds.join(',')}`,
    {}
  )) as IApiResponse<User>;
  const users = ((response.data || {}).data || {}).affected_items || [];
  return users;
};

export default DeleteUsersService;