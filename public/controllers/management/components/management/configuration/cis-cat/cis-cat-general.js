/*
 * Psafe app - React component for show configuration of CIS-CAT - general tab.
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

import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import PaConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import PaNoConfig from '../util-components/no-config';
import helpLinks from './help-links';
import { isString, renderValueNoThenEnabled } from '../utils/utils';

const mainSettings = [
  {
    field: 'disabled',
    label: 'CIS-CAT integration status',
    render: renderValueNoThenEnabled
  },
  { field: 'timeout', label: 'Timeout (in seconds) for scan executions' },
  { field: 'java_path', label: 'Path to Java executable directory' },
  { field: 'ciscat_path', label: 'Path to CIS-CAT executable directory' }
];

const schedulingSettings = [
  { field: 'interval', label: 'Interval between scan executions' },
  { field: 'scan-on-start', label: 'Scan on start' },
  { field: 'day', label: 'Day of the month to run scans' },
  { field: 'wday', label: 'Day of the week to run scans' },
  { field: 'time', label: 'Time of the day to run scans' }
];

class PaConfigurationCisCatGeneral extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig, wodleConfig } = this.props;
    return (
      <Fragment>
        {currentConfig['wmodules-wmodules'] &&
          isString(currentConfig['wmodules-wmodules']) && (
            <PaNoConfig
              error={currentConfig['wmodules-wmodules']}
              help={helpLinks}
            />
          )}
        {currentConfig &&
          !wodleConfig['cis-cat'] &&
          !isString(currentConfig['wmodules-wmodules']) && (
            <PaNoConfig error="not-present" help={helpLinks} />
          )}
        {wodleConfig['cis-cat'] && (
          <PaConfigurationSettingsTabSelector
            title="Main settings"
            description="General settings applied to all benchmarks"
            currentConfig={wodleConfig}
            minusHeight={this.props.agent.id === '000' ? 320 : 415}
            helpLinks={helpLinks}
          >
            <PaConfigurationSettingsGroup
              config={wodleConfig['cis-cat']}
              items={mainSettings}
            />
            <PaConfigurationSettingsGroup
              title="Scheduling settings"
              description="Customize CIS-CAT scans scheduling"
              config={wodleConfig['cis-cat']}
              items={schedulingSettings}
            />
          </PaConfigurationSettingsTabSelector>
        )}
      </Fragment>
    );
  }
}

PaConfigurationCisCatGeneral.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
};

export default PaConfigurationCisCatGeneral;
