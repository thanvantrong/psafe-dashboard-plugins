/*
 * Psafe app - React component for code viewer in configuration.
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

import PaConfigurationSettingsHeader from './configuration-settings-header';
import PaCodeEditor from './code-editor';
import { getJSON, getXML } from '../utils/utils';

class PaCodeViewer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      title,
      mode,
      description,
      editorValue,
      view,
      settings,
      json,
      xml,
      help,
      height,
      minusHeight
    } = this.props;
    return (
      <Fragment>
        <PaConfigurationSettingsHeader
          title={title}
          description={description}
          viewSelected={view}
          settings={settings}
          json={json}
          xml={xml}
          help={help}
        />
        <PaCodeEditor
          mode={mode}
          value={editorValue}
          height={height}
          minusHeight={minusHeight}
          isReadOnly
        />
      </Fragment>
    );
  }
}

PaCodeViewer.propTypes = {
  title: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  editorValue: PropTypes.string.isRequired
};

export default PaCodeViewer;

export class PaSettingsViewer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <PaCodeEditor
        mode={this.props.mode}
        value={(this.props.mode === 'json' ? getJSON : getXML)(
          this.props.value
        )}
        isReadOnly
        minusHeight={this.props.minusHeight}
      />
    );
  }
}
