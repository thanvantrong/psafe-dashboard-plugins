/*
 * Psafe app - React component for show configuration of integrity monitoring - synchronization tab.
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
import PropTypes from 'prop-types';

import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import PaConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import PaNoConfig from '../util-components/no-config';
import helpLinks from './help-links';
import { renderValueYesThenEnabled } from '../utils/utils';

const mainSettings = [
  {
    field: 'enabled',
    label: 'Synchronization status',
    render: renderValueYesThenEnabled
  },
  {
    field: 'max_interval',
    label: 'Maximum interval (in seconds) between every sync'
  },
  { field: 'interval', label: 'Interval (in seconds) between every sync' },
  { field: 'response_timeout', label: 'Response timeout (in seconds)' },
  { field: 'queue_size', label: 'Queue size of the manager responses' },
  { field: 'max_eps', label: 'Maximum message throughput' }
];

class PaConfigurationIntegrityMonitoringSynchronization extends Component {
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
        currentConfig['syscheck-syscheck'].syscheck.synchronization ? (
          <PaConfigurationSettingsTabSelector
            title="Syncronization"
            description="Database synchronization settings"
            currentConfig={currentConfig['syscheck-syscheck']}
            minusHeight={this.props.agent.id === '000' ? 320 : 415}
            helpLinks={helpLinks}
          >
            <PaConfigurationSettingsGroup
              config={
                currentConfig['syscheck-syscheck'].syscheck.synchronization
              }
              items={mainSettings}
            />
          </PaConfigurationSettingsTabSelector>
        ) : (
          <PaNoConfig error="not-present" help={helpLinks} />
        )}
      </Fragment>
    );
  }
}

PaConfigurationIntegrityMonitoringSynchronization.proptTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default PaConfigurationIntegrityMonitoringSynchronization;
