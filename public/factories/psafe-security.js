/*
 * Psafe app - Factory to store visualizations handlers
 *
 * Copyright (C) 2015-2022 Psafe, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

import { PaSecurityXpack } from '../react-services/pa-security-xpack';
import { PaSecurityOpendistro } from '../react-services/pa-security-opendistro';
import { PSAFE_SECURITY_PLUGIN_XPACK_SECURITY, PSAFE_SECURITY_PLUGIN_OPEN_DISTRO_FOR_ELASTICSEARCH } from '../../common/constants';
import store from '../redux/store';


export class PsafeSecurity {
  /**
   * Class constructor
   */
  constructor() {
    if (!!PsafeSecurity.instance) {
      return PsafeSecurity.instance;
    }
    const platform = store.getState().appStateReducers.currentPlatform;
    if(platform === PSAFE_SECURITY_PLUGIN_XPACK_SECURITY){
      this.security = PaSecurityXpack;
    }else if(platform === PSAFE_SECURITY_PLUGIN_OPEN_DISTRO_FOR_ELASTICSEARCH){
     this.security =  PaSecurityOpendistro;
    }else{
      this.security = false;
    }

    PsafeSecurity.instance = this;
    return this;
  }

}
