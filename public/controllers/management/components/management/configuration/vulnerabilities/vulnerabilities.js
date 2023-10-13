/*
 * Psafe app - React component for show configuration of vulnerabilities.
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

import withPaConfig from '../util-hocs/pa-config';
import PaTabSelector, {
  PaTabSelectorTab
} from '../util-components/tab-selector';
import PaConfigurationVulnerabilitiesGeneral from './vulnerabilities-general';
import PaConfigurationVulnerabilitiesProviders from './vulnerabilities-providers';
import { wodleBuilder } from '../utils/builders';

class PaConfigurationVulnerabilities extends Component {
  constructor(props) {
    super(props);
    this.wodleConfig = wodleBuilder(
      this.props.currentConfig,
      'vulnerability-detector'
    );
  }
  componentDidMount() {
    this.props.updateBadge(this.badgeEnabled());
  }
  badgeEnabled() {
    return (
      this.wodleConfig &&
      this.wodleConfig['vulnerability-detector'] &&
      this.wodleConfig['vulnerability-detector'].enabled === 'yes'
    );
  }
  render() {
    const { currentConfig } = this.props;
    return (
      <Fragment>
        <PaTabSelector>
          <PaTabSelectorTab label="General">
            <PaConfigurationVulnerabilitiesGeneral
              currentConfig={currentConfig}
              wodleConfig={this.wodleConfig}
            />
          </PaTabSelectorTab>
          <PaTabSelectorTab label="Providers">
            <PaConfigurationVulnerabilitiesProviders
              currentConfig={currentConfig}
              wodleConfig={this.wodleConfig}
            />
          </PaTabSelectorTab>
        </PaTabSelector>
      </Fragment>
    );
  }
}

const sections = [{ component: 'wmodules', configuration: 'wmodules' }];

PaConfigurationVulnerabilities.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withPaConfig(sections)(PaConfigurationVulnerabilities);
