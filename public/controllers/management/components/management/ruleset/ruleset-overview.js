import React, { Component } from 'react';
// Eui components
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiPage,
  EuiText,
  EuiTitle,
  EuiLoadingSpinner,
  EuiSpacer
} from '@elastic/eui';

import { connect } from 'react-redux';

// Psafe components
import PaRulesetTable from './ruleset-table';
import PaRulesetSearchBar from './ruleset-search-bar';
import PaRulesetActionButtons from './actions-buttons';
import './ruleset-overview.scss';
import { withUserAuthorizationPrompt, withGlobalBreadcrumb } from '../../../../../components/common/hocs';
import PaRestartClusterManagerCallout from '../../../../../components/common/restart-cluster-manager-callout';
import { compose } from 'redux';
import { resourceDictionary } from './utils/ruleset-handler';

class PaRulesetOverview extends Component {
  sectionNames = {
    rules: 'Rules',
    decoders: 'Decoders',
    lists: 'CDB lists'
  };

  constructor(props) {
    super(props);
    this.state = {
      totalItems: 0,
      showWarningRestart: false
    }
  }

  updateRestartManagers(showWarningRestart){
    this.setState({ showWarningRestart });
  }

  render() {
    const { section } = this.props.state;
    const { totalItems } = this.state;

    return (
      <EuiPage style={{ background: 'transparent' }}>
        <EuiPanel>
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiTitle>
                <h2>{this.sectionNames[section]} {totalItems === false ? <EuiLoadingSpinner /> : <span>({totalItems})</span>}</h2>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem></EuiFlexItem>
            <PaRulesetActionButtons clusterStatus={this.props.clusterStatus} updateRestartClusterManager={(showWarningRestart) => this.updateRestartManagers(showWarningRestart)}/>
          </EuiFlexGroup>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText color="subdued">
                {`From here you can manage your ${section}.`}
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
          {this.state.showWarningRestart && (
            <>
              <EuiSpacer size='s' />
              <PaRestartClusterManagerCallout
                onRestarted={() => this.updateRestartManagers(false)}
                onRestartedError={() => this.updateRestartManagers(true)}
              />
              <EuiSpacer size='s' />
            </>
          )}
          <PaRulesetSearchBar />
          <EuiFlexGroup>
            <EuiFlexItem>
              <PaRulesetTable
                clusterStatus={this.props.clusterStatus}
                request={section}
                updateTotalItems={(totalItems) => this.setState({ totalItems })}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.rulesetReducers
  };
};

export default compose(
  connect(
    mapStateToProps
  ),
  withGlobalBreadcrumb(props => {
    const sectionNames = {
      rules: 'Rules',
      decoders: 'Decoders',
      lists: 'CDB lists'
    }
    return [
      { text: '' },
      { text: 'Management', href: '#/manager' },
      { text: sectionNames[props.state.section] }
    ];
  }),
  withUserAuthorizationPrompt((props) => [{action: `${props.state.section}:read`, resource: resourceDictionary[props.state.section].permissionResource('*')}])
)(PaRulesetOverview);
