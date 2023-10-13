/*
 * Psafe app - React component for show configuration of commands.
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

import PaNoConfig from '../util-components/no-config';
import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import PaConfigurationSettingsListSelector from '../util-components/configuration-settings-list-selector';
import withPaConfig from '../util-hocs/pa-config';
import { isString, renderValueNoThenEnabled } from '../utils/utils';
import { settingsListBuilder } from '../utils/builders';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const helpLinks = [
  {
    text: 'Command module reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/wodle-command.html')
  }
];

const mainSettings = [
  { field: 'disabled', label: 'Command status', renderValueNoThenEnabled },
  { field: 'tag', label: 'Command name' },
  { field: 'command', label: 'Command to execute' },
  { field: 'interval', label: 'Interval between executions' },
  { field: 'run_on_start', label: 'Run on start' },
  { field: 'ignore_output', label: 'Ignore command output' },
  { field: 'timeout', label: 'Timeout (in seconds) to wait for execution' },
  { field: 'verify_md5', label: 'Verify MD5 sum' },
  { field: 'verify_sha1', label: 'Verify SHA1 sum' },
  { field: 'verify_sha256', label: 'Verify SHA256 sum' },
  { field: 'skip_verification', label: 'Ignore checksum verification' }
];

class PaConfigurationCommands extends Component {
  constructor(props) {
    super(props);
    this.wodleConfig =
      this.props.currentConfig &&
      !isString(this.props.currentConfig['wmodules-wmodules'])
        ? this.props.currentConfig['wmodules-wmodules'].wmodules.filter(
            item => item['command']
          )
        : [];
  }
  render() {
    const { currentConfig } = this.props;
    const items =
      this.wodleConfig && this.wodleConfig.length
        ? settingsListBuilder(this.wodleConfig.map(item => item.command), ['tag','command'])
        : false;
    return (
      <Fragment>
        {currentConfig['wmodules-wmodules'] &&
          isString(currentConfig['wmodules-wmodules']) && (
            <PaNoConfig
              error={currentConfig['wmodules-wmodules']}
              help={helpLinks}
            />
          )}
        {currentConfig &&
          !items &&
          !isString(currentConfig['wmodules-wmodules']) && (
            <PaNoConfig error="not-present" help={helpLinks} />
          )}
        {currentConfig &&
        items &&
        !isString(currentConfig['wmodules-wmodules']) ? (
          <PaConfigurationSettingsTabSelector
            title="Command definitions"
            description="Find here all the currently defined commands"
            currentConfig={currentConfig}
            minusHeight={this.props.agent.id === '000' ? 260 : 355}
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

const sections = [{ component: 'wmodules', configuration: 'wmodules' }];

PaConfigurationCommands.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withPaConfig(sections)(PaConfigurationCommands);
