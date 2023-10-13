/*
 * Psafe app - React component for show configuration of active response - active response tab.
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
import PaConfigurationSettingsListSelector from '../util-components/configuration-settings-list-selector';
import { isString, renderValueNoThenEnabled } from '../utils/utils';
import { settingsListBuilder } from '../utils/builders';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withPaConfig from '../util-hocs/pa-config';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const mainSettings = [
  {
    field: 'disabled',
    label: 'Status of this active response',
    render: renderValueNoThenEnabled
  },
  { field: 'command', label: 'Command to execute' },
  { field: 'location', label: 'Execute the command on this location' },
  { field: 'agent_id', label: 'Agent ID on which execute the command' },
  { field: 'level', label: 'Match to this severity level or above' },
  { field: 'rules_group', label: 'Match to one of these groups' },
  { field: 'rules_id', label: 'Match to one of these rule IDs' },
  { field: 'timeout', label: 'Timeout (in seconds) before reverting' }
];

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

class PaConfigurationActiveResponseActiveResponse extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig, psafeNotReadyYet } = this.props;
    const items =
      !isString(currentConfig['analysis-active_response']) &&
      currentConfig['analysis-active_response']['active-response'] &&
      currentConfig['analysis-active_response']['active-response'].length
        ? settingsListBuilder(
            currentConfig['analysis-active_response']['active-response'],
            'command'
          )
        : [];
    return (
      <Fragment>
        {currentConfig['analysis-active_response'] &&
          isString(currentConfig['analysis-active_response']) && (
            <PaNoConfig
              error={currentConfig['analysis-active_response']}
              help={helpLinks}
            />
          )}
        {currentConfig['analysis-active_response'] &&
          !isString(currentConfig['analysis-active_response']) &&
          currentConfig['analysis-active_response']['active-response'] &&
          !currentConfig['analysis-active_response']['active-response']
            .length && <PaNoConfig error="not-present" help={helpLinks} />}
        {psafeNotReadyYet &&
          (!currentConfig || !currentConfig['analysis-active_response']) && (
            <PaNoConfig error="Psafe not ready yet" help={helpLinks} />
          )}
        {currentConfig['analysis-active_response'] &&
        !isString(currentConfig['analysis-active_response']) &&
        currentConfig['analysis-active_response']['active-response'].length ? (
          <PaConfigurationSettingsTabSelector
            title="Active response definitions"
            description="Find here all the currently defined Active responses"
            currentConfig={currentConfig['analysis-active_response']}
            minusHeight={320}
            helpLinks={helpLinks}
          >
            <PaConfigurationSettingsListSelector
              items={items}
              settings={mainSettings}
            />
          </PaConfigurationSettingsTabSelector>
        ) : null}
      </Fragment>
    );
  }
}

PaConfigurationActiveResponseActiveResponse.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

const mapStateToProps = state => ({
  psafeNotReadyYet: state.appStateReducers.psafeNotReadyYet
});

export default connect(mapStateToProps)(
  PaConfigurationActiveResponseActiveResponse
);

const sectionsAgent = [{ component: 'com', configuration: 'active-response' }];

export const PaConfigurationActiveResponseActiveResponseAgent = compose(
  connect(mapStateToProps),
  withPaConfig(sectionsAgent)
)(PaConfigurationActiveResponseActiveResponse);

PaConfigurationActiveResponseActiveResponseAgent.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};
