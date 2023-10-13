/*
 * Psafe app - React component for show configuration of CIS-CAT.
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
import withPaConfig from '../util-hocs/pa-config';
import PaConfigurationCisCatGeneral from './cis-cat-general';
import PaConfigurationCisCatBenchmarks from './cis-cat-benchmarks';
import { wodleBuilder } from '../utils/builders';

class PaConfigurationCisCat extends Component {
  constructor(props) {
    super(props);
    this.wodleConfig = wodleBuilder(this.props.currentConfig, 'cis-cat');
  }
  badgeEnabled() {
    return (
      this.wodleConfig['cis-cat'] &&
      this.wodleConfig['cis-cat'].disabled !== 'yes'
    );
  }
  componentDidMount() {
    this.props.updateBadge(this.badgeEnabled());
  }
  render() {
    return (
      <PaTabSelector>
        <PaTabSelectorTab label="General">
          <PaConfigurationCisCatGeneral
            {...this.props}
            wodleConfig={this.wodleConfig}
          />
        </PaTabSelectorTab>
        <PaTabSelectorTab label="Benchmarks">
          <PaConfigurationCisCatBenchmarks
            {...this.props}
            wodleConfig={this.wodleConfig}
          />
        </PaTabSelectorTab>
      </PaTabSelector>
    );
  }
}

const sections = [{ component: 'wmodules', configuration: 'wmodules' }];

PaConfigurationCisCat.propTypes = {
  // currentConfig: PropTypes.object.isRequired
};

export default withPaConfig(sections)(PaConfigurationCisCat);
