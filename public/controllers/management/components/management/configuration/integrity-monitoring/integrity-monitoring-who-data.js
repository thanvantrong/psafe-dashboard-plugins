/*
 * Psafe app - React component for show configuration of integrity monitoring - whodata tab.
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

import { EuiBasicTable, EuiIcon, EuiLink } from '@elastic/eui';

import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import PaConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import PaNoConfig from '../util-components/no-config';
import helpLinks from './help-links';

const mainSettings = [
  { field: 'restart_audit', label: 'Restart audit' },
  { field: 'startup_healthcheck', label: 'Startup healthcheck' }
];

const columns = [{ field: 'audit_key', name: 'Keys' }];

class PaConfigurationIntegrityMonitoringWhoData extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig } = this.props;
    return (
      <Fragment>
        {currentConfig &&
          currentConfig['syscheck-syscheck'] &&
          currentConfig['syscheck-syscheck'].syscheck &&
          !currentConfig['syscheck-syscheck'].syscheck.whodata && (
            <PaNoConfig error="not-present" help={helpLinks} />
          )}
        {currentConfig &&
          currentConfig['syscheck-syscheck'] &&
          currentConfig['syscheck-syscheck'].syscheck &&
          currentConfig['syscheck-syscheck'].syscheck.whodata && (
            <PaConfigurationSettingsTabSelector
              title="Who-data audit keys"
              description="Psafe will include in its FIM baseline those events being monitored by Audit using audit_key."
              currentConfig={currentConfig['syscheck-syscheck']}
              minusHeight={this.props.agent.id === '000' ? 320 : 415}
              helpLinks={helpLinks}
            >
              <PaConfigurationSettingsGroup
                config={currentConfig['syscheck-syscheck'].syscheck.whodata}
                items={mainSettings}
              />
              {currentConfig['syscheck-syscheck'].syscheck.whodata
                .audit_key && (
                <EuiBasicTable
                  items={currentConfig[
                    'syscheck-syscheck'
                  ].syscheck.whodata.audit_key.map(item => ({
                    audit_key: item
                  }))}
                  columns={columns}
                />
              )}
            </PaConfigurationSettingsTabSelector>
          )}
      </Fragment>
    );
  }
}

PaConfigurationIntegrityMonitoringWhoData.proptTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default PaConfigurationIntegrityMonitoringWhoData;
