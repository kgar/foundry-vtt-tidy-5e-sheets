import { CONSTANTS } from 'src/constants';
import type {
  Actor5e,
  ActorInventoryTypes,
  ActorSheetQuadroneContext,
  ExpandedItemData,
  ExpandedItemIdToLocationsMap,
  GroupMemberPortraitContext,
  GroupMembersQuadroneContext,
  GroupSheetQuadroneContext,
  GroupSkill,
  GroupSkillModContext,
  GroupTrait,
  LocationToSearchTextMap,
  MeasuredGroupTrait,
} from 'src/types/types';
import type {
  CurrencyContext,
  Item5e,
  ItemChatData,
} from 'src/types/item.types';
import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import GroupSheet from './actor/GroupSheet.svelte';
import { mount } from 'svelte';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import { type TidyDocumentSheetRenderOptions } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import { Tidy5eActorSheetQuadroneBase } from './Tidy5eActorSheetQuadroneBase.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import { Inventory } from 'src/features/sections/Inventory';
import { TidyFlags } from 'src/api';
import { SheetSections } from 'src/features/sections/SheetSections';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { Container } from 'src/features/containers/Container';
import type { Group5eMember } from 'src/types/group.types';
import { Tidy5eCharacterSheetQuadrone } from './Tidy5eCharacterSheetQuadrone.svelte';
import { getModifierData } from 'src/utils/formatting';
import type { SkillData } from 'src/foundry/dnd5e.types';
import { Tidy5eNpcSheetQuadrone } from './Tidy5eNpcSheetQuadrone.svelte';
import { isNil } from 'src/utils/data';
import type { Ref } from 'src/features/reactivity/reactivity.types';

