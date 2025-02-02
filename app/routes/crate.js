import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CrateRoute extends Route {
  @service headData;
  @service router;
  @service store;

  async model(params, transition) {
    let crateName = params.crate_id;

    try {
      return await this.store.find('crate', crateName);
    } catch (error) {
      if (error.errors?.some(e => e.detail === 'Not Found')) {
        let title = `${crateName}: Crate not found`;
        this.router.replaceWith('catch-all', { transition, error, title });
      } else {
        let title = `${crateName}: Failed to load crate data`;
        this.router.replaceWith('catch-all', { transition, error, title, tryAgain: true });
      }
    }
  }

  setupController(controller, model) {
    super.setupController(...arguments);
    this.headData.crate = model;
  }

  resetController() {
    super.resetController(...arguments);
    this.headData.crate = null;
  }
}
