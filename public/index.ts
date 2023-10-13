import { PluginInitializer, PluginInitializerContext } from 'kibana/public';
import { PsafePlugin } from './plugin';
import { PsafeSetup, PsafeSetupPlugins, PsafeStart, PsafeStartPlugins } from './types';

export const plugin: PluginInitializer<PsafeSetup, PsafeStart, PsafeSetupPlugins, PsafeStartPlugins> = (
  initializerContext: PluginInitializerContext
) => {
  return new PsafePlugin(initializerContext);
};

// These are your public types & static code
export { PsafeSetup, PsafeStart };
