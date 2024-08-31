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

type MemberStats = {
  currentHP: number;
  maxHP: number;
  memberCount: number;
  vehicleCount: number;
};

export class Tidy5eGroupSheet extends SvelteApplicationMixin<GroupSheetClassicContext>(
  foundry.applications.sheets.ActorSheetV2
) {
  #dragDrop;

  constructor(...args: any[]) {
    super(...args);

    this.supportedItemTypes = new Set(Inventory.getDefaultInventoryTypes());
    this.#dragDrop = this.#createDragDropHandlers();
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
        id: CONSTANTS.TAB_GROUP_INVENTORY,
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

  /**
   * A set of item types that should be allow to be dropped on this type of actor sheet.
   * @type {Set<string>}
   */
  supportedItemTypes: Set<string>;

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

  /**
   * Create drag-and-drop workflow handlers for this Application
   * @returns {DragDrop[]}     An array of DragDrop handlers
   * @private
   */
  #createDragDropHandlers(): DragDrop[] {
    const options: (typeof Tidy5eGroupSheet)['DEFAULT_OPTIONS'] = this.options;
    return Array.isArray(options.dragDrop)
      ? options.dragDrop.map((d) => {
          d.permissions = {
            dragstart: this._canDragStart.bind(this),
            drop: this._canDragDrop.bind(this),
          };
          d.callbacks = {
            dragstart: this._onDragStart.bind(this),
            dragover: this._onDragOver.bind(this),
            drop: this._onDrop.bind(this),
          };
          return new DragDrop(d);
        })
      : [];
  }

  /** @inheritdoc */
  _canDragStart(selector: string) {
    return this.isEditable;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _canDragDrop(selector: string) {
    return this.isEditable;
  }

  _onDragStart(event: DragEvent) {}

  _onDragOver(event: DragEvent) {}

  async _onDrop(event: DragEvent) {
    const data = TextEditor.getDragEventData(event);
    const actor = this.actor;
    // TODO: Extract hook call
    const allowed = Hooks.call('dropActorSheetData', actor, this, data);
    if (allowed === false) return;

    // Handle different data types
    switch (data.type) {
      case 'ActiveEffect':
        return this._onDropActiveEffect(event, data);
      case 'Actor':
        return this._onDropActor(event, data);
      case 'Item':
        return this._onDropItem(event, data);
      case 'Folder':
        return this._onDropFolder(event, data);
    }
  }

  /**
   * Handle the dropping of ActiveEffect data onto an Actor Sheet
   * @param {DragEvent} event                  The concluding DragEvent which contains drop data
   * @param {object} data                      The data transfer extracted from the event
   * @returns {Promise<ActiveEffect|boolean>}  The created ActiveEffect object or false if it couldn't be created.
   * @protected
   */
  async _onDropActiveEffect(
    event: DragEvent,
    data: Record<string, any>
  ): Promise</*ActiveEffect*/ unknown | boolean> {
    // TODO: Make Active Effect handling target only PCs, NPCs, and Vehicles.
    // const effect = await ActiveEffect.implementation.fromDropData(data);
    // if ( effect?.target === this.actor ) return false;
    // const effect = await ActiveEffect.implementation.fromDropData(data);
    // if ( !this.actor.isOwner || !effect ) return false;
    // if ( effect.target === this.actor ) return false;
    // return ActiveEffect.create(effect.toObject(), {parent: this.actor});

    return false;
  }

  // Keep on Group sheet and pull the base-sheet / Foundry-base impl for the Actor-specific dnd base class
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
    if (!this.actor.isOwner) return [];
    const folder = await Folder.implementation.fromDropData(data);
    if (folder.type !== 'Item') return [];
    const droppedItemData = await Promise.all(
      folder.contents.map(async (item: Record<string, any>) => {
        if (!(item instanceof Item)) item = await fromUuid(item.uuid);
        return item;
      })
    );
    return this._onDropItemCreate(droppedItemData);
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
    const toCreate = await Item5e.createWithContents(items, {
      transformFirst: (item: Item5e) => this._onDropSingleItem(item.toObject()),
    });
    return Item5e.createDocuments(toCreate, {
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
    const isSupportedItem = this.supportedItemTypes.has(itemData.type);
    if (!isSupportedItem) {
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
    if (itemData.type === 'spell') {
      const scroll = await Item5e.createScrollFromSpell(itemData);
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

  /**
   * Returns an array of DragDrop instances
   * @type {DragDrop[]}
   */
  get dragDrop() {
    return this.#dragDrop;
  }

  _onRender(
    context: GroupSheetClassicContext,
    options: Partial<ApplicationConfiguration>
  ) {
    this.#dragDrop.forEach((d) => d.bind(this.element));
    super._onRender(context, options);
  }
}
