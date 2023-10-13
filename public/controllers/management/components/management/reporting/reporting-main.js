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
//Psafe groups overview
import PaReportingOverview from './reporting-overview';
import { updateGlobalBreadcrumb } from '../../../../../redux/actions/globalBreadcrumbActions';
import store from '../../../../../redux/store';

class PaReporting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setGlobalBreadcrumb() {
    const breadcrumb = [
      { text: '' },
      { text: 'Management', href: '#/manager' },
      { text: 'Reporting' }
    ];
    store.dispatch(updateGlobalBreadcrumb(breadcrumb));
  }

  componentDidMount() {
    this.setGlobalBreadcrumb();
  }

  render() {
    return (
      <PaReduxProvider>
        <PaReportingOverview />
      </PaReduxProvider>
    );
  }
}

export default PaReporting;
