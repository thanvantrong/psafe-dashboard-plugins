/*
 * Psafe app - Integrity monitoring components
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
import {
  EuiFlexItem,
  EuiToolTip,
  EuiTab,
  EuiTabs,
  EuiButton,
  EuiButtonEmpty
} from '@elastic/eui';
import '../../common/modules/module.scss';
import { ReportingService } from '../../../react-services/reporting';
import { ModulesDefaults } from './modules-defaults';
import { getAngularModule, getDataPlugin } from '../../../kibana-services';
import { MainModuleAgent } from './main-agent'
import { MainModuleOverview } from './main-overview';
import { compose } from 'redux';
import { withReduxProvider,withErrorBoundary } from '../hocs';
import { UI_LOGGER_LEVELS } from '../../../../common/constants';
import { UI_ERROR_SEVERITIES } from '../../../react-services/error-orchestrator/types';
import { getErrorOrchestrator } from '../../../react-services/common-services';

export const MainModule = compose(
  withErrorBoundary,
  withReduxProvider
)(
  class MainModule extends Component {
    constructor(props) {
      super(props);
      this.reportingService = new ReportingService();
      this.state = {
        selectView: false,
        loadingReport: false,
        switchModule: false,
        showAgentInfo: false,
      };
      const app = getAngularModule();
      this.$rootScope = app.$injector.get('$rootScope');
      if (!(ModulesDefaults[this.props.section] || {}).notModule) {
        this.tabs = (ModulesDefaults[this.props.section] || {}).tabs || [
          { id: 'dashboard', name: 'Dashboard' },
          { id: 'events', name: 'Events' },
        ];
        this.module = ModulesDefaults[this.props.section];
      }
    }

    componentWillUnmount() {
      const { filterManager } = getDataPlugin().query;
      
      // When the component is unmounted, we don't want the filters on the `filterManager` to be removed when navigating
      // to the `lens` plugin. The same `filterManager` is used by our plugin and the `lens` one.
      // This is related with the maintenance of the filters when clicking on the `Visualize` button in the <Module>/Events section.
      // We use `pathname.includes` instead of the equal operator because the `window.location.pathname` could contain a prefix
      // indicating the plugin's platform, for example using a proxy.
      // More information: https://github.com/psafe/psafe-kibana-app/issues/4143#issuecomment-1129854030
      if (filterManager.getFilters()?.length && !window.location.pathname.includes('/app/lens')) {
        filterManager.removeAll();
      }
    }

    renderTabs(agent = false) {
      const { selectView } = this.state;
      if (!agent) {
      }
      return (
        <EuiFlexItem style={{ margin: '0 8px 0 8px' }}>
          <EuiTabs>
            {this.tabs.map((tab, index) => {
              if (!tab.onlyAgent || (tab.onlyAgent && this.props.agent)) {
                return (
                  <EuiTab
                    onClick={() => this.onSelectedTabChanged(tab.id)}
                    isSelected={selectView === tab.id}
                    key={index}
                  >
                    {tab.name}
                  </EuiTab>
                );
              }
            })}
          </EuiTabs>
        </EuiFlexItem>
      );
    }

    loadSection(id) {
      this.setState({ selectView: id });
    }

    onSelectedTabChanged(id) {
      if (id !== this.state.selectView) {
        if (id === 'events' || id === 'dashboard' || id === 'inventory') {
          this.$rootScope.moduleDiscoverReady = false;
          if (this.props.switchSubTab)
            this.props.switchSubTab(
              id === 'events' ? 'discover' : id === 'inventory' ? 'inventory' : 'panels'
            );
          window.location.href = window.location.href.replace(
            new RegExp('tabView=' + '[^&]*'),
            `tabView=${id === 'events' ? 'discover' : id === 'inventory' ? 'inventory' : 'panels'}`
          );
          this.loadSection(id === 'panels' ? 'dashboard' : id === 'discover' ? 'events' : id);
        } else {
          this.loadSection(id === 'panels' ? 'dashboard' : id === 'discover' ? 'events' : id);
        }
      }
    }

    render() {
      const { agent } = this.props;
      const { selectView } = this.state;
      const mainProps = {
        selectView,
        tabs: this.tabs,
        module: this.module,
        renderTabs: () => this.renderTabs(),
        loadSection: (id) => this.loadSection(id),
        onSelectedTabChanged: (id) => this.onSelectedTabChanged(id),
      };
      return (
        <>
          {(agent && <MainModuleAgent {...{ ...this.props, ...mainProps }}></MainModuleAgent>) ||
            (this.props.section && this.props.section !== 'welcome' && (
              <MainModuleOverview {...{ ...this.props, ...mainProps }}></MainModuleOverview>
            ))}
        </>
      );
    }
  }
);
