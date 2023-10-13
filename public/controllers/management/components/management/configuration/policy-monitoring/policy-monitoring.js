/*
 * Psafe app - React component for React component for show configuration of policy monitoring.
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
import PaTabSelector, {
  PaTabSelectorTab
} from '../util-components/tab-selector';

import PaConfigurationPolicyMonitoringGeneral from './policy-monitoring-general';
import PaConfigurationPolicyMonitoringSystemAudit from './policy-monitoring-system-audit';
import PaConfigurationPolicyMonitoringIgnored from './policy-monitoring-ignored';
import PaConfigurationPolicyMonitoringSCA from './policy-monitoring-sca';

class PaPolicyMonitoring extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.updateBadge(this.badgeEnabled());
  }
  badgeEnabled() {
    return (
      this.props.currentConfig['syscheck-rootcheck'] &&
      this.props.currentConfig['syscheck-rootcheck'].rootcheck &&
      this.props.currentConfig['syscheck-rootcheck'].rootcheck.disabled &&
      this.props.currentConfig['syscheck-rootcheck'].rootcheck.disabled === 'no'
    );
  }
  render() {
    return (
      <Fragment>
        {(this.props.onlyShowTab === 'Policy Monitoring' && (
          <PaTabSelector>
            <PaTabSelectorTab label="General">
              <PaConfigurationPolicyMonitoringGeneral {...this.props} />
            </PaTabSelectorTab>
            <PaTabSelectorTab label="Ignored">
              <PaConfigurationPolicyMonitoringIgnored {...this.props} />
            </PaTabSelectorTab>
          </PaTabSelector>
        )) ||
          (this.props.onlyShowTab === 'System audit' && (
            <PaConfigurationPolicyMonitoringSystemAudit {...this.props} />
          )) ||
          (this.props.onlyShowTab === 'SCA' && (
            <PaConfigurationPolicyMonitoringSCA {...this.props} />
          )) || (
            <PaTabSelector>
              <PaTabSelectorTab label="General">
                <PaConfigurationPolicyMonitoringGeneral {...this.props} />
              </PaTabSelectorTab>
              <PaTabSelectorTab label="System audit">
                <PaConfigurationPolicyMonitoringSystemAudit {...this.props} />
              </PaTabSelectorTab>
              <PaTabSelectorTab label="Ignored">
                <PaConfigurationPolicyMonitoringIgnored {...this.props} />
              </PaTabSelectorTab>
              <PaTabSelectorTab label="SCA">
                <PaConfigurationPolicyMonitoringSCA {...this.props} />
              </PaTabSelectorTab>
            </PaTabSelector>
          )}
      </Fragment>
    );
  }
}

const sections = [
  { component: 'syscheck', configuration: 'rootcheck' },
  { component: 'wmodules', configuration: 'wmodules' }
];

PaPolicyMonitoring.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withPaConfig(sections)(PaPolicyMonitoring);
