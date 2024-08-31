import { CONSTANTS } from 'src/constants';
import {
  SvelteApplicationMixin,
  type ApplicationClosingOptions,
  type ApplicationConfiguration,
  type ApplicationRenderOptions,
} from '../mixins/SvelteApplicationMixin';
import type { SvelteComponent } from 'svelte';
import GroupSheet from './group/GroupSheet.svelte';
import type { Tab } from 'src/types/types';
import GroupMembersTab from './group/tabs/GroupMembersTab.svelte';
import GroupInventoryTab from './group/tabs/GroupInventoryTab.svelte';
import GroupDescriptionTab from './group/tabs/GroupDescriptionTab.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  Group5eXp,
  GroupMemberSection,
  GroupSheetClassicContext,
} from 'src/types/group.types';
import { Inventory } from 'src/features/sections/Inventory';
import { SettingsProvider } from 'src/settings/settings';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';
import { getPercentage } from 'src/utils/numbers';
import type { Item5e } from 'src/types/item.types';
import { Mixins } from 'src/mixins/Mixins';
import { ActorBaseDragAndDropMixin } from 'src/mixins/ActorBaseDragAndDropMixin';

type MemberStats = {
  currentHP: number;
  maxHP: number;
  memberCount: number;
  vehicleCount: number;
};

