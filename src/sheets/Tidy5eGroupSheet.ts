import { CONSTANTS } from 'src/constants';
import {
  SvelteApplicationMixin,
  type ApplicationClosingOptions,
  type ApplicationConfiguration,
  type ApplicationRenderOptions,
} from '../mixins/SvelteApplicationMixin';
import type { SvelteComponent } from 'svelte';
import GroupSheet from './group/GroupSheet.svelte';
import type {
  ActorInventoryTypes,
  ItemCardStore,
  MessageBus,
  MessageBusMessage,
  Tab,
  Utilities,
} from 'src/types/types';
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
import { SettingsProvider, settingStore } from 'src/settings/settings';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';
import { getPercentage } from 'src/utils/numbers';
import type { Item5e } from 'src/types/item.types';
import { ActorBaseDragAndDropMixin } from 'src/mixins/ActorBaseDragAndDropMixin';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { Container } from 'src/features/containers/Container';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService';
import { SheetPreferencesRuntime } from 'src/runtime/user-preferences/SheetPreferencesRuntime';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication';
import { GroupSheetRuntime } from 'src/runtime/GroupSheetRuntime';
import { writable } from 'svelte/store';
import { InlineContainerToggleService } from 'src/features/containers/InlineContainerToggleService';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { debug } from 'src/utils/logging';

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
  _itemFilterService: ItemFilterService;
  _messageBus: MessageBus = writable<MessageBusMessage | undefined>();
  _inlineContainerToggleService = new InlineContainerToggleService();
  _card = writable<ItemCardStore>();

  constructor(...args: any[]) {
    super(...args);

    this._supportedItemTypes = new Set(Inventory.getDefaultInventoryTypes());
    this._supportedItemTypes.add(CONSTANTS.ITEM_TYPE_SPELL);
    this._itemFilterService = new ItemFilterService({}, this.actor);
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
    const component = new GroupSheet({
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.APP_ID, this.appId],
        [CONSTANTS.SVELTE_CONTEXT.CARD, this._card],
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._store],
        [
          CONSTANTS.SVELTE_CONTEXT.INLINE_CONTAINER_TOGGLE_SERVICE,
          this._inlineContainerToggleService,
        ],
        [CONSTANTS.SVELTE_CONTEXT.ITEM_FILTER_SERVICE, this._itemFilterService],
        [CONSTANTS.SVELTE_CONTEXT.LOCATION, ''],
        [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this._messageBus],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER,
          this._itemFilterService.onFilter.bind(this._itemFilterService),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER_CLEAR_ALL,
          this._itemFilterService.onFilterClearAll.bind(
            this._itemFilterService
          ),
        ],
      ]),
    });

    initTidy5eContextMenu(this, $(this.element));

    return component;
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

    const source = this.actor.toObject();

    const unlocked =
      FoundryAdapter.isActorSheetUnlocked(this.actor) && this.isEditable;

    const editable = this.isEditable;

    const summary = this.#getSummary(stats);

    const movement = this.#prepareMovementSpeed();

    const sheetPreferences = SheetPreferencesService.getByType(this.actor.type);

    const membersSortMode =
      sheetPreferences.tabs?.[CONSTANTS.TAB_GROUP_MEMBERS]?.sort ?? 'm';

    const inventorySortMode =
      sheetPreferences.tabs?.[CONSTANTS.TAB_ACTOR_INVENTORY]?.sort ?? 'm';

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
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
        utilityToolbarCommands: [
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeAlpha'),
            iconClass: 'fa-solid fa-arrow-down-a-z fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_INVENTORY,
                'sort',
                'm'
              );
            },
            visible: inventorySortMode === 'a',
          },
          {
            title: FoundryAdapter.localize('SIDEBAR.SortModeManual'),
            iconClass: 'fa-solid fa-arrow-down-short-wide fa-fw',
            execute: async () => {
              await SheetPreferencesService.setDocumentTypeTabPreference(
                this.actor.type,
                CONSTANTS.TAB_ACTOR_INVENTORY,
                'sort',
                'a'
              );
            },
            visible: inventorySortMode === 'm',
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Commands.HideContainerPanel'
            ),
            iconClass: `fas fa-boxes-stacked fa-fw`,
            execute: () => {
              TidyFlags.showContainerPanel.unset(this.actor);
            },
            visible: !!TidyFlags.showContainerPanel.get(this.actor),
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Commands.ShowContainerPanel'
            ),
            iconClass: `fas fa-box fa-fw`,
            execute: () => {
              TidyFlags.showContainerPanel.set(this.actor, true);
            },
            visible: !TidyFlags.showContainerPanel.get(this.actor),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              // TODO: Use app.messageBus
              this._messageBus.set({
                tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
                message: CONSTANTS.MESSAGE_BUS_EXPAND_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              // TODO: Use app.messageBus
              this._messageBus.set({
                tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
                message: CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL,
              }),
          },
          {
            title: FoundryAdapter.localize('TIDY5E.ListLayout'),
            iconClass: 'fas fa-th-list fa-fw toggle-list',
            visible: !TidyFlags.inventoryGrid.get(this.actor),
            execute: () => {
              TidyFlags.inventoryGrid.set(this.actor);
            },
          },
          {
            title: FoundryAdapter.localize('TIDY5E.GridLayout'),
            iconClass: 'fas fa-th-large fa-fw toggle-grid',
            visible: !!TidyFlags.inventoryGrid.get(this.actor),
            execute: () => {
              TidyFlags.inventoryGrid.unset(this.actor);
            },
          },
          {
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context }) => {
              new DocumentTabSectionConfigApplication({
                document: context.actor,
                sections: context.inventory,
                tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
                tabTitle: GroupSheetRuntime.getTabTitle(
                  CONSTANTS.TAB_ACTOR_INVENTORY
                ),
              }).render(true);
            },
          },
        ],
      },
    };

    const uncontainedItems: Item5e[] = Array.from(this.actor.items).filter(
      (i: Item5e) => !this.actor.items.has(i.system.container)
    );

    const inventoryTypesArray = Inventory.getDefaultInventoryTypes();
    const inventoryTypes = new Set(inventoryTypesArray);
    const inventory: ActorInventoryTypes =
      Inventory.getDefaultInventorySections();

    for (let item of uncontainedItems) {
      if (inventoryTypes.has(item.type)) {
        Inventory.applyInventoryItemToSection(
          inventory,
          item,
          inventoryTypesArray,
          {
            canCreate: true,
          }
        );
      }
    }

    let context: GroupSheetClassicContext = {
      actor: this.actor,
      actorPortraitCommands:
        ActorPortraitRuntime.getEnabledPortraitMenuCommands(this.actor),
      config: CONFIG.DND5E,
      containerPanelItems: await Inventory.getContainerPanelItems(
        uncontainedItems
      ),
      currentHP: stats.currentHP,
      descriptionFullEnrichedHtml: descriptionFullEnrichedHtml,
      document: this.actor,
      editable: editable,
      effects: dnd5e.applications.components.EffectsElement.prepareCategories(
        this.actor.allApplicableEffects()
      ),
      filterData: this._itemFilterService.getDocumentItemFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPins[this.actor.type],
      healthPercentage: getPercentage(stats.currentHP, stats.maxHP),
      inventory: Object.values(inventory),
      isGM: game.user.isGM,
      itemContext: {}, // TODO: Implement
      items: Array.from(this.actor.items),
      limited: this.actor.limited,
      lockSensitiveFields:
        (!unlocked && SettingsProvider.settings.useTotalSheetLock.get()) ||
        !editable,
      maxHP: stats.maxHP,
      memberSections: memberSections,
      movement: movement,
      owner: this.actor.isOwner,
      showContainerPanel:
        TidyFlags.showContainerPanel.get(this.actor) === true &&
        Array.from(uncontainedItems).some(
          (i: Item5e) => i.type === CONSTANTS.ITEM_TYPE_CONTAINER
        ),
      source: source,
      summary: summary,
      system: this.actor.system,
      tabs: tabs,
      unlocked: unlocked,
      useClassicControls: true, // TODO: Establish setting for this; and group section in settings
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
      ].includes(SettingsProvider.settings.useCircularPortraitStyle.get()),
      utilities: utilities,
      xp: xp,
    };

    await this.#prepareItems(context);

    return context;
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

      sections[member.type].members.push(member);
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

  async #prepareItems(context: GroupSheetClassicContext) {
    for (const item of context.items) {
      context.itemContext[item.id] ??= {
        canToggle: false,
        containerContents: undefined,
        hasUses: item.hasLimitedUses,
        isStack: item.system.quantity > 1,
        totalWeight: (await item.system.totalWeight).toNearest(0.1),
      };
    }

    for (const panelItem of context.containerPanelItems) {
      const ctx = context.itemContext[panelItem.container.id];
      ctx.containerContents = await Container.getContainerContents(
        panelItem.container
      );
    }
  }

  _getSubscriptions() {
    let first = true;
    const subscriptions = [
      this._itemFilterService.filterData$.subscribe(() => {
        if (first) return;
        this.render();
      }),
      settingStore.subscribe((s) => {
        if (first) return;
        this.render();
      }),
      SheetPreferencesRuntime.getStore().subscribe(() => {
        if (first) return;
        this.render();
      }),
      this._messageBus.subscribe((m) => {
        debug('Message bus message received', {
          app: this,
          actor: this.actor,
          message: m,
        });
      }),
    ];
    first = false;
    return subscriptions;
  }

  async _renderHTML(
    context: GroupSheetClassicContext,
    options: ApplicationRenderOptions
  ) {
    // Clear the item card anytime a render occurs, in case that render was the deletion of the current item being visualized.
    this._card.set({
      sheet: this.element,
      item: null,
      itemCardContentTemplate: null,
    });

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
    if (!this.isEditable) {
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
    if (!this.isEditable) {
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
