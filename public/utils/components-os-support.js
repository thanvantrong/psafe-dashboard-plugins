/*
 * Psafe app - Components compatibility operative system
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { PSAFE_AGENTS_OS_TYPE, PSAFE_MODULES_ID } from '../../common/constants';

export const UnsupportedComponents = {
  [PSAFE_AGENTS_OS_TYPE.LINUX]: [],
  [PSAFE_AGENTS_OS_TYPE.WINDOWS]: [PSAFE_MODULES_ID.AUDITING, PSAFE_MODULES_ID.DOCKER, PSAFE_MODULES_ID.OPEN_SCAP],
  [PSAFE_AGENTS_OS_TYPE.DARWIN]: [PSAFE_MODULES_ID.AUDITING, PSAFE_MODULES_ID.DOCKER, PSAFE_MODULES_ID.OPEN_SCAP],
  [PSAFE_AGENTS_OS_TYPE.SUNOS]: [PSAFE_MODULES_ID.VULNERABILITIES],
  [PSAFE_AGENTS_OS_TYPE.OTHERS]: [PSAFE_MODULES_ID.AUDITING, PSAFE_MODULES_ID.DOCKER, PSAFE_MODULES_ID.OPEN_SCAP, PSAFE_MODULES_ID.VULNERABILITIES]
};
