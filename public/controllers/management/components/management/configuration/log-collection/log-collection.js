/*
 * Psafe app - React component for show configuration of log collection.
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

import PaTabSelector, {
  PaTabSelectorTab
} from '../util-components/tab-selector';
import PaConfigurationLogCollectionLogs from './log-collection-logs';
import PaConfigurationLogCollectionCommands from './log-collection-commands';
import PaConfigurationLogCollectionSockets from './log-collection-sockets';
import withPaConfig from '../util-hocs/pa-config';
import { isString } from '../utils/utils';

class PaConfigurationLogCollection extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { currentConfig, agent } = this.props;
    currentConfig =
      currentConfig['logcollector-localfile'] &&
      !isString(currentConfig['logcollector-localfile'])
        ? {
            ...currentConfig,
            'logcollector-localfile': {
              ...currentConfig['logcollector-localfile'],
              'localfile-logs': currentConfig[
                'logcollector-localfile'
              ].localfile.filter(item => typeof item.file !== 'undefined'), // TODO: it needs to be defined to support localfile as `eventchannel`. These doesn't have file property.
              'localfile-commands': currentConfig[
                'logcollector-localfile'
              ].localfile.filter(item => typeof item.file === 'undefined')
            }
          }
        : currentConfig;
    return (
      <Fragment>
        <PaTabSelector>
          <PaTabSelectorTab label="Logs">
            <PaConfigurationLogCollectionLogs
              currentConfig={currentConfig}
              agent={agent}
            />
          </PaTabSelectorTab>
          <PaTabSelectorTab label="Commands">
            <PaConfigurationLogCollectionCommands
              currentConfig={currentConfig}
              agent={agent}
            />
          </PaTabSelectorTab>
          <PaTabSelectorTab label="Sockets">
            <PaConfigurationLogCollectionSockets
              currentConfig={currentConfig}
              agent={agent}
            />
          </PaTabSelectorTab>
        </PaTabSelector>
      </Fragment>
    );
  }
}

const sections = [
  { component: 'logcollector', configuration: 'localfile' },
  { component: 'logcollector', configuration: 'socket' }
];

PaConfigurationLogCollection.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withPaConfig(sections)(PaConfigurationLogCollection);
