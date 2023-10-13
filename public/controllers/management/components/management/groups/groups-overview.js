/*
 * Psafe app - React component for building the groups table.
 *
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
import {
  EuiFlexItem,
  EuiFlexGroup,
  EuiPanel,
  EuiTitle,
  EuiText,
  EuiPage
} from '@elastic/eui';

// Psafe components
import PaGroupsTable from './groups-table';
import PaGroupsActionButtons from './actions-buttons-main';

import { connect } from 'react-redux';
import { withUserAuthorizationPrompt } from '../../../../../components/common/hocs'
import { compose } from 'redux';

export class PaGroupsOverview extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <EuiPage style={{ background: 'transparent' }}>
        <EuiPanel>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiTitle>
                    <h2>Groups</h2>
                  </EuiTitle>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <PaGroupsActionButtons />
          </EuiFlexGroup>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText color="subdued" style={{ paddingBottom: '15px' }}>
                From here you can list and check your groups, its agents and
                files.
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup>
            <EuiFlexItem>
              <PaGroupsTable />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.groupsReducers
  };
};


export default compose(
  withUserAuthorizationPrompt([{action: 'group:read', resource: 'group:id:*'}]),
  connect(
    mapStateToProps
  ),
)(PaGroupsOverview);
