import { CustomActorTraitsRuntime } from 'src/runtime/actor-traits/CustomActorTraitsRuntime';
import type { CustomActorTrait } from './types';
import type { ContentRegistrationOptions } from 'src/api';

/** @category Configuration */
export class ActorTraitsApi {
  registerActorTraits(
    traits: CustomActorTrait[],
    options?: ContentRegistrationOptions
  ) {
    CustomActorTraitsRuntime.registerCustomActorTraits(traits);
  }

  registerActorTrait(
    traits: CustomActorTrait,
    options?: ContentRegistrationOptions
  ) {
    this.registerActorTraits([traits], options);
  }
}
