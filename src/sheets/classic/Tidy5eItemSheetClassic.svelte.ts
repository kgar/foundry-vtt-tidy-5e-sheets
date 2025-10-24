import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import type {
  Item5e,
  ItemDescription,
  ItemFacilityOrdersContext,
  ItemSheetContext as ItemSheetClassicContext,
  ItemSheetContext,
  UsesRecoveryData,
} from 'src/types/item.types';
import TypeNotFoundSheet from './item/TypeNotFoundSheet.svelte';
import { mount } from 'svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TabManager } from 'src/runtime/tab/TabManager';
import type { GroupableSelectOption, Tab } from 'src/types/types';
import { getPercentage } from 'src/utils/numbers';
import { isNil } from 'src/utils/data';
import { initTidy5eContextMenu } from 'src/context-menu/tidy5e-context-menu';
import { Activities } from 'src/features/activities/activities';
import AttachedInfoCard from 'src/components/info-card/AttachedInfoCard.svelte';
import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
import FloatingContextMenu from 'src/context-menu/FloatingContextMenu';
import { TidyExtensibleDocumentSheetMixin } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type { SpellProgressionConfig } from 'src/foundry/config.types';

export class Tidy5eItemSheetClassic extends TidyExtensibleDocumentSheetMixin(
  CONSTANTS.SHEET_TYPE_ITEM,
  SvelteApplicationMixin<
    ApplicationConfiguration | undefined,
    ItemSheetClassicContext
  >(foundry.applications.sheets.ItemSheetV2)
) {
  currentTabId: string | undefined = undefined;
  sectionExpansionTracker: ExpansionTracker;

  constructor(options?: Partial<ApplicationConfiguration> | undefined) {
    super(options);
    
    this._fixedMode = CONSTANTS.SHEET_MODE_EDIT;
    
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
      CONSTANTS.SHEET_TYPE_ITEM,
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
      'tidy-form',
    ],
    tag: 'form',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 560,
      height: 600,
    },
    actions: {
      showIcon: async function (this: Tidy5eItemSheetClassic) {
        const title =
          this.item.system.identified === false
            ? this.item.system.unidentified.name
            : this.item.name;
        new foundry.applications.apps.ImagePopout({
          src: this.item.img,
          uuid: this.item.uuid,
          window: { title },
        }).render({ force: true });
      },
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
    submitOnClose: true,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    const sheetComponent = ItemSheetRuntime.classicSheets[this.item.type];

    const context = new Map<any, any>([
      [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._context],
      [
        CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
        this.sectionExpansionTracker,
      ],
    ]);

    const component = sheetComponent
      ? mount(sheetComponent.Sheet, {
          target: node,
          context: context,
        })
      : mount(TypeNotFoundSheet, {
          target: node,
          context: context,
        });

    new FloatingContextMenu(this.element, '.advancement-item', [], {
      onOpen: (target) =>
        dnd5e.documents.advancement.Advancement.onContextMenu(
          this.item,
          target
        ),
      jQuery: false,
      layout: CONSTANTS.SHEET_LAYOUT_CLASSIC,
    });

    initTidy5eContextMenu(this, this.element, CONSTANTS.SHEET_LAYOUT_CLASSIC);

    return component;
  }

  _createAdditionalComponents(content: HTMLElement) {
    const infoCard = mount(AttachedInfoCard, {
      target: content,
      props: {
        sheet: this,
      },
    });

    return [infoCard];
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<ItemSheetClassicContext> {
    const documentSheetContext = await super._prepareContext(options);

    const rollData = this.document.getRollData();

    // Enrich HTML description
    const enrichmentOptions = {
      secrets: this.document.isOwner,
      relativeTo: this.item,
      rollData: rollData,
    };

    const enriched = {
      description: await foundry.applications.ux.TextEditor.enrichHTML(
        this.document.system.description.value,
        enrichmentOptions
      ),
      unidentified: await foundry.applications.ux.TextEditor.enrichHTML(
        this.document.system.unidentified?.description,
        enrichmentOptions
      ),
      chat: await foundry.applications.ux.TextEditor.enrichHTML(
        this.document.system.description.chat,
        enrichmentOptions
      ),
    };

    const systemSource = this.item.system.toObject();

    const isIdentifiable = 'identified' in this.document.system;

    const itemDescriptions: ItemDescription[] = [];
    itemDescriptions.push({
      enriched: enriched.description,
      content: systemSource.description.value,
      field: 'system.description.value',
      label: FoundryAdapter.localize('DND5E.Description'),
    });

    if (isIdentifiable && FoundryAdapter.userIsGm()) {
      itemDescriptions.push({
        enriched: enriched.unidentified,
        content: systemSource.unidentified.description,
        field: 'system.unidentified.description',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      });
    }

    // kgar: I am knowingly repurposing the Identifiable trait,
    // because for items where identification is irrelevant,
    // they are likely not to have a need for Unidentified or Chat descriptions.
    if (isIdentifiable) {
      itemDescriptions.push({
        enriched: enriched.chat,
        content: systemSource.description.chat,
        field: 'system.description.chat',
        label: FoundryAdapter.localize('DND5E.DescriptionChat'),
      });
    }

    const editable = this.isEditable;

    const target = this.item.type === 'spell' ? this.item.system.target : null;

    documentSheetContext.source = systemSource;

    const context: ItemSheetContext = {
      activities: (this.document.system.activities ?? [])
        .filter((a: any) => {
          return Activities.isConfigurable(a);
        })
        .map(({ _id: id, name, img, sort, uuid }: any) => ({
          id,
          name,
          sort,
          uuid,
          img: { src: img, svg: img?.endsWith('.svg') },
        }))
        .sort((a: any, b: any) => a.sort - b.sort),
      affectsPlaceholder: game.i18n.localize(
        `DND5E.TARGET.Count.${target?.template?.type ? 'Every' : 'Any'}`
      ),
      advancementEditable:
        (this.advancementConfigurationMode || !this.document.isEmbedded) &&
        editable,
      config: CONFIG.DND5E,
      coverOptions: Object.entries(CONFIG.DND5E.cover).map(
        ([value, label]) => ({ value, label })
      ),
      customContent: [],
      customEquipmentTypeGroups:
        ItemSheetRuntime.getCustomEquipmentTypeGroups(),
      data: this.document.toObject(false),
      defaultAbility: '',
      dimensions: target?.template?.dimensions,
      durationUnits: [
        ...Object.entries(CONFIG.DND5E.specialTimePeriods).map(
          ([value, label]) => ({ value, label })
        ),
        ...Object.entries(CONFIG.DND5E.scalarTimePeriods).map(
          ([value, label]) => {
            return { value, label, group: 'DND5E.DurationTime' };
          }
        ),
        ...Object.entries(CONFIG.DND5E.permanentTimePeriods).map(
          ([value, label]) => {
            return { value, label, group: 'DND5E.DurationPermanent' };
          }
        ),
      ],
      enriched,
      isEmbedded: this.document.isEmbedded,
      item: this.document,
      itemDescriptions,
      itemOverrides: new Set<string>(this._getItemOverrides()),
      healthPercentage: getPercentage(
        this.item?.system?.hp?.value,
        this.item?.system?.hp?.max
      ),
      identifiedName: FoundryAdapter.getIdentifiedName(this.item),
      labels: this.document.labels,
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      limited: this.document.limited,
      modernRules: FoundryAdapter.checkIfModernRules(this.item),
      options: this.options,
      owner: this.document.isOwner,
      scalarTarget:
        target?.affects?.type &&
        CONFIG.DND5E.individualTargetTypes[target.affects.type]?.scalar !==
          false,
      sheet: this,
      system: this.document.system,
      tabs: [],
      title: this.title,
      rollData: rollData,

      // Item Type, Status, and Details
      itemType: game.i18n.localize(CONFIG.Item.typeLabels[this.item.type]),
      itemStatus: this._getItemStatus(),
      baseItems: {},
      isPhysical: this.document.system.hasOwnProperty('quantity'),

      // Identified state
      isIdentifiable: isIdentifiable,
      isIdentified: this.document.system.identified !== false,

      // Armor Class
      hasDexModifier:
        this.document.isArmor && this.document.system.type.value !== 'shield',

      // Advancement
      advancement: this._getItemAdvancement(this.document),

      effects: dnd5e.applications.components.EffectsElement.prepareCategories(
        this.document.effects,
        { parent: this.item }
      ),

      concealDetails:
        !game.user.isGM && this.document.system.identified === false,

      toggleAdvancementLock: this.toggleAdvancementLock.bind(this),

      rangeTypes: [
        ...Object.entries(CONFIG.DND5E.rangeTypes).map(([value, label]) => ({
          value,
          label,
        })),
        ...Object.entries(CONFIG.DND5E.movementUnits).map(([value, config]) => {
          return { value, label: config.label, group: 'DND5E.RangeDistance' };
        }),
      ],

      activationTypes: [
        ...Object.entries(CONFIG.DND5E.activityActivationTypes).map(
          // @ts-ignore
          ([value, { label, group }]) => {
            return { value, label, group: group ?? '' };
          }
        ),
        { value: '', label: 'DND5E.NoneActionLabel' },
      ],

      properties: {
        active: [],
        object: {},
        options: [],
      },

      equipmentTypes: [
        ...Object.entries(CONFIG.DND5E.miscEquipmentTypes).map(
          ([value, label]) => ({ value, label })
        ),
        ...Object.entries(CONFIG.DND5E.armorTypes).map(([value, label]) => ({
          value,
          label,
          group: 'DND5E.Armor',
        })),
        ...ItemSheetRuntime.getCustomEquipmentTypeGroups().reduce<
          GroupableSelectOption[]
        >((prev, curr) => {
          for (let [key, typeLabel] of Object.entries(curr.types)) {
            prev.push({
              value: key,
              label: typeLabel,
              group: curr.label,
            });
          }
          return prev;
        }, []),
      ],

      recoveryPeriods: CONFIG.DND5E.limitedUsePeriods.recoveryOptions,

      recoveryTypes: [
        { value: 'recoverAll', label: 'DND5E.USES.Recovery.Type.RecoverAll' },
        { value: 'loseAll', label: 'DND5E.USES.Recovery.Type.LoseAll' },
        { value: 'formula', label: 'DND5E.USES.Recovery.Type.Formula' },
      ],

      usesRecovery: (this.document.system.uses?.recovery ?? []).map(
        (data: UsesRecoveryData) => ({
          data,
          formulaOptions:
            data.period === 'recharge' ? data.recharge?.options : null,
        })
      ),

      damageTypes: [],
      denominationOptions: [],

      spellProgression: [],

      // getSheetData props
      spellcastingMethods: [],

      ...documentSheetContext,
    };

    await this.item.system.getSheetData?.(context);

    if (!context.editable) {
      context.source = context.system;
    }

    // Physical items
    context.baseItems = await this._getItemBaseTypes(context);

    // Properties
    context.properties = {
      active: [],
      object: Object.fromEntries(
        (this.document.system.properties ?? []).map((p: string) => [p, true])
      ),
      options: (this.document.system.validProperties ?? []).reduce(
        (arr: ItemSheetContext['properties']['options'], k: any) => {
          // @ts-ignore
          const { label } = CONFIG.DND5E.itemProperties[k];
          arr.push({
            label,
            value: k,
            selected:
              context.source.properties?.includes?.(k) ??
              context.source.properties?.has?.(k),
          });
          return arr;
        },
        []
      ),
    };

    if (this.item.type !== 'spell') {
      context.properties.options.sort((a, b) =>
        a.label.localeCompare(b.label, game.i18n.lang)
      );
    }

    if (this.item.type === 'class') {
      let progressionConfig: Record<string, SpellProgressionConfig> = {
        ...CONFIG.DND5E.spellProgression,
      };

      // If using modern rules, do not show redundant artificer progression unless it is already selected.
      if (
        game.settings.get('dnd5e', 'rulesVersion') === 'modern' &&
        this.item.system.spellcasting?.progression !== 'artificer'
      ) {
        delete progressionConfig.artificer;
      }

      context.spellProgression = Object.entries(progressionConfig).map(
        ([value, config]) => {
          const group =
            CONFIG.DND5E.spellcasting[config.type ?? '']?.label ?? '';
          return { group, value, label: config.label };
        }
      );
      const { progression } = this.item.system.spellcasting ?? {};
      if (progression && !(progression in CONFIG.DND5E.spellProgression)) {
        context.spellProgression.push({
          value: progression,
          label: progression,
        });
      }

      context.spellProgression.sort(
        (a, b) =>
          (a.group ?? '')?.localeCompare(b.group ?? '', game.i18n.lang) ||
          a.label.localeCompare(b.label, game.i18n.lang)
      );
    }

    if (game.user.isGM || this.item.system.identified !== false) {
      context.properties.active.push(
        ...(this.item.system.cardProperties ?? []),
        // @ts-expect-error
        ...Object.values(this.item.labels.activations?.[0] ?? {}),
        ...(this.item.system.equippableItemCardProperties ?? [])
      );
    }

    // Facilities
    const { building, craft, order, type } = this.item.system;

    if (this.item.type === 'facility') {
      context.orders = Object.entries(
        CONFIG.DND5E.facilities.orders
      ).reduce<ItemFacilityOrdersContext>(
        (obj, [value, config]) => {
          const { label, basic, hidden } = config;
          if (hidden) {
            return obj;
          }

          if (value === 'build') {
            if (!building.built) obj.executable.push({ value, label });
            return obj;
          }

          if (value === 'change') {
            if (type.subtype === 'garden')
              obj.executable.push({ value, label });
            return obj;
          }

          if (type.value === 'basic') {
            if (!building.built) return obj;
            if (basic) obj.executable.push({ value, label });
          } else if (type.value === 'special' && !basic) {
            obj.available.push({ value, label });
            if (value === order || value === 'maintain')
              obj.executable.push({ value, label });
          }

          return obj;
        },
        { available: [], executable: [] }
      );
    }

    if (
      type?.value === 'special' &&
      (order === 'craft' || order === 'harvest')
    ) {
      context.canCraft = true;
      context.isHarvesting = order === 'harvest';
      const crafting = await fromUuid(craft.item);
      if (crafting) {
        context.craft = {
          img: crafting.img,
          name: crafting.name,
          contentLink: crafting.toAnchor().outerHTML,
        };
      }
    }

    // Tabs
    const eligibleCustomTabs = ItemSheetRuntime.getCustomItemTabs(context);

    const customTabs: Tab[] = await TabManager.prepareTabsForRender(
      context,
      eligibleCustomTabs
    );

    const tabs =
      ItemSheetRuntime.classicSheets[this.item.type]?.defaultTabs() ?? [];

    tabs.push(...customTabs);

    context.tabs = tabs;

    // Custom Content
    context.customContent = await ItemSheetRuntime.getContent(context);

    // Handle item subtypes.
    if (['feat', 'loot', 'consumable'].includes(this.document.type)) {
      const name =
        this.document.type === 'feat' ? 'feature' : this.document.type;
      const itemTypes =
        // @ts-expect-error
        CONFIG.DND5E[`${name}Types`][this.document.system.type.value];
      if (itemTypes) {
        context.itemType = itemTypes.label;
        context.itemSubtypes = itemTypes.subtypes;
      }
    }

    return context;
  }

  /**
   * Whether advancements on embedded items should be configurable.
   * @type {boolean}
   */
  advancementConfigurationMode = false;

  /* -------------------------------------------- */

  /**
   * Get the display object used to show the advancement tab.
   * @param {Item5e} item  The item for which the advancement is being prepared.
   * @returns {object}     Object with advancement data grouped by levels.
   */
  _getItemAdvancement(item: Item5e) {
    if (!item.system.advancement) return {};
    const advancement: Record<string, any> = {};
    const configMode = !item.parent || this.advancementConfigurationMode;
    const legacyDisplay = this.options.legacyDisplay;
    const maxLevel = !configMode
      ? item.system.levels ??
        item.class?.system.levels ??
        item.parent.system.details?.level ??
        -1
      : -1;

    // Improperly configured advancements
    if (item.advancement.needingConfiguration.length) {
      advancement.unconfigured = {
        items: item.advancement.needingConfiguration.map((a: any) => ({
          id: a.id,
          order: a.constructor.order,
          title: a.title,
          icon: a.icon,
          classRestriction: a.classRestriction,
          configured: false,
          tags: this._getItemAdvancementTags(a),
          classes: [a.icon?.endsWith('.svg') ? 'svg' : ''].filterJoin(' '),
        })),
        configured: 'partial',
      };
    }

    // All other advancements by level
    for (let [level, advancements] of Object.entries<any>(
      item.advancement.byLevel
    )) {
      if (!configMode)
        advancements = advancements.filter((a: any) => a.appliesToClass);
      const items = advancements.map((advancement: any) => ({
        id: advancement.id,
        order: advancement.sortingValueForLevel(level),
        title: advancement.titleForLevel(level, { configMode, legacyDisplay }),
        icon: advancement.icon,
        classRestriction: advancement.classRestriction,
        summary: advancement.summaryForLevel(level, {
          configMode,
          legacyDisplay,
        }),
        configured: advancement.configuredForLevel(level),
        tags: this._getItemAdvancementTags(advancement),
        value: advancement.valueForLevel?.(level),
        classes: [advancement.icon?.endsWith('.svg') ? 'svg' : ''].filterJoin(
          ' '
        ),
      }));
      if (!items.length) continue;
      advancement[level] = {
        items: items.sort((a: any, b: any) =>
          a.order.localeCompare(b.order, game.i18n.lang)
        ),
        configured:
          level > maxLevel
            ? false
            : items.some((a: any) => !a.configured)
            ? 'partial'
            : 'full',
      };
    }
    return advancement;
  }

  /* -------------------------------------------- */

  /**
   * Prepare tags for an Advancement.
   * @param {Advancement} advancement  The Advancement.
   * @returns {{label: string, icon: string}[]}
   * @protected
   */
  _getItemAdvancementTags(advancement: any) {
    return [];
  }

  /* -------------------------------------------- */

  /**
   * Get the base weapons and tools based on the selected type.
   * @param context        Sheet preparation context.
   * @returns             Object with base items for this type formatted for selectOptions.
   * @protected
   */
  async _getItemBaseTypes(
    context: ItemSheetClassicContext
  ): Promise<Record<string, any>> {
    const baseIds =
      this.item.type === 'equipment'
        ? {
            ...CONFIG.DND5E.armorIds,
            ...CONFIG.DND5E.shieldIds,
          }
        : this.item.type === CONSTANTS.ITEM_TYPE_TOOL
        ? Object.entries(CONFIG.DND5E.tools).reduce<Record<string, string>>(
            (acc, [key, tool]) => {
              acc[key] = tool.id;
              return acc;
            },
            {}
          )
        : // @ts-expect-error
          CONFIG.DND5E[`${this.item.type}Ids`];

    if (baseIds === undefined) {
      return {};
    }

    const baseType = context?.source.type.value ?? this.item.system.type.value;

    const items: Record<string, any> = {};
    for (const [name, id] of Object.entries(baseIds)) {
      const baseItem = await dnd5e.documents.Trait.getBaseItem(id);
      if (baseType !== baseItem?.system?.type?.value) continue;
      items[name] = baseItem.name;
    }
    if (foundry.utils.isEmpty(items)) return {};
    return Object.fromEntries(
      Object.entries(items).sort((lhs, rhs) =>
        lhs[1].localeCompare(rhs[1], game.i18n.lang)
      )
    );
  }

  /* -------------------------------------------- */

  /**
   * Get the text item status which is shown beneath the Item type in the top-right corner of the sheet.
   * @returns {string|null}  Item status string if applicable to item's type.
   * @protected
   */
  _getItemStatus() {
    switch (this.item.type) {
      case 'class':
        return game.i18n.format('DND5E.LevelCount', {
          ordinal: this.item.system.levels.ordinalString(),
        });
      case 'equipment':
      case 'weapon':
        return game.i18n.localize(
          this.item.system.equipped ? 'DND5E.Equipped' : 'DND5E.Unequipped'
        );
      case 'feat':
      case 'consumable':
        return this.item.system.type.label;
      case 'spell':
        return FoundryAdapter.getPreparedLabel(this.item);
      case 'tool':
        return CONFIG.DND5E.proficiencyLevels[
          this.item.system.prof?.multiplier || 0
        ];
    }
    return null;
  }

  /* -------------------------------------------- */

  /**
   * Retrieve the list of fields that are currently modified by Active Effects on the Item.
   * @returns {string[]}
   * @protected
   */
  _getItemOverrides() {
    const overrides = Object.keys(
      foundry.utils.flattenObject(this.item.overrides ?? {})
    );
    this.item.system.getItemOverrides?.(overrides);
    if ('properties' in this.item.system) {
      dnd5e.documents.ActiveEffect5e.addOverriddenChoices(
        this.item,
        'system.properties',
        'system.properties',
        overrides
      );
    }
    if (
      'damage' in this.item.system &&
      foundry.utils.getProperty(this.item.overrides, 'system.damage.parts')
    ) {
      overrides.push('damage-control');
      Array.fromRange(this.item.system.damage.parts.length).forEach((index) =>
        overrides.push(
          `system.damage.parts.${index}.0`,
          `system.damage.parts.${index}.1`
        )
      );
    }
    return overrides;
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  /** @inheritDoc */
  _canDragDrop(selector: string) {
    return this.isEditable;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  _onDragStart(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
  ) {
    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragged = event.currentTarget;

    // Create drag data
    let dragData;

    // Active Effect
    if (dragged.dataset.effectId) {
      const effect = this.item.effects.get(dragged.dataset.effectId);
      dragData = effect.toDragData();
    } else if (
      dragged.classList.contains('advancement-item') &&
      !isNil(dragged.dataset.id)
    ) {
      dragData = this.item.advancement.byId[dragged.dataset.id]?.toDragData();
    }

    if (!dragData) return;

    // Set data transfer
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _onDrop(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement }
  ) {
    const data = foundry.applications.ux.TextEditor.getDragEventData(event);
    const item = this.item;

    const allowed = TidyHooks.dnd5eDropItemSheetData(item, this, data);
    if (allowed === false) return;

    switch (data.type) {
      case 'ActiveEffect':
        return this._onDropActiveEffect(event, data);
      case 'Activity':
        return await this._onDropActivity(event, data);
      case 'Advancement':
        return this._onDropAdvancement(event, data);
      case 'Item':
        return this._onDropItem(event, data);
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle the dropping of ActiveEffect data onto an Item Sheet
   * @param {DragEvent} event                  The concluding DragEvent which contains drop data
   * @param {object} data                      The data transfer extracted from the event
   * @returns {Promise<ActiveEffect|boolean>}  The created ActiveEffect object or false if it couldn't be created.
   * @protected
   */
  async _onDropActiveEffect(event: DragEvent, data: any) {
    const effect = await ActiveEffect.implementation.fromDropData(data);
    if (
      !this.item.isOwner ||
      !effect ||
      this.item.uuid === effect.parent?.uuid ||
      this.item.uuid === effect.origin
    )
      return false;
    const effectData = effect.toObject();
    const options: Record<string, any> = {
      parent: this.item,
      keepOrigin: false,
    };

    if (effect.type === 'enchantment') {
      effectData.origin ??= effect.parent.uuid;
      options.keepOrigin = true;
      options.dnd5e = {
        enchantmentProfile: effect.id,
        activityId: data.activityId,
      };
    }

    return ActiveEffect.create(effectData, options);
  }

  /* -------------------------------------------- */

  /**
   * Handle dropping an Activity onto the sheet.
   * @param {DragEvent} event       The drag event.
   * @param {object} transfer       The dropped data.
   * @param {object} transfer.data  The Activity data.
   * @protected
   */
  async _onDropActivity(
    event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
    { data, uuid }: any
  ) {
    const { _id: id, type } = data;

    const droppedActivityDocument = await fromUuid(uuid);

    // Reordering
    if (this.item.uuid === droppedActivityDocument.item?.uuid) {
      const source = this.item.system.activities.get(id);
      const targetId = event.target.closest<HTMLElement>(
        '.activity[data-activity-id]'
      )?.dataset.activityId;
      const target = this.item.system.activities.get(targetId);
      if (!target || target === source) return;
      const siblings = this.item.system.activities.filter(
        (a: any) => a._id !== id
      );
      const sortUpdates = foundry.utils.SortingHelpers.performIntegerSort(
        source,
        {
          target,
          siblings,
        }
      );
      const updateData = Object.fromEntries(
        sortUpdates.map(({ target, update }: { target: any; update: any }) => {
          return [target._id, { sort: update.sort }];
        })
      );
      this.item.update({ 'system.activities': updateData });
    }

    // Copying
    else {
      delete data._id;
      this.item.createActivity(type, data, { renderSheet: false });
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle dropping another item onto this item.
   * @param {DragEvent} event  The drag event.
   * @param {object} data      The dropped data.
   */
  async _onDropItem(event: DragEvent, data: object) {
    const item = await Item.implementation.fromDropData(data);
    if (item?.type === 'spell' && this.item.system.activities) {
      this._onDropSpell(event, item);
    } else {
      this._onDropAdvancement(event, data);
    }
  }

  /**
   * Handle creating a "Cast" activity when dropping a spell.
   * @param {DragEvent} event  The drag event.
   * @param {Item5e} item      The dropped item.
   */
  _onDropSpell(event: DragEvent, item: Item5e) {
    this.item.createActivity(CONSTANTS.ACTIVITY_TYPE_CAST, {
      spell: { uuid: item.uuid },
    });
  }

  /**
   * Handle the dropping of an advancement or item with advancements onto the advancements tab.
   * @param {DragEvent} event                  The concluding DragEvent which contains drop data.
   * @param {object} data                      The data transfer extracted from the event.
   * @returns {Promise}
   */
  async _onDropAdvancement(event: DragEvent, data: any) {
    if (!this.item.system.advancement) return;

    let advancements;
    let showDialog = false;
    if (data.type === 'Advancement') {
      advancements = [await fromUuid(data.uuid)];
    } else if (data.type === 'Item') {
      const item = await Item.implementation.fromDropData(data);
      if (!item?.system.advancement) return false;
      advancements = Object.values(item.advancement.byId);
      showDialog = true;
    } else {
      return false;
    }
    advancements = advancements.filter((a) => {
      const validItemTypes =
        // @ts-expect-error
        CONFIG.DND5E.advancementTypes[a.constructor.typeName]?.validItemTypes ??
        a.metadata.validItemTypes;
      return (
        !this.item.advancement.byId[a.id] &&
        validItemTypes.has(this.item.type) &&
        a.constructor.availableForItem(this.item)
      );
    });

    // Display dialog prompting for which advancements to add
    if (showDialog) {
      try {
        advancements =
          await dnd5e.applications.advancement.AdvancementMigrationDialog.createDialog(
            this.item,
            advancements
          );
      } catch (err) {
        return false;
      }
    }

    if (!advancements.length) return false;
    if (
      this.item.actor?.system.metadata?.supportsAdvancement &&
      !game.settings.get('dnd5e', 'disableAdvancements')
    ) {
      const manager =
        dnd5e.applications.advancement.AdvancementManager.forNewAdvancement(
          this.item.actor,
          this.item.id,
          advancements
        );
      if (manager.steps.length) return manager.render(true);
    }

    // If no advancements need to be applied, just add them to the item
    const advancementArray = this.item.system.toObject().advancement;
    advancementArray.push(...advancements.map((a: any) => a.toObject()));
    this.item.update({ 'system.advancement': advancementArray });
  }

  async toggleAdvancementLock() {
    this.advancementConfigurationMode = !this.advancementConfigurationMode;
    this.render();
  }

  /* -------------------------------------------- */
  /* Actions
  /* -------------------------------------------- */

  addActivity() {
    return dnd5e.documents.activity.UtilityActivity.createDialog(
      {},
      {
        parent: this.item,
        types: Object.entries(CONFIG.DND5E.activityTypes)
          .filter(([, { configurable }]: any) => {
            return configurable !== false;
          })
          .map(([k]) => k),
      }
    );
  }

  /**
   * Create a new recovery profile.
   */
  addRecovery(): Promise<any> {
    return this.submit({
      updateData: {
        'system.uses.recovery': [
          ...this.item.system.toObject().uses.recovery,
          {},
        ],
      },
    });
  }

  deleteRecovery(index: number) {
    const recovery = this.item.system.toObject().uses.recovery;
    recovery.splice(index, 1);
    return this.submit({ updateData: { 'system.uses.recovery': recovery } });
  }

  updateRecovery(index: number, prop: string, value: string) {
    const recovery = this.item.system.toObject().uses.recovery;
    recovery[index][prop] = value;
    return this.submit({ updateData: { 'system.uses.recovery': recovery } });
  }

  /**
   * Handle one of the advancement actions from the buttons or context menu.
   * @param {Element} target  Button or context menu entry that triggered this action.
   * @param {string} action   Action being triggered.
   * @returns {Promise|void}
   */
  _onAdvancementAction(target: HTMLElement, action: string) {
    const id = target.closest<HTMLElement>('.advancement-item')?.dataset.id;

    if (!id) {
      return;
    }

    const advancement = this.item.advancement.byId[id];
    let manager;
    if (['edit', 'delete', 'duplicate'].includes(action) && !advancement)
      return;
    switch (action) {
      case 'add':
        return dnd5e.documents.advancement.Advancement.createDialog(
          {},
          { parent: this.item }
        );
      case 'edit':
        return new advancement.constructor.metadata.apps.config(
          advancement
        ).render(true);
      case 'delete':
        if (
          this.item.actor?.system.metadata?.supportsAdvancement &&
          !game.settings.get('dnd5e', 'disableAdvancements')
        ) {
          manager =
            dnd5e.applications.advancement.AdvancementManager.forDeletedAdvancement(
              this.item.actor,
              this.item.id,
              id
            );
          if (manager.steps.length) return manager.render(true);
        }
        return this.item.deleteAdvancement(id);
      case 'duplicate':
        return this.item.duplicateAdvancement(id);
      case 'modify-choices':
        const level =
          target.closest<HTMLElement>('[data-level]')?.dataset.level;

        if (!level) {
          return;
        }

        manager =
          dnd5e.applications.advancement.AdvancementManager.forModifyChoices(
            this.item.actor,
            this.item.id,
            Number(level)
          );
        if (manager.steps.length) manager.render(true);
        return;
      case 'toggle-configuration':
        this.advancementConfigurationMode = !this.advancementConfigurationMode;
        return this.render();
    }
  }
}
