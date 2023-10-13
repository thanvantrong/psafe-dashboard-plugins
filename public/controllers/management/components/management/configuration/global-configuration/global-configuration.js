/*
 * Psafe app - React component for show configuration of global configuration.
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
import PaConfigurationGlobalConfigurationGlobal from './global-configuration-global';
import PaConfigurationGlobalConfigurationRemote from './global-configuration-remote';

import withPaConfig from '../util-hocs/pa-config';

import { connect } from 'react-redux';
import { compose } from 'redux';

class PaConfigurationGlobalConfiguration extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { agent } = this.props;
    return (
      <Fragment>
        {agent && agent.id === '000' ? (
          <PaTabSelector>
            <PaTabSelectorTab label="Global">
              <PaConfigurationGlobalConfigurationGlobal {...this.props} />
            </PaTabSelectorTab>
            <PaTabSelectorTab label="Remote">
              <PaConfigurationGlobalConfigurationRemote {...this.props} />
            </PaTabSelectorTab>
          </PaTabSelector>
        ) : (
          <PaConfigurationGlobalConfigurationGlobal {...this.props} />
        )}
      </Fragment>
    );
  }
}

const sectionsManager = [
  { component: 'analysis', configuration: 'global' },
  { component: 'mail', configuration: 'global' },
  { component: 'request', configuration: 'remote' },
  { component: 'com', configuration: 'logging' }
];

const sectionsAgent = [{ component: 'com', configuration: 'logging' }];

const mapStateToProps = state => ({
  psafeNotReadyYet: state.appStateReducers.psafeNotReadyYet,
  clusterNodeSelected: state.configurationReducers.clusterNodeSelected
});

export const PaConfigurationGlobalConfigurationManager = compose(
  connect(mapStateToProps),
  withPaConfig(sectionsManager)
)(PaConfigurationGlobalConfiguration);

export const PaConfigurationGlobalConfigurationAgent = compose(
  connect(mapStateToProps),
  withPaConfig(sectionsAgent)
)(PaConfigurationGlobalConfiguration);

PaConfigurationGlobalConfigurationManager.propTypes = {
  agent: PropTypes.object
};

PaConfigurationGlobalConfigurationAgent.propTypes = {
  agent: PropTypes.object
};
