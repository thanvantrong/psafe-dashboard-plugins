/*
 * Psafe app - React component for view selector.
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

class PaViewSelector extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { view, children } = this.props;
    return (
      <Fragment>
        {children.find(child => child.props.view === view) ||
          children.find(child => child.props.default)}
      </Fragment>
    );
  }
}

PaViewSelector.propTypes = {
  children: PropTypes.array
};

export default PaViewSelector;

export class PaViewSelectorSwitch extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}

PaViewSelectorSwitch.propTypes = {
  view: PropTypes.oneOfType([PropTypes.string, PropTypes.any])
};
