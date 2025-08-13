import { CONSTANTS } from 'src/constants';
import {
  type ApplicationClosingOptions,
  type ApplicationConfiguration,
  type ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import type {
  Actor5e,
  ActorInventoryTypes,
  DocumentSheetV2Context,
  Utilities,
} from 'src/types/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  GroupItemContext,
  GroupLanguage,
  GroupMemberSection,
  GroupMemberSkillInfo,
  GroupSkill,
  Encounter5eMember,
  EncounterMemberContext,
  EncounterSheetClassicContext,
  Encounter5e,
} from 'src/types/group.types';
import { Inventory } from 'src/features/sections/Inventory';
import { settings, systemSettings } from 'src/settings/settings.svelte';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';
import type { Item5e } from 'src/types/item.types';
import { Tidy5eActorSheetBaseMixin } from 'src/mixins/Tidy5eActorSheetBaseMixin';
import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { Container } from 'src/features/containers/Container';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { ItemFilterService } from 'src/features/filtering/ItemFilterService.svelte';
import { DocumentTabSectionConfigApplication } from 'src/applications/section-config/DocumentTabSectionConfigApplication.svelte';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { warn } from 'src/utils/logging';
import { processInputChangeDeltaFromValues } from 'src/utils/form';
import { isNil } from 'src/utils/data';
import { formatAsModifier } from 'src/utils/formatting';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { Activities } from 'src/features/activities/activities';
import AttachedInfoCard from 'src/components/info-card/AttachedInfoCard.svelte';
import { ImportSheetControl } from '../../features/sheet-header-controls/ImportSheetControl';
import { SheetSections } from 'src/features/sections/SheetSections';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import { ItemContext } from 'src/features/item/ItemContext';
import {
  TidyExtensibleDocumentSheetMixin,
  type TidyDocumentSheetRenderOptions,
} from 'src/mixins/TidyDocumentSheetMixin.svelte';
import EncounterSheetClassicRuntime from 'src/runtime/actor/EncounterSheetClassicRuntime.svelte';
import SheetHeaderModeToggleV2 from './shared/SheetHeaderModeToggleV2.svelte';
import EncounterSheet from './encounter/EncounterSheet.svelte';

type MemberStats = {
  memberCount: number;
};

