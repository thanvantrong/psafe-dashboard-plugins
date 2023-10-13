/*
 * Psafe app - React component for show configuration of Office 365 module.
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
import PaNoConfig from '../util-components/no-config';
import withPaConfig from '../util-hocs/pa-config';
import { wodleBuilder } from '../utils/builders';
import { compose } from 'redux';
import PaTabSelector, { PaTabSelectorTab } from '../util-components/tab-selector';
import { isString } from '../utils/utils';
import { withGuard } from '../../../../../../components/common/hocs';
import { HELP_LINKS, OFFICE_365, WMODULES_WMODULES } from './constants';
import { GeneralTab } from './components/general-tab/general-tab';
import { ApiAuthTab } from './components/api-auth-tab/api-auth-tab';
import { SubscriptionTab } from './components/SubscriptionTab/SubscriptionTab';

interface IPaConfigOffice365 {
  currentConfig: {};
  agent: { id: string | number };
  updateBadge: () => void;
  updateConfigurationSection: () => void;
}
const sections = [{ component: 'wmodules', configuration: 'wmodules' }];

export const PaConfigurationOffice365: React.FunctionComponent<IPaConfigOffice365> = withPaConfig(
  sections
)(({ currentConfig, updateBadge, ...props }) => {
  const wodleConfiguration = useMemo(() => wodleBuilder(currentConfig, OFFICE_365), [
    currentConfig,
  ]);

  useEffect(() => {
    updateBadge(
      currentConfig &&
        wodleConfiguration &&
        wodleConfiguration[OFFICE_365] &&
        wodleConfiguration[OFFICE_365].enabled === 'yes'
    );
  }, [currentConfig]);

  return (
    <PaTabSelector>
      <PaTabSelectorTab label="General">
        <GeneralTabWrapped
          wodleConfiguration={wodleConfiguration}
          currentConfig={currentConfig}
          {...props}
        />
      </PaTabSelectorTab>
      <PaTabSelectorTab label="Credentials">
        <ApiAuthTabWrapped
          wodleConfiguration={wodleConfiguration}
          currentConfig={currentConfig}
          {...props}
        />
      </PaTabSelectorTab>
      <PaTabSelectorTab label="Subscriptions">
        <SubscriptionTabWrapped
          wodleConfiguration={wodleConfiguration}
          currentConfig={currentConfig}
          {...props}
        />
      </PaTabSelectorTab>
    </PaTabSelector>
  );
});

const tabWrapper = compose(
  withGuard(
    ({ currentConfig }) =>
      currentConfig[WMODULES_WMODULES] && isString(currentConfig[WMODULES_WMODULES]),
    ({ currentConfig }) => <PaNoConfig error={currentConfig[WMODULES_WMODULES]} help={HELP_LINKS} />
  ),
  withGuard(
    ({ wodleConfiguration }) => !wodleConfiguration[OFFICE_365],
    (props) => <PaNoConfig error="not-present" help={HELP_LINKS} />
  )
);

const GeneralTabWrapped = tabWrapper(GeneralTab);
const ApiAuthTabWrapped = tabWrapper(ApiAuthTab);
const SubscriptionTabWrapped = tabWrapper(SubscriptionTab);
