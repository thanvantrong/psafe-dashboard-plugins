/*
 * Psafe app - React component for show configuration of client-buffer.
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import React, { Component, Fragment } from 'react';

import { EuiBasicTable } from '@elastic/eui';

import PaNoConfig from '../util-components/no-config';
import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import PaConfigurationSettingsHeader from '../util-components/configuration-settings-header';
import PaConfigurationSettingsGroup from '../util-components/configuration-settings-group';

import {
  isString,
  renderValueOrDefault,
  renderValueOrNoValue
} from '../utils/utils';
import withPaConfig from '../util-hocs/pa-config';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const helpLinks = [
  {
    text: 'Checking connection with manager',
    href: webDocumentationLink('user-manual/agents/agent-connection.html')
  },
  {
    text: 'Client reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/client.html')
  }
];

const mainSettings = [
  { field: 'crypto_method', label: 'Method used to encrypt communications' },
  { field: 'remote_conf', label: 'Remote configuration is enabled' },
  {
    field: 'auto_restart',
    label:
      'Auto-restart the agent when receiving valid configuration from manager'
  },
  {
    field: 'notify_time',
    label: 'Time (in seconds) between agent checkings to the manager'
  },
  {
    field: 'time-reconnect',
    label: 'Time (in seconds) before attempting to reconnect'
  },
  { field: 'config-profile', label: 'Configuration profiles' },
  {
    field: 'local_ip',
    label: 'IP address used when the agent has multiple network interfaces'
  }
];

const columns = [
  { field: 'address', name: 'Address', render: renderValueOrNoValue },
  { field: 'port', name: 'Port', render: renderValueOrDefault('1514') },
  { field: 'protocol', name: 'Protocol', render: renderValueOrDefault('udp') },
  { field: 'max_retries', name: 'Maximum retries to connect', render: renderValueOrNoValue },
  { field: 'retry_interval', name: 'Retry interval to connect', render: renderValueOrNoValue },
];

class PaConfigurationClient extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig } = this.props;
    return (
      <Fragment>
        {currentConfig['agent-client'] &&
          isString(currentConfig['agent-client']) && (
            <PaNoConfig
              error={currentConfig['agent-client']}
              help={helpLinks}
            />
          )}
        {currentConfig['agent-client'] &&
          !isString(currentConfig['agent-client']) && (
            <PaConfigurationSettingsTabSelector
              title="Main settings"
              description="Basic manager-agent communication settings"
              currentConfig={currentConfig}
              minusHeight={355}
              helpLinks={helpLinks}
            >
              <PaConfigurationSettingsGroup
                config={currentConfig['agent-client'].client}
                items={mainSettings}
              />
              {currentConfig['agent-client'].client.server.length && (
                <Fragment>
                  <PaConfigurationSettingsHeader
                    title="Server settings"
                    description="List of managers to connect"
                  />
                  <EuiBasicTable
                    items={currentConfig['agent-client'].client.server}
                    columns={columns}
                  />
                </Fragment>
              )}
            </PaConfigurationSettingsTabSelector>
          )}
      </Fragment>
    );
  }
}

const sections = [{ component: 'agent', configuration: 'client' }];

PaConfigurationClient.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withPaConfig(sections)(PaConfigurationClient);
