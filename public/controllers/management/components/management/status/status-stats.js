/*
 * Psafe app - React component for building the status stats
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
import { EuiStat, EuiFlexItem, EuiFlexGroup } from '@elastic/eui';

import { connect } from 'react-redux';
import { UI_ORDER_AGENT_STATUS } from '../../../../../../common/constants';
import { agentStatusColorByAgentStatus, agentStatusLabelByAgentStatus } from '../../../../../../common/services/pa_agent_status';

export class PaStatusStats extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
    this.agentStatus = ['total', ...UI_ORDER_AGENT_STATUS].map(status => ({
      color: status !== 'total' ? agentStatusColorByAgentStatus(status) : 'primary',
      description: `${status === 'total' ? 'Total agents' : agentStatusLabelByAgentStatus(status)}`,
      status
    }));
    this.agentStatus.push({
      color: undefined,
      description: 'Agents coverage',
      status: 'coverage'
    })
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { stats } = this.props.state;

    return (
      <div>
        <EuiFlexGroup>
          <EuiFlexItem />
          {this.agentStatus.map(({color, description, status}) => (
            <EuiFlexItem key={`agent-status-${status}`}>
              <EuiStat
                title={status === 'coverage' ? `${stats?.agentsCoverage}%` : stats?.agentsCount?.[status]}
                description={description}
                titleColor={color}
                textAlign="center"
              />
            </EuiFlexItem>
          ))}
          <EuiFlexItem />
        </EuiFlexGroup>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.statusReducers
  };
};

export default connect(mapStateToProps)(PaStatusStats);
