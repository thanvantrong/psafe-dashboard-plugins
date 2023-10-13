/*
 * Psafe app - Wrap EUI components with ng-react and the Psafe app
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import './eui-loader';
import { PaFilterBar } from './pa-filter-bar/pa-filter-bar';
import { PaVisualize } from './visualize/pa-visualize';
import { PaMenuWrapper } from '../components/pa-menu/pa-menu-wrapper';
import { PaAgentSelectorWrapper } from '../components/pa-agent-selector/pa-agent-selector-wrapper';
import { PaBlankScreen } from '../components/pa-blank-screen/pa-blank-screen';
import { ClusterDisabled } from '../components/management/cluster/cluster-disabled';
import { ClusterTimelions } from '../components/management/cluster/cluster-timelions';
import { KibanaVisWrapper } from '../components/management/cluster/cluster-visualization';
import { ToastNotificationsModal } from '../components/notifications/modal';
import { getAngularModule } from '../kibana-services';

const app = getAngularModule();

app.value('PaFilterBar', PaFilterBar);
app.value('PaVisualize', PaVisualize);
app.value('PaMenuWrapper', PaMenuWrapper);
app.value('PaAgentSelectorWrapper', PaAgentSelectorWrapper);
app.value('PaBlankScreen', PaBlankScreen);
app.value('ClusterDisabled', ClusterDisabled);
app.value('ClusterTimelions', ClusterTimelions);
app.value('KibanaVisualization', KibanaVisWrapper);
app.value('ToastNotificationsModal', ToastNotificationsModal);
