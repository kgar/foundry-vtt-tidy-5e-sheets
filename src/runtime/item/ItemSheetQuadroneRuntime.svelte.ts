import type {
  ContainerSheetQuadroneContext,
  ItemSheetQuadroneContext,
} from 'src/types/item.types';
import type { RegisteredContent, RegisteredTab } from '../types';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { CustomContent, Tab } from 'src/types/types';
import { Activities } from 'src/features/activities/activities';
import ItemActivitiesQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemActivitiesTab.svelte';
import ItemAdvancementQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemAdvancementTab.svelte';
import ItemBackgroundDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemBackgroundDetailsTab.svelte';
import ItemClassDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemClassDetailsTab.svelte';
import ItemConsumableDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemConsumableDetailsTab.svelte';
import ItemContainerContentsQuadroneTab from 'src/sheets/quadrone/container/tabs/ContainerContentsTab.svelte';
import ItemContainerDetailsQuadronTab from 'src/sheets/quadrone/container/tabs/ContainerDetailsTab.svelte';
import ItemDescriptionsQuadroneTab from '../../sheets/quadrone/item/tabs/ItemDescriptionsTab.svelte';
import ItemEffectsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemEffectsTab.svelte';
import ItemEquipmentDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemEquipmentDetailsTab.svelte';
import ItemFacilityDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemFacilityDetailsTab.svelte';
import ItemFeatDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemFeatDetailsTab.svelte';
import ItemLootDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemLootDetailsTab.svelte';
import ItemSpeciesDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemSpeciesDetailsTab.svelte';
import ItemSpellDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemSpellDetailsTab.svelte';
import ItemSubclassDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemSubclassDetailsTab.svelte';
import ItemToolDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemToolDetailsTab.svelte';
import ItemWeaponDetailsQuadroneTab from 'src/sheets/quadrone/item/tabs/ItemWeaponDetailsTab.svelte';
import { CustomContentManager } from '../content/CustomContentManager';
import { TabManager } from '../tab/TabManager';
import { SvelteMap } from 'svelte/reactivity';
import type { Component } from 'svelte';
import BackgroundSheet from 'src/sheets/quadrone/item/BackgroundSheet.svelte';
import ClassSheet from 'src/sheets/quadrone/item/ClassSheet.svelte';
import ConsumableSheet from 'src/sheets/quadrone/item/ConsumableSheet.svelte';
import ContainerSheet from 'src/sheets/quadrone/container/ContainerSheet.svelte';
import EquipmentSheet from 'src/sheets/quadrone/item/EquipmentSheet.svelte';
import FacilitySheet from 'src/sheets/quadrone/item/FacilitySheet.svelte';
import FeatSheet from 'src/sheets/quadrone/item/FeatSheet.svelte';
import LootSheet from 'src/sheets/quadrone/item/LootSheet.svelte';
import SpeciesSheet from 'src/sheets/quadrone/item/SpeciesSheet.svelte';
import SpellSheet from 'src/sheets/quadrone/item/SpellSheet.svelte';
import SubclassSheet from 'src/sheets/quadrone/item/SubclassSheet.svelte';
import ToolSheet from 'src/sheets/quadrone/item/ToolSheet.svelte';
import WeaponSheet from 'src/sheets/quadrone/item/WeaponSheet.svelte';
import { error } from 'src/utils/logging';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { settings } from 'src/settings/settings.svelte';
import type { ItemTabRegistrationOptions } from 'src/api';

export type ItemSheetInfo = {
  component: Component;
  defaultTabs: string[];
};

class ItemSheetQuadroneRuntimeImpl {
  private _content = $state<RegisteredContent<ItemSheetQuadroneContext>[]>([]);
  private _tabs = $state<RegisteredTab<ItemSheetQuadroneContext>[]>([]);
  private _sheetMap: SvelteMap<string, ItemSheetInfo>;

  constructor(
    nativeTabs: RegisteredTab<ItemSheetQuadroneContext>[],
    nativeSheets: [string, ItemSheetInfo][]
  ) {
    this._tabs = nativeTabs;
    this._sheetMap = new SvelteMap(nativeSheets);
  }

  async registerItemSheet(
    type: string,
    info: ItemSheetInfo,
    existingTabIds?: string[]
  ) {
    this._sheetMap.set(type, info);

    // There is surely a more efficient way to do this, but it's just not worth it.
    existingTabIds?.forEach((tabId) => {
      for (let tab of this._tabs) {
        if (tab.id === tabId && tab.types) {
          tab.types.add(type);
        }
      }
    });
  }

