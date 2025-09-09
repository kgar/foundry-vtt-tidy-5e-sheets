import { CONSTANTS } from 'src/constants';
import { Tidy5eActorSheetQuadroneBase } from './Tidy5eActorSheetQuadroneBase.svelte';
import type {
  Actor5e,
  ActorInventoryTypes,
  ActorSheetQuadroneContext,
  MultiActorQuadroneContext,
} from 'src/types/types';
import type {
  ApplicationClosingOptions,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { Inventory } from 'src/features/sections/Inventory';
import type { CurrencyContext, Item5e } from 'src/types/item.types';
import { Container } from 'src/features/containers/Container';
import { SheetSections } from 'src/features/sections/SheetSections';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { TidyFlags } from 'src/api';
import type { Group5eMember as MultiActor5eMember } from 'src/types/group.types';
import type { DropEffectValue } from 'src/mixins/DragAndDropBaseMixin';

export function Tidy5eMultiActorSheetQuadroneBase<
  TContext extends MultiActorQuadroneContext<any>
>(sheetType: string) {
  const TidyActorSheetBase = Tidy5eActorSheetQuadroneBase<TContext>(sheetType);

  abstract class Tidy5eMultiActorSheetQuadroneBase extends TidyActorSheetBase {
    async _prepareContext(
      options: ApplicationRenderOptions
    ): Promise<MultiActorQuadroneContext<Tidy5eMultiActorSheetQuadroneBase>> {
      const actorContext = (await super._prepareContext(
        options
      )) as ActorSheetQuadroneContext;

      const currencies: CurrencyContext[] = [];
      Object.keys(CONFIG.DND5E.currencies).forEach((key) =>
        currencies.push({
          key: key,
          value: this.actor.system.currency[key] as number,
          abbr:
            CONFIG.DND5E.currencies[key as keyof typeof CONFIG.DND5E.currencies]
              ?.abbreviation ?? key,
        })
      );

      const context = {
        containerPanelItems: await Inventory.getContainerPanelItems(
          actorContext.items
        ),
        currencies,
        inventory: [],
        showContainerPanel:
          TidyFlags.showContainerPanel.get(this.actor) == true,
        ...actorContext,
      };

      for (const panelItem of context.containerPanelItems) {
        const ctx = context.itemContext[panelItem.container.id];
        ctx.containerContents = await Container.getContainerContents(
          panelItem.container,
          {
            hasActor: true,
            unlocked: actorContext.unlocked,
          }
        );
      }

      return context;
    }

    _prepareItems(context: TContext) {
      const inventoryRowActions = TableRowActionsRuntime.getInventoryRowActions(
        context,
        { hasActionsTab: false, canEquip: false }
      );

      const inventory: ActorInventoryTypes =
        Inventory.getDefaultInventorySections({
          rowActions: inventoryRowActions,
        });

      let inventoryItems = Array.from(this.actor.items).reduce(
        (inventoryItems: Item5e[], item: Item5e) => {
          const ctx = (context.itemContext[item.id] ??= {});

          // Individual item preparation
          this._prepareItem(item, ctx);

          const isWithinContainer = this.actor.items.has(item.system.container);

          if (!isWithinContainer && Inventory.isItemInventoryType(item)) {
            inventoryItems.push(item);
          }

          return inventoryItems;
        },
        [] as Item5e[]
      );

      const inventoryTypes = Inventory.getInventoryTypes();
      // Organize items
      // Section the items by type
      for (let item of inventoryItems) {
        const ctx = (context.itemContext[item.id] ??= {});
        ctx.totalWeight = item.system.totalWeight?.toNearest(0.1);
        Inventory.applyInventoryItemToSection(inventory, item, inventoryTypes, {
          canCreate: true,
          rowActions: inventoryRowActions,
        });
      }

      SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
        context.actor,
        CONSTANTS.TAB_ACTOR_INVENTORY
      ).forEach((s) => {
        inventory[s] ??= Inventory.createInventorySection(s, inventoryTypes, {
          canCreate: true,
          rowActions: inventoryRowActions,
        });
      });

      context.inventory = Object.values(inventory);
    }

    protected _prepareItem(item: Item5e, ctx: TContext) {}

    /* -------------------------------------------- */
    /*  Drag and Drop                               */
    /* -------------------------------------------- */

    _onDragStart(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
    ): void {
      const memberId = event.currentTarget
        .closest('[data-tidy-draggable][data-member-id]')
        ?.getAttribute('data-member-id');

      if (!memberId) {
        super._onDragStart(event);
        return;
      }

      const actor = this.#findMemberActor(memberId);

      if (!actor) {
        return;
      }

      const dragData = actor.toDragData();
      dragData['groupId'] = this.actor.id;
      event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
    }

    async _onDropActiveEffect(
      ..._args: any[]
    ): Promise</*ActiveEffect*/ unknown | boolean> {
      // Tidy Multi-Actor Sheets do not support active effect drops.
      return false;
    }

    async _onDropActor(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      data: Actor5e
    ): Promise<object | boolean | undefined> {
      if (!this.isEditable) {
        return false;
      }

      const cls = getDocumentClass(CONSTANTS.DOCUMENT_NAME_ACTOR);
      const sourceActor = await cls.fromDropData(data);
      if (!sourceActor) {
        return;
      }

      const dragEventData =
        foundry.applications.ux.TextEditor.getDragEventData(event);
      const groupId = dragEventData['groupId'];

      if (groupId !== this.actor.id) {
        return this.actor.system.addMember(sourceActor);
      }

      const dropTarget = event.target?.closest<HTMLElement>(
        '[data-tidy-draggable][data-member-id]'
      );
      const targetMemberId = dropTarget?.getAttribute('data-member-id');

      const targetMemberActor = this.#findMemberActor(targetMemberId);

      if (
        !dropTarget ||
        !targetMemberActor ||
        targetMemberId === sourceActor.id
      ) {
        return false;
      }

      return await this._onSortMember(sourceActor, targetMemberActor);
    }

    #findMemberActor(actorId: string | null | undefined): Actor5e | undefined {
      return this.actor.system.members.find(
        (m: MultiActor5eMember) => m.actor.id === actorId
      )?.actor;
    }

    async _onSortMember(sourceActor: Actor5e, targetActor: Actor5e) {
      const membersCollection: MultiActor5eMember[] =
        this.actor.system.toObject().members;
      const sourceIndex = membersCollection.findIndex(
        (m) => m.actor === sourceActor.id
      );
      const targetIndex = membersCollection.findIndex(
        (m) => m.actor === targetActor.id
      );

      const sortBefore = sourceIndex > targetIndex;

      if (sortBefore) {
        const sourceMember = membersCollection.splice(sourceIndex, 1)[0];
        membersCollection.splice(targetIndex, 0, sourceMember);
      } else {
        const sourceMember = membersCollection[sourceIndex];
        membersCollection.splice(targetIndex + 1, 0, sourceMember);
        membersCollection.splice(sourceIndex, 1);
      }

      return await this.actor.update({ 'system.members': membersCollection });
    }

    async _onDropFolder(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      data: Record<string, any>
    ) {
      if (!this.isEditable) {
        return false;
      }

      const folder = await Folder.implementation.fromDropData(data);

      if (folder.type === CONSTANTS.DOCUMENT_NAME_ACTOR) {
        const results: any[] = [];
        for (let actor of folder.contents) {
          results.push(await this.actor.system.addMember(actor));
        }
        return results;
      }

      return await super._onDropFolder(event, data);
    }

    /** @inheritDoc */
    async _onDropItem(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      item: Item5e
    ) {
      const { uuid } =
        event.target.closest<HTMLElement>('[data-uuid]')?.dataset ?? {};
      const target = await fromUuid(uuid);
      if (target instanceof foundry.documents.Actor)
        return target.sheet._onDropCreateItems(event, [item]);
      return super._onDropItem(event, item);
    }

    /** @inheritDoc */
    async _onDropCreateItems(
      event: DragEvent,
      items: Item5e[],
      behavior?: DropEffectValue | null
    ) {
      let foundNonPhysical = false;
      items = items.filter((item) => {
        if (
          !item.system.constructor._schemaTemplates?.includes(
            dnd5e.dataModels.item.PhysicalItemTemplate
          )
        ) {
          foundNonPhysical = true;
          return false;
        }
        return true;
      });
      if (foundNonPhysical)
        ui.notifications.warn('DND5E.Group.Warning.PhysicalItemOnly', {
          localize: true,
        });
      return super._onDropCreateItems(event, items, behavior);
    }

    /* -------------------------------------------- */
    /*  Life-Cycle Handlers                         */
    /* -------------------------------------------- */

    async _renderHTML(context: TContext, options: ApplicationRenderOptions) {
      game.user.apps[this.id] = this;
      for (const member of this.actor.system.members) {
        member.actor.apps[this.id] = this;
      }
      return await super._renderHTML(context, options);
    }

    async close(options: ApplicationClosingOptions = {}) {
      delete game.user.apps[this.id];
      for (const member of this.actor.system.members) {
        delete member.actor.apps[this.id];
      }
      return await super.close(options);
    }
  }

  return Tidy5eMultiActorSheetQuadroneBase;
}
