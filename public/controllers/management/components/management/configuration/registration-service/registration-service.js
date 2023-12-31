/*
 * Psafe app - React component for show configuration of registration service.
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

import PaConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import withPaConfig from '../util-hocs/pa-config';
import PaNoConfig from '../util-components/no-config';
import { isString, renderValueNoThenEnabled } from '../utils/utils';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const helpLinks = [
  {
    text: 'Psafe agent enrollment',
    href: webDocumentationLink('user-manual/agent-enrollment/index.html')
  },
  {
    text: 'Registration service reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/auth.html')
  }
];

const mainSettings = [
  {
    field: 'disabled',
    label: 'Service status',
    render: renderValueNoThenEnabled
  },
  { field: 'port', label: 'Listen to connections at port' },
  { field: 'use_source_ip', label: "Use client's source IP address" },
  { field: 'use_password', label: 'Use a password to register agents' },
  { field: 'purge', label: 'Purge agents list when removing agents' },
  {
    field: 'limit_maxagents',
    label: 'Limit registration to maximum number of agents'
  },
  {
    field: 'force.enabled',
    label: 'Force registration when using an existing IP address'
  },
  {
    field: 'force.after_registration_time',
    label: 'Specifies that the agent replacement will be performed only when the time (seconds) passed since the agent registration is greater than the value configured in the setting'
  },
  {
    field: 'force.key_mismatch',
    label: 'Avoid re-registering agents that already have valid keys'
  },
  {
    field: 'force.disconnected_time.enabled',
    label: 'Specifies that the replacement will be performed only for agents that have been disconnected longer than a certain time'
  },
  {
    field: 'force.disconnected_time.value',
    label: 'Seconds since an agent is in a disconnected state'
  },
];
const sslSettings = [
  { field: 'ssl_verify_host', label: 'Verify agents using a CA certificate' },
  {
    field: 'ssl_auto_negotiate',
    label: 'Auto-select the SSL negotiation method'
  },
  { field: 'ssl_manager_ca', label: 'CA certificate location' },
  { field: 'ssl_manager_cert', label: 'Server SSL certificate location' },
  { field: 'ssl_manager_key', label: 'Server SSL key location' },
  { field: 'ciphers', label: 'Use the following SSL ciphers' }
];

class PaRegistrationService extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.updateBadge(this.badgeEnabled());
  }
  badgeEnabled() {
    return (
      this.props.currentConfig['auth-auth'] &&
      this.props.currentConfig['auth-auth'].auth &&
      this.props.currentConfig['auth-auth'].auth.disabled === 'no'
    );
  }
  render() {
    const { currentConfig } = this.props;
    return (
      <Fragment>
        {currentConfig['auth-auth'] && !currentConfig['auth-auth'].auth && (
          <PaNoConfig error={currentConfig['auth-auth']} help={helpLinks} />
        )}
        {currentConfig['auth-auth'] &&
          currentConfig['auth-auth'].auth &&
          !isString(currentConfig['auth-auth'].auth) && (
            <PaConfigurationSettingsTabSelector
              title="Main settings"
              description="General settings applied to the registration service"
              currentConfig={currentConfig}
              minusHeight={260}
              helpLinks={helpLinks}
            >
              <PaConfigurationSettingsGroup
                config={currentConfig['auth-auth'].auth}
                items={mainSettings}
              />
              <PaConfigurationSettingsGroup
                title="SSL settings"
                description="Applied when the registration service uses SSL certificates"
                config={currentConfig['auth-auth'].auth}
                items={sslSettings}
              />
            </PaConfigurationSettingsTabSelector>
          )}
      </Fragment>
    );
  }
}

PaRegistrationService.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withPaConfig([{ component: 'auth', configuration: 'auth' }])(
  PaRegistrationService
);