export class Tidy5eGroupSheetQuadrone extends Tidy5eActorSheetQuadroneBase(
  CONSTANTS.SHEET_TYPE_GROUP
) {
  currentTabId: string;
  searchFilters: LocationToSearchTextMap = new Map<string, string>();
  expandedItems: ExpandedItemIdToLocationsMap = new Map<string, Set<string>>();
  expandedItemData: ExpandedItemData = new Map<string, ItemChatData>();
  inlineToggleService = new InlineToggleService();
  sectionExpansionTracker: ExpansionTracker;
  emphasizedActorUuid: Ref<string | undefined> = $state({ value: undefined });

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);

    this.currentTabId = CONSTANTS.TAB_MEMBERS;

    this.sectionExpansionTracker = new ExpansionTracker(
      true,
      this.document,
      CONSTANTS.LOCATION_SECTION
    );
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    position: {
      width: 740,
      height: 810,
    },
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    if (this.actor.limited) {
      return this._createLimitedViewComponent(node);
    }

    const component = mount(GroupSheet, {
      target: node,
      context: new Map<any, any>([
        [
          CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
          this.inlineToggleService,
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
        [CONSTANTS.SVELTE_CONTEXT.POSITION_REF, this._position],

        [
          CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED,
          this.onTabSelected.bind(this),
        ],
        [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
        [CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS, this.messageBus],
        [
          CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_ACTOR_REF,
          this.emphasizedActorUuid,
        ],
      ]),
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_QUADRONE);

    return component;
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<GroupSheetQuadroneContext> {
    // this._concentration = this.actor.concentration;

    const actorContext = (await super._prepareContext(
      options
    )) as ActorSheetQuadroneContext;

    const themeSettings = ThemeQuadrone.getSheetThemeSettings({
      doc: this.actor,
    });

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

    const context: GroupSheetQuadroneContext = {
      containerPanelItems: await Inventory.getContainerPanelItems(
        actorContext.items
      ),
      currencies,
      inventory: [],
      members: await this._prepareMembersContext(),
      sheet: this,
      showContainerPanel: TidyFlags.showContainerPanel.get(this.actor) == true,
      type: 'group',
      ...actorContext,
    };

    // etc.

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

    context.tabs = await GroupSheetQuadroneRuntime.getTabs(context);

    return context;
  }

  _prepareItems(context: GroupSheetQuadroneContext) {
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

  protected _prepareItem(item: Item5e, ctx: GroupSheetQuadroneContext) {}

  async _prepareMembersContext(): Promise<GroupMembersQuadroneContext> {
    let sections: GroupMembersQuadroneContext = {
      character: {
        members: [],
        label: 'TYPES.Actor.characterPl',
      },
      npc: {
        members: [],
        label: 'TYPES.Actor.npcPl',
      },
      vehicle: {
        members: [],
        label: 'TYPES.Actor.vehiclePl',
      },
      skills: [],
      traits: {
        languages: [],
        senses: [],
        specials: [],
        speeds: [],
        tools: [],
      },
    };

    let skills = new Map<string, GroupSkill>(
      Object.entries(CONFIG.DND5E.skills).map<[string, GroupSkill]>(
        ([key, skill]) => [
          key,
          {
            ability: skill.ability,
            high: {
              mod: 0,
              value: '0',
              sign: '+',
            },
            low: {
              mod: 0,
              value: '0',
              sign: '+',
            },
            identifiers: new Map<string, GroupSkillModContext>(),
            key,
            name: skill.label,
            proficient: false,
          },
        ]
      )
    );

    let languages = new Map<string, GroupTrait<number>>();
    let senses = new Map<string, MeasuredGroupTrait>();
    let specials = new Map<string, GroupTrait>();
    let speeds = new Map<string, MeasuredGroupTrait>();
    let tools = new Map<string, GroupTrait>();

    for (let { actor } of this.actor.system.members) {
      if (!actor) {
        continue;
      }

      const section = sections[actor.type as SupportedActorType];

      if (!section) {
        continue;
      }

      section.members.push({
        actor,
        portrait: await this._preparePortrait(actor),
        inspirationSource:
          actor.type === CONSTANTS.SHEET_TYPE_CHARACTER
            ? await Tidy5eCharacterSheetQuadrone.tryGetInspirationSource(actor)
            : undefined,
        accentColor: ThemeQuadrone.getSheetThemeSettings({ doc: actor })
          .accentColor,
      });

      // Skills
      Object.entries<SkillData>(
        actor.system.skills ??
          {
            /* Vehicles don't have Skills */
          }
      ).forEach(([key, skill]) => {
        let groupSkill = skills.get(key);
        if (!groupSkill) {
          return;
        }

        const modData = getModifierData(skill.mod);

        if (skill.mod > groupSkill.high.mod) {
          groupSkill.high = {
            mod: skill.mod,
            ...modData,
          };
        }

        groupSkill.identifiers.set(actor.uuid, {
          mod: skill.mod,
          ...modData,
        });

        groupSkill.proficient ||= skill.proficient > 0;
      });

      // Languages
      this._prepareMemberLanguages(actor, languages);

      // Senses

      // Specials

      // Speeds

      // Tools
    }

    sections.skills = [...skills.values()].toSorted((a, b) =>
      a.name.localeCompare(b.name, game.i18n.lang)
    );
    sections.traits.languages = [...languages.values()].toSorted((a, b) =>
      a.label.localeCompare(b.label, game.i18n.lang)
    );

    return sections;
  }

  private _prepareMemberLanguages(
    actor: any,
    languages: Map<string, GroupTrait<number>>
  ) {
    let memberLanguages =
      actor.type === CONSTANTS.SHEET_TYPE_CHARACTER
        ? Tidy5eCharacterSheetQuadrone._getLanguageTraits(actor)
        : actor.type === CONSTANTS.SHEET_TYPE_NPC
        ? Tidy5eNpcSheetQuadrone._getLanguageTraits(actor)
        : [];

    memberLanguages.forEach((language) => {
      const actorLanguageTrait = {
        label: language.label,
        units: language.units,
        value: language.value !== undefined ? language.value : undefined,
      };

      const groupLanguage =
        languages.get(language.label) ??
        languages
          .set(language.label, {
            identifiers: new Map<string, GroupTrait<number>>(),
            ...actorLanguageTrait,
          })
          .get(language.label)!;

      groupLanguage.identifiers.set(actor.uuid, actorLanguageTrait);

      const actorLanguageUniversalValue =
        actorLanguageTrait.value !== undefined &&
        !isNil(actorLanguageTrait.units, '')
          ? dnd5e.utils.convertLength(
              actorLanguageTrait.value,
              actorLanguageTrait.units,
              'ft'
            )
          : undefined;

      const groupLanguageUniversalValue =
        groupLanguage.value !== undefined && !isNil(groupLanguage.units, '')
          ? dnd5e.utils.convertLength(
              groupLanguage.value,
              groupLanguage.units,
              'ft'
            )
          : undefined;

      if (
        actorLanguageUniversalValue &&
        actorLanguageUniversalValue > (groupLanguageUniversalValue ?? 0)
      ) {
        groupLanguage.value = actorLanguageTrait.value;
        groupLanguage.units = actorLanguageTrait.units;
      }

      if (
        actorLanguageTrait.value &&
        actorLanguageTrait.value > (groupLanguage.value ?? 0)
      ) {
        groupLanguage.value = actorLanguageTrait.value;
      }
    });
  }

  async _preparePortrait(actor: Actor5e): Promise<GroupMemberPortraitContext> {
    const showTokenPortrait = this.actor.getFlag(
      CONSTANTS.DND5E_SYSTEM_ID,
      CONSTANTS.SYSTEM_FLAG_SHOW_TOKEN_PORTRAIT
    );

    const token = actor.isToken ? actor.token : actor.prototypeToken;

    const defaults = Actor.implementation.getDefaultArtwork(actor._source);
    let src = showTokenPortrait ? token.texture.src : actor.img;

    if (showTokenPortrait && token?.randomImg) {
      const images = await actor.getTokenImages();
      src = images[Math.floor(Math.random() * images.length)];
    }

    if (!src) {
      src = showTokenPortrait ? defaults.texture.src : defaults.img;
    }

    return {
      src,
      isVideo: foundry.helpers.media.VideoHelper.hasVideoExtension(src),
    };
  }

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
    // Tidy Group Sheet doesn't support active effect drops.
    return false;
  }

  async _onDropActor(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    data: Actor5e
  ): Promise<object | boolean | undefined> {
    if (!this.isEditable) {
      return false;
    }

    const cls = getDocumentClass('Actor');
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
      (m: Group5eMember) => m.actor.id === actorId
    )?.actor;
  }

  async _onSortMember(sourceActor: Actor5e, targetActor: Actor5e) {
    const membersCollection: Group5eMember[] =
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
  /*  Life-Cycle Handlers                         */
  /* -------------------------------------------- */

  async _renderFrame(options: TidyDocumentSheetRenderOptions) {
    const element = await super._renderFrame(options);

    element.querySelector('.window-header').classList.add('theme-dark');

    return element;
  }
}

type SupportedActorType =
  | typeof CONSTANTS.SHEET_TYPE_CHARACTER
  | typeof CONSTANTS.SHEET_TYPE_NPC
  | typeof CONSTANTS.SHEET_TYPE_VEHICLE;
