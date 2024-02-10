import { CustomActorTraitsRuntime } from 'src/runtime/actor-traits/CustomActorTraitsRuntime';
import type { CustomActorTrait } from './types';

/**
 * API functionality related to the Actor Traits section (languages, senses, tools, etc.) of the actor sheet.
 */
/** @category Configuration */
export class ActorTraitsApi {
  /**
   * Registers multiple custom traits to the actor traits section of the actor sheet.
   * @param traits traits to register
   *
   * @example Registering vehicle traits
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.config.actorTraits.registerActorTraits([
   *     {
   *       title: "Vehicle Customization Options",
   *       iconClass: "fa-solid fa-ferry",
   *       enabled: (params) => params.context.actor.type === "vehicle",
   *       openConfiguration: (params) => {
   *         // TODO: Open totally awesome config dialog for setting custom vehicle stuff.
   *       },
   *       openConfigurationTooltip: "Click to customize!",
   *     },
   *     {
   *       title: "Vehicle Tribble Manager",
   *       iconClass: "fa-solid fa-ghost",
   *       enabled: (params) => params.context.actor.type === "vehicle",
   *       openConfiguration: (params) => {
   *         // TODO: Open a hopeless manager dialog for dealing with a tribble infestation.
   *       },
   *       openConfigurationTooltip: "Click to manage the unmanageable tribble problem 😰",
   *       alwaysShow: true,
   *     },
   *   ]);
   * });
   * ```
   */
  registerActorTraits(traits: CustomActorTrait[]) {
    CustomActorTraitsRuntime.registerCustomActorTraits(traits);
  }

  /**
   * Registers a custom actor trait to the actor traits section of the actor sheet.
   * @param trait the trait to register
   *
   * @example Registering an actor trait
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.config.actorTraits.registerActorTrait({
   *     title: "Configure My Module",
   *     iconClass: "fa-solid fa-spaghetti-monster-flying",
   *     enabled: (params) =>
   *       ["character", "npc"].includes(params.context.actor.type),
   *     openConfiguration: (params) => {
   *       // TODO: For example, open another form to input some data.
   *     },
   *     openConfigurationTooltip: "Click to configure my module",
   *   });
   * });
   * ```
   *
   * @remarks
   * The actor traits section is a good place to put a configuration button for opening another dialog for a custom module.
   */
  registerActorTrait(trait: CustomActorTrait) {
    this.registerActorTraits([trait]);
  }
}
