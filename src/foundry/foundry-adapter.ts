import type {
  ActionItem,
  ActiveEffect5e,
  ActiveEffectContext,
  AttunementContext,
  ClassSummary,
  DropdownListOption,
  LanguageTraitContext,
  SpellcastingInfo,
} from 'src/types/types';
import { CONSTANTS } from '../constants';
import type { Actor5e } from 'src/types/types';
import type { Item5e, MovementInfo, SenseInfo } from 'src/types/item.types';
import { settings, type CurrentSettings } from 'src/settings/settings.svelte';
import { debug, error } from 'src/utils/logging';
import { TidyFlags } from './TidyFlags';
import { TidyHooks } from './TidyHooks';
import { isNil } from 'src/utils/data';
import { clamp } from 'src/utils/numbers';
import { processInputChangeDelta } from 'src/utils/form';
import { calculateSpellAttackAndDc } from 'src/utils/formula';
import type { Activity5e } from './dnd5e.types';
import type { ClassValue } from 'svelte/elements';
import type { TidyExtensibleDocumentSheetMixin } from 'src/mixins/TidyDocumentSheetMixin.svelte';

const quadroneSheetRegex = /Tidy.*Quadrone/;
export type DocumentSheetConstructor = new (...args: any[]) => InstanceType<
  ReturnType<typeof TidyExtensibleDocumentSheetMixin>
>;
export type TidySheetClassMetadata = {
  documentClass: any;
  documentName: string;
  documentSubtype: string;
  isDefault: boolean;
  sheetClass: DocumentSheetConstructor;
  sheetClassIdentifier: string;
  typeLabel: string;
};

