/*
 * Psafe app - React component for show configuration of active response - command tab.
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
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const helpLinks = [
  {
    text: 'Active response documentation',
    href: webDocumentationLink('user-manual/capabilities/active-response/index.html')
  },
  {
    text: 'Commands reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/commands.html')
  }
];

const mainSettings = [
  { field: 'name', label: 'Command name' },
  { field: 'executable', label: 'Name of executable file' },
  { field: 'expect', label: 'List of expected fields' },
  { field: 'extra_args', label: 'Extra arguments' },
  {
    field: 'timeout_allowed',
    label: 'Allow this command to be reverted',
    render: renderValueNoThenEnabled
  }
];

class PaConfigurationActiveResponseCommands extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig, psafeNotReadyYet } = this.props;
    const items =
      currentConfig &&
      currentConfig['analysis-command'] &&
      currentConfig['analysis-command'].command
        ? settingsListBuilder(currentConfig['analysis-command'].command, 'name')
        : [];
    return (
      <Fragment>
        {currentConfig['analysis-command'] &&
          isString(currentConfig['analysis-command']) && (
            <PaNoConfig
              error={currentConfig['analysis-command']}
              help={helpLinks}
            />
          )}
        {currentConfig['analysis-command'] &&
          !isString(currentConfig['analysis-command']) &&
          currentConfig['analysis-command'].command &&
          !currentConfig['analysis-command'].command.length && (
            <PaNoConfig error="not-present" help={helpLinks} />
          )}
        {psafeNotReadyYet &&
          (!currentConfig || !currentConfig['analysis-command']) && (
            <PaNoConfig error="Psafe not ready yet" help={helpLinks} />
          )}
        {currentConfig['analysis-command'] &&
        !isString(currentConfig['analysis-command']) &&
        currentConfig['analysis-command'].command &&
        currentConfig['analysis-command'].command.length ? (
          <PaConfigurationSettingsTabSelector
            title="Command definitions"
            description="Find here all the currently defined commands used for Active response"
            currentConfig={currentConfig['analysis-command']}
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

const mapStateToProps = state => ({
  psafeNotReadyYet: state.appStateReducers.psafeNotReadyYet
});

PaConfigurationActiveResponseCommands.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export default connect(mapStateToProps)(PaConfigurationActiveResponseCommands);
