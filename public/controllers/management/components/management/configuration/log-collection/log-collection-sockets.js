/*
 * Psafe app - React component for show configuration of log collection - sockets tab.
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
import PaConfigurationListSelector from '../util-components/configuration-settings-list-selector';
import {
  isString,
  isArray,
  renderValueOrDefault,
  renderValueOrNoValue
} from '../utils/utils';
import { settingsListBuilder } from '../utils/builders';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const helpLinks = [
  {
    text: 'Using multiple outputs',
    href: webDocumentationLink('user-manual/capabilities/log-data-collection/log-data-configuration.html#using-multiple-outputs')
  },
  {
    text: 'Socket reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/socket.html')
  }
];

const mainSettings = [
  { field: 'name', label: 'Socket name', render: renderValueOrNoValue },
  { field: 'location', label: 'Socket location', render: renderValueOrNoValue },
  {
    field: 'mode',
    label: 'UNIX socket protocol',
    render: renderValueOrDefault('udp')
  },
  {
    field: 'prefix',
    label: 'Prefix to place before the message',
    render: renderValueOrNoValue
  }
];

class PaConfigurationLogCollectionSockets extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig } = this.props;
    const items = isArray(currentConfig['logcollector-socket'].target)
      ? settingsListBuilder(currentConfig['logcollector-socket'].target, 'name')
      : [];
    return (
      <Fragment>
        {currentConfig['logcollector-socket'] &&
          isString(currentConfig['logcollector-socket']) && (
            <PaNoConfig
              error={currentConfig['logcollector-socket']}
              help={helpLinks}
            />
          )}
        {currentConfig['logcollector-socket'] &&
        !isString(currentConfig['logcollector-socket']) &&
        !currentConfig['logcollector-socket'].target ? (
          <PaNoConfig error="not-present" help={helpLinks} />
        ) : null}
        {currentConfig['logcollector-socket'] &&
        !isString(currentConfig['logcollector-socket']) &&
        currentConfig['logcollector-socket'].target &&
        currentConfig['logcollector-socket'].target.length ? (
          <PaConfigurationSettingsTabSelector
            title="Output sockets"
            description="Define custom outputs to send log data"
            currentConfig={currentConfig}
            minusHeight={this.props.agent.id === '000' ? 320 : 415}
            helpLinks={helpLinks}
          >
            <PaConfigurationListSelector
              items={items}
              settings={mainSettings}
            />
          </PaConfigurationSettingsTabSelector>
        ) : null}
      </Fragment>
    );
  }
}

PaConfigurationLogCollectionSockets.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default PaConfigurationLogCollectionSockets;
