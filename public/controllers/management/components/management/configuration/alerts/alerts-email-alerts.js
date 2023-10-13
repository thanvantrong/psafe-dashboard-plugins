/*
 * Psafe app - React component for show configuration of alerts - email alerts tab.
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

import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import PaConfigurationSettingsListSelector from '../util-components/configuration-settings-list-selector';
import PaNoConfig from '../util-components/no-config';
import { isString, isArray } from '../utils/utils';
import { settingsListBuilder } from '../utils/builders';

import { connect } from 'react-redux';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const mainSettings = [
  { field: 'email_to', label: 'Send alerts to this email address' },
  {
    field: 'level',
    label: 'Minimum severity level to send the alert by email'
  },
  {
    field: 'group',
    label: 'Send only alerts that belong to one of these groups'
  },
  {
    field: 'event_location',
    label: 'Send alerts when they match this event location'
  },
  { field: 'format', label: 'Format for email alerts' },
  {
    field: 'rule_id',
    label: 'Send only alerts that belong to one of these rule IDs'
  },
  { field: 'do_not_delay', label: 'Disable delayed email delivery' },
  {
    field: 'do_not_group',
    label: 'Disable alerts grouping into the same email'
  }
];

const helpLinks = [
  {
    text: 'Configuring email alerts',
    href: webDocumentationLink('user-manual/manager/manual-email-report/index.html')
  },
  {
    text: 'SMTP server with authentication',
    href: webDocumentationLink('user-manual/manager/manual-email-report/smtp-authentication.html')
  },
  {
    text: 'Email alerts reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/email-alerts.html')
  }
];

class PaConfigurationAlertsEmailAlerts extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { currentConfig, psafeNotReadyYet } = this.props;
    const items =
      currentConfig &&
      currentConfig['mail-alerts'] &&
      isArray(currentConfig['mail-alerts'].email_alerts)
        ? settingsListBuilder(
            currentConfig['mail-alerts'].email_alerts,
            'email_to'
          )
        : [];
    return (
      <Fragment>
        {currentConfig['mail-alerts'] &&
          isString(currentConfig['mail-alerts']) && (
            <PaNoConfig error={currentConfig['mail-alerts']} help={helpLinks} />
          )}
        {currentConfig['mail-alerts'] &&
        !isString(currentConfig['mail-alerts']) &&
        (!currentConfig['mail-alerts'].email_alerts ||
          !currentConfig['mail-alerts'].email_alerts.length) ? (
          <PaNoConfig error="not-present" help={helpLinks} />
        ) : null}
        {psafeNotReadyYet &&
          (!currentConfig || !currentConfig['mail-alerts']) && (
            <PaNoConfig error="Psafe not ready yet" help={helpLinks} />
          )}
        {currentConfig['mail-alerts'] &&
        isArray(currentConfig['mail-alerts'].email_alerts) &&
        currentConfig['mail-alerts'].email_alerts.length ? (
          <PaConfigurationSettingsTabSelector
            title="Main settings"
            description="Granular email alert options"
            currentConfig={currentConfig}
            minusHeight={320}
            helpLinks={helpLinks}
          >
            <PaConfigurationSettingsListSelector
              items={items}
              settings={mainSettings}
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

PaConfigurationAlertsEmailAlerts.propTypes = {
  // currentConfig: PropTypes.object.isRequired,
  psafeNotReadyYet: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export default connect(mapStateToProps)(PaConfigurationAlertsEmailAlerts);