export const FoundryAdapter = {
  deepClone(obj: any) {
    return foundry.utils.deepClone(obj);
  },
  userIsGm() {
    return game.user.isGM === true;
  },
  getTidySetting<T = string>(settingName: string): T {
    return game.settings.get(CONSTANTS.MODULE_ID, settingName) as T;
  },
  async setTidySetting(
    key: keyof CurrentSettings,
    value: unknown
  ): Promise<void> {
    await game.settings.set(CONSTANTS.MODULE_ID, key, value);
  },
  registerTidySetting(key: string, data: any): void {
    game.settings.register(CONSTANTS.MODULE_ID, key, data);
  },
  registerTidyMenu(key: string, data: any): void {
    game.settings.registerMenu(CONSTANTS.MODULE_ID, key, data);
  },
  getGameSetting<T = string>(namespace: string, settingName: string): T {
    return game.settings.get(namespace, settingName) as T;
  },
  getSystemSetting<T = string>(settingName: string): T {
    return FoundryAdapter.getGameSetting(
      CONSTANTS.DND5E_SYSTEM_ID,
      settingName
    );
  },
  localize(value: string, options?: Record<string, unknown>) {
    if (options) {
      return game.i18n.format(value, options);
    }

    return game.i18n.localize(value);
  },
  /** A spell can be prepared if its method is prepareable and it is not Always Prepared. */
  canPrepareSpell(item: Item5e) {
    return (
      item.system.canPrepare &&
      item.system.prepared !== CONFIG.DND5E.spellPreparationStates.always.value
    );
  },
  getPreparedLabel(item: Item5e) {
    return Object.values(CONFIG.DND5E.spellPreparationStates).find(
      (s) => s.value === item.system.prepared
    )?.label;
  },
  mergeObject<T>(original: T, ...args: any[]) {
    return foundry.utils.mergeObject(original, ...args) as T;
  },
  expandObject(data: any) {
    return foundry.utils.expandObject(data);
  },
  doActionOnMiddleClick(event: MouseEvent, action: () => any) {
    if (event.button !== CONSTANTS.MOUSE_BUTTON_AUXILIARY) {
      return;
    }

    event.preventDefault();

    return action();
  },
  documentIsEditable(document: any) {
    if (document.pack) {
      const pack = game.packs.get(document.pack);
      if (pack.locked) return false;
    }
    return document.testUserPermission(
      game.user,
      CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
    );
  },
  editOnMiddleClick(
    event: MouseEvent,
    entityWithSheet: {
      sheet: { render: (force: boolean) => void; isEditable: boolean };
    }
  ) {
    return FoundryAdapter.doActionOnMiddleClick(event, () =>
      FoundryAdapter.editOnMouseEvent(event, entityWithSheet)
    );
  },
  editOnMouseEvent(
    event: MouseEvent,
    entityWithSheet: {
      sheet: {
        render: (force: boolean, options?: any) => void;
        isEditable: boolean;
      };
    }
  ) {
    if (!entityWithSheet.sheet.isEditable) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    entityWithSheet.sheet.render(true, { mode: CONSTANTS.SHEET_MODE_EDIT });
  },
  createItem({ type, ...data }: Record<string, any>, actor: Actor5e) {
    // Check to make sure the newly created class doesn't take player over level cap
    if (
      type === 'class' &&
      actor.system.details.level + 1 > CONFIG.DND5E.maxLevel
    ) {
      const error = game.i18n.format('DND5E.MaxCharacterLevelExceededWarn', {
        max: CONFIG.DND5E.maxLevel,
      });
      ui.notifications.error(error);
      return null;
    }

    // Enforce the singleton rule for singleton items (e.g., an actor can have only one race)
    const dataModel = CONFIG.Item.dataModels[type];
    const singleton = dataModel?.metadata.singleton ?? false;
    if (singleton && actor.itemTypes[type].length) {
      const error = FoundryAdapter.localize('DND5E.ACTOR.Warning.Singleton', {
        itemType: type,
        actorType: actor.type,
      });
      ui.notifications.error(error);
      return null;
    }

    const itemData = foundry.utils.mergeObject(
      {
        name: FoundryAdapter.localize('DND5E.ItemNew', {
          type: FoundryAdapter.localize(
            CONFIG.Item.typeLabels[type as keyof typeof CONFIG.Item.typeLabels]
          ),
        }),
        type,
      },
      foundry.utils.expandObject({ ...data })
    );

    if (!TidyHooks.tidy5eSheetsPreCreateItem(actor, itemData, game.user.id)) {
      return;
    }

    return actor.createEmbeddedDocuments('Item', [itemData]);
  },
  async onLevelChange(
    event: Event & { currentTarget: EventTarget & HTMLSelectElement },
    item: any,
    actor: Actor5e
  ) {
    event.preventDefault();
    const target = event.currentTarget;
    if (!target?.value === undefined) {
      return;
    }

    const delta = Number(event.currentTarget.value);

    if (!delta || !item.id) {
      return;
    }

    return FoundryAdapter.changeLevel(actor, item, delta);
  },
  async changeLevel(actor: Actor5e, item: Item5e, delta: number) {
    if (!game.settings.get('dnd5e', 'disableAdvancements')) {
      const manager =
        dnd5e.applications.advancement.AdvancementManager.forLevelChange(
          actor,
          item.id,
          delta
        );
      if (manager.steps.length) {
        if (delta > 0) return manager.render(true);
        try {
          const shouldRemoveAdvancements =
            await dnd5e.applications.advancement.AdvancementConfirmationDialog.forLevelDown(
              item
            );
          if (shouldRemoveAdvancements) return manager.render(true);
        } catch (err) {
          return;
        }
      }
    }

    return item.update({
      'system.levels': item.system.levels + delta,
    });
  },
  getSpellComponentLabels() {
    return Array.from(CONFIG.DND5E.validProperties.spell).reduce<
      Record<string, string>
    >((prev, curr) => {
      const config =
        CONFIG.DND5E.itemProperties[
        curr as keyof typeof CONFIG.DND5E.itemProperties
        ];
      if (config.abbreviation) {
        prev[config.abbreviation] = config.label;
      }
      return prev;
    }, {});
  },
  getProperty<T = unknown>(obj: any, path: string): T | undefined {
    return foundry.utils.getProperty(obj, path);
  },
  getProficiencyIconClass(level: number) {
    const icons: Record<number, string> = {
      0: 'far fa-circle color-text-gold',
      0.5: 'fas fa-circle-half-stroke color-text-gold-emphasis',
      1: 'fas fa-circle color-text-gold-emphasis',
      2: 'fas fa-circle-star color-text-gold-light',
    };
    return icons[level] || icons[0];
  },
  searchItem(item: any, searchCriteria: string): boolean {
    return (
      searchCriteria.trim() === '' ||
      (item.system.identified === false &&
        item.system.unidentified?.name
          ?.toLowerCase()
          .includes(searchCriteria.toLowerCase())) ||
      (item.system.identified !== false &&
        item.name.toLowerCase().includes(searchCriteria.toLowerCase()))
    );
  },
  getWeightUnit() {
    return FoundryAdapter.localize(
      `DND5E.UNITS.WEIGHT.${game.settings.get('dnd5e', 'metricWeightUnits') ? 'Kilogram' : 'Pound'
      }.Abbreviation`
    );
  },
  getEffectActor(effect: ActiveEffect5e) {
    return (
      // Item-Owned
      effect.parent?.actor ??
      // Actor-Owned
      effect.parent
    );
  },
  isEffectFavorited(effect: ActiveEffect5e, actor: Actor5e) {
    if (
      actor?.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR &&
      'favorites' in actor.system
    ) {
      const relativeUuid = effect.getRelativeUUID(actor);
      return actor.system.favorites.some((f: any) => f.id === relativeUuid);
    }
  },
  async toggleFavoriteEffect(effect: ActiveEffect5e) {
    const actor = FoundryAdapter.getEffectActor(effect);

    if (!actor || !actor.system?.addFavorite) {
      return;
    }

    const favorited = FoundryAdapter.isEffectFavorited(effect, actor);
    if (favorited) {
      await actor.system.removeFavorite(effect.getRelativeUUID(actor));
    } else {
      await actor.system.addFavorite({
        type: 'effect',
        id: effect.getRelativeUUID(actor),
      });
    }
  },
  isItemFavorited(document: any) {
    const actor = document.actor;

    if (actor && 'favorites' in actor.system) {
      const relativeUuid = document.getRelativeUUID(actor);
      return actor.system.hasFavorite(relativeUuid);
    }

    return false;
  },
  isActivityFavorited(activity: Activity5e) {
    const actor = activity.actor;

    if (actor && 'favorites' in actor.system) {
      return actor.system.hasFavorite(activity.relativeUUID);
    }

    return false;
  },
  async toggleFavoriteItem(document: any) {
    const actor = document.actor;

    if (!actor || !actor.system?.addFavorite) {
      return;
    }

    const favorited = FoundryAdapter.isItemFavorited(document);

    if (favorited) {
      await actor.system.removeFavorite(document.getRelativeUUID(actor));
    } else {
      await actor.system.addFavorite({
        type: 'item',
        id: document.getRelativeUUID(actor),
      });
    }
  },
  isInGmEditMode(document: any): boolean {
    return (
      document?.sheet?.sheetMode === CONSTANTS.SHEET_MODE_EDIT &&
      FoundryAdapter.userIsGm()
    );
  },
  shouldLockMoneyChanges() {
    return !FoundryAdapter.userIsGm() && settings.value.lockMoneyChanges;
  },
  getModule(moduleId: string): any | undefined {
    return game.modules.get(moduleId);
  },
  debounce(callback: Function, delay: number): Function {
    return foundry.utils.debounce(callback, delay);
  },
  throttle(callback: Function, delay: number): Function {
    return foundry.utils.throttle(callback, delay);
  },
  renderCreatureTypeConfig(document: Actor5e) {
    const raceId: string | undefined = document.system.details?.race?.id;

    const documentToUpdate = raceId ? document.system.details.race : document;

    const keyPath =
      documentToUpdate.type === CONSTANTS.ITEM_TYPE_RACE
        ? // A species document
        'type'
        : // An actor without a species
        'details.type';

    const options: Record<string, any> = {
      document: documentToUpdate,
      keyPath,
    };

    return new dnd5e.applications.shared.CreatureTypeConfig(options).render(
      true
    );
  },
  calculateAverageFromFormula(formula: string) {
    let r = new Roll(formula);
    let term = r.terms;
    debug(`tidy5e-npc | activateListeners | term: ${term}`);
    let averageString: string | any[] = '';
    for (let i = 0; i < term.length; i++) {
      let type = term[i].constructor.name;
      switch (type) {
        case 'Die': {
          averageString += Math.floor(
            (term[i].faces * term[i].number + term[i].number) / 2
          );
          break;
        }
        case 'OperatorTerm': {
          averageString += term[i].operator;
          break;
        }
        case 'NumericTerm': {
          averageString += term[i].number;
          break;
        }
        default: {
          break;
        }
      }
    }
    debug(`tidy5e-npc | activateListeners | averageString: ${averageString}`);
    let average = 0;
    averageString =
      averageString.replace(/\s/g, '').match(/[+\-]?([0-9\.\s]+)/g) ?? [];
    while (averageString.length) {
      average += parseFloat(averageString.shift());
    }
    debug(`tidy5e-npc | activateListeners | average: ${average}`);
    return average;
  },
  enrichHtml(value: string, options?: any): Promise<string> {
    return foundry.applications.ux.TextEditor.enrichHTML(value, options);
  },
  createAdvancementSelectionDialog(item: any) {
    return dnd5e.documents.advancement.Advancement.createDialog(
      {},
      { parent: item }
    );
  },
  modifyAdvancementChoices(advancementLevel: string, item: Item5e) {
    let manager =
      dnd5e.applications.advancement.AdvancementManager.forModifyChoices(
        item.actor,
        item.id,
        Number(advancementLevel)
      );

    if (manager.steps.length) {
      manager.render(true);
    }
  },
  async renderSheetFromUuid(uuid: string) {
    (await fromUuid(uuid))?.sheet?.render(true);
  },
  renderArmorConfig(document: any) {
    return new dnd5e.applications.actor.ArmorClassConfig({ document }).render(
      true
    );
  },
  renderInitiativeConfig(document: any) {
    return new dnd5e.applications.actor.InitiativeConfig({
      document,
    }).render(true);
  },
  renderAbilityConfig(document: any, key: any) {
    return new dnd5e.applications.actor.AbilityConfig({
      document,
      key,
    }).render(true);
  },
  renderDeathConfig(document: any) {
    return new dnd5e.applications.actor.DeathConfig({ document }).render(true);
  },
  renderLanguagesConfig(actor: Actor5e) {
    new dnd5e.applications.actor.LanguagesConfig({
      document: actor,
    }).render({ force: true });
  },
  renderMovementSensesConfig(document: any, type: 'movement' | 'senses') {
    return new dnd5e.applications.shared.MovementSensesConfig({
      document,
      type,
    }).render(true);
  },
  renderHitPointsDialog(document: any) {
    return new dnd5e.applications.actor.HitPointsConfig({ document }).render(
      true
    );
  },
  renderHitDiceConfig(document: any) {
    return new dnd5e.applications.actor.HitDiceConfig({ document }).render(
      true
    );
  },
  renderToolsConfig(document: any) {
    return new dnd5e.applications.actor.ToolsConfig({
      document,
      trait: 'tool',
    }).render(true);
  },
  renderTraitsConfig(document: any, trait: string) {
    return new dnd5e.applications.actor.TraitsConfig({
      document,
      trait,
    }).render(true);
  },
  renderWeaponsConfig(actor: any) {
    return new dnd5e.applications.actor.WeaponsConfig({
      document: actor,
      trait: 'weapon',
    }).render({ force: true });
  },
  renderSkillToolConfig(document: any, trait: 'skills' | 'tool', key: string) {
    return new dnd5e.applications.actor.SkillToolConfig({
      document,
      trait,
      key,
    }).render(true);
  },
  renderSourceConfig(document: any, keyPath: string) {
    return new dnd5e.applications.shared.SourceConfig(
      { document: document },
      {
        keyPath,
      }
    ).render(true);
  },
  async onActorItemDelete(actor: Actor5e, item: Item5e) {
    // If item has advancement, handle it separately
    if (
      actor?.system.metadata?.supportsAdvancement &&
      !game.settings.get('dnd5e', 'disableAdvancements')
    ) {
      const manager =
        dnd5e.applications.advancement.AdvancementManager.forDeletedItem(
          actor,
          item.id
        );

      if (manager.steps.length) {
        try {
          const shouldRemoveAdvancements =
            await dnd5e.applications.advancement.AdvancementConfirmationDialog.forDelete(
              item
            );

          if (shouldRemoveAdvancements) {
            return manager.render(true);
          }

          return item.delete({ shouldRemoveAdvancements });
        } catch (err) {
          // This dialog throws an exception when you click cancel. We'll ignore it.
          return;
        }
      }
    }

    return item.deleteDialog();
  },
  getActivationTypeLabel(activationType: string) {
    return activationType === 'other'
      ? FoundryAdapter.localize('DND5E.ActionOther')
      : game.dnd5e.config.abilityActivationTypes[activationType];
  },
  async actorTryUseItem(item: Item5e, event: Event) {
    const config = { legacy: false, event };

    const suppressItemUse =
      TidyHooks.tidy5eSheetsActorPreUseItem(item, config) === false;

    if (suppressItemUse) {
      return;
    }

    return await item.use(config);
  },
  /**
   * Fires appropriate hooks related to tab selection and reports whether tab selection was cancelled.
   * @param app the associated sheets
   * @param newTabId the new tab ID to select
   * @returns `true` to indicate proceeding with tab change; `false` to halt tab change
   */
  onTabSelecting(
    app: { currentTabId: string; element: HTMLElement },
    newTabId: string
  ) {
    if (!app.element) {
      return false;
    }

    const canProceed = TidyHooks.tidy5eSheetsPreSelectTab(app, app.element, {
      currentTab: app.currentTabId,
      newTab: newTabId,
    });

    if (!canProceed) {
      return false;
    }

    setTimeout(() => {
      if (!app.element) {
        return;
      }

      TidyHooks.tidy5eSheetsSelectTab(app, app.element, newTabId);
    });

    return true;
  },
  concealDetails(item: Item5e | null | undefined) {
    return !game.user.isGM && item?.system?.identified === false;
  },
  getIdentifiedName(item: Item5e): string {
    if (!FoundryAdapter.userIsGm() || item?.system?.identified !== false) {
      return item.name;
    }

    try {
      return FoundryAdapter.localize('TIDY5E.GMOnly.Message', {
        message: item.toJSON().name,
      });
    } catch (e) {
      error(
        'An error occurred while getting the identified name of this item for the GM',
        false,
        e
      );
      return '';
    }
  },
  async toggleCondition(document: Actor5e, condition: any) {
    const existing = document.effects.get(
      dnd5e.utils.staticID(`dnd5e${condition.id}`)
    );

    if (existing) {
      return existing.delete();
    }

    const effect = await ActiveEffect.implementation.fromStatusEffect(
      condition.id
    );

    return ActiveEffect.implementation.create(effect, {
      parent: document,
      keepId: true,
    });
  },
  getEffect({
    document,
    effectId,
    parentId,
  }: {
    document: any;
    effectId: string;
    parentId?: string;
  }) {
    let effect = document.effects?.get(effectId);
    if (effect) {
      return effect;
    }
    const parentDocument = document.items.get(parentId);
    effect = parentDocument?.effects?.get(effectId);
    return (
      effect ??
      FoundryAdapter.tryGetLegacyTransferredEffect(parentDocument, effectId)
    );
  },
  /** Last-ditch effort to find an effect by ID in a given document. */
  tryGetLegacyTransferredEffect(document: any, effectId: string) {
    return document
      ?.allApplicableEffects?.()
      .find((e: ActiveEffect5e) => e.id === effectId);
  },
  attunementContextApplicable: {
    icon: 'fa-sun',
    cls: 'not-attuned',
    title: 'ERROR: This should be replaced with valid attunement type text',
  },
  attunementContextAttune: {
    icon: 'fa-sun',
    cls: 'attuned',
    title: 'DND5E.AttunementAttuned',
  },
  isAttunementApplicable(item: Item5e) {
    return !!CONFIG.DND5E.attunementTypes[
      item.system.attunement as keyof typeof CONFIG.DND5E.attunementTypes
    ];
  },
  getAttunementContext(item: Item5e): AttunementContext | undefined {
    return FoundryAdapter.isAttunementApplicable(item) && !item.system.attuned
      ? {
        ...FoundryAdapter.attunementContextApplicable,
        title:
          CONFIG.DND5E.attunementTypes[
          item.system
            .attunement as keyof typeof CONFIG.DND5E.attunementTypes
          ],
      }
      : !!item.system.attunement && item.system.attuned
        ? FoundryAdapter.attunementContextAttune
        : undefined;
  },
  canIdentify(item: Item5e) {
    return (
      FoundryAdapter.userIsGm() ||
      (settings.value.itemIdentificationPermission ===
        CONSTANTS.SHEET_SETTINGS_OPTION_GM_AND_OWNERS &&
        item.isOwner)
    );
  },
  openSpellSlotsConfig(document: any) {
    new dnd5e.applications.actor.SpellSlotsConfig({ document }).render(true);
  },
  openDamagesConfig(document: Actor5e, trait: 'dr' | 'di' | 'dv' | 'dm') {
    new dnd5e.applications.actor.DamagesConfig({ document, trait }).render(
      true
    );
  },
  openConcentrationConfig(document: any) {
    new dnd5e.applications.actor.ConcentrationConfig({
      document: document,
    }).render(true);
  },
  openStartingEquipmentConfig(item: Item5e) {
    new dnd5e.applications.item.StartingEquipmentConfig({
      document: item,
    }).render(true);
  },
  isConcentrationEffect(effect: ActiveEffect5e, app: any) {
    return (
      app.document instanceof dnd5e.documents.Actor5e &&
      app._concentration?.effects.has(effect)
    );
  },
  /**
   * Stack identical consumables when a new one is dropped rather than creating a duplicate item.
   */
  onDropStackConsumablesForActor(
    actor: Actor5e,
    itemData: any,
    { container = null }: { container?: any | null } = {}
  ): Promise<Item5e> | null {
    // TODO: Move this to the base actor sheet in app V2 when all actors go App V2.
    const droppedSourceId =
      itemData._stats?.compendiumSource ?? itemData.flags.core?.sourceId;

    if (itemData.type !== 'consumable' || !droppedSourceId) {
      return null;
    }

    const similarItem = actor.sourcedItems
      .get(droppedSourceId, { legacy: false })
      ?.filter(
        (i: Item5e) =>
          i.system.container === container && i.name === itemData.name
      )
      ?.first();

    if (!similarItem) {
      return null;
    }

    return similarItem.update({
      'system.quantity':
        similarItem.system.quantity + Math.max(itemData.system.quantity, 1),
    });
  },
  /**
   * Handle a drop event for an existing embedded Item to sort that Item relative to its siblings
   */
  onSortItemForActor(actor: Actor5e, event: Event, itemData: any): any {
    const eventTarget = event.target as HTMLElement | null;

    if (!eventTarget) {
      return;
    }

    // Get the drag source and drop target
    const items = actor.items;
    const source = items.get(itemData._id);

    const dropTarget = eventTarget.closest<HTMLElement>('[data-item-id]');
    if (!dropTarget) return;
    const target = items.get(dropTarget.dataset.itemId);

    // Don't sort on yourself
    if (source.id === target.id) return;

    // Identify sibling items based on adjacent HTML elements
    const siblings = [];
    for (let el of Array.from(dropTarget.parentElement!.children)) {
      if (el instanceof HTMLElement) {
        const siblingId = el.dataset.itemId;
        if (siblingId && siblingId !== source.id)
          siblings.push(items.get(el.dataset.itemId));
      }
    }

    // Perform the sort
    const sortUpdates = foundry.utils.SortingHelpers.performIntegerSort(
      source,
      {
        target,
        siblings,
      }
    );

    const sectionUpdate = FoundryAdapter.getSectionUpdateForDropTarget(
      eventTarget,
      itemData
    );

    const updateData = sortUpdates.map((u: any) => {
      const update = u.update;
      update._id = u.target._id;
      if (update._id === source.id) {
        foundry.utils.mergeObject(update, sectionUpdate);
      }
      return update;
    });

    // Perform the update
    return actor.updateEmbeddedDocuments('Item', updateData);
  },
  getSectionUpdateForDropTarget(eventTarget: HTMLElement, itemData: any) {
    // Handle Tidy Custom Section Transfer
    const sectionProp = eventTarget.closest('.tidy-tab.actions')
      ? 'actionSection'
      : 'section';

    const sourceSection = foundry.utils.getProperty(
      itemData,
      TidyFlags[sectionProp].prop
    );

    const targetSection = eventTarget
      .closest('[data-tidy-section-key][data-custom-section="true"]')
      ?.getAttribute('data-tidy-section-key');

    const isMovedToNewSection =
      !isNil(targetSection?.trim(), '') && sourceSection !== targetSection;

    const isMovedToDefaultSection =
      !isNil(sourceSection?.trim(), '') && isNil(targetSection?.trim(), '');

    let sectionUpdate: Record<string, any> = {};

    if (isMovedToNewSection) {
      sectionUpdate[TidyFlags[sectionProp].prop] = targetSection;
    } else if (isMovedToDefaultSection) {
      sectionUpdate[TidyFlags[sectionProp].unsetProp] = null;
    }

    return sectionUpdate;
  },
  formatCr(cr: unknown) {
    return dnd5e.utils.formatCR(cr);
  },
  formatNumber(num: number) {
    return dnd5e.utils.formatNumber(num) as string;
  },
  handleDocumentUsesChanged(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    documentWithUses: any,
    valueProp: string = 'system.uses.value',
    spentProp: string = 'system.uses.spent',
    maxProp: string = 'system.uses.max'
  ) {
    event.preventDefault();
    event.stopPropagation();

    const value = processInputChangeDelta(
      event.currentTarget.value,
      documentWithUses,
      valueProp
    );

    const max =
      FoundryAdapter.getProperty<number>(documentWithUses, maxProp) ?? 0;

    const uses = clamp(0, value, max);
    event.currentTarget.value = uses.toString();

    return documentWithUses.update({ [spentProp]: max - uses });
  },
  async handleActivityUsesChanged(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    activity: Activity5e
  ) {
    const value = processInputChangeDelta(
      event.currentTarget.value,
      activity,
      'uses.value'
    );

    const uses = clamp(0, value, activity.uses.max);
    event.currentTarget.value = uses.toString();

    return await activity.update({ 'uses.spent': activity.uses.max - uses });
  },
  // TEMP: Find better home
  groupSelectOptions(entries: [string, any][]) {
    const groupMap: Record<string, typeof entries> = {};
    for (let [key, value] of entries) {
      let groupMapKey =
        typeof value === 'object' && 'group' in value ? value.group ?? '' : '';
      (groupMap[groupMapKey] ??= []).push([key, value]);
    }
    return Object.entries<any>(groupMap);
  },
  checkIfModernRules(document: any) {
    return document.system.source?.rules
      ? document.system.source?.rules === '2024'
      : game.settings.get('dnd5e', 'rulesVersion') === 'modern';
  },
  isLockedInCompendium(doc: any) {
    return game.packs.get(doc.pack)?.locked;
  },
  getMovementInfo(movement: any): Record<string, MovementInfo> {
    const units =
      CONFIG.DND5E.movementUnits[
      movement.units || Object.keys(CONFIG.DND5E.movementUnits)[0]
      ];
    return Object.entries(CONFIG.DND5E.movementTypes).reduce<
      Record<string, MovementInfo>
    >((obj, [k, config]) => {
      const value = movement[k];
      if (value)
        obj[k] = { label: config.label, value, unit: units.abbreviation };
      return obj;
    }, {} satisfies Record<string, MovementInfo>);
  },
  getSensesInfo(senses: any): Record<string, SenseInfo> {
    const units =
      CONFIG.DND5E.movementUnits[
      senses.units || Object.keys(CONFIG.DND5E.movementUnits)[0]
      ];
    return Object.entries(CONFIG.DND5E.senses).reduce<
      Record<string, SenseInfo>
    >((obj, [k, label]) => {
      const value = senses[k];
      if (value) obj[k] = { label, value, unit: units.abbreviation };
      return obj;
    }, {} satisfies Record<string, SenseInfo>);
  },
  getActivationText(type: string) {
    return {
      abbreviation: {
        action: 'DND5E.ActionAbbr',
        bonus: 'DND5E.BonusActionAbbr',
        reaction: 'DND5E.ReactionAbbr',
        legendary: 'TIDY5E.LegendaryAbbr',
        lair: 'TIDY5E.LairAbbr',
        minute: 'DND5E.TimeMinuteAbbr',
        hour: 'DND5E.TimeHourAbbr',
        day: 'DND5E.TimeDayAbbr',
      }[type || ''],
      label: CONFIG.DND5E.activityActivationTypes[type]?.label,
    };
  },
  getAdvancementOriginId(item: Item5e) {
    let [originId] = (item.flags.dnd5e?.advancementOrigin ?? '').split('.');

    return originId;
  },
  getSpellMethodConfig(item: Item5e) {
    return (
      CONFIG.DND5E.spellcasting[item.system.method] ??
      CONFIG.DND5E.spellcasting.innate
    );
  },
  getSpellIcon(item: Item5e): ClassValue {
    const config = FoundryAdapter.getSpellMethodConfig(item);

    const method = config.key;

    let classes: ClassValue = [];

    if (config.prepares) {
      classes.push('can-prepare');
      classes.push(
        item.system.prepared ===
          CONFIG.DND5E.spellPreparationStates.prepared.value
          ? 'fa-solid prepared'
          : item.system.prepared ===
            CONFIG.DND5E.spellPreparationStates.always.value
            ? 'fa-solid always'
            : 'fa-regular unprepared'
      );
    } else {
      classes.push('cannot-prepare', 'fa-solid');
    }

    switch (method) {
      case CONSTANTS.SPELL_PREPARATION_METHOD_SPELL:
        classes.push('fa-book');
        break;
      case CONSTANTS.SPELL_PREPARATION_METHOD_ATWILL:
        classes.push('fa-hand-sparkles');
        break;
      case CONSTANTS.SPELL_PREPARATION_METHOD_INNATE:
        classes.push('fa-hand-holding-magic');
        break;
      case CONSTANTS.SPELL_PREPARATION_METHOD_PACT:
        classes.push('fa-moon');
        break;
      case CONSTANTS.SPELL_PREPARATION_METHOD_RITUAL:
        classes.push('fa-candle-holder');
        break;
      default:
        classes.push('fa-sparkles');
        break;
    }

    return classes;
  },
  getRollModeState(ev: Event) {
    return {
      normal: dnd5e.utils.areKeysPressed(ev, 'skipDialogNormal'),
      advantage: dnd5e.utils.areKeysPressed(ev, 'skipDialogAdvantage'),
      disadvantage: dnd5e.utils.areKeysPressed(ev, 'skipDialogDisadvantage'),
    };
  },
  hasVideoExtension(src: string): boolean {
    return foundry.helpers.media.VideoHelper.hasVideoExtension(src);
  },
  getAllTidySheetClassMetadata(): TidySheetClassMetadata[] {
    const result: TidySheetClassMetadata[] = [];

    const documentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

    const setting = game.settings.get('core', 'sheetClasses');

    for (const { name, documentName, hasTypeData } of Object.values<any>(
      foundry.documents
    )) {
      // documentName -> e.g., "Actor", "Item", ...
      if (!hasTypeData) {
        continue;
      }

      if (name.startsWith('Base')) {
        continue;
      }

      const subTypes = game.documentTypes[documentName].filter(
        (t: string) => t !== CONST.BASE_DOCUMENT_TYPE
      );

      if (!subTypes.length) {
        continue;
      }

      for (let subType of subTypes) {
        const { defaultClasses } =
          documentSheetConfig.getSheetClassesForSubType(documentName, subType);

        const className = Object.keys(defaultClasses).find((c: string) =>
          quadroneSheetRegex.test(c)
        );

        if (!className) {
          continue;
        }

        const sheetClassDetails =
          // @ts-expect-error - todo: make this somehow work with TS
          CONFIG[documentName]?.sheetClasses[subType]?.[className];

        const documentClass =
          // @ts-expect-error - todo: make this somehow work with TS
          CONFIG[documentName]?.documentClass;

        const isDefault = className === setting[documentName]?.[subType];

        result.push({
          documentClass,
          documentName,
          documentSubtype: subType,
          isDefault,
          sheetClass: sheetClassDetails?.cls,
          sheetClassIdentifier: sheetClassDetails?.id,
          typeLabel: FoundryAdapter.localize(
            // @ts-ignore
            CONFIG[documentName].typeLabels?.[subType]
          ),
        });
      }
    }

    return result;
  },
};
