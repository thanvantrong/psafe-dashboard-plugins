/*
 * Psafe app - React component for show configuration of Alerts.
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

import PaTabSelector, {
  PaTabSelectorTab
} from '../util-components/tab-selector';
import withPaConfig from '../util-hocs/pa-config';
import PaConfigurationAlertsGeneral from './alerts-general';
import PaConfigurationAlertsLabels from './alerts-labels';
import PaConfigurationAlertsEmailAlerts from './alerts-email-alerts';
import PaConfigurationAlertsEmailReports from './alerts-reports';
import PaConfigurationAlertsSyslogOutput from './alerts-syslog-output';

import { connect } from 'react-redux';
import { compose } from 'redux';

class PaConfigurationAlerts extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Fragment>
        <PaTabSelector>
          <PaTabSelectorTab label="General">
            <PaConfigurationAlertsGeneral {...this.props} />
          </PaTabSelectorTab>
          <PaTabSelectorTab label="Labels">
            <PaConfigurationAlertsLabels {...this.props} />
          </PaTabSelectorTab>
          <PaTabSelectorTab label="Email alerts">
            <PaConfigurationAlertsEmailAlerts {...this.props} />
          </PaTabSelectorTab>
          <PaTabSelectorTab label="Reports">
            <PaConfigurationAlertsEmailReports {...this.props} />
          </PaTabSelectorTab>
          <PaTabSelectorTab label="Syslog output">
            <PaConfigurationAlertsSyslogOutput {...this.props} />
          </PaTabSelectorTab>
        </PaTabSelector>
      </Fragment>
    );
  }
}

const sections = [
  { component: 'analysis', configuration: 'alerts' },
  { component: 'analysis', configuration: 'labels' },
  { component: 'mail', configuration: 'alerts' },
  { component: 'monitor', configuration: 'reports' },
  { component: 'csyslog', configuration: 'csyslog' }
];

const mapStateToProps = state => ({
  psafeNotReadyYet: state.appStateReducers.psafeNotReadyYet
});

PaConfigurationAlerts.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export default compose(
  withPaConfig(sections),
  connect(mapStateToProps)
)(PaConfigurationAlerts);
