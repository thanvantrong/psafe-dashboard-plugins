/*
 * Psafe app - React component for show configuration of cluster.
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

import PaConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import PaNoConfig from '../util-components/no-config';

import withPaConfig from '../util-hocs/pa-config';
import { isString } from '../utils/utils';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const mainSettings = [
  { field: 'disabled', label: 'Cluster status' },
  { field: 'name', label: 'Cluster name' },
  { field: 'node_name', label: 'Node name' },
  { field: 'node_type', label: 'Node type' },
  { field: 'nodes', label: 'Master node IP address' },
  { field: 'port', label: 'Port to listen to cluster communications' },
  {
    field: 'bind_addr',
    label: 'IP address to listen to cluster communications'
  },
  { field: 'hidden', label: 'Hide cluster information in alerts' }
];

const helpLinks = [
  {
    text: 'Configuring a Psafe cluster',
    href: webDocumentationLink('user-manual/configuring-cluster/index.html')
  },
  {
    text: 'Psafe cluster reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/cluster.html')
  }
];

class PaCluster extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig, psafeNotReadyYet } = this.props;
    let mainSettingsConfig = {
      ...currentConfig['com-cluster'],
      disabled:
        currentConfig['com-cluster'].disabled === 'yes' ? 'disabled' : 'enabled'
    };
    return (
      <Fragment>
        {currentConfig['com-cluster'] &&
          isString(currentConfig['com-cluster']) && (
            <PaNoConfig error={currentConfig['com-cluster']} help={helpLinks} />
          )}
        {psafeNotReadyYet &&
          (!currentConfig || !currentConfig['com-cluster']) && (
            <PaNoConfig error="Psafe not ready yet" help={helpLinks} />
          )}
        {currentConfig['com-cluster'] &&
          !isString(currentConfig['com-cluster']) && (
            <PaConfigurationSettingsTabSelector
              title="Main settings"
              currentConfig={currentConfig}
              minusHeight={260}
              helpLinks={helpLinks}
            >
              <PaConfigurationSettingsGroup
                config={mainSettingsConfig}
                items={mainSettings}
              />
            </PaConfigurationSettingsTabSelector>
          )}
      </Fragment>
    );
  }
}

const sections = [{ component: 'com', configuration: 'cluster' }];

const mapStateToProps = state => ({
  psafeNotReadyYet: state.appStateReducers.psafeNotReadyYet
});

PaCluster.propTypes = {
  // currentConfig: PropTypes.object.isRequired
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export default compose(
  withPaConfig(sections),
  connect(mapStateToProps)
)(PaCluster);
