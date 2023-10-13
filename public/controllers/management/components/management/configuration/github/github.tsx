/*
 * Psafe app - React component for show configuration of GitHub.
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import React, { useEffect, useMemo } from 'react';
import { EuiBasicTable } from '@elastic/eui';
import { compose } from 'redux';
import PaConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import PaConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import PaConfigurationSettingsListSelector from '../util-components/configuration-settings-list-selector';
import PaTabSelector, {
  PaTabSelectorTab
} from '../util-components/tab-selector';
import PaNoConfig from '../util-components/no-config';
import { isString, renderValueYesThenEnabled } from '../utils/utils';
import { wodleBuilder, settingsListBuilder } from '../utils/builders';
import { withGuard } from '../../../../../../components/common/hocs';
import withPaConfig from '../util-hocs/pa-config';
import { webDocumentationLink } from '../../../../../../../common/services/web_documentation';

const sections = [{ component: 'wmodules', configuration: 'wmodules' }];

const mainSettings = [
  { field: 'enabled', label: 'Service status', render: renderValueYesThenEnabled },
  { field: 'only_future_events', label: 'Collect events generated since Psafe agent was started' },
  { field: 'time_delay', label: 'Time in seconds that each scan will monitor until that delay backwards' },
  { field: 'curl_max_size', label: 'Maximum size allowed for the GitHub API response' },
  { field: 'interval', label: 'Interval between GitHub wodle executions in seconds' },
  { field: 'event_type', label: 'Event type' },
];

const columns = [
  { field: 'org_name', label: 'Organization' },
  { field: 'api_token', label: 'Token' }
];

const helpLinks = [
  {
    text: 'Using Psafe to monitor GitHub',
    href: webDocumentationLink('github/index.html')
  },
  {
    text: 'GitHub module reference',
    href: webDocumentationLink('user-manual/reference/optit-conf/github-module.html')
  }
];

export const PaConfigurationGitHub = withPaConfig(sections)(({currentConfig, updateBadge, ...rest }) => {
  const wodleConfiguration = useMemo(() => wodleBuilder(currentConfig, 'github'), [currentConfig]);
  
  useEffect(() => {
    updateBadge(currentConfig &&
      wodleConfiguration &&
      wodleConfiguration['github'] &&
      wodleConfiguration['github'].enabled === 'yes');
  }, [currentConfig]);

  return (
    <PaTabSelector>
      <PaTabSelectorTab label="General">
        <GeneralTab wodleConfiguration={wodleConfiguration} currentConfig={currentConfig} {...rest}/>
      </PaTabSelectorTab>
      <PaTabSelectorTab label="Credentials">
        <CredentialsTab wodleConfiguration={wodleConfiguration} currentConfig={currentConfig} {...rest}/>
      </PaTabSelectorTab>
    </PaTabSelector>
  )
});


const tabWrapper = compose(
  withGuard(({currentConfig}) => currentConfig['wmodules-wmodules'] && isString(currentConfig['wmodules-wmodules']), ({currentConfig}) => <PaNoConfig error={currentConfig['wmodules-wmodules']} help={helpLinks}/>),
  withGuard(({wodleConfiguration}) => !wodleConfiguration['github'], (props) => <PaNoConfig error='not-present' help={helpLinks}/>),
);

const GeneralTab = tabWrapper(({agent, wodleConfiguration}) => (
  <PaConfigurationSettingsTabSelector
    title="Main settings"
    description="Configuration for the GitHub module"
    currentConfig={wodleConfiguration}
    minusHeight={agent.id === '000' ? 370 : 420} //TODO: Review the minusHeight for the agent case
    helpLinks={helpLinks}
  >
    <PaConfigurationSettingsGroup
      config={wodleConfiguration['github']}
      items={mainSettings}
    />           
  </PaConfigurationSettingsTabSelector>
));



const CredentialsTab = tabWrapper(({agent, wodleConfiguration}) => {
  const credentials = useMemo(() => settingsListBuilder(
    wodleConfiguration['github'].api_auth,
    'org_name'
  ), [wodleConfiguration]);
  return (
    <PaConfigurationSettingsTabSelector
      title="List of organizations to auditing"
      currentConfig={wodleConfiguration}
      minusHeight={agent.id === '000' ? 370 : 420} //TODO: Review the minusHeight for the agent case
      helpLinks={helpLinks}
    >
      <PaConfigurationSettingsListSelector
        items={credentials}
        settings={columns}
      />
    </PaConfigurationSettingsTabSelector>
  )  
});
