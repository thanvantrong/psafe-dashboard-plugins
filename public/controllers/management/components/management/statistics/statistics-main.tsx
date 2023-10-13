/*
 * Psafe app - React component for reporting
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

import PaReduxProvider from '../../../../../redux/pa-redux-provider';
//Psafe statistics overview
import PaStatisticsOverview from './statistics-overview';

function PaStatistics() {
  return (
    <PaReduxProvider>
      <PaStatisticsOverview />
    </PaReduxProvider>
  );
}

export default PaStatistics;
