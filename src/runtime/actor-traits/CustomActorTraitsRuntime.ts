import type { CustomActorTrait } from 'src/api/config/actor-traits/types';
import type { RegisteredCustomActorTrait } from '../types';
import { debug, error } from 'src/utils/logging';

export class CustomActorTraitsRuntime {
  protected static _traits: RegisteredCustomActorTrait[] = [];

  static registerCustomActorTraits(traits: CustomActorTrait[]) {
    const registeredTraits = traits.map<RegisteredCustomActorTrait>((t) => ({
      title: t.title,
      iconClass: t.iconClass,
      alwaysShow: t.alwaysShow,
      openConfiguration: t.openConfiguration,
      openConfigurationTooltip: t.openConfigurationTooltip,
      enabled: t.enabled,
    }));

    CustomActorTraitsRuntime._traits.push(...registeredTraits);
  }

  static getEnabledTraits(context: any) {
    return this._traits.filter((t) => {
      try {
        return t.enabled?.({ context }) ?? true;
      } catch (e) {
        error(
          'An error occurred while determining if a custom actor trait is enabled.',
          false,
          e
        );
        debug('Custom actor trait enabled error details', {
          context,
          trait: t,
        });
        return false;
      }
    });
  }
}
