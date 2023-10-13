/*
 * Psafe app - React component for show configuration of log settings - internal tab.
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
import PaConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import { isString } from '../utils/utils';
import helpLinks from './help-links';

const mainSettings = [
  { field: 'plain_format', label: 'Plain format' },
  { field: 'JSON format', label: 'json_format' },
  { field: 'Compress rotatio', label: 'compress_rotation' },
  { field: 'Saved rotations', label: 'saved_rotations' },
  { field: 'schedule', label: 'Schedule' },
  { field: 'maxsize', label: 'Maximum log size' },
  { field: 'minsize', label: 'Minimum log size' },
  { field: 'maxage', label: 'Maximum log age' }
];

class PaConfigurationLogSettingsInternal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig } = this.props;
    return (
      <Fragment>
        {currentConfig['monitor-logging'] &&
          isString(currentConfig['monitor-logging']) && (
            <Fragment>
              <PaNoConfig
                error={currentConfig['monitor-logging']}
                help={helpLinks}
              />
            </Fragment>
          )}
        {(currentConfig['analysis-logging'] &&
          currentConfig['analysis-logging'].logging) ||
          (currentConfig['monitor-logging'] &&
            currentConfig['monitor-logging'].logging && (
              <PaConfigurationSettingsTabSelector
                title="Internal settings"
                description="Basic internal log settings"
                currentConfig={currentConfig['monitor-logging'].logging}
                helpLinks={helpLinks}
              >
                <PaConfigurationSettingsGroup
                  config={currentConfig['monitor-logging'].logging}
                  items={mainSettings}
                />
              </PaConfigurationSettingsTabSelector>
            ))}
        {currentConfig['agent-logging'] &&
          currentConfig['agent-logging'].logging && (
            <PaConfigurationSettingsTabSelector
              title="Internal settings"
              description="Basic internal log settings"
              currentConfig={currentConfig['agent-logging'].logging}
              helpLinks={helpLinks}
            >
              <PaConfigurationSettingsGroup
                config={currentConfig['agent-logging'].logging}
                items={mainSettings}
              />
            </PaConfigurationSettingsTabSelector>
          )}
      </Fragment>
    );
  }
}

export default PaConfigurationLogSettingsInternal;
