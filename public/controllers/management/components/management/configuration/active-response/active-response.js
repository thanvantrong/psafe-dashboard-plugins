/*
 * Psafe app - React component for show configuration of active response.
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

import PaTabSelector, {
  PaTabSelectorTab
} from '../util-components/tab-selector';
import PaConfigurationActiveResponseActiveResponse from './active-response-active-response';
import PaConfigurationActiveResponseCommands from './active-response-commands';
import withPaConfig from '../util-hocs/pa-config';

class PaConfigurationActiveResponse extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Fragment>
        <PaTabSelector>
          <PaTabSelectorTab label="Active response">
            <PaConfigurationActiveResponseActiveResponse {...this.props} />
          </PaTabSelectorTab>
          <PaTabSelectorTab label="Commands">
            <PaConfigurationActiveResponseCommands {...this.props} />
          </PaTabSelectorTab>
        </PaTabSelector>
      </Fragment>
    );
  }
}

const sections = [
  { component: 'analysis', configuration: 'command' },
  { component: 'analysis', configuration: 'active_response' }
];

PaConfigurationActiveResponse.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withPaConfig(sections)(PaConfigurationActiveResponse);
