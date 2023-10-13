/*
 * Psafe app - React component for show configuration of agentless.
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

import withPaConfig from '../util-hocs/pa-config';
import PaNoConfig from '../util-components/no-config';
import PaConfigurationListSelector from '../util-components/configuration-settings-list-selector';
import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import { isString } from '../utils/utils';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const mainSettings = [
  { field: 'type', label: 'Agentless monitoring type' },
  { field: 'frequency', label: 'Interval (in seconds) between checks' },
  { field: 'host', label: 'Device username and hostname' },
  { field: 'state', label: 'Device check type' },
  { field: 'arguments', label: 'Pass these arguments to check' }
];

const helpLinks = [
  {
    text: 'How to monitor agentless devices',
    href: webDocumentationLink('user-manual/capabilities/agentless-monitoring/index.html')
  },
  {
    text: 'Agentless reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/agentless.html')
  }
];

class PaConfigurationAgentless extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig, psafeNotReadyYet } = this.props;
    const items =
      currentConfig &&
      currentConfig['agentless-agentless'] &&
      currentConfig['agentless-agentless'].agentless
        ? currentConfig['agentless-agentless'].agentless.map(item => ({
            label: `${item.type} (${item.state})`,
            data: item
          }))
        : false;
    return (
      <Fragment>
        {currentConfig['agentless-agentless'] &&
          isString(currentConfig['agentless-agentless']) && (
            <PaNoConfig
              error={currentConfig['agentless-agentless']}
              help={helpLinks}
            />
          )}
        {psafeNotReadyYet &&
          (!currentConfig || !currentConfig['agentless-agentless']) && (
            <PaNoConfig error="Psafe not ready yet" help={helpLinks} />
          )}
        {currentConfig['agentless-agentless'] &&
          !isString(currentConfig['agentless-agentless']) && (
            <PaConfigurationSettingsTabSelector
              title="Devices list"
              description="List of monitored devices that don't use the agent"
              currentConfig={currentConfig}
              minusHeight={260}
              helpLinks={helpLinks}
            >
              <PaConfigurationListSelector
                items={items}
                settings={mainSettings}
              />
            </PaConfigurationSettingsTabSelector>
          )}
      </Fragment>
    );
  }
}

const sections = [{ component: 'agentless', configuration: 'agentless' }];

const mapStateToProps = state => ({
  psafeNotReadyYet: state.appStateReducers.psafeNotReadyYet
});

PaConfigurationAgentless.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export default compose(
  withPaConfig(sections),
  connect(mapStateToProps)
)(PaConfigurationAgentless);
