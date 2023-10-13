import store from '../redux/store';
import { updatePsafeNotReadyYet } from '../redux/actions/appStateActions';
import { PaRequest } from '../react-services/pa-request';

export class CheckDaemonsStatus {
  constructor($rootScope, $timeout) {
    this.$rootScope = $rootScope;
    this.tries = 10;
    this.$timeout = $timeout;
    this.busy = false;
  }

  async makePing() {
    try {
      if (this.busy) return;

      this.busy = true;

      let isValid = false;
      while (this.tries--) {
        await this.$timeout(1200);
        const result = await PaRequest.apiReq('GET', '/ping', {});
        isValid = ((result || {}).data || {}).isValid;
        if (isValid) {
          const updateNotReadyYet = updatePsafeNotReadyYet(false);
          store.dispatch(updateNotReadyYet);

          this.$rootScope.psafeNotReadyYet = false;
          this.$rootScope.$applyAsync();
          break;
        }
      }

      if (!isValid) {
        throw new Error('Not recovered');
      }

      this.tries = 10;
    } catch (error) {
      this.tries = 10;

      const updateNotReadyYet = updatePsafeNotReadyYet(
        'Psafe could not be recovered.'
      );
      store.dispatch(updateNotReadyYet);

      this.$rootScope.psafeNotReadyYet = 'Psafe could not be recovered.';
      this.$rootScope.$applyAsync();
      throw error;
    }

    this.busy = false;
  }
}
