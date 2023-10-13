/*
 * Psafe app - React component for show configuration of active response - agent tab.
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

import PaNoConfig from '../util-components/no-config';
import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import PaConfigurationSettingsGroup from '../util-components/configuration-settings-group';

import withPaConfig from '../util-hocs/pa-config';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { isString, renderValueNoThenEnabled } from '../utils/utils';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const helpLinks = [
  {
    text: 'Active response documentation',
    href: webDocumentationLink('user-manual/capabilities/active-response/index.html')
  },
  {
    text: 'Active response reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/active-response.html')
  }
];

const mainSettings = [
  {
    field: 'disabled',
    label: 'Active response status',
    render: renderValueNoThenEnabled
  },
  {
    field: 'repeated_offenders',
    label: 'List of timeouts (in minutes) for repeated offenders'
  },
  {
    field: 'ca_store',
    label: 'Use the following list of root CA certificates'
  },
  { field: 'ca_verification', label: 'Validate WPKs using root CA certificate' }
];

class PaConfigurationActiveResponseAgent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig, psafeNotReadyYet } = this.props;
    return (
      <Fragment>
        {currentConfig['com-active-response'] &&
          isString(currentConfig['com-active-response']) && (
            <PaNoConfig
              error={currentConfig['com-active-response']}
              help={helpLinks}
            />
          )}
        {currentConfig['com-active-response'] &&
          !isString(currentConfig['com-active-response']) &&
          !currentConfig['com-active-response']['active-response'] && (
            <PaNoConfig error="not-present" help={helpLinks} />
          )}
        {psafeNotReadyYet &&
          (!currentConfig || !currentConfig['com-active-response']) && (
            <PaNoConfig error="Psafe not ready yet" help={helpLinks} />
          )}
        {currentConfig['com-active-response'] &&
          !isString(currentConfig['com-active-response']) &&
          currentConfig['com-active-response']['active-response'] && (
            <PaConfigurationSettingsTabSelector
              title="Active response settings"
              description="Find here all the Active response settings for this agent"
              currentConfig={currentConfig}
              minusHeight={this.props.agent.id === '000' ? 280 : 355}
              helpLinks={helpLinks}
            >
              <PaConfigurationSettingsGroup
                config={currentConfig['com-active-response']['active-response']}
                items={mainSettings}
              />
            </PaConfigurationSettingsTabSelector>
          )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  psafeNotReadyYet: state.appStateReducers.psafeNotReadyYet
});

const sectionsAgent = [{ component: 'com', configuration: 'active-response' }];

PaConfigurationActiveResponseAgent.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export default compose(
  connect(mapStateToProps),
  withPaConfig(sectionsAgent)
)(PaConfigurationActiveResponseAgent);