export class Tidy5eEncounterSheetClassic extends Tidy5eActorSheetBaseMixin(
  TidyExtensibleDocumentSheetMixin(
    CONSTANTS.SHEET_TYPE_ENCOUNTER,
    SvelteApplicationMixin<
      ApplicationConfiguration | undefined,
      EncounterSheetClassicContext
    >(foundry.applications.sheets.ActorSheetV2)
  )
) {
  sectionExpansionTracker: ExpansionTracker;

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this._supportedItemTypes = new Set(Inventory.getInventoryTypes());
    this._supportedItemTypes.add(CONSTANTS.ITEM_TYPE_SPELL);
    this.itemFilterService = new ItemFilterService({}, this.actor);

    this.sectionExpansionTracker = new ExpansionTracker(
      true,
      this.document,
      CONSTANTS.LOCATION_SECTION
    );
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'actor',
      CONSTANTS.SHEET_TYPE_ENCOUNTER,
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
    ],
    tag: 'form',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [
        this.ACTOR_ACTIONS_AND_CONTROLS.showPortraitArtwork.control,
        this.ACTOR_ACTIONS_AND_CONTROLS.showTokenArtwork.control,
        this.ACTOR_ACTIONS_AND_CONTROLS.openTabSelection.control,
      ],
    },
    position: {
      width: 600,
      height: 700,
    },
    dragDrop: [
      {
        dragSelector: `[data-tidy-always-draggable]`,
        dropSelector: null,
      },
      {
        dragSelector: '[data-tidy-draggable]',
        dropSelector: null,
      },
    ],
    actions: {
      [ImportSheetControl.actionName]: async function (this: any) {
        await ImportSheetControl.importFromCompendium(this, this.document);
      },
      ...this.ACTOR_ACTIONS_AND_CONTROLS.showPortraitArtwork.action,
      ...this.ACTOR_ACTIONS_AND_CONTROLS.showTokenArtwork.action,
      ...this.ACTOR_ACTIONS_AND_CONTROLS.openTabSelection.action,
    },
    submitOnClose: true,
  };

  itemFilterService: ItemFilterService;
  #inlineToggleService = new InlineToggleService();

  _createComponent(node: HTMLElement): Record<string, any> {
    const component = mount(EncounterSheet, {
      target: node,
      context: new Map<any, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        [
          CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
          this.#inlineToggleService,
        ],
        [CONSTANTS.SVELTE_CONTEXT.ITEM_FILTER_SERVICE, this.itemFilterService],
        [CONSTANTS.SVELTE_CONTEXT.LOCATION, ''],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER,
          this.itemFilterService.onFilter.bind(this.itemFilterService),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.ON_FILTER_CLEAR_ALL,
          this.itemFilterService.onFilterClearAll.bind(this.itemFilterService),
        ],
        [
          CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
          this.sectionExpansionTracker,
        ],
      ]),
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_CLASSIC);

    return component;
  }

  _createAdditionalComponents(content: HTMLElement) {
    const windowHeader = this.element.querySelector('.window-header');
    const sheetLock = mount(SheetHeaderModeToggleV2, {
      target: windowHeader,
      anchor: windowHeader.querySelector('.window-title'),
      context: new Map<string, any>([
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
      ]),
      props: {
        class: 'header-control',
      },
    });

    const infoCard = mount(AttachedInfoCard, {
      target: this.element,
      props: {
        sheet: this,
      },
    });

    return [sheetLock, infoCard];
  }

  async _prepareContext(
    options: TidyDocumentSheetRenderOptions
  ): Promise<EncounterSheetClassicContext> {
    this.itemFilterService.refreshFilters();

    const documentSheetContext = (await super._prepareContext(
      options
    )) as DocumentSheetV2Context;

    let xp: number | undefined = undefined;
    if (
      systemSettings.value.levelingMode !==
      CONSTANTS.SYSTEM_SETTING_LEVELING_MODE_NO_XP
    ) {
      xp = await this.actor.system.getXPValue();
    }

    const descriptionFullEnrichedHtml =
      await foundry.applications.ux.TextEditor.enrichHTML(
        this.actor.system.description.full,
        {
          secrets: this.actor.isOwner,
          rollData: this.actor.getRollData(),
          relativeTo: this.actor,
        }
      );

    const {
      sections: memberSections,
      stats,
      memberContext,
      groupLanguages,
      groupSkills,
    } = await this.#prepareMembers();

    const source = this.actor.toObject();

    const editable = this.isEditable;

    const summary = this.#getSummary(stats);

    const sheetPreferences = SheetPreferencesService.getByType(this.actor.type);

    const membersSortMode =
      sheetPreferences.tabs?.[CONSTANTS.TAB_GROUP_MEMBERS]?.sort ?? 'm';

    const inventorySortMode =
      sheetPreferences.tabs?.[CONSTANTS.TAB_ACTOR_INVENTORY]?.sort ?? 'm';

    const utilities: Utilities<EncounterSheetClassicContext> = {
      [CONSTANTS.TAB_GROUP_MEMBERS]: {
        utilityToolbarCommands: [
          {
            id: 'sort-mode-alpha',
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
            id: 'sort-mode-manual',
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
          {
            id: 'show-member-tab-info-panel',
            title: FoundryAdapter.localize(
              'TIDY5E.Group.ShowMemberTabInfoPanel'
            ),
            iconClass: 'fa-solid fa-people-group fa-fw',
            execute: async () => {
              await TidyFlags.showGroupMemberTabInfoPanel.set(this.actor, true);
            },
            visible:
              FoundryAdapter.userIsGm() &&
              !TidyFlags.showGroupMemberTabInfoPanel.get(this.actor),
          },
          {
            id: 'hide-member-tab-info-panel',
            title: FoundryAdapter.localize(
              'TIDY5E.Group.HideMemberTabInfoPanel'
            ),
            iconClass: 'fa-solid fa-people-group fa-fw active',
            execute: async () => {
              await TidyFlags.showGroupMemberTabInfoPanel.unset(this.actor);
            },
            visible:
              FoundryAdapter.userIsGm() &&
              TidyFlags.showGroupMemberTabInfoPanel.get(this.actor),
          },
        ],
      },
      [CONSTANTS.TAB_ACTOR_INVENTORY]: {
        utilityToolbarCommands: [
          {
            id: 'sort-mode-alpha',
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
            id: 'sort-mode-manual',
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
            id: 'hide-container-panel',
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
            id: 'show-container-panel',
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
            id: 'expand-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.ExpandAll'),
            iconClass: 'fas fa-angles-down',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_INVENTORY,
                true
              ),
          },
          {
            id: 'collapse-all',
            title: FoundryAdapter.localize('TIDY5E.Commands.CollapseAll'),
            iconClass: 'fas fa-angles-up',
            execute: () =>
              this.sectionExpansionTracker.setAll(
                CONSTANTS.TAB_ACTOR_INVENTORY,
                false
              ),
          },
          {
            id: 'list-layout',
            title: FoundryAdapter.localize('TIDY5E.ListLayout'),
            iconClass: 'fas fa-th-list fa-fw toggle-list',
            visible: !TidyFlags.inventoryGrid.get(this.actor),
            execute: () => {
              TidyFlags.inventoryGrid.set(this.actor);
            },
          },
          {
            id: 'grid-layout',
            title: FoundryAdapter.localize('TIDY5E.GridLayout'),
            iconClass: 'fas fa-th-large fa-fw toggle-grid',
            visible: !!TidyFlags.inventoryGrid.get(this.actor),
            execute: () => {
              TidyFlags.inventoryGrid.unset(this.actor);
            },
          },
          {
            id: 'configure-sections',
            title: FoundryAdapter.localize(
              'TIDY5E.Utilities.ConfigureSections'
            ),
            iconClass: 'fas fa-cog',
            execute: ({ context, sections }) => {
              new DocumentTabSectionConfigApplication(
                {
                  sections: sections,
                  tabId: CONSTANTS.TAB_ACTOR_INVENTORY,
                  tabTitle: EncounterSheetClassicRuntime.getTabTitle(
                    CONSTANTS.TAB_ACTOR_INVENTORY
                  ),
                },
                {
                  document: context.actor,
                }
              ).render(true);
            },
          },
        ],
      },
    };

    const uncontainedItems: Item5e[] = Array.from(this.actor.items).filter(
      (i: Item5e) => !this.actor.items.has(i.system.container)
    );

    const inventoryTypesArray = Inventory.getInventoryTypes();
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

    SheetSections.getFilteredGlobalSectionsToShowWhenEmpty(
      this.actor,
      CONSTANTS.TAB_ACTOR_INVENTORY
    ).forEach((s) => {
      inventory[s] ??= Inventory.createInventorySection(
        s,
        inventoryTypesArray,
        {
          canCreate: true,
        }
      );
    });

    let context: EncounterSheetClassicContext = {
      actor: this.actor,
      actorPortraitCommands:
        ActorPortraitRuntime.getEnabledPortraitMenuCommands(this.actor),
      canObserveAll: Object.values(memberContext).every((m) => m.canObserve),
      config: CONFIG.DND5E,
      containerPanelItems: await Inventory.getContainerPanelItems(
        uncontainedItems
      ),
      customContent: [],
      descriptionFullEnrichedHtml: descriptionFullEnrichedHtml,
      disableExperience:
        systemSettings.value.levelingMode ===
        CONSTANTS.SYSTEM_SETTING_LEVELING_MODE_NO_XP,
      effects: dnd5e.applications.components.EffectsElement.prepareCategories(
        this.actor.allApplicableEffects()
      ),
      filterData: this.itemFilterService.getFilterData(),
      filterPins: ItemFilterRuntime.defaultFilterPins[this.actor.type],
      groupLanguages: groupLanguages,
      groupSkills: groupSkills,
      healthPercentage: 0,
      inventory: Object.values(inventory),
      isGM: game.user.isGM,
      itemContext: {},
      items: Array.from(this.actor.items),
      limited: this.actor.limited,
      lockSensitiveFields:
        (!documentSheetContext.unlocked && settings.value.useTotalSheetLock) ||
        !editable,
      memberContext: memberContext,
      memberSections: memberSections,
      modernRules: FoundryAdapter.checkIfModernRules(this.actor),
      owner: this.actor.isOwner,
      showContainerPanel:
        TidyFlags.showContainerPanel.get(this.actor) === true &&
        Array.from(uncontainedItems).some(
          (i: Item5e) => i.type === CONSTANTS.ITEM_TYPE_CONTAINER
        ),
      showGroupMemberTabInfoPanel: TidyFlags.showGroupMemberTabInfoPanel.get(
        this.actor
      ),
      summary: summary,
      system: this.actor.system,
      tabs: [],
      useClassicControls: true, // TODO: Establish setting for this; and group section in settings
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
      ].includes(settings.value.useCircularPortraitStyle),
      utilities: utilities,
      xp: xp,
      ...documentSheetContext,
    };

    context.customContent = await EncounterSheetClassicRuntime.getContent(
      context
    );

    await this._prepareItems(context);

    let tabs = await EncounterSheetClassicRuntime.getTabs(context);

    const selectedTabs = TidyFlags.selectedTabs.get(context.actor);

    if (selectedTabs?.length) {
      tabs = tabs
        .filter((t) => selectedTabs?.includes(t.id))
        .sort(
          (a, b) => selectedTabs.indexOf(a.id) - selectedTabs.indexOf(b.id)
        );
    } else {
      const defaultTabs: string[] = settings.value.defaultGroupSheetTabs;
      tabs = tabs
        .filter((t) => defaultTabs?.includes(t.id))
        .sort((a, b) => defaultTabs.indexOf(a.id) - defaultTabs.indexOf(b.id));
    }

    context.tabs = tabs;

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
    if (!members.length) return game.i18n.localize('DND5E.GroupSummaryEmpty');
    return game.i18n.format('DND5E.GroupSummary', {
      members: formatter.format(members),
    });
  }

  async #prepareMembers(): Promise<{
    sections: GroupMemberSection[];
    stats: MemberStats;
    memberContext: EncounterSheetClassicContext['memberContext'];
    groupLanguages: GroupLanguage[];
    groupSkills: GroupSkill[];
  }> {
    const stats: MemberStats = {
      memberCount: 0,
    };

    const sections: Record<string, GroupMemberSection> = {
      npc: {
        label: `${CONFIG.Actor.typeLabels.npc}Pl`,
        members: [],
        dataset: {},
        key: 'npc',
        show: true,
        custom: undefined,
        isExternal: false,
        showCrColumn: true,
        rowActions: [], // for the UI Overhaul
      },
    };

    const memberContext: EncounterSheetClassicContext['memberContext'] = {};

    const groupLanguages: Record<string, GroupLanguage> = {};
    const groupSkills: Record<string, GroupSkill> = {};
    const collectAggregates = FoundryAdapter.userIsGm();
    const configuredSkills = Object.entries(CONFIG.DND5E.skills);

    for (const [index, memberData] of this.actor.system.members.entries()) {
      const member = await fromUuid(memberData.uuid);

      const ctx: EncounterMemberContext = (memberContext[memberData.uuid] = {
        index: index,
        quantity: memberData.quantity,
        canObserve: member.testUserPermission(game.user, 'OBSERVER'),
        senses: [],
        conditionImmunities: [],
        topSkills: [],
      });

      const multiplier = memberData.quantity.value ?? 1;

      stats.memberCount += multiplier;

      sections[member.type].members.push(member);

      if (collectAggregates && member.system.traits?.languages?.value) {
        const customLanguageString =
          member.system.traits.languages.custom?.trim();
        const customLanguages = isNil(customLanguageString, '')
          ? []
          : dnd5e.utils.splitSemicolons(customLanguageString);
        const languageKeys = [
          ...member.system.traits.languages.value,
          ...customLanguages,
        ];

        for (let key of languageKeys) {
          const language = dnd5e.documents.Trait.keyLabel(key, {
            trait: 'languages',
          });

          const groupLanguage = (groupLanguages[language] ??=
            this.#createEmptyGroupLanguage(language));

          groupLanguage.members.push(member);
        }
      }

      if (collectAggregates && member.system.skills) {
        for (let [key, skill] of Object.entries<any>(member.system.skills)) {
          const groupSkill = (groupSkills[key] ??=
            this.#createEmptyGroupSkill(key));

          groupSkill.total = Math.max(groupSkill.total, skill.total);
          groupSkill.members.push(member);
        }
      }

      if (ctx.canObserve) {
        // Member Senses
        const senses = member.system.attributes.senses ?? {};
        const tags: Record<string, string> = {};
        for (let [k, label] of Object.entries(CONFIG.DND5E.senses)) {
          const v = senses[k] ?? 0;
          if (v === 0) continue;
          tags[k] = `${game.i18n.localize(label)} ${v} ${
            senses.units ??
            Object.values(CONFIG.DND5E.movementUnits)[0].abbreviation
          }`;
        }
        if (senses.special)
          dnd5e.utils
            .splitSemicolons(senses.special)
            .forEach(
              (c: string, i: number) => (tags[`custom${i + 1}`] = c.trim())
            );
        ctx.senses = Object.values(tags);

        // Member Condition Immunities
        const conditionImmunities: string[] = [];
        for (let entry of member.system.traits.ci.value) {
          conditionImmunities.push(
            CONFIG.DND5E.conditionTypes[entry]?.name ?? entry
          );
        }

        const customImmunity = member.system.traits.ci.custom?.trim();
        if (!isNil(customImmunity, '')) {
          conditionImmunities.push(customImmunity);
        }

        ctx.conditionImmunities = conditionImmunities;

        // Perception and Top Skills

        let skills: GroupMemberSkillInfo[];
        skills = member.system.skills
          ? Array.from(configuredSkills).reduce<GroupMemberSkillInfo[]>(
              (prev, [key, configSkill]: [string, any]) => {
                const skill = this.#getSkill(member, key);

                if (!skill) {
                  warn(
                    'Unable to find skill. Ensure custom skills are added at "init" time.',
                    false,
                    { key, configSkill }
                  );
                  return prev;
                }

                const label =
                  CONFIG.DND5E.skills[key as keyof typeof CONFIG.DND5E.skills]
                    ?.label ?? key;

                prev.push({
                  key: key,
                  label: label,
                  passive: skill.passive,
                  total: skill.total,
                  formattedTotal: formatAsModifier(skill.total),
                });

                return prev;
              },
              []
            )
          : [];

        ctx.topSkills = skills
          .filter((s) => s.key !== CONSTANTS.SKILL_KEY_PERCEPTION)
          .sort((a, b) => b.total - a.total)
          .slice(0, 4);

        ctx.perception = skills.find(
          (s) => s.key === CONSTANTS.SKILL_KEY_PERCEPTION
        );
      }
    }

    return {
      sections: Object.values(sections).filter((s) => s.members.length > 0),
      stats: stats,
      memberContext: memberContext,
      groupLanguages: Object.values(groupLanguages).sort((a, b) =>
        a.label.localeCompare(b.label, game.i18n.lang)
      ),
      groupSkills: Object.values(groupSkills).sort((a, b) =>
        a.label.localeCompare(b.label, game.i18n.lang)
      ),
    };
  }

  #createEmptyGroupLanguage(language: any): GroupLanguage {
    return {
      label: language,
      members: [],
    };
  }

  #createEmptyGroupSkill(key: string): GroupSkill {
    return {
      key: key,
      label:
        CONFIG.DND5E.skills[key as keyof typeof CONFIG.DND5E.skills]?.label ??
        key,
      members: [],
      total: Number.NEGATIVE_INFINITY,
    };
  }

  #getSkill(member: Actor5e, key: string): any | null {
    if (key in member.system.skills) {
      return member.system.skills[key];
    }

    return null;
  }

  async _prepareItems(context: EncounterSheetClassicContext) {
    for (const item of context.items) {
      if (Inventory.isItemInventoryType(item)) {
        context.itemContext[item.id] ??= await this._prepareItem(item, context);
      }
    }

    for (const panelItem of context.containerPanelItems) {
      const ctx = context.itemContext[panelItem.container.id];
      ctx.containerContents = await Container.getContainerContents(
        panelItem.container,
        {
          hasActor: false,
          unlocked: context.unlocked,
        }
      );
    }
  }

  async _prepareItem(
    item: Item5e,
    context: EncounterSheetClassicContext
  ): Promise<GroupItemContext> {
    return {
      activities: Activities.getVisibleActivities(
        item,
        item.system.activities
      )?.map(Activities.getActivityItemContext),
      canToggle: false,
      containerContents: undefined,
      hasUses: item.hasLimitedUses,
      isStack: item.system.quantity > 1,
      save: ItemContext.getItemSaveContext(item),
      toHit: ItemContext.getToHit(item),
      totalWeight: (await item.system.totalWeight)?.toNearest(0.1) ?? 0,
    };
  }

  async _renderHTML(
    context: EncounterSheetClassicContext,
    options: ApplicationRenderOptions
  ) {
    game.user.apps[this.id] = this;
    for (const member of this.actor.system.members) {
      const actor = await fromUuid(member.uuid);
      actor.apps[this.id] = this;
    }
    return await super._renderHTML(context, options);
  }

  async close(options: ApplicationClosingOptions = {}) {
    delete game.user.apps[this.id];
    for (const member of this.actor.system.members) {
      const actor = await fromUuid(member.uuid);
      delete actor.apps[this.id];
    }
    return await super.close(options);
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  _onDragStart(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
  ): void {
    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const memberUuid = event.currentTarget
      .closest('[data-tidy-draggable][data-member-uuid]')
      ?.getAttribute('data-member-uuid');

    if (!memberUuid) {
      super._onDragStart(event);
      return;
    }

    const memberEntry = this.#findMember(memberUuid);

    if (!memberEntry) {
      return;
    }

    // TODO: Eliminate fromUuidSync usage
    const actor = fromUuidSync(memberEntry.uuid);

    if (!actor) {
      return;
    }

    const dragData = actor.toDragData();
    dragData['encounterId'] = this.actor.id;
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }

  async _onDropActiveEffect(
    ..._args: any[]
  ): Promise</*ActiveEffect*/ unknown | boolean> {
    // Tidy Encounter Sheet doesn't support active effect drops.
    return false;
  }

  async _onDropActor(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
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

    const encounterId = data['encounterId'];

    if (encounterId !== this.actor.id) {
      return this.actor.system.addMember(sourceActor);
    }

    const dropTarget = event.target?.closest<HTMLElement>(
      '[data-tidy-draggable][data-member-uuid]'
    );
    const memberUuid = dropTarget?.getAttribute('data-member-uuid');

    const memberEntry = this.#findMember(memberUuid);

    if (!memberEntry) {
      return false;
    }

    const targetMemberActor = fromUuidSync(memberEntry.uuid);

    if (!dropTarget || !targetMemberActor || memberUuid === sourceActor.id) {
      return false;
    }

    return await this._onSortMember(sourceActor, targetMemberActor);
  }

  #findMember(uuid: string | null | undefined): Actor5e | undefined {
    return this.actor.system.members.find(
      (m: Encounter5eMember) => m.uuid === uuid
    );
  }

  async _onSortMember(sourceActor: Actor5e, targetActor: Actor5e) {
    const membersCollection: Encounter5eMember[] =
      this.actor.system.toObject().members;
    const sourceIndex = membersCollection.findIndex(
      (m) => m.uuid === sourceActor.uuid
    );
    const targetIndex = membersCollection.findIndex(
      (m) => m.uuid === targetActor.uuid
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

    if (folder.type === 'Actor') {
      const results: any[] = [];
      for (let actor of folder.contents) {
        results.push(await this.actor.system.addMember(actor));
      }
      return results;
    }

    return await super._onDropFolder(event, data);
  }

  // ---------------------------------------------
  // Actions
  // ---------------------------------------------

  award() {
    const award = new dnd5e.applications.Award({
      award: {
        savedDestinations: this.actor.getFlag('dnd5e', 'awardDestinations'),
      },
      origin: this.actor,
    });
    award.render(true);
  }

  async updateMemberQuantity(
    memberUuid: string,
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ): Promise<Encounter5e | undefined> {
    const membersCollection = this.actor.system.toObject().members;

    const index = membersCollection.findIndex(
      (m: any) => m.uuid === memberUuid
    );

    const originalValue = membersCollection[index].quantity.value;

    const amount = event.currentTarget.value;
    const newQuantity =
      amount?.trim() === ''
        ? null
        : processInputChangeDeltaFromValues(amount, originalValue);

    membersCollection[index].quantity.value = newQuantity;

    const result = await this.actor.update({
      ['system.members']: membersCollection,
    });

    if (!result) {
      event.currentTarget.value = originalValue.toString();
    }

    return result;
  }

  async updateMemberFormula(
    memberUuid: string,
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ): Promise<Encounter5e | undefined> {
    const membersCollection = this.actor.system.toObject().members;

    const index = membersCollection.findIndex(
      (m: any) => m.uuid === memberUuid
    );

    const originalValue = membersCollection[index].quantity.formula;

    membersCollection[index].quantity.formula = event.currentTarget.value;

    const result = await this.actor.update({
      ['system.members']: membersCollection,
    });

    if (!result) {
      event.currentTarget.value = originalValue;
    }

    return result;
  }
}