export class Tidy5eGroupSheet extends Mixins.combineMixins(
  foundry.applications.sheets.ActorSheetV2,
  SvelteApplicationMixin<GroupSheetClassicContext>,
  ActorBaseDragAndDropMixin
) {
  constructor(...args: any[]) {
    super(...args);

    this._supportedItemTypes = new Set(Inventory.getDefaultInventoryTypes());
    this._supportedItemTypes.add(CONSTANTS.ITEM_TYPE_SPELL);
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    dragDrop: [{ dragSelector: '[data-drag]' }],
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'actor',
      CONSTANTS.SHEET_TYPE_GROUP,
      'app-v2',
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
    ],
    tag: 'form',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
    },
    position: {
      width: 600,
      height: 700,
    },
  };

  // TODO: First render, derive options that come from user preference

  _createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new GroupSheet({
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._store],
      ]),
    });
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<GroupSheetClassicContext> {
    const tabs: Tab[] = [
      {
        content: {
          type: 'svelte',
          component: GroupMembersTab,
        },
        id: CONSTANTS.TAB_GROUP_MEMBERS,
        title: FoundryAdapter.localize('DND5E.Group.Member.other'),
      },
      {
        content: {
          type: 'svelte',
          component: GroupInventoryTab,
        },
        id: CONSTANTS.TAB_ACTOR_INVENTORY,
        title: FoundryAdapter.localize('DND5E.Inventory'),
      },
      {
        content: {
          type: 'svelte',
          component: GroupDescriptionTab,
        },
        id: CONSTANTS.TAB_GROUP_DESCRIPTION,
        title: FoundryAdapter.localize('DND5E.Description'),
      },
    ];

    let xp: Group5eXp | undefined = undefined;
    if (!game.settings.get('dnd5e', 'disableExperienceTracking')) {
      xp = this.actor.system.details.xp;
    }

    const descriptionFullEnrichedHtml = await TextEditor.enrichHTML(
      this.actor.system.description.full,
      {
        secrets: this.actor.isOwner,
        rollData: this.actor.getRollData(),
        async: true,
        relativeTo: this.actor,
      }
    );

    const { sections: memberSections, stats } = this.#prepareMembers();

    const inventorySections = Inventory.getDefaultInventorySections();
    const inventory = Object.values(inventorySections);

    const source = this.actor.toObject();

    const unlocked =
      FoundryAdapter.isActorSheetUnlocked(this.actor) && this.isEditable;

    const editable = this.isEditable;

    return {
      actorPortraitCommands:
        ActorPortraitRuntime.getEnabledPortraitMenuCommands(this.actor),
      tabs: tabs,
      actor: this.actor,
      system: this.actor.system,
      items: Array.from(this.actor.items),
      config: CONFIG.DND5E,
      isGM: game.user.isGM,
      xp: xp,
      healthPercentage: getPercentage(stats.currentHP, stats.maxHP),
      descriptionFullEnrichedHtml: descriptionFullEnrichedHtml,
      memberSections: memberSections,
      currentHP: stats.currentHP,
      document: this.actor.document,
      editable: editable,
      effects: dnd5e.applications.components.EffectsElement.prepareCategories(
        this.actor.allApplicableEffects()
      ),
      inventory: inventory,
      limited: this.actor.limited,
      lockSensitiveFields:
        (!unlocked && SettingsProvider.settings.useTotalSheetLock.get()) ||
        !editable,
      maxHP: stats.maxHP,
      owner: this.actor.isOwner,
      summary: 'TODO: Implement',
      unlocked: unlocked,
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
      ].includes(SettingsProvider.settings.useCircularPortraitStyle.get()),
      utilities: {},
      source: source,
    };
  }

  #prepareMembers(): {
    sections: GroupMemberSection[];
    stats: MemberStats;
  } {
    const stats: MemberStats = {
      currentHP: 0,
      maxHP: 0,
      memberCount: 0,
      vehicleCount: 0,
    };

    const sections: Record<string, GroupMemberSection> = {
      character: {
        label: `${CONFIG.Actor.typeLabels.character}Pl`,
        members: [],
        dataset: {},
        key: 'character',
        show: true,
        custom: undefined,
        isExternal: false,
      },
      npc: {
        label: `${CONFIG.Actor.typeLabels.npc}Pl`,
        members: [],
        dataset: {},
        key: 'npc',
        show: true,
        custom: undefined,
        isExternal: false,
      },
      vehicle: {
        label: `${CONFIG.Actor.typeLabels.vehicle}Pl`,
        members: [],
        dataset: {},
        key: 'vehicle',
        show: true,
        custom: undefined,
        isExternal: false,
      },
    };

    const type = this.actor.system.type.value;

    for (const [index, memberData] of this.actor.system.members.entries()) {
      const member = memberData.actor;
      const hp = member.system.attributes.hp;
      const multiplier =
        type === 'encounter' ? memberData.quantity.value ?? 1 : 1;

      const memberCurrentHp = hp.value + (hp.temp || 0);
      const memberMaxHp = Math.max(0, hp.effectiveMax);

      stats.currentHP += memberCurrentHp * multiplier;
      stats.maxHP += memberMaxHp * multiplier;

      // TODO: CR

      if (member.type === 'vehicle') {
        stats.vehicleCount += multiplier;
      } else {
        stats.memberCount += multiplier;
      }

      sections[member.type].members.push({
        actor: member,
      });
    }

    // Apply any section config stuff here?

    return {
      sections: Object.values(sections),
      stats: stats,
    };
  }

  // TODO: Confirm whether this is being called. Is the mixin overriding this or augmenting it?
  async _renderHTML(
    context: GroupSheetClassicContext,
    options: ApplicationRenderOptions
  ) {
    for (const member of this.actor.system.members) {
      member.actor.apps[this.id] = this;
    }
    return await super._renderHTML(context, options);
  }

  async close(options: ApplicationClosingOptions = {}) {
    for (const member of this.actor.system.members) {
      delete member.actor.apps[this.id];
    }
    return await super.close(options);
  }

  async _onDropActiveEffect(
    ..._args: any[]
  ): Promise</*ActiveEffect*/ unknown | boolean> {
    // Tidy Group Sheet doesn't support active effect drops.
    return false;
  }

  /**
   * Handle dropping of an Actor data onto another Actor sheet
   * @param {DragEvent} event            The concluding DragEvent which contains drop data
   * @param {object} data                The data transfer extracted from the event
   * @returns {Promise<object|boolean|undefined>}  A data object which describes the result of the drop, or false if the drop was
   *                                     not permitted.
   * @protected
   */
  async _onDropActor(
    _event: DragEvent,
    data: any
  ): Promise<object | boolean | undefined> {
    if (!this.isEditable || !FoundryAdapter.isActorSheetUnlocked(this.actor)) {
      return false;
    }

    const cls = getDocumentClass('Actor');
    const sourceActor = await cls.fromDropData(data);
    if (!sourceActor) {
      return;
    }

    return this.actor.system.addMember(sourceActor);
  }

  // Keep on Group sheet and pull the base-sheet / Foundry-base impl for the Actor-specific dnd base class
  /** @override */
  async _onDropItem(event: DragEvent, data: unknown) {
    if (!this.actor.isOwner) return false;
    const item = await Item.implementation.fromDropData(data);

    // Handle moving out of container & item sorting
    if (this.actor.uuid === item.parent?.uuid) {
      if (item.system.container !== null)
        await item.update({ 'system.container': null });
      return FoundryAdapter.onSortItemForActor(
        this.actor,
        event,
        item.toObject()
      );
    }

    return this._onDropItemCreate(item);
  }

  /* -------------------------------------------- */

  // Keep on Group sheet and pull the base-sheet / Foundry-base impl for the Actor-specific dnd base class
  /** @override */
  async _onDropFolder(event: DragEvent, data: Record<string, any>) {
    if (!this.isEditable || !FoundryAdapter.isActorSheetUnlocked(this.actor)) {
      return false;
    }

    const folder = await Folder.implementation.fromDropData(data);

    if (folder.type === 'Actor') {
      const results: any[] = [];
      for (let actor of folder.contents) {
        results.push(await this.actor.system.addMember(actor));
      }
      return results;
    }

    return await super._onDropFolder(event, data);
  }

  /* -------------------------------------------- */

  // Keep on Group sheet and pull the base-sheet / Foundry-base impl for the Actor-specific dnd base class
  /** @override */
  async _onDropItemCreate(
    itemData: Record<string, any> | Record<string, any>[]
  ) {
    let items = itemData instanceof Array ? itemData : [itemData];

    // Filter out items already in containers to avoid creating duplicates
    const containers = new Set(
      items.filter((i) => i.type === 'container').map((i) => i._id)
    );
    items = items.filter((i) => !containers.has(i.system.container));

    // Create the owned items & contents as normal
    const toCreate = await dnd5e.documents.Item5e.createWithContents(items, {
      transformFirst: (item: Item5e) => this._onDropSingleItem(item.toObject()),
    });
    return dnd5e.documents.Item5e.createDocuments(toCreate, {
      pack: this.actor.pack,
      parent: this.actor,
      keepId: true,
    });
  }

  /* -------------------------------------------- */

  // Keep on Group sheet and pull the base-sheet / Foundry-base impl for the Actor-specific dnd base class
  /**
   * Handles dropping of a single item onto this group sheet.
   * @param {object} itemData            The item data to create.
   * @returns {Promise<object|boolean>}  The item data to create after processing, or false if the item should not be
   *                                     created or creation has been otherwise handled.
   * @protected
   */
  async _onDropSingleItem(
    itemData: Record<string, any>
  ): Promise<object | boolean> {
    // Check to make sure items of this type are allowed on this actor
    const isSupportedItemType =
      this._supportedItemTypes.size === 0 ||
      this._supportedItemTypes.has(itemData.type);

    if (!isSupportedItemType) {
      ui.notifications.warn(
        game.i18n.format('DND5E.ActorWarningInvalidItem', {
          itemType: game.i18n.localize(CONFIG.Item.typeLabels[itemData.type]),
          actorType: game.i18n.localize(
            CONFIG.Actor.typeLabels[this.actor.type]
          ),
        })
      );
      return false;
    }

    // Create a Consumable spell scroll on the Inventory tab
    if (itemData.type === CONSTANTS.ITEM_TYPE_SPELL) {
      const scroll = await dnd5e.documents.Item5e.createScrollFromSpell(
        itemData
      );
      return scroll?.toObject?.();
    }

    // Stack identical consumables
    const stacked = await FoundryAdapter.onDropStackConsumablesForActor(
      this.actor,
      itemData
    );
    if (stacked) return false;

    return itemData;
  }
}
