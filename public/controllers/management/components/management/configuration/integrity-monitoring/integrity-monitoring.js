/*
 * Psafe app - React component for show configuration of integrity monitoring.
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

import withPaConfig from '../util-hocs/pa-config';
import PaNoConfig from '../util-components/no-config';
import { isString } from '../utils/utils';
import PaTabSelector, {
  PaTabSelectorTab
} from '../util-components/tab-selector';
import helpLinks from './help-links';

import PaConfigurationIntegrityMonitoringGeneral from './integrity-monitoring-general';
import PaConfigurationIntegrityMonitoringMonitored from './integrity-monitoring-monitored';
import PaConfigurationIntegrityMonitoringIgnored from './integrity-monitoring-ignored';
import PaConfigurationIntegrityMonitoringNoDiff from './integrity-monitoring-no-diff';
import PaConfigurationIntegrityMonitoringWhoData from './integrity-monitoring-who-data';
import PaConfigurationIntegrityMonitoringSynchronization from './integrity-monitoring-synchronization';
import PaConfigurationIntegrityMonitoringFileLimit from './integrity-monitoring-file-limit';

class PaConfigurationIntegrityMonitoring extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.updateBadge(this.badgeEnabled());
  }
  badgeEnabled() {
    return (
      this.props.currentConfig['syscheck-syscheck'] &&
      this.props.currentConfig['syscheck-syscheck'].syscheck &&
      this.props.currentConfig['syscheck-syscheck'].syscheck.disabled &&
      this.props.currentConfig['syscheck-syscheck'].syscheck.disabled === 'no'
    );
  }
  render() {
    const { currentConfig, agent } = this.props;
    const agentPlatform = ((agent || {}).os || {}).platform;
    return (
      <Fragment>
        {currentConfig['syscheck-syscheck'] &&
          isString(currentConfig['syscheck-syscheck']) && (
            <PaNoConfig
              error={currentConfig['syscheck-syscheck']}
              help={helpLinks}
            />
          )}
        {currentConfig['syscheck-syscheck'] &&
          !isString(currentConfig['syscheck-syscheck']) &&
          !currentConfig['syscheck-syscheck'].syscheck && (
            <PaNoConfig error="not-present" help={helpLinks} />
          )}
        {currentConfig['syscheck-syscheck'] &&
          !isString(currentConfig['syscheck-syscheck']) &&
          currentConfig['syscheck-syscheck'].syscheck && (
            <PaTabSelector>
              <PaTabSelectorTab label="General">
                <PaConfigurationIntegrityMonitoringGeneral {...this.props} />
              </PaTabSelectorTab>
              <PaTabSelectorTab label="Monitored">
                <PaConfigurationIntegrityMonitoringMonitored {...this.props} />
              </PaTabSelectorTab>
              <PaTabSelectorTab label="Ignored">
                <PaConfigurationIntegrityMonitoringIgnored {...this.props} />
              </PaTabSelectorTab>
              <PaTabSelectorTab label="No diff">
                <PaConfigurationIntegrityMonitoringNoDiff {...this.props} />
              </PaTabSelectorTab>
              {agentPlatform !== 'windows' && (
                <PaTabSelectorTab label="Who-data">
                  <PaConfigurationIntegrityMonitoringWhoData {...this.props} />
                </PaTabSelectorTab>
              )}
              <PaTabSelectorTab label="Synchronization">
                <PaConfigurationIntegrityMonitoringSynchronization
                  {...this.props}
                />
              </PaTabSelectorTab>
              <PaTabSelectorTab label="File limit">
                <PaConfigurationIntegrityMonitoringFileLimit {...this.props} />
              </PaTabSelectorTab>
            </PaTabSelector>
          )}
      </Fragment>
    );
  }
}

const sections = [{ component: 'syscheck', configuration: 'syscheck' }];

PaConfigurationIntegrityMonitoring.proptTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withPaConfig(sections)(PaConfigurationIntegrityMonitoring);
