import { CONSTANTS } from 'src/constants';
import type { UserPreferences } from './user-preferences.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

class UserPreferencesService {
  async setPreference<
    K extends keyof UserPreferences,
    V extends UserPreferences[K]
  >(property: K, value: V) {
    await game.user.setFlag(
      CONSTANTS.MODULE_ID,
      `userPreferences.${property}`,
      value
    );
  }

  get(): UserPreferences {
    return {
      expandCollapseBehavior: 'top-level',

      ...FoundryAdapter.getProperty<UserPreferences>(game.user, this.getProp()),
    };
  }

  getProp(): string {
    return `flags.${CONSTANTS.MODULE_ID}.userPreferences`;
  }
}

export default new UserPreferencesService();
