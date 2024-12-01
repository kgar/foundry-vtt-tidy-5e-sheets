import type { SvelteComponent, mount } from 'svelte';
import AssignSpellsToSourceClasses from './SpellSourceClassAssignments.svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import type { Actor5e } from 'src/types/types';
import { writable, type Writable } from 'svelte/store';
import type { Item5e } from 'src/types/item.types';
import { CONSTANTS } from 'src/constants';
import { StoreSubscriptionsService } from 'src/features/store/StoreSubscriptionsService';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type SpellSourceClassAssignment = {
  /**
   * The spell to receive an assignment.
   */
  item: Item5e;
  /**
   * Represents the chosen source class.
   */
  sourceClass: string;
};

export type SpellSourceClassAssignmentsContext = {
  actor: Actor5e;
  assignments: SpellSourceClassAssignment[];
};

export default class SpellSourceClassAssignmentsFormApplication extends SvelteFormApplicationBase {
  context: Writable<SpellSourceClassAssignmentsContext> = writable();
  actor: Actor5e;
  subscriptionsService: StoreSubscriptionsService;
  updateHook: number | undefined;

  constructor(actor: Actor5e, ...args: any[]) {
    super(...args);
    this.actor = actor;
    this.subscriptionsService = new StoreSubscriptionsService();
  }

  createComponent(node: HTMLElement): SvelteComponent {
    this.context.set(this.getData());

    return mount(AssignSpellsToSourceClasses, {
      target: node,
      context: new Map<any, any>([
        ['appId', this.appId],
        ['context', this.context],
      ]),
    });
  }

  getData(): SpellSourceClassAssignmentsContext {
    return {
      actor: this.actor,
      assignments: this.actor.items
        .filter((item: Item5e) => item.type === CONSTANTS.ITEM_TYPE_SPELL)
        .map((item: Item5e) => ({
          item,
          sourceClass: 'test',
        })),
    };
  }

  activateListeners(html: any): void {
    if (this.updateHook !== undefined) {
      Hooks.off('updateItem', this.updateHook);
    }
    this.trackActorChanges();
    super.activateListeners(html);
  }

  private trackActorChanges() {
    this.updateHook = Hooks.on('updateItem', (item: Item5e) => {
      if (item.actor?.id !== this.actor.id) {
        return;
      }

      this.context.set(this.getData());
    });
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.Utilities.AssignSpellsToClasses');
  }

  close(options: unknown = {}) {
    Hooks.off('updateItem', this.updateHook);
    return super.close(options);
  }
}
