/*
 * Psafe app - Module for ui logging functions
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { BaseLogger } from './base-logger';
import {
  PSAFE_UI_LOGS_PLAIN_FILENAME,
  PSAFE_UI_LOGS_RAW_FILENAME
} from '../../common/constants';

export default new BaseLogger(PSAFE_UI_LOGS_PLAIN_FILENAME,PSAFE_UI_LOGS_RAW_FILENAME);
