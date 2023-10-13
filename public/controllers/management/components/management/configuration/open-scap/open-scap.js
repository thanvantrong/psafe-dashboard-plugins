/*
 * Psafe app - React component for show configuration of OpenSCAP.
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

import PaTabSelector, {
  PaTabSelectorTab
} from '../util-components/tab-selector';
import PaConfigurationOpenSCAPGeneral from './open-scap-general';
import PaConfigurationOpenSCAPEvaluations from './open-scap-evaluations';

import { connect } from 'react-redux';
import { compose } from 'redux';
import withPaConfig from '../util-hocs/pa-config';
import { wodleBuilder } from '../utils/builders';

class PaConfigurationOpenSCAP extends Component {
  constructor(props) {
    super(props);
    this.wodleConfig = wodleBuilder(this.props.currentConfig, 'open-scap');
  }
  componentDidMount() {
    this.props.updateBadge(
      this.props.currentConfig &&
        this.props.currentConfig['open-scap'] &&
        this.props.currentConfig['open-scap'].disabled === 'no'
    );
  }
  render() {
    let { currentConfig } = this.props;
    return (
      <PaTabSelector>
        <PaTabSelectorTab label="General">
          <PaConfigurationOpenSCAPGeneral
            {...this.props}
            currentConfig={currentConfig}
            wodleConfig={this.wodleConfig}
          />
        </PaTabSelectorTab>
        <PaTabSelectorTab label="Evaluations">
          <PaConfigurationOpenSCAPEvaluations
            {...this.props}
            currentConfig={currentConfig}
            wodleConfig={this.wodleConfig}
          />
        </PaTabSelectorTab>
      </PaTabSelector>
    );
  }
}

const mapStateToProps = state => ({
  psafeNotReadyYet: state.appStateReducers.psafeNotReadyYet
});

const sections = [{ component: 'wmodules', configuration: 'wmodules' }];

PaConfigurationOpenSCAP.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default compose(
  connect(mapStateToProps),
  withPaConfig(sections)
)(PaConfigurationOpenSCAP);
