import type { CustomActorTrait } from 'src/api/config/actor-traits/types';
import type { RegisteredCustomActorTrait, CustomTraitEnabledParams } from '../types';
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
      content: t.content,
      pills: t.pills
    }));

    CustomActorTraitsRuntime._traits.push(...registeredTraits);
  }

  static getEnabledTraits(params: CustomTraitEnabledParams) {
    return this._traits.filter((t) => {
      try {
        return t.enabled?.(params) ?? true;
      } catch (e) {
        error(
          'An error occurred while determining if a custom actor trait is enabled.',
          false,
          e
        );
        debug('Custom actor trait enabled error details', {
          params,
          trait: t,
        });
        return false;
      }
    });
  }
}