  getSheetTypes() {
    return Array.from(this._sheetMap).map(([documentType]) => documentType);
  }

  async getContent(
    context: ItemSheetQuadroneContext | ContainerSheetQuadroneContext
  ): Promise<CustomContent[]> {
    return await CustomContentManager.prepareContentForRender(
      context,
      this._content
    );
  }

  async getTabs(
    context: ItemSheetQuadroneContext | ContainerSheetQuadroneContext
  ) {
    let tabsForType = this._getVisibleTabs(context);
    let tabIds = tabsForType.map((t) => t.id);

    const selectedTabs =
      TidyFlags.tabConfiguration.get(context.item)?.selected ?? [];

    if (selectedTabs?.length) {
      tabIds = tabIds
        .filter((t) => selectedTabs?.includes(t))
        .sort((a, b) => selectedTabs.indexOf(a) - selectedTabs.indexOf(b));
    }

    if (!selectedTabs?.length) {
      let defaultTabs =
        settings.value.tabConfiguration[context.document.documentName]?.[
          context.document.type
        ]?.selected ?? [];

      if (!defaultTabs.length) {
        defaultTabs = this.getDefaultTabIds(context.document.type);
      }

      tabIds = tabIds
        .filter((t) => defaultTabs?.includes(t))
        .sort((a, b) => defaultTabs.indexOf(a) - defaultTabs.indexOf(b));
    }

    let tabsToPrepare = tabIds
      .map((tabId) => tabsForType.find((tab) => tab.id === tabId))
      .filter((t) => !!t);

    let tabs = await TabManager.prepareTabsForRender(context, tabsToPrepare);

    return tabs.filter((t) => !t.condition || t.condition(context.document));
  }

  private _getVisibleTabs(
    context: ItemSheetQuadroneContext | ContainerSheetQuadroneContext
  ) {
    const tabs = Iterator.from(this._tabs).filter(
      (x) => !x.types || x.types.has(context.document.type)
    );

    if (FoundryAdapter.userIsGm()) {
      return [...tabs];
    }

    const worldTabConfig =
      settings.value.tabConfiguration[context.document.documentName]?.[
        context.document.type
      ]?.visibilityLevels ?? {};

    const sheetTabConfig =
      TidyFlags.tabConfiguration.get(context.document)?.visibilityLevels ?? {};

    const documentOwnershipLevel = context.document.getUserLevel(game.user);

    return [
      ...tabs.filter((tab) => {
        const minOwnershipLevel = Math.max(
          worldTabConfig[tab.id] ?? CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
          sheetTabConfig[tab.id] ?? CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED
        );
        return documentOwnershipLevel >= minOwnershipLevel;
      }),
    ];
  }

  getAllRegisteredTabs(
    type: string
  ): RegisteredTab<ItemSheetQuadroneContext>[] {
    return this._tabs.filter((t) => t.types?.has(type) ?? true);
  }

  getSheet(type: string) {
    const component = this._sheetMap.get(type)?.component;

    if (!component) {
      error(
        'Sheet not found in Item Sheet Quadrone Runtime sheet map. Native sheets must be passed to the runtime constructor, and new sheets must be registered via the sheet registration function.'
      );
    }

    return component;
  }

  getDefaultTabIds(type: string): string[] {
    return [...(this._sheetMap.get(type)?.defaultTabs ?? [])];
  }

  registerContent(
    registeredContent: RegisteredContent<ItemSheetQuadroneContext>
  ) {
    this._content.push(registeredContent);
  }

  registerTab(
    tab: RegisteredTab<ItemSheetQuadroneContext>,
    options?: ItemTabRegistrationOptions
  ) {
    this._tabs.push(tab);

    const includeAsDefault = options?.includeAsDefaultTab ?? true;

    if (!includeAsDefault) {
      return;
    }

    const types = tab.types ?? this._sheetMap.keys();

    for (const type of types) {
      const info = this._sheetMap.get(type);
      if (info && !info.defaultTabs.includes(tab.id)) {
        info.defaultTabs.push(tab.id);
      }
    }
  }

  getCustomItemTabs(context: any) {
    return this._tabs;
  }
}

