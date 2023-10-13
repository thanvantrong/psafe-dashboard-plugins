/*
 * Psafe app - React component for show chose section in configuration.
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

import PaConfigurationOverview from './configuration-overview';
import {
  PaConfigurationGlobalConfigurationManager,
  PaConfigurationGlobalConfigurationAgent,
} from './global-configuration/global-configuration';
import PaConfigurationEditConfiguration from './edit-configuration/edit-configuration';
import PaConfigurationRegistrationService from './registration-service/registration-service';
import PaConfigurationLogSettings from './log-settings/log-settings';
import PaConfigurationCluster from './cluster/cluster';
import PaConfigurationAlerts from './alerts/alerts';
import PaConfigurationClient from './client/client';
import PaConfigurationClientBuffer from './client-buffer/client-buffer';
import { PaConfigurationAlertsLabelsAgent } from './alerts/alerts-labels';
import PaConfigurationIntegrations from './integrations/integrations';
import PaConfigurationPolicyMonitoring from './policy-monitoring/policy-monitoring';
import PaConfigurationOpenSCAP from './open-scap/open-scap';
import PaConfigurationCisCat from './cis-cat/cis-cat';
import PaConfigurationVulnerabilities from './vulnerabilities/vulnerabilities';
import PaConfigurationOsquery from './osquery/osquery';
import PaConfigurationInventory from './inventory/inventory';
import PaConfigurationActiveResponse from './active-response/active-response';
import PaConfigurationActiveResponseAgent from './active-response/active-response-agent';
import PaConfigurationCommands from './commands/commands';
import PaConfigurationDockerListener from './docker-listener/docker-listener';
import PaConfigurationLogCollection from './log-collection/log-collection';
import PaConfigurationIntegrityMonitoring from './integrity-monitoring/integrity-monitoring';
import PaConfigurationIntegrityAgentless from './agentless/agentless';
import PaConfigurationIntegrityAmazonS3 from './aws-s3/aws-s3';
import PaConfigurationAzureLogs from './azure-logs/azure-logs';
import PaConfigurationGoogleCloudPubSub from './google-cloud-pub-sub/google-cloud-pub-sub';
import { PaConfigurationGitHub } from './github/github';
import PaViewSelector, {
  PaViewSelectorSwitch
} from './util-components/view-selector';
import PaLoading from './util-components/loading';
import { withRenderIfOrWrapped } from './util-hocs/render-if';
import { PaAgentNeverConnectedPrompt } from './configuration-no-agent';
import PaConfigurationPath from './util-components/configuration-path';
import PaRefreshClusterInfoButton from './util-components/refresh-cluster-info-button';
import { withUserAuthorizationPrompt } from '../../../../../components/common/hocs';

import { clusterNodes, clusterReq } from './utils/pa-fetch';
import {
  updateClusterNodes,
  updateClusterNodeSelected,
} from '../../../../../redux/actions/configurationActions';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { EuiPage, EuiPanel, EuiSpacer, EuiButtonEmpty, EuiFlexItem } from '@elastic/eui';

import { agentIsSynchronized } from './utils/pa-fetch';
import { PaRequest } from '../../../../../react-services/pa-request';
import { API_NAME_AGENT_STATUS, UI_LOGGER_LEVELS } from '../../../../../../common/constants';
import { UI_ERROR_SEVERITIES } from '../../../../../react-services/error-orchestrator/types';
import { getErrorOrchestrator } from '../../../../../react-services/common-services';
import { PaConfigurationOffice365 } from './office365/office365';

class PaConfigurationSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: '',
      viewProps: {},
      agentSynchronized: undefined,
      masterNodeInfo: undefined,
      loadingOverview: this.props.agent.id === '000',
    };
  }
  componentWillUnmount() {
    this.props.updateClusterNodes(false);
    this.props.updateClusterNodeSelected(false);
  }
  updateConfigurationSection = (view, title, description) => {
    this.setState({ view, viewProps: { title: title, description } });
  };
  updateBadge = (badgeStatus) => {
    // default value false?
    this.setState({
      viewProps: { ...this.state.viewProps, badge: badgeStatus },
    });
  };
  async componentDidMount() {
    // If agent, check if is synchronized or not
    if (this.props.agent.id !== '000') {
      try {
        const agentSynchronized = await agentIsSynchronized(this.props.agent);
        this.setState({ agentSynchronized });
      } catch (error) {
        const options = {
          context: `${PaConfigurationSwitch.name}.componentDidMount`,
          level: UI_LOGGER_LEVELS.ERROR,
          severity: UI_ERROR_SEVERITIES.BUSINESS,
          error: {
            error: error,
            message: error.message || error,
            title: error.name || error,
          },
        };
        getErrorOrchestrator().handleError(options);
      }
    } else {
      try {
        // try if it is a cluster
        const clusterStatus = await clusterReq();
        if (
          clusterStatus.data.data.enabled === 'yes' &&
          clusterStatus.data.data.running === 'yes'
        ) {
          const nodes = await clusterNodes();
          // set cluster nodes in Redux Store
          this.props.updateClusterNodes(nodes.data.data.affected_items);
          // set cluster node selected in Redux Store
          this.props.updateClusterNodeSelected(
            nodes.data.data.affected_items.find((node) => node.type === 'master').name
          );
        } else {
          // do nothing if it isn't a cluster
          this.props.updateClusterNodes(false);
          this.props.updateClusterNodeSelected(false);
        }
      } catch (error) {
        // do nothing if it isn't a cluster
        this.props.updateClusterNodes(false);
        this.props.updateClusterNodeSelected(false);
        const options = {
          context: `${PaConfigurationSwitch.name}.componentDidMount`,
          level: UI_LOGGER_LEVELS.ERROR,
          severity: UI_ERROR_SEVERITIES.BUSINESS,
          error: {
            error: error,
            message: error.message || error,
            title: error.name || error,
          },
        };
        getErrorOrchestrator().handleError(options);
      }
      // If manager/cluster require agent platform info to filter sections in overview. It isn't coming from props for Management/Configuration
      try {
        this.setState({ loadingOverview: true });
        const masterNodeInfo = await PaRequest.apiReq('GET', '/agents', {
          params: { q: 'id=000' },
        });
        this.setState({
          masterNodeInfo: masterNodeInfo.data.data.affected_items[0]
        });
        this.setState({ loadingOverview: false });
      } catch (error) {
        this.setState({ loadingOverview: false });
        const options = {
          context: `${PaConfigurationSwitch.name}.componentDidMount`,
          level: UI_LOGGER_LEVELS.ERROR,
          severity: UI_ERROR_SEVERITIES.BUSINESS,
          error: {
            error: error,
            message: error.message || error,
            title: error.name || error,
          },
        };
        getErrorOrchestrator().handleError(options);
      }
    }
  }
  render() {
    const {
      view,
      viewProps: { title, description, badge },
      agentSynchronized,
      masterNodeInfo,
    } = this.state;
    const { agent, goGroups } = this.props; // TODO: goGroups and exportConfiguration is used for Manager and depends of AngularJS
    return (
      <EuiPage>
        <EuiPanel>
          {agent.id !== '000' && agent.group && agent.group.length ? (
            <Fragment>
              <span>Groups:</span>
              {agent.group.map((group, key) => (
                <EuiButtonEmpty key={`agent-group-${key}`} onClick={() => goGroups(agent, key)}>
                  {group}
                </EuiButtonEmpty>
              ))}
              <EuiSpacer size="s" />
            </Fragment>
          ) : null}
          {view !== '' && view !== 'edit-configuration' && (
            <PaConfigurationPath
              title={title}
              description={description}
              updateConfigurationSection={this.updateConfigurationSection}
              badge={badge}
            >
              {agent.id === '000' && (
                <EuiFlexItem grow={false}>
                  <PaRefreshClusterInfoButton />
                </EuiFlexItem>
              )}
            </PaConfigurationPath>
          )}
          {view === '' &&
            ((!this.state.loadingOverview && (
              <PaConfigurationOverview
                agent={masterNodeInfo || agent}
                agentSynchronized={agentSynchronized}
                exportConfiguration={this.props.exportConfiguration}
                updateConfigurationSection={this.updateConfigurationSection}
              />
            )) || <PaLoading />)}
          {view === 'edit-configuration' && (
            <PaConfigurationEditConfiguration
              clusterNodeSelected={this.props.clusterNodeSelected}
              agent={agent}
              updateConfigurationSection={this.updateConfigurationSection}
            />
          )}
          {view !== '' && (
            <PaViewSelector view={view}>
              <PaViewSelectorSwitch view="global-configuration">
                <PaConfigurationGlobalConfigurationManager
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="global-configuration-agent">
                <PaConfigurationGlobalConfigurationAgent
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="cluster">
                <PaConfigurationCluster
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="registration-service">
                <PaConfigurationRegistrationService
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="log-settings">
                <PaConfigurationLogSettings
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="alerts">
                <PaConfigurationAlerts
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="client">
                <PaConfigurationClient
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="client-buffer">
                <PaConfigurationClientBuffer
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="alerts-agent">
                <PaConfigurationAlertsLabelsAgent
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="integrations">
                <PaConfigurationIntegrations
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="policy-monitoring">
                <PaConfigurationPolicyMonitoring
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="open-scap">
                <PaConfigurationOpenSCAP
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="cis-cat">
                <PaConfigurationCisCat
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="vulnerabilities">
                <PaConfigurationVulnerabilities
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="osquery">
                <PaConfigurationOsquery
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="inventory">
                <PaConfigurationInventory
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="active-response">
                <PaConfigurationActiveResponse
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="active-response-agent">
                <PaConfigurationActiveResponseAgent
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="commands">
                <PaConfigurationCommands
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="docker-listener">
                <PaConfigurationDockerListener
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="log-collection">
                <PaConfigurationLogCollection
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="integrity-monitoring">
                <PaConfigurationIntegrityMonitoring
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="agentless">
                <PaConfigurationIntegrityAgentless
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="aws-s3">
                <PaConfigurationIntegrityAmazonS3
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="azure-logs">
                <PaConfigurationAzureLogs
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="gcp-pubsub">
                <PaConfigurationGoogleCloudPubSub
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="github">
                <PaConfigurationGitHub
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
              <PaViewSelectorSwitch view="office365">
                <PaConfigurationOffice365
                  clusterNodeSelected={this.props.clusterNodeSelected}
                  agent={agent}
                  updateBadge={this.updateBadge}
                  updateConfigurationSection={this.updateConfigurationSection}
                />
              </PaViewSelectorSwitch>
            </PaViewSelector>
          )}
        </EuiPanel>
      </EuiPage>
    );
  }
}

const mapStateToProps = (state) => ({
  clusterNodes: state.configurationReducers.clusterNodes,
  clusterNodeSelected: state.configurationReducers.clusterNodeSelected,
  psafeNotReadyYet: state.appStateReducers.psafeNotReadyYet,
});

const mapDispatchToProps = (dispatch) => ({
  updateClusterNodes: (clusterNodes) => dispatch(updateClusterNodes(clusterNodes)),
  updateClusterNodeSelected: (clusterNodeSelected) =>
    dispatch(updateClusterNodeSelected(clusterNodeSelected)),
});

export default compose(
  withUserAuthorizationPrompt((props) => [props.agent.id === '000' ?
  {action: 'manager:read', resource: '*:*:*'} :
  [
    {action: 'agent:read', resource: `agent:id:${props.agent.id}`},
    ...(props.agent.group || []).map(group => ({ action: 'agent:read', resource: `agent:group:${group}` }))
  ]]), //TODO: this need cluster:read permission but manager/cluster is managed in PaConfigurationSwitch component
  withRenderIfOrWrapped((props) => props.agent.status === API_NAME_AGENT_STATUS.NEVER_CONNECTED, PaAgentNeverConnectedPrompt),
  connect(
    mapStateToProps,
    mapDispatchToProps
))(PaConfigurationSwitch);
