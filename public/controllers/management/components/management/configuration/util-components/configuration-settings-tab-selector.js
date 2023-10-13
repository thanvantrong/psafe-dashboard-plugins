/*
 * Psafe app - React component for render settings, json and xml tab selector.
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

import PaConfigurationSettingsHeader from './configuration-settings-header';
import PaViewSelector, { PaViewSelectorSwitch } from './view-selector';
import { PaSettingsViewer } from './code-viewer';

class PaConfigurationSettingsTabSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: ''
    };
  }
  changeView(view) {
    this.setState({ view });
  }
  getTitleDescription(view) {
    const result = {};
    if (view === 'json') {
      result.title = 'JSON Viewer';
      result.description = 'View this configuration in raw JSON format';
    } else if (view === 'xml') {
      result.title = 'XML Viewer';
      result.description = 'View this configuration in raw XML format';
    } else {
      result.title = this.props.title;
      result.description = this.props.description;
    }
    return result;
  }

  render() {
    const { view } = this.state;
    const { currentConfig, helpLinks, children, minusHeight } = this.props;
    const { title, description } = this.getTitleDescription(view);
    const codeViewerMinusHeight = minusHeight !== undefined ? minusHeight : 280;
    
    return (
      <Fragment>
        <PaConfigurationSettingsHeader
          title={title}
          description={description}
          settings={() => this.changeView('')}
          json={() => this.changeView('json')}
          xml={() => this.changeView('xml')}
          viewSelected={view}
          help={helpLinks}
        />
        <PaViewSelector view={view}>
          <PaViewSelectorSwitch default>{children}</PaViewSelectorSwitch>
          <PaViewSelectorSwitch view="json">
            <PaSettingsViewer
              mode="json"
              value={currentConfig}
              minusHeight={codeViewerMinusHeight}
            />
          </PaViewSelectorSwitch>
          <PaViewSelectorSwitch view="xml">
            <PaSettingsViewer
              mode="xml"
              value={currentConfig}
              minusHeight={codeViewerMinusHeight}
            />
          </PaViewSelectorSwitch>
        </PaViewSelector>
      </Fragment>
    );
  }
}

export default PaConfigurationSettingsTabSelector;
