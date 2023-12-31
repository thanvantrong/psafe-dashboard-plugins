/*
 * Psafe app - React component for show search and filter
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
import { EuiBadge } from '@elastic/eui';
import { GroupingComponents } from '../../../common/util';
import './pa-search-badges.scss';
export const PA_SEARCH_BADGE_NAME = 'pa-search-badge';

const buttonLabel = (count) => `+${count} filters`;

export function PaSearchBadges({ filters, onFiltersChange }) {
  const removeFilter = (key) => {
    const newFilters = [...filters];
    newFilters.splice(key, 1);
    onFiltersChange(newFilters);
  };
  const badges = filters.map((filter, key) => badge({ filter, key, removeFilter }));
  const gruopingBadges = GroupingComponents({ children: badges, buttonLabel });
  return gruopingBadges;
}

function badge({ filter, key, removeFilter }) {
  return (
    <EuiBadge
      key={key}
      data-testid={`${PA_SEARCH_BADGE_NAME}-${key}`}
      className={`${PA_SEARCH_BADGE_NAME}`}
      color="hollow"
      iconType="cross"
      iconSide="right"
      onFocus={(e) => e.stopPropagation()}
      iconOnClick={() => removeFilter(key)}
      iconOnClickAriaLabel={'Remove filter'}
    >
      {filter.field !== 'q' ? `${filter.field}:` : ''} {filter.value}
    </EuiBadge>
  );
}
