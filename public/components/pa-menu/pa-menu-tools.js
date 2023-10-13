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
import { EuiFlexItem, EuiFlexGroup, EuiSideNav, EuiIcon } from '@elastic/eui';
import { PaRequest } from '../../react-services/pa-request';
import { connect } from 'react-redux';
import { AppNavigate } from '../../react-services/app-navigate';
import { PSAFE_MENU_TOOLS_SECTIONS_ID } from '../../../common/constants';
import { PSAFE_MENU_TOOLS_SECTIONS_CY_TEST_ID } from '../../../common/psaf-menu/pa-menu-tools.cy';

class PaMenuTools extends Component {
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

  avaibleRenderSettings() {
    return [
      this.createItem({
        id: PSAFE_MENU_TOOLS_SECTIONS_ID.API_CONSOLE,
        cyTestId: PSAFE_MENU_TOOLS_SECTIONS_CY_TEST_ID.API_CONSOLE,
        text: 'API Console',
      }),
      this.createItem({
        id: PSAFE_MENU_TOOLS_SECTIONS_ID.RULESET_TEST,
        cyTestId: PSAFE_MENU_TOOLS_SECTIONS_CY_TEST_ID.RULESET_TEST,
        text: 'Ruleset Test',
      }),
    ];
  }

  clickMenuItem = async (ev, section) => {
    this.props.closePopover();
    AppNavigate.navigateToModule(ev, 'psafe-dev', { tab: section });
  };

  createItem = (item, data = {}) => {
    // NOTE: Duplicate `name` values will cause `id` collisions.
    return {
      ...data,
      id: item.id,
      name: item.text,
      'data-test-subj': item.cyTestId,
      isSelected: window.location.href.includes('/psafe-dev') && this.props.state.selected_tools_section === item.id,
      onClick: () => { },
      onMouseDown: (ev) => this.clickMenuItem(ev, item.id)
    };
  };

  render() {
    const renderSettings = this.avaibleRenderSettings()
    const sideNavAdmin = [
      {
        name: 'Tools',
        id: 0,
        icon: <EuiIcon type="devToolsApp" color="primary"/>,
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
    state: state.toolsReducers
  };
};

export default connect(mapStateToProps, null)(PaMenuTools);
