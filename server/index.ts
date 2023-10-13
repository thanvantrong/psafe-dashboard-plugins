import { PluginInitializerContext } from 'kibana/server';

import { PsafePlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, plugin platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new PsafePlugin(initializerContext);
}

export { PsafePluginSetup, PsafePluginStart } from './types';
