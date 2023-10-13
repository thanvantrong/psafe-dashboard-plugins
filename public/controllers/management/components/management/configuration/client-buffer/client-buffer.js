/*
 * Psafe app - React component for show Client-Buffer configuration.
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

import withPaConfig from '../util-hocs/pa-config';

import {
  isString,
  renderValueNoThenEnabled,
  renderValueOrDefault
} from '../utils/utils';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const helpLinks = [
  {
    text: 'Anti-flooding mechanism',
    href: webDocumentationLink('user-manual/capabilities/antiflooding.html')
  },
  {
    text: 'Client buffer reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/client-buffer.html')
  }
];

const mainSettings = [
  {
    field: 'disabled',
    label: 'Buffer status',
    render: renderValueNoThenEnabled
  },
  {
    field: 'queue_size',
    label: 'Queue size',
    render: renderValueOrDefault('5000')
  },
  {
    field: 'events_per_second',
    label: 'Events per second',
    render: renderValueOrDefault('500')
  }
];

class PaConfigurationClientBuffer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig } = this.props;
    return (
      <Fragment>
        {currentConfig['agent-buffer'] &&
          isString(currentConfig['agent-buffer']) && (
            <PaNoConfig
              error={currentConfig['agent-buffer']}
              help={helpLinks}
            />
          )}
        {currentConfig['agent-buffer'] &&
          !isString(currentConfig['agent-buffer']) &&
          !currentConfig['agent-buffer'].buffer && (
            <PaNoConfig error="not-present" help={helpLinks} />
          )}
        {currentConfig['agent-buffer'] &&
          !isString(currentConfig['agent-buffer']) &&
          currentConfig['agent-buffer'].buffer && (
            <PaConfigurationSettingsTabSelector
              title="Main settings"
              description="These settings determine the event processing rate for the agent"
              currentConfig={currentConfig}
              minusHeight={355}
              helpLinks={helpLinks}
            >
              <PaConfigurationSettingsGroup
                config={currentConfig['agent-buffer'].buffer}
                items={mainSettings}
              />
            </PaConfigurationSettingsTabSelector>
          )}
      </Fragment>
    );
  }
}

const sections = [{ component: 'agent', configuration: 'buffer' }];

PaConfigurationClientBuffer.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withPaConfig(sections)(PaConfigurationClientBuffer);