export const ItemSheetQuadroneRuntime = new ItemSheetQuadroneRuntimeImpl(
  [
    {
      id: CONSTANTS.TAB_ITEM_ACTIVITIES,
      itemCount: (context) =>
        Array.from(context.document.system.activities).filter((x) =>
          Activities.isConfigurable(x)
        ).length,
      layout: 'quadrone',
      title: 'DND5E.ACTIVITY.Title.other',
      content: {
        component: ItemActivitiesQuadroneTab,
        type: 'svelte',
      },
      enabled: (context: ItemSheetQuadroneContext) =>
        context.document.system.identified !== false ||
        FoundryAdapter.isInGmEditMode(context.document),
      types: new Set<string>([
        CONSTANTS.ITEM_TYPE_CONSUMABLE,
        CONSTANTS.ITEM_TYPE_EQUIPMENT,
        CONSTANTS.ITEM_TYPE_FACILITY,
        CONSTANTS.ITEM_TYPE_FEAT,
        CONSTANTS.ITEM_TYPE_SPELL,
        CONSTANTS.ITEM_TYPE_TOOL,
        CONSTANTS.ITEM_TYPE_WEAPON,
      ]),
    },
    {
      id: CONSTANTS.TAB_ITEM_ADVANCEMENT,
      itemCount: (context) =>
        Array.from(context.document.system.advancement).length,
      layout: 'quadrone',
      title: 'DND5E.AdvancementTitle',
      content: {
        component: ItemAdvancementQuadroneTab,
        type: 'svelte',
      },
      types: new Set<string>([
        CONSTANTS.ITEM_TYPE_BACKGROUND,
        CONSTANTS.ITEM_TYPE_CLASS,
        CONSTANTS.ITEM_TYPE_FEAT,
        CONSTANTS.ITEM_TYPE_SUBCLASS,
        CONSTANTS.ITEM_TYPE_RACE,
      ]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemClassDetailsQuadroneTab,
        type: 'svelte',
      },
      types: new Set<string>([CONSTANTS.ITEM_TYPE_CLASS]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemConsumableDetailsQuadroneTab,
        type: 'svelte',
      },
      enabled: (context) =>
        context.document.system.identified !== false ||
        FoundryAdapter.isInGmEditMode(context.document),
      types: new Set<string>([CONSTANTS.ITEM_TYPE_CONSUMABLE]),
    },
    {
      id: CONSTANTS.TAB_CONTAINER_CONTENTS,
      layout: 'quadrone',
      title: 'DND5E.Contents',
      content: {
        component: ItemContainerContentsQuadroneTab,
        type: 'svelte',
      },
      types: new Set<string>([CONSTANTS.ITEM_TYPE_CONTAINER]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemBackgroundDetailsQuadroneTab,
        type: 'svelte',
      },
      types: new Set<string>([CONSTANTS.ITEM_TYPE_BACKGROUND]),
    },
    /**
     * Details form for containers.
     */
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemContainerDetailsQuadronTab,
        type: 'svelte',
      },
      enabled: (context) =>
        context.document.system.identified !== false ||
        FoundryAdapter.isInGmEditMode(context.document),
      types: new Set<string>([CONSTANTS.ITEM_TYPE_CONTAINER]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemEquipmentDetailsQuadroneTab,
        type: 'svelte',
      },
      enabled: (context) =>
        context.document.system.identified !== false ||
        FoundryAdapter.isInGmEditMode(context.document),
      types: new Set<string>([CONSTANTS.ITEM_TYPE_EQUIPMENT]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemFacilityDetailsQuadroneTab,
        type: 'svelte',
      },
      types: new Set<string>([CONSTANTS.ITEM_TYPE_FACILITY]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemFeatDetailsQuadroneTab,
        type: 'svelte',
      },
      types: new Set<string>([CONSTANTS.ITEM_TYPE_FEAT]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemLootDetailsQuadroneTab,
        type: 'svelte',
      },
      enabled: (context) =>
        context.document.system.identified !== false ||
        FoundryAdapter.isInGmEditMode(context.document),
      types: new Set<string>([CONSTANTS.ITEM_TYPE_LOOT]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemSpellDetailsQuadroneTab,
        type: 'svelte',
      },
      types: new Set<string>([CONSTANTS.ITEM_TYPE_SPELL]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemSubclassDetailsQuadroneTab,
        type: 'svelte',
      },
      types: new Set<string>([CONSTANTS.ITEM_TYPE_SUBCLASS]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemToolDetailsQuadroneTab,
        type: 'svelte',
      },
      enabled: (context) =>
        context.document.system.identified !== false ||
        FoundryAdapter.isInGmEditMode(context.document),
      types: new Set<string>([CONSTANTS.ITEM_TYPE_TOOL]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemWeaponDetailsQuadroneTab,
        type: 'svelte',
      },
      enabled: (context) =>
        context.document.system.identified !== false ||
        FoundryAdapter.isInGmEditMode(context.document),
      types: new Set<string>([CONSTANTS.ITEM_TYPE_WEAPON]),
    },
    {
      id: CONSTANTS.TAB_ITEM_DETAILS,
      layout: 'quadrone',
      title: 'DND5E.Details',
      content: {
        component: ItemSpeciesDetailsQuadroneTab,
        type: 'svelte',
      },
      types: new Set<string>([CONSTANTS.ITEM_TYPE_RACE]),
    },
    {
      id: CONSTANTS.TAB_DESCRIPTION,
      layout: 'quadrone',
      title: 'DND5E.Description',
      content: {
        component: ItemDescriptionsQuadroneTab,
        type: 'svelte',
      },
      types: new Set<string>([
        CONSTANTS.ITEM_TYPE_BACKGROUND,
        CONSTANTS.ITEM_TYPE_CLASS,
        CONSTANTS.ITEM_TYPE_CONSUMABLE,
        CONSTANTS.ITEM_TYPE_CONTAINER,
        CONSTANTS.ITEM_TYPE_EQUIPMENT,
        CONSTANTS.ITEM_TYPE_FACILITY,
        CONSTANTS.ITEM_TYPE_FEAT,
        CONSTANTS.ITEM_TYPE_LOOT,
        CONSTANTS.ITEM_TYPE_RACE,
        CONSTANTS.ITEM_TYPE_SPELL,
        CONSTANTS.ITEM_TYPE_SUBCLASS,
        CONSTANTS.ITEM_TYPE_TOOL,
        CONSTANTS.ITEM_TYPE_WEAPON,
      ]),
    },
    {
      id: CONSTANTS.TAB_EFFECTS,
      itemCount: (context) => Array.from(context.document?.effects).length,
      layout: 'quadrone',
      title: 'DND5E.Effects',
      content: {
        component: ItemEffectsQuadroneTab,
        type: 'svelte',
      },
      enabled: (context) =>
        context.document.system.identified !== false ||
        FoundryAdapter.isInGmEditMode(context.document),
      types: new Set<string>([
        CONSTANTS.ITEM_TYPE_CONSUMABLE,
        CONSTANTS.ITEM_TYPE_EQUIPMENT,
        CONSTANTS.ITEM_TYPE_FEAT,
        CONSTANTS.ITEM_TYPE_SPELL,
        CONSTANTS.ITEM_TYPE_TOOL,
        CONSTANTS.ITEM_TYPE_WEAPON,
      ]),
    },
  ],
  // Default Tab IDs for each Item Type
  [
    [
      CONSTANTS.ITEM_TYPE_BACKGROUND,
      {
        component: BackgroundSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ADVANCEMENT,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_CLASS,
      {
        component: ClassSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ADVANCEMENT,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_CONSUMABLE,
      {
        component: ConsumableSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ACTIVITIES,
          CONSTANTS.TAB_EFFECTS,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_CONTAINER,
      {
        component: ContainerSheet,
        defaultTabs: [
          CONSTANTS.TAB_CONTAINER_CONTENTS,
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_EQUIPMENT,
      {
        component: EquipmentSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ACTIVITIES,
          CONSTANTS.TAB_EFFECTS,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_FACILITY,
      {
        component: FacilitySheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ACTIVITIES,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_FEAT,
      {
        component: FeatSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ACTIVITIES,
          CONSTANTS.TAB_EFFECTS,
          CONSTANTS.TAB_ITEM_ADVANCEMENT,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_LOOT,
      {
        component: LootSheet,
        defaultTabs: [CONSTANTS.TAB_DESCRIPTION, CONSTANTS.TAB_ITEM_DETAILS],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_RACE,
      {
        component: SpeciesSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ADVANCEMENT,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_SPELL,
      {
        component: SpellSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ACTIVITIES,
          CONSTANTS.TAB_EFFECTS,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_SUBCLASS,
      {
        component: SubclassSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ADVANCEMENT,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_TOOL,
      {
        component: ToolSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ACTIVITIES,
          CONSTANTS.TAB_EFFECTS,
        ],
      },
    ],
    [
      CONSTANTS.ITEM_TYPE_WEAPON,
      {
        component: WeaponSheet,
        defaultTabs: [
          CONSTANTS.TAB_DESCRIPTION,
          CONSTANTS.TAB_ITEM_DETAILS,
          CONSTANTS.TAB_ITEM_ACTIVITIES,
          CONSTANTS.TAB_EFFECTS,
        ],
      },
    ],
  ]
);
