/*
 * Psafe app - React component for building the PaMenu component.
 *
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 *
 */
import React from 'react';
import PaMenu from './pa-menu';
import './pa-menu.scss';
import { compose } from 'redux';
import { withErrorBoundary, withReduxProvider } from '../common/hocs';

export const PaMenuWrapper = compose (withErrorBoundary, withReduxProvider)(PaMenu);
