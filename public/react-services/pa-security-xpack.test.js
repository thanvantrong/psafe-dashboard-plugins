/*
 * Psafe app
 *
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import { PaSecurityXpack } from './pa-security-xpack';

jest.mock('./generic-request', () => ({
  GenericRequest: {
    request: (method, path) => {
      return {
        data: {
          username: 'psafe_system',
          roles: ['kibana_system', 'psafe'],
          full_name: 'psafe',
          email: '',
          metadata: {},
          enabled: true,
        },
      };
    },
  },
}));
jest.mock('./pa-request', () => ({
  PaRequest: {
    apiReq: (method, path, params) => {
      return {
        data: {
          id: 3,
          name: 'agents_all_groups',
          policy: {
            actions: [
              'group:read',
              'group:delete',
              'group:update_config',
              'group:modify_assignments',
            ],
            resources: ['group:id:*'],
            effect: 'allow',
          },
          roles: [1, 5],
        },
      };
    },
  },
}));
describe('Psafe Internal Users with X-Pack', () => {
  it('Should create a X-Pack policy', async () => {
    const users = await PaSecurityXpack.createPolicy();
    const expected_result = {
      id: 3,
      name: 'agents_all_groups',
      policy: {
        actions: ['group:read', 'group:delete', 'group:update_config', 'group:modify_assignments'],
        resources: ['group:id:*'],
        effect: 'allow',
      },
      roles: [1, 5],
    };
    expect(users).toEqual(expected_result);
  });
  it('Should create,edit and delete a X-Pack user and also gets all the X-pack internal users', async () => {
    const createUser = await PaSecurityXpack.createUser();
    const users = await PaSecurityXpack.getUsers();
    const editUser = await PaSecurityXpack.editUser();
    const deleteUser = await PaSecurityXpack.deleteUser();
    const expected_result = {
      username: 'psafe_system',
      roles: ['kibana_system', 'psafe'],
      full_name: 'psafe',
      email: '',
      metadata: {},
      enabled: true,
    };
    expect(createUser).toEqual(expected_result);
    expect(editUser).toEqual(expected_result);
    expect(deleteUser).toEqual(expected_result);
    expect(users).toEqual(expected_result);
  });
});
