/*
 * Psafe app - Module for Psafe utils routes
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { PsafeUtilsCtrl } from '../../controllers';
import { IRouter } from 'kibana/server';
import { schema } from '@kbn/config-schema';

export function PsafeUtilsRoutes(router: IRouter) {
  const ctrl = new PsafeUtilsCtrl();

  // Returns the psafe.yml file parsed
  router.get(
    {
      path: '/utils/configuration',
      validate: false
    },
    async (context, request, response) => ctrl.getConfigurationFile(context, request, response)
  );

  // Returns the psafe.yml file in raw
  router.put(
    {
      path: '/utils/configuration',
      validate: {
        body: schema.object({
          key: schema.string(),
          value: schema.any()
        })
      }
    },
    async (context, request, response) => ctrl.updateConfigurationFile(context, request, response)
  );

  // Returns Psafe app logs
  router.get(
    {
      path: '/utils/logs',
      validate: false
    },
    async (context, request, response) => ctrl.getAppLogs(context,request, response)
  );
}
