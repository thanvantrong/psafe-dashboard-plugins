/*
 * Psafe app - Module for app initialization
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { log } from '../../lib/logger';
import packageJSON from '../../../package.json';
import { pluginPlatformTemplate } from '../../integration-files/kibana-template';
import { getConfiguration } from '../../lib/get-configuration';
import { totalmem } from 'os';
import fs from 'fs';
import { PSAFE_ALERTS_PATTERN, PSAFE_DATA_CONFIG_REGISTRY_PATH, PSAFE_PLUGIN_PLATFORM_TEMPLATE_NAME, PSAFE_DATA_PLUGIN_PLATFORM_BASE_ABSOLUTE_PATH, PLUGIN_PLATFORM_NAME, PLUGIN_PLATFORM_INSTALLATION_USER_GROUP, PLUGIN_PLATFORM_INSTALLATION_USER, PSAFE_DEFAULT_APP_CONFIG, PLUGIN_APP_NAME } from '../../../common/constants';
import { createDataDirectoryIfNotExists } from '../../lib/filesystem';
import _ from 'lodash';


export function jobInitializeRun(context) {
  const PLUGIN_PLATFORM_INDEX = context.server.config.kibana.index;
  log('initialize', `${PLUGIN_PLATFORM_NAME} index: ${PLUGIN_PLATFORM_INDEX}`, 'info');
  log('initialize', `App revision: ${packageJSON.revision}`, 'info');

  let configurationFile = {};
  let pattern = null;
  // Read config from package.json and psafe.yml
  try {
    configurationFile = getConfiguration();

    pattern =
      configurationFile && typeof configurationFile.pattern !== 'undefined'
        ? configurationFile.pattern
        : PSAFE_ALERTS_PATTERN;
  } catch (error) {
    log('initialize', error.message || error);
    context.psafe.logger.error(
      'Something went wrong while reading the configuration.' + (error.message || error)
    );
  }

  try {
    // RAM in MB
    const ram = Math.ceil(totalmem() / 1024 / 1024);
    log('initialize', `Total RAM: ${ram}MB`, 'info');
  } catch (error) {
    log(
      'initialize',
      `Could not check total RAM due to: ${error.message || error}`
    );
  }

  // Save Psafe App setup
  const saveConfiguration = async (hosts = {}) => {
    try {
      const commonDate = new Date().toISOString();

      const configuration = {
        name: 'Psafe App',
        'app-version': packageJSON.version,
        revision: packageJSON.revision,
        installationDate: commonDate,
        lastRestart: commonDate,
        hosts
      };
      try {
        createDataDirectoryIfNotExists();
        createDataDirectoryIfNotExists('config');
        log(
          'initialize:saveConfiguration',
          `Saving configuration in registry file: ${JSON.stringify(configuration)}`,
          'debug'
        );
        await fs.writeFileSync(PSAFE_DATA_CONFIG_REGISTRY_PATH, JSON.stringify(configuration), 'utf8');
        log(
          'initialize:saveConfiguration',
          'Psafe configuration registry saved.',
          'debug'
        );
      } catch (error) {
        log('initialize:saveConfiguration', error.message || error);
        context.psafe.logger.error(
          'Could not create Psafe configuration registry'
        );
      }
    } catch (error) {
      log('initialize:saveConfiguration', error.message || error);
      context.psafe.logger.error(
        'Error creating psafe-registry.json file.'
      );
    }
  };

  /**
   * Checks if the .psafe-registry.json file exists:
   * - yes: check the plugin version and revision match the values stored in the registry file.
   *  If not, then it migrates the data rebuilding the registry file.
   * - no: create the file with empty hosts
   */
  const checkPsafeRegistry = async () => {
    log(
      'initialize:checkpsafeRegistry',
      'Checking psafe-registry.json file.',
      'debug'
    );

    if(!fs.existsSync(PSAFE_DATA_PLUGIN_PLATFORM_BASE_ABSOLUTE_PATH)){
      throw new Error(`The data directory is missing in the ${PLUGIN_PLATFORM_NAME} root instalation. Create the directory in ${PSAFE_DATA_PLUGIN_PLATFORM_BASE_ABSOLUTE_PATH} and give it the required permissions (sudo mkdir ${PSAFE_DATA_PLUGIN_PLATFORM_BASE_ABSOLUTE_PATH};sudo chown -R ${PLUGIN_PLATFORM_INSTALLATION_USER}:${PLUGIN_PLATFORM_INSTALLATION_USER_GROUP} ${PSAFE_DATA_PLUGIN_PLATFORM_BASE_ABSOLUTE_PATH}). After restart the ${PLUGIN_PLATFORM_NAME} service.`);
    };

    if (!fs.existsSync(PSAFE_DATA_CONFIG_REGISTRY_PATH)) {
      log(
        'initialize:checkpsafeRegistry',
        'psafe-registry.json file does not exist. Initializing configuration.',
        'debug'
      );

      // Create the app registry file for the very first time
      await saveConfiguration();
    } else {
      // If this function fails, it throws an exception
      const source = JSON.parse(fs.readFileSync(PSAFE_DATA_CONFIG_REGISTRY_PATH, 'utf8'));

      // Check if the stored revision differs from the package.json revision
      const isUpgradedApp = packageJSON.revision !== source.revision || packageJSON.version !== source['app-version'];

      // Rebuild the registry file if revision or version fields are differents
      if (isUpgradedApp) { 
        log(
          'initialize:checkpsafeRegistry',
          'Psafe app revision or version changed, regenerating psafe-registry.json.',
          'info'
        );

        // Rebuild the registry file `psafe-registry.json`

        // Get the supported extensions for the installed plugin
        const supportedDefaultExtensionsConfiguration = Object.entries(PSAFE_DEFAULT_APP_CONFIG)
          .filter(([setting]) => setting.startsWith('extensions.'))
          .map(([setting, settingValue]) => {
            return [setting.split('.')[1], settingValue];
        });

        // Get the supported extensions by ID
        const supportedDefaultExtensionsNames = supportedDefaultExtensionsConfiguration.map(([setting]) => setting);

        // Generate the hosts data, migrating the extensions.
        // Keep the supported and existent extensions for the installed plugin with the configurated value
        // Add the extensions with default values that didn't exist in the previous configuration
        // Remove the unsupported extensions for the installed plugin
        const registryHostsData = Object.entries(source.hosts).reduce((accum, [hostID, hostData]) => {
          accum[hostID] = hostData;
          if(accum[hostID].extensions){
            // Migrate extensions to those supported by the installed plugin
            const defaultHostExtentionsConfiguration = Object.fromEntries(supportedDefaultExtensionsConfiguration);
            // Select of current configuration the extension IDs that are supported in the installed plugin
            const currentHostConfiguration = _.pick(accum[hostID].extensions, supportedDefaultExtensionsNames);
            // Merge the default extensions configuration with the configuration stored in the registry file
            accum[hostID].extensions = _.merge(defaultHostExtentionsConfiguration, currentHostConfiguration);
          }
          return accum;
        }, {});

        // Rebuild the registry file with the migrated host data (extensions are migrated to these supported by the installed plugin).
        await saveConfiguration(registryHostsData);

        log(
          'initialize:checkpsafeRegistry',
          'Migrated the registry file.',
          'info'
        );
      }
    }
  };

  // Init function. Check for psafe-registry.json file exists.
  const init = async () => {
    await checkPsafeRegistry();
  };

  const createKibanaTemplate = () => {
    log(
      'initialize:createKibanaTemplate',
      `Creating template for ${PLUGIN_PLATFORM_INDEX}`,
      'debug'
    );

    try {
      pluginPlatformTemplate.template = PLUGIN_PLATFORM_INDEX + '*';
    } catch (error) {
      log('initialize:createKibanaTemplate', error.message || error);
      context.psafe.logger.error(
        'Exception: ' + error.message || error
      );
    }

    return context.core.elasticsearch.client.asInternalUser.indices.putTemplate({
      name: PSAFE_PLUGIN_PLATFORM_TEMPLATE_NAME,
      order: 0,
      create: true,
      body: pluginPlatformTemplate
    });
  };

  const createEmptyKibanaIndex = async () => {
    try {
      log(
        'initialize:createEmptyKibanaIndex',
        `Creating ${PLUGIN_PLATFORM_INDEX} index.`,
        'info'
      );
      await context.core.elasticsearch.client.asInternalUser.indices.create({
        index: PLUGIN_PLATFORM_INDEX
      });
      log(
        'initialize:createEmptyKibanaIndex',
        `Successfully created ${PLUGIN_PLATFORM_INDEX} index.`,
        'debug'
      );
      await init();
    } catch (error) {
      return Promise.reject(
        new Error(
          `Error creating ${
          PLUGIN_PLATFORM_INDEX
          } index due to ${error.message || error}`
        )
      );
    }
  };

  const fixKibanaTemplate = async () => {
    try {
      await createKibanaTemplate();
      log(
        'initialize:fixKibanaTemplate',
        `Successfully created ${PLUGIN_PLATFORM_INDEX} template.`,
        'debug'
      );
      await createEmptyKibanaIndex();
    } catch (error) {
      return Promise.reject(
        new Error(
          `Error creating template for ${
          PLUGIN_PLATFORM_INDEX
          } due to ${error.message || error}`
        )
      );
    }
  };

  const getTemplateByName = async () => {
    try {
      await context.core.elasticsearch.client.asInternalUser.indices.getTemplate({
        name: PSAFE_PLUGIN_PLATFORM_TEMPLATE_NAME
      });
      log(
        'initialize:getTemplateByName',
        `No need to create the ${PLUGIN_PLATFORM_INDEX} template, already exists.`,
        'debug'
      );
      await createEmptyKibanaIndex();
    } catch (error) {
      log('initialize:getTemplateByName', error.message || error);
      return fixKibanaTemplate();
    }
  };

  // Does Kibana index exist?
  const checkKibanaStatus = async () => {
    try {
      const response = await context.core.elasticsearch.client.asInternalUser.indices.exists({
        index: PLUGIN_PLATFORM_INDEX
      });
      if (response.body) {
        // It exists, initialize!
        await init();
      } else {
        // No Kibana index created...
        log(
          'initialize:checkKibanaStatus',
          `Not found ${PLUGIN_PLATFORM_INDEX} index`,
          'info'
        );
        await getTemplateByName();
      }
    } catch (error) {
      log('initialize:checkKibanaStatus', error.message || error);
      context.psafe.logger.error(error.message || error);
    }
  };

  // Wait until Elasticsearch js is ready
  const checkStatus = async () => {
    try {
      // TODO: wait until elasticsearch is ready?
      // await server.plugins.elasticsearch.waitUntilReady();
      return await checkKibanaStatus();
    } catch (error) {
      log(
        'initialize:checkStatus',
        'Waiting for elasticsearch plugin to be ready...',
        'debug'
      );
      setTimeout(() => checkStatus(), 3000);
    }
  };

  // Check Kibana index and if it is prepared, start the initialization of Psafe App.
  return checkStatus();
}
