import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin';
import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import type {
  Item5e,
  ItemDescription,
  ItemSheetContext as ItemSheetClassicContext,
  ItemSheetContext,
  PropertyContext,
  UsesRecoveryData,
} from 'src/types/item.types';
import TypeNotFoundSheet from './item/TypeNotFoundSheet.svelte';
import type { SvelteComponent } from 'svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TabManager } from 'src/runtime/tab/TabManager';
import type { GroupableSelectOption, Tab } from 'src/types/types';
import { getPercentage } from 'src/utils/numbers';
import { isNil } from 'src/utils/data';
import { DragAndDropMixin } from 'src/mixins/DragAndDropBaseMixin';

export class Tidy5eItemSheetClassic extends DragAndDropMixin(
  SvelteApplicationMixin<ItemSheetClassicContext>(
    foundry.applications.sheets.ItemSheetV2
  )
) {
  currentTabId: string | undefined = undefined;

  constructor(...args: any[]) {
    super(...args);
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'item',
      'app-v2',
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
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
    actions: {},
  };

  _createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    const sheetComponent = ItemSheetRuntime.sheets[this.item.type];

    const context = new Map<any, any>([
      [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._store],
      [CONSTANTS.SVELTE_CONTEXT.STATS, this.stats],
      [CONSTANTS.SVELTE_CONTEXT.CURRENT_TAB_ID, this.currentTabId],
      // [CONSTANTS.SVELTE_CONTEXT.ON_TAB_SELECTED, this.onTabSelected.bind(this)],
    ]);

    const component = sheetComponent
      ? new sheetComponent.Sheet({
          target: node,
          context: context,
        })
      : new TypeNotFoundSheet({
          target: node,
          context: context,
        });

    // Advancement context menu
    const contextOptions = this._getAdvancementContextMenuOptions();

    const html = $(this.element);

    TidyHooks.dnd5eGetItemAdvancementContext(html, contextOptions);

    if (contextOptions) {
      FoundryAdapter.createContextMenu(
        html,
        '.advancement-item',
        contextOptions
      );
    }

    FoundryAdapter.createContextMenu(html, '.activity[data-activity-id]', [], {
      onOpen: (target: HTMLElement) =>
        dnd5e.documents.activity.UtilityActivity.onContextMenu(
          this.item,
          target
        ),
    });

    return component;
  }

  async _prepareContext(
    options: ApplicationRenderOptions
  ): Promise<ItemSheetClassicContext> {
    const rollData = this.document.getRollData();

    // Enrich HTML description
    const enrichmentOptions = {
      secrets: this.document.isOwner,
      relativeTo: this.item,
      rollData: rollData,
    };

    const enriched = {
      description: await TextEditor.enrichHTML(
        this.document.system.description.value,
        enrichmentOptions
      ),
      unidentified: await TextEditor.enrichHTML(
        this.document.system.unidentified?.description,
        enrichmentOptions
      ),
      chat: await TextEditor.enrichHTML(
        this.document.system.description.chat,
        enrichmentOptions
      ),
    };

    const isIdentifiable = 'identified' in this.document.system;

    const itemDescriptions: ItemDescription[] = [];
    itemDescriptions.push({
      content: enriched.description,
      field: 'system.description.value',
      label: FoundryAdapter.localize('DND5E.Description'),
    });

    if (isIdentifiable && FoundryAdapter.userIsGm()) {
      itemDescriptions.push({
        content: enriched.unidentified,
        field: 'system.unidentified.description',
        label: FoundryAdapter.localize('DND5E.DescriptionUnidentified'),
      });
    }
    itemDescriptions.push({
      content: enriched.chat,
      field: 'system.description.chat',
      label: FoundryAdapter.localize('DND5E.DescriptionChat'),
    });

    const sourceSystem = this.document.toObject().system;

    const editable = this.isEditable;

    const target = this.item.type === 'spell' ? this.item.system.target : null;

    const context: ItemSheetContext = {
      activities: this.document.system.activities
        ? (this.document.system.activities ?? [])
            .map(({ _id: id, name, img, sort }: any) => ({
              id,
              name,
              sort,
              img: { src: img, svg: img?.endsWith('.svg') },
            }))
            .sort((a: any, b: any) => a.sort - b.sort)
        : undefined,
      affectsPlaceholder: game.i18n.localize(
        `DND5E.Target${target?.template?.type ? 'Every' : 'Any'}`
      ),
      appId: this.appId,
      advancementEditable:
        (this.advancementConfigurationMode || !this.document.isEmbedded) &&
        editable,
      config: CONFIG.DND5E,
      customContent: [],
      customEquipmentTypeGroups:
        ItemSheetRuntime.getCustomEquipmentTypeGroups(),
      data: this.document.toObject(false),
      dimensions: target?.template?.dimensions,
      document: this.document,
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
      editable: editable,
      enriched,
      fields: this.document.system.schema.fields,
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
      options: this.options,
      owner: this.document.isOwner,
      scalarTarget: !['', 'self', 'any'].includes(target?.affects?.type),
      source: sourceSystem,
      system: this.document.system,
      tabs: [],
      title: this.title,
      rollData: rollData,
      user: game.user,

      // Item Type, Status, and Details
      // @ts-expect-error
      itemType: game.i18n.localize(CONFIG.Item.typeLabels[this.item.type]),
      itemStatus: this._getItemStatus(),
      itemProperties: this._getItemProperties(),
      baseItems: await this._getItemBaseTypes(),
      isPhysical: this.document.system.hasOwnProperty('quantity'),

      // Action Details
      isHealing: this.document.system.actionType === 'heal',
      isFlatDC: this.document.system.save?.scaling === 'flat',
      isLine: ['line', 'wall'].includes(this.document.system.target?.type),
      isFormulaRecharge:
        // @ts-expect-error
        !!CONFIG.DND5E.limitedUsePeriods[this.item.system.uses?.per]?.formula,
      isCostlessAction:
        this.document.system.activation?.type in
        CONFIG.DND5E.staticAbilityActivationTypes,

      // Identified state
      isIdentifiable: isIdentifiable,
      isIdentified: this.document.system.identified !== false,

      // Vehicles
      isCrewed: this.document.system.activation?.type === 'crew',

      // Armor Class
      hasDexModifier:
        this.document.isArmor && this.document.system.type.value !== 'shield',

      // Advancement
      advancement: this._getItemAdvancement(this.document),

      effects: dnd5e.applications.components.EffectsElement.prepareCategories(
        this.document.effects,
        { parent: this.item }
      ),
      elements: this.options.elements,

      concealDetails:
        !game.user.isGM && this.document.system.identified === false,

      toggleAdvancementLock: this.toggleAdvancementLock.bind(this),

      rangeTypes: [
        ...Object.entries(CONFIG.DND5E.rangeTypes).map(([value, label]) => ({
          value,
          label,
        })),
        ...Object.entries(CONFIG.DND5E.movementUnits).map(([value, label]) => {
          return { value, label, group: 'DND5E.RangeDistance' };
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
        object: Object.fromEntries(
          (this.document.system.properties ?? []).map((p: string) => [p, true])
        ),
        options: (this.document.system.validProperties ?? [])
          .reduce((arr: ItemSheetContext['properties']['options'], k: any) => {
            // @ts-ignore
            const { label } = CONFIG.DND5E.itemProperties[k];
            arr.push({
              label,
              value: k,
              selected: this.item._source.system.properties?.includes(k),
            });
            return arr;
          }, [])
          .sort(
            (
              a: PropertyContext['options'][0],
              b: PropertyContext['options'][0]
            ) => {
              return a.label.localeCompare(b.label, game.i18n.lang);
            }
          ),
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

      recoveryPeriods: [
        ...Object.entries(CONFIG.DND5E.limitedUsePeriods)
          //@ts-ignore
          .filter(([, { deprecated }]) => !deprecated)
          .map(([value, { label }]) => ({
            value,
            label,
            group: 'DND5E.DurationTime',
          })),
        { value: 'recharge', label: 'DND5E.USES.Recovery.Recharge.Label' },
      ],

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
    };

    // Tabs
    const eligibleCustomTabs = ItemSheetRuntime.getCustomItemTabs(context);

    const customTabs: Tab[] = await TabManager.prepareTabsForRender(
      context,
      eligibleCustomTabs
    );

    const tabs = ItemSheetRuntime.sheets[this.item.type]?.defaultTabs() ?? [];

    tabs.push(...customTabs);

    context.tabs = tabs;

    // Custom Content
    context.customContent = await ItemSheetRuntime.getContent(context);

    // Etc.
    if (
      !this.document.isEmbedded &&
      foundry.utils.isEmpty(context.abilityConsumptionTargets)
    ) {
      context.abilityConsumptionHint =
        this.item.system.consume?.type === 'attribute'
          ? 'DND5E.ConsumeHint.Attribute'
          : 'DND5E.ConsumeHint.Item';
    }

    // if (
    //   'properties' in this.document.system &&
    //   this.document.type in CONFIG.DND5E.validProperties
    // ) {
    //   context.properties = this.document.system.validProperties.reduce(
    //     (obj: Record<string, unknown>, k: any) => {
    //       // @ts-expect-error
    //       const v = CONFIG.DND5E.itemProperties[k];
    //       obj[k] = {
    //         label: v.label,
    //         selected: this.document.system.properties.has(k),
    //       };
    //       return obj;
    //     },
    //     {}
    //   );
    //   if (this.document.type !== 'spell')
    //     context.properties = dnd5e.utils.sortObjectEntries(
    //       context.properties,
    //       'label'
    //     );
    // }

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

    await this.item.system.getSheetData?.(context);

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
   * @returns {Promise<object>}  Object with base items for this type formatted for selectOptions.
   * @protected
   */
  async _getItemBaseTypes() {
    const baseIds =
      this.item.type === 'equipment'
        ? {
            ...CONFIG.DND5E.armorIds,
            ...CONFIG.DND5E.shieldIds,
          }
        : // @ts-expect-error
          CONFIG.DND5E[`${this.item.type}Ids`];
    if (baseIds === undefined) return {};

    const baseType = this.item.system.type.value;

    const items: Record<string, string> = {};
    for (const [name, id] of Object.entries(baseIds)) {
      const baseItem = await dnd5e.documents.Trait.getBaseItem(id);
      if (baseType !== baseItem?.system?.type?.value) continue;
      items[name] = baseItem.name;
    }
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
        // @ts-expect-error
        return CONFIG.DND5E.spellPreparationModes[
          this.item.system.preparation.mode
        ]?.label;
      case 'tool':
        // @ts-expect-error
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

  /**
   * Get the Array of item properties which are used in the small sidebar of the description tab.
   * @returns {string[]}   List of property labels to be shown.
   * @private
   */
  _getItemProperties() {
    const props = [];
    const labels = this.item.labels;
    switch (this.item.type) {
      case 'consumable':
      case 'weapon':
        if (this.item.isMountable) props.push(labels.armor);
        const ip: Record<string, any> = CONFIG.DND5E.itemProperties;
        // @ts-expect-error
        const vp = CONFIG.DND5E.validProperties[this.item.type];
        this.item.system.properties.forEach((k: string) => {
          if (vp.has(k)) props.push(ip[k].label);
        });
        break;
      case 'equipment':
        // @ts-expect-error
        props.push(CONFIG.DND5E.equipmentTypes[this.item.system.type.value]);
        if (this.item.isArmor || this.item.isMountable)
          props.push(labels.armor);
        break;
      case 'feat':
        props.push(labels.featType);
        break;
      case 'spell':
        props.push(
          labels.components.vsm,
          labels.materials,
          ...labels.components.tags
        );
        break;
    }

    // Action type
    if (this.item.system.actionType) {
      // @ts-expect-error
      props.push(CONFIG.DND5E.itemActionTypes[this.item.system.actionType]);
    }

    // Action usage
    if (
      this.item.type !== 'weapon' &&
      !foundry.utils.isEmpty(this.item.system.activation)
    ) {
      props.push(
        labels.activation,
        labels.range,
        labels.target,
        labels.duration
      );
    }
    return props.filter((p) => !!p);
  }

  /* -------------------------------------------- */

  /**
   * Get the set of ContextMenu options which should be applied for advancement entries.
   * @returns {ContextMenuEntry[]}  Context menu entries.
   * @protected
   */
  _getAdvancementContextMenuOptions() {
    const condition = (li: any) =>
      (this.advancementConfigurationMode || !this.isEmbedded) &&
      this.isEditable;
    return [
      {
        name: 'DND5E.AdvancementControlEdit',
        icon: "<i class='fas fa-edit fa-fw'></i>",
        condition,
        callback: (li: any) => this._onAdvancementAction(li[0], 'edit'),
      },
      {
        name: 'DND5E.AdvancementControlDuplicate',
        icon: "<i class='fas fa-copy fa-fw'></i>",
        condition: (li: any) => {
          const id = li[0].closest('.advancement-item')?.dataset.id;
          const advancement = this.item.advancement.byId[id];
          return (
            condition(li) &&
            advancement?.constructor.availableForItem(this.item)
          );
        },
        callback: (li: any) => this._onAdvancementAction(li[0], 'duplicate'),
      },
      {
        name: 'DND5E.AdvancementControlDelete',
        icon: "<i class='fas fa-trash fa-fw' style='color: rgb(255, 65, 65);'></i>",
        condition,
        callback: (li: any) => this._onAdvancementAction(li[0], 'delete'),
      },
    ];
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  _canDragStart(selector: string) {
    if (['.advancement-item', '[data-effect-id]'].includes(selector))
      return true;
    return this.isEditable;
  }

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
    const li = event.currentTarget;
    if (event.target.classList.contains('content-link')) return;

    // Create drag data
    let dragData;

    // Active Effect
    if (li.dataset.effectId) {
      const effect = this.item.effects.get(li.dataset.effectId);
      dragData = effect.toDragData();
    } else if (
      li.classList.contains('advancement-item') &&
      !isNil(li.dataset.id)
    ) {
      dragData = this.item.advancement.byId[li.dataset.id]?.toDragData();
    }

    if (!dragData) return;

    // Set data transfer
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  _onDrop(event: DragEvent) {
    const data = TextEditor.getDragEventData(event);
    const item = this.item;

    /**
     * A hook event that fires when some useful data is dropped onto an ItemSheet5e.
     * @function dnd5e.dropItemSheetData
     * @memberof hookEvents
     * @param {Item5e} item                  The Item5e
     * @param {ItemSheet5e} sheet            The ItemSheet5e application
     * @param {object} data                  The data that has been dropped onto the sheet
     * @returns {boolean}                    Explicitly return `false` to prevent normal drop handling.
     */
    const allowed = Hooks.call('dnd5e.dropItemSheetData', item, this, data);
    if (allowed === false) return;

    switch (data.type) {
      case 'ActiveEffect':
        return this._onDropActiveEffect(event, data);
      case 'Activity':
        return this._onDropActivity(event, data);
      case 'Advancement':
      case 'Item':
        return this._onDropAdvancement(event, data);
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
      const manager = AdvancementManager.forNewAdvancement(
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
    this.context.set(await this.getData());
  }

  /* -------------------------------------------- */
  /* Actions
  /* -------------------------------------------- */

  addActivity() {
    return dnd5e.documents.activity.UtilityActivity.createDialog(
      {},
      {
        parent: this.item,
        types: Object.keys(CONFIG.DND5E.activityTypes),
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

  // TODO: Make prop of type `keyof WhateverWeCallTheREcoveryType`
  updateRecovery(index: number, prop: string, value: keyof UsesRecoveryData) {
    const recovery = this.item.system.toObject().uses.recovery;
    recovery[index][prop] = value;
    return this.submit({ updateData: { 'system.uses.recovery': recovery } });
  }
}