import { CONSTANTS } from 'src/constants';
import {
  SvelteApplicationMixin,
  type ApplicationClosingOptions,
  type ApplicationConfiguration,
  type ApplicationRenderOptions,
} from '../mixins/SvelteApplicationMixin';
import type { SvelteComponent } from 'svelte';
import GroupSheet from './group/GroupSheet.svelte';
import type { Tab, Utilities } from 'src/types/types';
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
import { ActorBaseDragAndDropMixin } from 'src/mixins/ActorBaseDragAndDropMixin';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';

type MemberStats = {
  currentHP: number;
  maxHP: number;
  memberCount: number;
  vehicleCount: number;
};

export class Tidy5eGroupSheet extends ActorBaseDragAndDropMixin(
  SvelteApplicationMixin<GroupSheetClassicContext>(
    foundry.applications.sheets.ActorSheetV2
  )
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

    const summary = this.#getSummary(stats);

    const movement = this.#prepareMovementSpeed();

    const sheetPreferences = SheetPreferencesService.getByType(this.actor.type);

    const membersSortMode =
      sheetPreferences.tabs?.[CONSTANTS.TAB_GROUP_MEMBERS]?.sort ?? 'm';

    const utilities: Utilities<GroupSheetClassicContext> = {
      [CONSTANTS.TAB_GROUP_MEMBERS]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_GROUP_MEMBERS,
                'sort',
                'm'
              );
            },
            visible: membersSortMode === 'a',
          },
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeManual'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_GROUP_MEMBERS,
                'sort',
                'a'
              );
            },
            visible: membersSortMode === 'm',
          },
        ],
      },
    };

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
      itemContext: {}, // TODO: Implement
      limited: this.actor.limited,
      lockSensitiveFields:
        (!unlocked && SettingsProvider.settings.useTotalSheetLock.get()) ||
        !editable,
      maxHP: stats.maxHP,
      movement: movement,
      owner: this.actor.isOwner,
      summary: summary,
      unlocked: unlocked,
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
      ].includes(SettingsProvider.settings.useCircularPortraitStyle.get()),
      utilities: utilities,
      source: source,
    };
  }

  #getSummary(stats: MemberStats) {
    const formatter = game.i18n.getListFormatter({
      style: 'long',
      type: 'conjunction',
    });
    const rule = new Intl.PluralRules(game.i18n.lang);
    const members = [];
    if (stats.memberCount) {
      members.push(
        `${stats.memberCount} ${game.i18n.localize(
          `DND5E.Group.Member.${rule.select(stats.memberCount)}`
        )}`
      );
    }
    if (stats.vehicleCount) {
      members.push(
        `${stats.vehicleCount} ${game.i18n.localize(
          `DND5E.Group.Vehicle.${rule.select(stats.vehicleCount)}`
        )}`
      );
    }
    if (!members.length) return game.i18n.localize('DND5E.GroupSummaryEmpty');
    return game.i18n.format('DND5E.GroupSummary', {
      members: formatter.format(members),
    });
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

  #prepareMovementSpeed() {
    const movement = this.actor.system.attributes.movement;
    let speeds = [
      [
        movement.land,
        `${game.i18n.localize('DND5E.MovementLand')} ${movement.land}`,
      ],
      [
        movement.water,
        `${game.i18n.localize('DND5E.MovementWater')} ${movement.water}`,
      ],
      [
        movement.air,
        `${game.i18n.localize('DND5E.MovementAir')} ${movement.air}`,
      ],
    ];
    speeds = speeds.filter((s) => s[0]).sort((a, b) => b[0] - a[0]);
    const primary = speeds.shift();
    return {
      primary: `${primary ? primary[1] : '0'}`,
      secondary: speeds.map((s) => s[1]).join(', '),
    };
  }

  async _renderHTML(
    context: GroupSheetClassicContext,
    options: ApplicationRenderOptions
  ) {
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

  // ---------------------------------------------
  // Drag and Drop
  // ---------------------------------------------

  async _onDropActiveEffect(
    ..._args: any[]
  ): Promise</*ActiveEffect*/ unknown | boolean> {
    // Tidy Group Sheet doesn't support active effect drops.
    return false;
  }

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

  // ---------------------------------------------
  // Actions
  // ---------------------------------------------

  award() {
    const award = new dnd5e.applications.Award(this.actor, {
      savedDestinations: this.actor.getFlag('dnd5e', 'awardDestinations'),
    });
    award.render(true);
  }
}
