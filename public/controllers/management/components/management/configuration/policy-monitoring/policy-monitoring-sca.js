/*
 * Psafe app - React component for show configuration of policy monitoring - sca tab.
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
import helpLinks from './help-links';
import { renderValueYesThenEnabled } from '../utils/utils';
import { wodleBuilder } from '../utils/builders';

const securitySettings = [
  {
    field: 'enabled',
    label: 'Security configuration assessment status',
    render: renderValueYesThenEnabled
  },
  { field: 'interval', label: 'Interval' },
  { field: 'scan_on_start', label: 'Scan on start' },
  { field: 'skip_nfs', label: 'Skip nfs' }
];

const columns = [{ field: 'policy', name: 'Name' }];

class PaPolicyMonitoringSCA extends Component {
  constructor(props) {
    super(props);
    this.wodleConfig = wodleBuilder(this.props.currentConfig, 'sca');
  }
  render() {
    return (
      <Fragment>
        {!this.wodleConfig.sca ? (
          <PaNoConfig error="not-present" help={helpLinks} />
        ) : (
          <PaConfigurationSettingsTabSelector
            title="Security configuration assessment status"
            currentConfig={this.wodleConfig}
            minusHeight={this.props.agent.id === '000' ? 320 : 415}
            helpLinks={helpLinks}
          >
            <PaConfigurationSettingsGroup
              config={this.wodleConfig.sca}
              items={securitySettings}
            />
            <PaConfigurationSettingsHeader title="Policies" />
            <EuiBasicTable
              items={this.wodleConfig.sca.policies.map(policy => ({ policy }))}
              columns={columns}
            />
          </PaConfigurationSettingsTabSelector>
        )}
      </Fragment>
    );
  }
}

PaPolicyMonitoringSCA.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default PaPolicyMonitoringSCA;
