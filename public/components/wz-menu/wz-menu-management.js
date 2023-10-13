/*
 * Psafe app - React component for registering agents.
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
import { AppNavigate } from '../../react-services/app-navigate'
import { PSAFE_MENU_MANAGEMENT_SECTIONS_ID } from '../../../common/constants';
import { PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID } from '../../../common/psaf-menu/pa-menu-management.cy';

class PaMenuManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO: Fix the selected section
      selectedItemName: null
    };

    this.managementSections = {
      management: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.MANAGEMENT,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.MANAGEMENT,
        text: 'Management',
      },
      administration: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.ADMINISTRATION,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.ADMINISTRATION,
        text: 'Administration',
      },
      ruleset: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.RULESET,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.RULESET,
        text: 'Ruleset',
      },
      rules: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.RULES,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.RULES,
        text: 'Rules',
      },
      decoders: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.DECODERS,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.DECODERS,
        text: 'Decoders',
      },
      lists: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.CDB_LISTS,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.CDB_LISTS,
        text: 'CDB lists',
      },
      groups: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.GROUPS,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.GROUPS,
        text: 'Groups',
      },
      configuration: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.CONFIGURATION,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.CONFIGURATION,
        text: 'Configuration',
      },
      statusReports: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.STATUS_AND_REPORTS,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.STATUS_AND_REPORTS,
        text: 'Status and reports',
      },
      status: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.STATUS,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.STATUS,
        text: 'Status',
      },
      cluster: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.CLUSTER,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.CLUSTER,
        text: 'Cluster',
      },
      logs: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.LOGS,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.LOGS,
        text: 'Logs',
      },
      reporting: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.REPORTING,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.REPORTING,
        text: 'Reporting',
      },
      statistics: {
        id: PSAFE_MENU_MANAGEMENT_SECTIONS_ID.STATISTICS,
        cyTestId: PSAFE_MENU_MANAGEMENT_SECTIONS_CY_TEST_ID.STATISTICS,
        text: 'Statistics',
      },
    };

    this.paths = {
      rules: '/rules',
      decoders: '/decoders',
      lists: '/lists/files'
    };

    this.paReq = PaRequest;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.section !== this.state.selectedItemName) {
      this.setState({ selectedItemName: nextProps.section });
    }
  }

  clickMenuItem = (ev, section) => {
    this.props.closePopover();
    AppNavigate.navigateToModule(ev, 'manager', { tab: section })
  };

  createItem = (item, data = {}) => {
    // NOTE: Duplicate `name` values will cause `id` collisions.
    return {
      ...data,
      id: item.id,
      name: item.text,
      'data-test-subj': item.cyTestId,
      isSelected: this.props.state.section === item.id,
      onClick: () => { },
      onMouseDown: (ev) => this.clickMenuItem(ev, item.id)
    };
  };

  render() {
    const sideNavAdmin = [
      {
        name: this.managementSections.administration.text,
        id: this.managementSections.administration.id,
        icon: <EuiIcon type="managementApp" color="primary" />,
        items: [
          this.createItem(this.managementSections.rules),
          this.createItem(this.managementSections.decoders),
          this.createItem(this.managementSections.lists),
          this.createItem(this.managementSections.groups),
          this.createItem(this.managementSections.configuration),
        ],
      }
    ];

    const sideNavStatus = [
      {
        name: this.managementSections.statusReports.text,
        id: this.managementSections.statusReports.id,
        icon: <EuiIcon type="reportingApp" color="primary" />,
        items: [
          this.createItem(this.managementSections.status),
          this.createItem(this.managementSections.cluster),
          this.createItem(this.managementSections.statistics),
          this.createItem(this.managementSections.logs),
          this.createItem(this.managementSections.reporting)
        ]
      }
    ];

    return (
      <div className="PaManagementSideMenu">
        <EuiFlexGroup>
          <EuiFlexItem grow={false} style={{ marginLeft: 14 }}>
            <EuiButtonEmpty iconType="apps"
              onClick={() => {
                this.props.closePopover();
                window.location.href = '#/manager';
              }}>
              Management directory
              </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiSideNav items={sideNavAdmin} style={{ padding: '4px 12px' }} />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiSideNav items={sideNavStatus} style={{ padding: '4px 12px' }} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.rulesetReducers,
  };
};

export default connect(
  mapStateToProps,
)(PaMenuManagement);
