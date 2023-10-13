/*
 * Psafe app - React component for show configuration of alerts - labels tab.
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

import { EuiBasicTable } from '@elastic/eui';

import PaNoConfig from '../util-components/no-config';
import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import withPaConfig from '../util-hocs/pa-config';
import { isString, hasSize } from '../utils/utils';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const columns = [
  { field: 'key', name: 'Label key' },
  { field: 'value', name: 'Label value' },
  { field: 'hidden', name: 'Hidden' }
];

const helpLinks = [
  {
    text: 'Agent labels',
    href: webDocumentationLink('user-manual/capabilities/labels.html')
  },
  {
    text: 'Labels reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/labels.html')
  }
];

class PaConfigurationAlertsLabels extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig, agent, psafeNotReadyYet } = this.props;
    return (
      <Fragment>
        {currentConfig[
          agent && agent.id !== '000' ? 'agent-labels' : 'analysis-labels'
        ] &&
          isString(
            currentConfig[
              agent && agent.id !== '000' ? 'agent-labels' : 'analysis-labels'
            ]
          ) && (
            <PaNoConfig
              error={
                currentConfig[
                  agent && agent.id !== '000'
                    ? 'agent-labels'
                    : 'analysis-labels'
                ]
              }
              help={helpLinks}
            />
          )}
        {currentConfig[
          agent && agent.id !== '000' ? 'agent-labels' : 'analysis-labels'
        ] &&
          !isString(
            currentConfig[
              agent && agent.id !== '000' ? 'agent-labels' : 'analysis-labels'
            ]
          ) &&
          !hasSize(
            currentConfig[
              agent && agent.id !== '000' ? 'agent-labels' : 'analysis-labels'
            ].labels
          ) && <PaNoConfig error="not-present" help={helpLinks} />}
        {psafeNotReadyYet &&
          (!currentConfig ||
            !currentConfig[
              agent && agent.id !== '000' ? 'agent-labels' : 'analysis-labels'
            ]) && <PaNoConfig error="Psafe not ready yet" />}
        {currentConfig[
          agent && agent.id !== '000' ? 'agent-labels' : 'analysis-labels'
        ] &&
        !isString(
          currentConfig[
            agent && agent.id !== '000' ? 'agent-labels' : 'analysis-labels'
          ]
        ) &&
        hasSize(
          currentConfig[
            agent && agent.id !== '000' ? 'agent-labels' : 'analysis-labels'
          ].labels
        ) ? (
          <PaConfigurationSettingsTabSelector
            title="Defined labels"
            currentConfig={currentConfig}
            minusHeight={agent.id === '000' ? 320 : 355}
            helpLinks={helpLinks}
          >
            <EuiBasicTable
              columns={columns}
              items={
                currentConfig[
                  agent && agent.id !== '000'
                    ? 'agent-labels'
                    : 'analysis-labels'
                ].labels
              }
            />
          </PaConfigurationSettingsTabSelector>
        ) : null}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  psafeNotReadyYet: state.appStateReducers.psafeNotReadyYet
});

export default connect(mapStateToProps)(PaConfigurationAlertsLabels);

const sectionsAgent = [{ component: 'agent', configuration: 'labels' }];

export const PaConfigurationAlertsLabelsAgent = compose(
  connect(mapStateToProps),
  withPaConfig(sectionsAgent)
)(PaConfigurationAlertsLabels);

PaConfigurationAlertsLabels.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

PaConfigurationAlertsLabelsAgent.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};
