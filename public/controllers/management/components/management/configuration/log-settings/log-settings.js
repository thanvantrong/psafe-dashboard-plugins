/*
 * Psafe app - React component for show configuration of log settings.
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

import PaConfigurationLogSettingsAlerts from './log-settings-alerts';
import PaConfigurationLogSettingsArchives from './log-settings-archives';
import PaConfigurationLogSettingsInternal from './log-settings-internal';
import PaTabSelector, {
  PaTabSelectorTab
} from '../util-components/tab-selector';
import withPaConfig from '../util-hocs/pa-config';

class PaConfigurationLogSettings extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { agent } = this.props;
    return (
      <Fragment>
        {agent && agent.id === '000' ? (
          <PaTabSelector>
            <PaTabSelectorTab label="Alerts">
              <PaConfigurationLogSettingsAlerts {...this.props} />
            </PaTabSelectorTab>
            <PaTabSelectorTab label="Archives">
              <PaConfigurationLogSettingsArchives {...this.props} />
            </PaTabSelectorTab>
            <PaTabSelectorTab label="Internal">
              <PaConfigurationLogSettingsInternal {...this.props} />
            </PaTabSelectorTab>
          </PaTabSelector>
        ) : (
          <div {...this.props}></div>
        )}{' '}
        {/*TODO: when is agent && agent.id !== '000' */}
      </Fragment>
    );
  }
}

const sections = [
  { component: 'analysis', configuration: 'logging' },
  { component: 'monitor', configuration: 'logging' }
];

const sectionsAgent = [
  {
    component: 'agent',
    configuration: 'logging',
    scope: 'null',
    agentId: 'true'
  }
];

export default withPaConfig(sections)(PaConfigurationLogSettings);
