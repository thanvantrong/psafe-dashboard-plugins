/*
 * Psafe app - React HOC to wrap a component with Psafe Redux store
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React from 'react';
import PaReduxProvider from '../../../redux/pa-redux-provider';

// Wrap the component with Psafe Redux provider
export const withReduxProvider = WrappedComponent => props => <PaReduxProvider><WrappedComponent {...props}/></PaReduxProvider>