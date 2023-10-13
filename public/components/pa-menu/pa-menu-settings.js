/*
 * Psafe app - React component for Settings submenu.
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
import { EuiFlexItem, EuiFlexGroup, EuiSideNav, EuiIcon, EuiButtonEmpty, EuiToolTip } from '@elastic/eui';
import { PaRequest } from '../../react-services/pa-request';
import { connect } from 'react-redux';
import { AppNavigate } from '../../react-services/app-navigate';
import { getAngularModule } from '../../kibana-services';
import { PSAFE_MENU_SETTINGS_SECTIONS_ID } from '../../../common/constants';
import { PSAFE_MENU_SETTINGS_SECTIONS_CY_TEST_ID } from '../../../common/psaf-menu/pa-menu-settings.cy';

class PaMenuSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO: Fix the selected section
      selectedItemName: null
    };
    this.paReq = PaRequest;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.section !== this.state.selectedItemName) {
      this.setState({ selectedItemName: nextProps.section });
    }
  }

  availableSettings() {
    let auxSettings = {
      settings: {
        id: PSAFE_MENU_SETTINGS_SECTIONS_ID.SETTINGS,
        cyTestId: PSAFE_MENU_SETTINGS_SECTIONS_CY_TEST_ID.SETTINGS,
        text: 'Settings',
      },
      api: {
        id: PSAFE_MENU_SETTINGS_SECTIONS_ID.API_CONFIGURATION,
        cyTestId: PSAFE_MENU_SETTINGS_SECTIONS_CY_TEST_ID.API_CONFIGURATION,
        text: 'API configuration',
      },
      modules: {
        id: PSAFE_MENU_SETTINGS_SECTIONS_ID.MODULES,
        cyTestId: PSAFE_MENU_SETTINGS_SECTIONS_CY_TEST_ID.MODULES,
        text: 'Modules',
      },
      sample_data: {
        id: PSAFE_MENU_SETTINGS_SECTIONS_ID.SAMPLE_DATA,
        cyTestId: PSAFE_MENU_SETTINGS_SECTIONS_CY_TEST_ID.SAMPLE_DATA,
        text: 'Sample data',
      },
      configuration: {
        id: PSAFE_MENU_SETTINGS_SECTIONS_ID.CONFIGURATION,
        cyTestId: PSAFE_MENU_SETTINGS_SECTIONS_CY_TEST_ID.CONFIGURATION,
        text: 'Configuration',
      },
      logs: {
        id: PSAFE_MENU_SETTINGS_SECTIONS_ID.LOGS,
        cyTestId: PSAFE_MENU_SETTINGS_SECTIONS_CY_TEST_ID.LOGS,
        text: 'Logs' },
      miscellaneous: {
        id: PSAFE_MENU_SETTINGS_SECTIONS_ID.MISCELLANEOUS,
        cyTestId: PSAFE_MENU_SETTINGS_SECTIONS_CY_TEST_ID.MISCELLANEOUS,
        text: 'Miscellaneous',
      },
      about: {
        id: PSAFE_MENU_SETTINGS_SECTIONS_ID.ABOUT,
        cyTestId: PSAFE_MENU_SETTINGS_SECTIONS_CY_TEST_ID.ABOUT,
        text: 'About',
      },
    };
    return (auxSettings);
  }

  avaibleRenderSettings() {
    const availableSettings = this.availableSettings()
    let auxItems = [
      this.createItem(availableSettings.api),
      this.createItem(availableSettings.modules),
      this.createItem(availableSettings.sample_data),
      this.createItem(availableSettings.configuration),
      this.createItem(availableSettings.logs),
      this.createItem(availableSettings.miscellaneous),
      this.createItem(availableSettings.about),
    ]
    return (auxItems);
  }

  clickMenuItem = async (ev, section) => {
    this.props.closePopover();
    AppNavigate.navigateToModule(ev, 'settings', { tab: section });
    if (this.props.currentMenuTab === 'settings') {
      const $injector = getAngularModule().$injector;
      const router = $injector.get('$route');
      router.reload();
    }
  };

  createItem = (item, data = {}) => {
    // NOTE: Duplicate `name` values will cause `id` collisions.
    return {
      ...data,
      id: item.id,
      name: item.text,
      'data-test-subj': item.cyTestId,
      isSelected: window.location.href.includes('/settings') && this.props.state.selected_settings_section === item.id,
      onClick: () => { },
      onMouseDown: (ev) => this.clickMenuItem(ev, item.id)
    };
  };

  render() {
    const availableSettings = this.availableSettings()
    const renderSettings = this.avaibleRenderSettings()
    const sideNavAdmin = [
      {
        name: availableSettings.settings.text,
        id: availableSettings.settings.id,
        icon: <EuiIcon type="gear" color="primary"/>,
        items: renderSettings
      }
    ];


    return (
      <div className="PaManagementSideMenu" style={{ width: 200 }}>
        <EuiFlexGroup responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiSideNav items={sideNavAdmin} style={{ padding: '4px 12px' }} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.appStateReducers,
  };
};

export default connect(
  mapStateToProps,
)(PaMenuSettings);
