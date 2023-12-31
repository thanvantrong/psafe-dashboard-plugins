/*
 * Psafe app - React component for show configuration of Azure logs.
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

import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import PaConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import PaNoConfig from '../util-components/no-config';
import withPaConfig from '../util-hocs/pa-config';
import { isString, renderValueNoThenEnabled } from '../utils/utils';
import { wodleBuilder } from '../utils/builders';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const helpLinks = [
  {
    text: 'Using Psafe to monitor Azure',
    href: webDocumentationLink('azure/index.html')
  },
  {
    text: 'Azure reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/wodle-azure-logs.html')
  }
];

const mainSettings = [
  { field: 'disabled', label: 'Enabled', render: renderValueNoThenEnabled },
  { field: 'timeout', label: 'Timeout for each evaluation' },
  { field: 'day', label: 'Day of the month to run the Azure-Logs' },
  { field: 'wday', label: 'Day of the month to run the Azure-Logs' },
  { field: 'time', label: 'Time of the day to run the Azure-Logs' },
  { field: 'interval', label: 'Interval between Azure-Logs executions' },
  {
    field: 'run_on_start',
    label: 'Run evaluation immediately when service is started'
  }
];

const contentSettings = [
  { field: 'application_id', label: 'Application id' },
  { field: 'tag', label: 'Tag' },
  { field: 'tenantdomain', label: 'Tenant domain' },
  { field: 'application_key', label: 'Application key' },
  { field: 'account_name', label: 'Account name' },
  { field: 'account_key', label: 'Account key' },
  {
    field: 'auth_path',
    label:
      'Path of the file that contains the application identifier and the application key'
  }
];

class PaConfigurationAzure extends Component {
  constructor(props) {
    super(props);
    this.wodleConfig = wodleBuilder(this.props.currentConfig, 'azure-logs');
  }
  componentDidMount() {
    this.props.updateBadge(this.badgeEnabled());
  }
  badgeEnabled() {
    return (
      this.wodleConfig &&
      this.wodleConfig['azure-logs'] &&
      this.wodleConfig['azure-logs'].disabled === 'no'
    );
  }
  render() {
    const { currentConfig } = this.props;
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
          !this.wodleConfig['azure-logs'] &&
          !isString(currentConfig['wmodules-wmodules']) && (
            <PaNoConfig error="not-present" help={helpLinks} />
          )}
        {currentConfig && this.wodleConfig['azure-logs'] && (
          <PaConfigurationSettingsTabSelector
            title="Main settings"
            description="Configuration for the Azure logs wodle"
            currentConfig={this.wodleConfig}
            minusHeight={260}
            helpLinks={helpLinks}
          >
            <PaConfigurationSettingsGroup
              config={this.wodleConfig['azure-logs']}
              items={mainSettings}
            />
            {this.wodleConfig['azure-logs'].content &&
            this.wodleConfig['azure-logs'].content.length ? (
              <Fragment>
                {this.wodleConfig['azure-logs'].content.map(
                  (currentContent, key) => (
                    <Fragment key={`azure-logs-content-${key}`}>
                      {(currentContent.type || currentContent.tag) && (
                        <PaConfigurationSettingsGroup
                          title={currentContent.type || currentContent.tag}
                          config={currentContent}
                          items={contentSettings}
                        />
                      )}
                    </Fragment>
                  )
                )}
              </Fragment>
            ) : null}
          </PaConfigurationSettingsTabSelector>
        )}
      </Fragment>
    );
  }
}

const sections = [{ component: 'wmodules', configuration: 'wmodules' }];

export default withPaConfig(sections)(PaConfigurationAzure);
