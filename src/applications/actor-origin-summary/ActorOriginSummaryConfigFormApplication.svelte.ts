import { mount } from 'svelte';
import ActorOriginSummaryConfig from './ActorOriginSummaryConfig.svelte';
import type { Actor5e } from 'src/types/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CONSTANTS } from 'src/constants';
import { error } from 'src/utils/logging';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';

export type ActorOriginSummaryContext = {
  isCharacter: boolean;
  race: string;
  canEditBackground: boolean;
  background: boolean;
  alignment: string;
  isNpc: boolean;
  environment: string;
  isVehicle: boolean;
  dimensions: string;
};

export default class ActorOriginSummaryConfigFormApplication extends SvelteFormApplicationBase {
  context = $state<ActorOriginSummaryContext>();
  actor: Actor5e;
  actorHook: number | undefined;

  constructor(actor: Actor5e, ...args: any[]) {
    super(...args);
    this.actor = actor;
  }

  createComponent(node: HTMLElement): Record<string, any> {
    this.context = this.getData();

    return mount(ActorOriginSummaryConfig, {
      target: node,
      context: new Map<any, any>([
        ['appId', this.appId],
        ['context', this.context],
      ]),
    });
  }

  activateListeners(html: any): void {
    this.refreshContextOnActorChanges();
    super.activateListeners(html);
  }

  refreshContextOnActorChanges() {
    if (this.actorHook !== undefined) {
      return;
    }

    this.actorHook = Hooks.on('updateActor', (actor: Actor5e) => {
      if (actor.id === this.actor.id) {
        this.refreshContext();
      }
    });
  }

  getData() {
    return {
      race:
        this.actor.system.details.race?.name ?? this.actor.system.details.race,
      background:
        this.actor.system.details.background?.name ??
        this.actor.system.details.background,
      environment: this.actor.system.details.environment,
      alignment: this.actor.system.details.alignment,
      dimensions: this.actor.system.traits.dimensions,

      isCharacter: this.actor.type === CONSTANTS.SHEET_TYPE_CHARACTER,
      canEditBackground: !this.actor.system.details.background?.name,
      isNpc: this.actor.type === CONSTANTS.SHEET_TYPE_NPC,
      isVehicle: this.actor.type === CONSTANTS.SHEET_TYPE_VEHICLE,
    } satisfies ActorOriginSummaryContext;
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      width: 380,
      height: 'auto',
      sheetConfig: false,
      resizable: false,
    });
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.OriginSummaryConfig', {
      actorName: this.actor.name,
    });
  }

  refreshContext() {
    this.context = this.getData();
  }

  close(options?: unknown) {
    Hooks.off('updateActor', this.actorHook);
    this.actorHook = undefined;
    super.close(options);
  }

  async save() {
    if (!this.context) {
      error('Unable to save data due to an error.', true);
      console.error(
        'Unable to save Actor Origin Summary Config because the context is unexpectedly null.',
        this.actor,
        this.context
      );
      return;
    }

    if (this.context.isCharacter) {
      const update: Record<string, any> = {
        'system.details.alignment': this.context.alignment,
      };
      if (this.context.canEditBackground) {
        update['system.details.background'] = this.context.background;
      }
      await this.actor.update(update);
    } else if (this.context.isNpc) {
      await this.actor.update({
        'system.details.environment': this.context.environment,
        'system.details.alignment': this.context.alignment,
      });
    } else if (this.context.isVehicle) {
      await this.actor.update({
        'system.traits.dimensions': this.context.dimensions,
      });
    }
    this.close();
  }

  async _updateObject(): Promise<void> {
    await this.save();
  }
}
