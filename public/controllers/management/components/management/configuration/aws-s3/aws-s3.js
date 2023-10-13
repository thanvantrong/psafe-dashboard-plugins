/*
 * Psafe app - React component for show configuration of AWS S3.
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PaTabSelector, {
  PaTabSelectorTab
} from '../util-components/tab-selector';
import withPaConfig from '../util-hocs/pa-config';
import { wodleBuilder } from '../utils/builders';

import PaConfigurationAmazonS3General from './aws-s3-general';
import PaConfigurationAmazonS3Buckets from './aws-s3-buckets';
import PaConfigurationAmazonS3Services from './aws-s3-services';

class PaConfigurationAmazonS3 extends Component {
  constructor(props) {
    super(props);
    this.wodleConfig = wodleBuilder(this.props.currentConfig, 'aws-s3');
  }
  componentDidMount() {
    this.props.updateBadge(this.badgeEnabled());
  }
  badgeEnabled() {
    return (
      this.wodleConfig &&
      this.wodleConfig['aws-s3'] &&
      this.wodleConfig['aws-s3'].disabled === 'no'
    );
  }
  render() {
    return (
      <PaTabSelector>
        <PaTabSelectorTab label="General">
          <PaConfigurationAmazonS3General
            currentConfig={this.props.currentConfig}
            wodleConfig={this.wodleConfig}
          />
        </PaTabSelectorTab>
        <PaTabSelectorTab label="Buckets">
          <PaConfigurationAmazonS3Buckets
            currentConfig={this.props.currentConfig}
            wodleConfig={this.wodleConfig}
          />
        </PaTabSelectorTab>
        <PaTabSelectorTab label="Services">
          <PaConfigurationAmazonS3Services
            currentConfig={this.props.currentConfig}
            wodleConfig={this.wodleConfig}
          />
        </PaTabSelectorTab>
      </PaTabSelector>
    );
  }
}

const sections = [{ component: 'wmodules', configuration: 'wmodules' }];

PaConfigurationAmazonS3.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export default withPaConfig(sections)(PaConfigurationAmazonS3);
