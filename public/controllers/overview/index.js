/*
 * Psafe app - Load all the Overview controllers and related React components.
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { OverviewController } from './overview';
import { OverviewWelcome } from '../../components/common/welcome/overview-welcome';
import { PaCurrentOverviewSectionWrapper } from '../../components/common/modules/overview-current-section-wrapper';
import { PaCurrentAgentsSectionWrapper } from '../../components/common/modules/agents-current-section-wrapper';
import { Mitre } from '../../components/overview'
import { Stats } from './components/stats';
import { SelectAgent } from './components/select-agent';
import { RequirementCard } from './components/requirement-card';
import { getAngularModule } from '../../kibana-services';

const app = getAngularModule();

OverviewWelcome.displayName = 'OverviewWelcome';
PaCurrentOverviewSectionWrapper.displayName = 'PaCurrentOverviewSectionWrapper';
PaCurrentAgentsSectionWrapper.displayName = 'PaCurrentAgentsSectionWrapper';
Stats.displayName = 'StatsOverview';
Mitre.displayName = 'Mitre';
SelectAgent.displayName = 'SelectAgent';
RequirementCard.displayName = 'RequirementCard';

app
  .controller('overviewController', ['$scope', '$location', '$rootScope', 'errorHandler', 'commonData', 'reportingService', 'visFactoryService', '$route', OverviewController])
  .value('OverviewWelcome', OverviewWelcome)
  .value('PaCurrentOverviewSectionWrapper', PaCurrentOverviewSectionWrapper)
  .value('PaCurrentAgentsSectionWrapper', PaCurrentAgentsSectionWrapper)
  .value('StatsOverview', Stats)
  .value('Mitre', Mitre)
  .value('SelectAgent', SelectAgent)
  .value('RequirementCard', RequirementCard);
