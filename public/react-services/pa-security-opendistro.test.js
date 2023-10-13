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

import { PaSecurityOpendistro } from './pa-security-opendistro';

jest.mock('./generic-request', () => ({
  GenericRequest: {
    request: (method, path) => {
      return {
        data: {
          data: {
            psafe: {
              hash: '',
              reserved: true,
              hidden: false,
              backend_roles: ['admin'],
              attributes: {email: 'psafe@email.com', full_name: 'psafe surname'},
              description: 'admin user',
              opendistro_security_roles: [],
              static: false,
            },
          },
        },
      };
    },
  },
}));
describe('Psafe Internal Users', () => {
  it('Should return the ODFE internal users', async () => {
    const users = await PaSecurityOpendistro.getUsers();
    const expected_result = [
        { username: 'psafe', email: 'psafe@email.com', full_name: 'psafe surname', roles: [] },
      ];
    expect(users).toEqual(expected_result);
  });
});
