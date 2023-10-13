/*
 * Psafe app - React component for status
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
//Psafe groups overview
import PaStatusOverview from './status-overview';

class PaStatus extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PaReduxProvider>
        <PaStatusOverview />
      </PaReduxProvider>
    );
  }
}

export default PaStatus;
