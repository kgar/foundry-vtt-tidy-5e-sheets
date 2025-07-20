import type {
  ActionItem,
  ActiveEffect5e,
  ActiveEffectContext,
  AttunementContext,
  CharacterSheetContext,
  ClassSummary,
  DropdownListOption,
  HTMLElementOrGettable,
  NpcSheetContext,
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
  async setGameSetting(
    namespace: string,
    key: string,
    value: unknown
  ): Promise<void> {
    await game.settings.set(namespace, key, value);
  },
  onGetActiveEffectContextOptions(func: (...args: any[]) => void) {
    Hooks.on('dnd5e.getActiveEffectContextOptions', func);
  },
  getTemplate(templateName: string) {
    return `modules/${CONSTANTS.MODULE_ID}/templates/${templateName}`;
  },
  localize(value: string, options?: Record<string, unknown>) {
    if (options) {
      return game.i18n.format(value, options);
    }

    return game.i18n.localize(value);
  },
  // TODO: Extract a dedicated ActiveEffectManager or the like
  addEffect(effectType: string, owner: any) {
    const isActor = owner instanceof Actor;

    const effectData = {
      name: isActor ? game.i18n.localize('DND5E.EffectNew') : owner.name,
      icon: isActor ? 'icons/svg/aura.svg' : owner.img,
      origin: owner.uuid,
      'duration.rounds': effectType === 'temporary' ? 1 : undefined,
      disabled: effectType === 'inactive',
    };

    if (
      !TidyHooks.tidy5eSheetsPreCreateActiveEffect(
        owner,
        effectData,
        game.user.id
      )
    ) {
      return;
    }

    return ActiveEffect.implementation.create(effectData, {
      parent: owner,
      renderSheet: true,
    });
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
  /**
   *
   * @param content           - the editor content to include
   * @param targetDataField   - the data field to update when this editor is saved
   * @param editable          - whether the editor should allow editing
   * @returns
   */
  createEditorHtml(
    content: string,
    targetDataField: string,
    editable: boolean
  ) {
    return foundry.applications.handlebars.editor(content, {
      hash: {
        target: targetDataField,
        button: true,
        engine: 'prosemirror',
        collaborate: false,
        editable,
      },
    });
  },
  mergeObject<T>(original: T, ...args: any[]) {
    return foundry.utils.mergeObject(original, ...args) as T;
  },
  expandObject(data: any) {
    return foundry.utils.expandObject(data);
  },
  isEmpty(obj: any) {
    return foundry.utils.isEmpty(obj);
  },
  getClassIdentifier(item: Item5e): string {
    return item.system.identifier || item.name.slugify({ strict: true });
  },
  getClassAndSubclassSummaries(actor: Actor5e): Map<string, ClassSummary> {
    return actor.items.reduce(
      (map: Map<string, ClassSummary>, item: Item5e) => {
        if (item.type === 'class') {
          const identifier = FoundryAdapter.getClassIdentifier(item);
          const data: ClassSummary = map.get(identifier) ?? {};
          data.class = item.name;
          data.level = item.system.levels?.toString();
          map.set(identifier, data);
        }

        if (
          item.type === 'subclass' &&
          item.system.classIdentifier !== undefined
        ) {
          const data: ClassSummary = map.get(item.system.classIdentifier) ?? {};
          data.subclass = item.name;
          if (item.system.classIdentifier !== undefined) {
            map.set(item.system.classIdentifier, data);
          }
        }

        return map;
      },
      new Map<string, ClassSummary>()
    );
  },
  getActorCharacterSummaryEntries(actorContext: any): string[] {
    const entries: string[] = [];

    if (actorContext.system.details.race?.name) {
      entries.push(actorContext.system.details.race.name);
    } else if (actorContext.system.details.race) {
      entries.push(actorContext.system.details.race);
    }

    if (actorContext.system.details.background?.name) {
      entries.push(actorContext.system.details.background.name);
    } else if (actorContext.system.details.background) {
      entries.push(actorContext.system.details.background);
    }

    if (actorContext.system.details.alignment) {
      entries.push(actorContext.system.details.alignment);
    }

    return entries;
  },
  getCurrentLang() {
    return game.i18n.lang;
  },
  doActionOnMiddleClick(event: MouseEvent, action: () => any) {
    if (event.button !== CONSTANTS.MOUSE_BUTTON_AUXILIARY) {
      return;
    }

    event.preventDefault();

    return action();
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
      const error = FoundryAdapter.localize('DND5E.ActorWarningSingleton', {
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
  getInventoryRowClasses(item: Item5e, ctx?: any, extras?: string[]): string {
    const itemClasses: string[] = [];

    if (item?.system?.properties?.has('mgc')) {
      itemClasses.push('magic-item');
    }

    if (ctx?.attunement?.cls && !FoundryAdapter.concealDetails(item)) {
      itemClasses.push(ctx.attunement.cls);
    }

    if (item?.system?.equipped) {
      itemClasses.push('equipped');
    }

    if (extras?.length) {
      itemClasses.push(...extras);
    }

    return itemClasses.join(' ');
  },
  getSpellRowClasses(spell: any): string {
    const classes: string[] = [];

    if (spell.system.canPrepare) {
      classes.push('can-prepare');
    } else {
      classes.push('cannot-prepare');
    }

    if (
      spell.system.prepared ===
      CONFIG.DND5E.spellPreparationStates.prepared.value
    ) {
      classes.push('prepared');
    }

    if (
      spell.system.prepared ===
      CONFIG.DND5E.spellPreparationStates.unprepared.value
    ) {
      classes.push('unprepared');
    }

    if (
      spell.system.prepared === CONFIG.DND5E.spellPreparationStates.always.value
    ) {
      classes.push('always');
    }

    if (spell.system.method === CONSTANTS.SPELL_PREPARATION_METHOD_SPELL) {
      classes.push('method-spell');
    }

    if (spell.system.method === CONSTANTS.SPELL_PREPARATION_METHOD_PACT) {
      classes.push('method-pact');
    }

    if (spell.system.method === CONSTANTS.SPELL_PREPARATION_METHOD_ATWILL) {
      classes.push('method-atwill');
    }

    if (spell.system.method === CONSTANTS.SPELL_PREPARATION_METHOD_RITUAL) {
      classes.push('method-ritual');
    }

    if (spell.system.method === CONSTANTS.SPELL_PREPARATION_METHOD_INNATE) {
      classes.push('method-innate');
    }

    return classes.join(' ');
  },
  getSpellAttackModAndTooltip(
    context: CharacterSheetContext | NpcSheetContext
  ) {
    let actor = context.actor;
    let formula = Roll.replaceFormulaData(
      actor.system.bonuses.rsak.attack,
      actor.getRollData(),
      { missing: 0, warn: false }
    );

    let prof = actor.system.attributes.prof ?? 0;
    let spellAbility = context.system.attributes.spellcasting;
    let abilityMod =
      (spellAbility != '' ? actor.system.abilities[spellAbility].mod : 0) ?? 0;
    let spellAttackMod = prof + abilityMod;
    let spellAttackText =
      spellAttackMod > 0 ? '+' + spellAttackMod : spellAttackMod;

    let spellAttackTextTooltip = `${prof} (prof.)+${abilityMod} (${spellAbility})`;

    return {
      mod: spellAttackText /* TODO: apply static bonuses; mention rolled bonuses without rolling them */,
      bonus: formula,
      modTooltip: spellAttackTextTooltip,
    };
  },
  cycleProficiency(
    actor: Actor5e,
    key: string,
    currentValue: number | undefined,
    systemFieldName: string,
    reverse: boolean = false
  ): Promise<any | undefined> {
    // TODO: Check for active effects and prevent if applicable.

    if (currentValue === null || currentValue === undefined) {
      return Promise.resolve(undefined);
    }

    const levels = [0, 1, 0.5, 2];
    const idx = levels.indexOf(currentValue);
    const next = idx + (reverse ? 3 : 1);
    return actor.update({
      [`system.${systemFieldName}.${key}.value`]: levels[next % levels.length],
    });
  },
  getProficiencyIconClass(level: number) {
    const icons: Record<number, string> = {
      0: 'far fa-circle',
      0.5: 'fas fa-adjust',
      1: 'fas fa-check',
      2: 'fas fa-check-double',
    };
    return icons[level] || icons[0];
  },
  getSpellImageUrl(
    context: CharacterSheetContext | NpcSheetContext,
    spell: any
  ): string | undefined {
    if (!settings.value.useSpellClassFilterIcons) {
      return spell.img;
    }

    const sourceClass = spell.system.sourceClass;

    const classImage =
      sourceClass && 'actorClassesToImages' in context
        ? context.actorClassesToImages[sourceClass]
        : undefined;

    return classImage ?? spell.img;
  },
  searchActors(searchCriteria: string, actors: Actor5e[]) {
    return new Set(
      actors
        .filter((actor) => FoundryAdapter.searchActor(searchCriteria, actor))
        .map((actor) => actor.uuid)
    );
  },
  searchActor(searchCriteria: string, actor: Actor5e) {
    return (
      searchCriteria.trim() === '' ||
      actor.name.toLowerCase().includes(searchCriteria.toLowerCase())
    );
  },
  searchItems(searchCriteria: string, items: Item5e[]): Set<string> {
    return new Set(
      items
        .filter((item) => FoundryAdapter.searchItem(item, searchCriteria))
        .map((item) => item.uuid)
    );
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
  searchEffects(
    searchCriteria: string,
    effects: ActiveEffect5e[]
  ): Set<string> {
    return new Set(
      effects
        .filter(
          (effect: any) =>
            searchCriteria.trim() === '' ||
            effect.name.toLowerCase().includes(searchCriteria.toLowerCase())
        )
        .map((effect) => effect.id)
    );
  },
  searchActivities(
    searchCriteria: string,
    activities: Activity5e[]
  ): Set<string> {
    return new Set(
      activities
        .filter(
          (activities: any) =>
            searchCriteria.trim() === '' ||
            activities.name.toLowerCase().includes(searchCriteria.toLowerCase())
        )
        .map((activities) => activities.uuid)
    );
  },
  getFilteredActionItems(searchCriteria: string, items: ActionItem[]) {
    return items.filter(
      (x: ActionItem) =>
        searchCriteria.trim() === '' ||
        x.item?.name?.toLowerCase().includes(searchCriteria.toLowerCase())
    );
  },
  parseAdditionalClassesDropDownItems(
    spellClassFilterAdditionalClassesText: string
  ) {
    return spellClassFilterAdditionalClassesText
      .split(',')
      .reduce((arr: DropdownListOption[], x: string) => {
        const pieces = x.split('|');
        if (pieces.length !== 2) {
          return arr;
        }
        arr.push({
          value: pieces[0],
          text: pieces[1],
        });
        return arr;
      }, []);
  },
  getNewCargo() {
    return { name: '', quantity: 1 };
  },
  getWeightUnit() {
    return FoundryAdapter.localize(
      `DND5E.Abbreviation${
        game.settings.get('dnd5e', 'metricWeightUnits') ? 'Kg' : 'Lbs'
      }`
    );
  },
  isActiveEffectContextFavorited(context: ActiveEffectContext, actor: Actor5e) {
    if (!actor) {
      return false;
    }

    const effect = FoundryAdapter.getEffect({
      document: actor,
      effectId: context.id,
      parentId: context.parentId,
    });

    return FoundryAdapter.isEffectFavorited(effect, actor);
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
  async toggleFavoriteActivity(activity: Activity5e) {
    const actor = activity.actor;

    if (!actor || !actor.system?.addFavorite) {
      return;
    }

    const favorited = FoundryAdapter.isActivityFavorited(activity);

    if (favorited) {
      await actor.system.removeFavorite(activity.relativeUUID);
    } else {
      await actor.system.addFavorite({
        type: 'activity',
        id: activity.relativeUUID,
      });
    }
  },
  isInGmEditMode(document: any): boolean {
    return (
      document?.sheet?.sheetMode === CONSTANTS.SHEET_MODE_EDIT &&
      FoundryAdapter.userIsGm()
    );
  },
  allowCharacterEffectsManagement(actor: any) {
    return (
      (settings.value.limitEffectsManagementToGm &&
        FoundryAdapter.userIsGm()) ||
      (!settings.value.limitEffectsManagementToGm && actor.isOwner)
    );
  },
  shouldLockMoneyChanges() {
    return !FoundryAdapter.userIsGm() && settings.value.lockMoneyChanges;
  },
  shouldLockExpChanges() {
    return !FoundryAdapter.userIsGm() && settings.value.lockExpChanges;
  },
  shouldLockHpMaxChanges() {
    return !FoundryAdapter.userIsGm() && settings.value.lockHpMaxChanges;
  },
  shouldLockLevelSelector() {
    return !FoundryAdapter.userIsGm() && settings.value.lockLevelSelector;
  },
  shouldLockItemQuantity() {
    return !FoundryAdapter.userIsGm() && settings.value.lockItemQuantity;
  },
  showLimitedSheet(actor: any): boolean {
    const showLimitedSheet = !FoundryAdapter.userIsGm() && actor.limited;
    if (actor.type === CONSTANTS.SHEET_TYPE_CHARACTER) {
      return showLimitedSheet && !settings.value.showExpandedLimitedView;
    }
    return showLimitedSheet;
  },
  flattenObject(obj: Object) {
    return foundry.utils.flattenObject(obj || {});
  },
  getGameItem(id: string): any | undefined {
    return game.items.get(id);
  },
  getGameActor(id: string): any | undefined {
    return game.actors.get(id);
  },
  getModule(moduleId: string): any | undefined {
    return game.modules.get(moduleId);
  },
  debounce(callback: Function, delay: number): Function {
    return foundry.utils.debounce(callback, delay);
  },
  roll(
    formula: string,
    rollData?: unknown,
    rollFnOptions: any = {}
  ): Promise<any> {
    return new Roll(formula, rollData).roll(rollFnOptions);
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
  playDiceSound() {
    return foundry.audio.AudioHelper.play({ src: CONFIG.sounds.dice });
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
  deleteAdvancement(advancementItemId: string, item: Item5e) {
    const advancement = item.advancement.byId[advancementItemId];
    return advancement?.deleteDialog();
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
  editAdvancement(advancementItemId: string, item: Item5e) {
    const advancement = item.advancement.byId[advancementItemId];

    return new advancement.constructor.metadata.apps.config(advancement).render(
      true
    );
  },
  async renderSheetFromUuid(uuid: string) {
    (await fromUuid(uuid))?.sheet?.render(true);
  },
  renderImagePopout(args: {
    src: string;
    uuid: string;
    window?: { title: string };
  }) {
    return new foundry.applications.apps.ImagePopout(args).render({
      force: true,
    });
  },
  browseFilePicker(...args: any[]) {
    return new foundry.applications.apps.FilePicker.implementation(
      ...args
    ).browse();
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
  renderActorSheetFlags(actor: any) {
    return new dnd5e.applications.actor.ActorSheetFlags(actor).render(true);
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
    return new dnd5e.applications.SourceConfig(
      { document: document },
      {
        keyPath,
      }
    ).render(true);
  },
  async onActorItemDelete(actor: Actor5e, item: Item5e) {
    // If item has advancement, handle it separately
    if (!game.settings.get('dnd5e', 'disableAdvancements')) {
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
  lookupDamageType(type: string) {
    return game.dnd5e.config.damageTypes[type]?.label;
  },
  lookupHealingType(type: string) {
    return game.dnd5e.config.healingTypes[type];
  },
  lookupAbility(abbr: string) {
    return game.dnd5e.config.abilities[abbr];
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
  onActorItemButtonContextMenu(item: Item5e, options: { event: Event }) {
    // Allow another module to react to a context menu action on the item use button.
    TidyHooks.tidy5eSheetsActorItemUseContextMenu(item, options);
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
  getAbilitiesAsDropdownOptions(abilities: any): DropdownListOption[] {
    try {
      return Object.entries<any>(abilities).map(([key, { label }]) => ({
        value: key,
        text: label,
      }));
    } catch (e) {
      error(
        'An error occurred while mapping abilities as dropdown items',
        false,
        e
      );
      debug('Dropdown mapping error troubleshooting info', { abilities });
      return [];
    }
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
  canUseItem(item: Item5e) {
    return !(!item.actor || !item.actor.isOwner || item.actor.pack);
  },
  useClassicControls(document: any) {
    return (
      (document.type === CONSTANTS.SHEET_TYPE_CHARACTER &&
        settings.value.useClassicControlsForCharacter) ||
      (document.type === CONSTANTS.SHEET_TYPE_NPC &&
        settings.value.useClassicControlsForNpc) ||
      (document.type === CONSTANTS.SHEET_TYPE_VEHICLE &&
        settings.value.useClassicControlsForVehicle) ||
      // Temporary stopgap: When we don't recognize a supported document for Classic Controls options, fall back to the character user setting
      settings.value.useClassicControlsForCharacter
    );
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
  async identifyAllItemsForContainer(container: any, items: Item5e[]) {
    const updates = items.map((i) => ({
      _id: i.id,
      'system.identified': true,
    }));
    await Item.updateDocuments(updates, {
      parent: container.actor,
      pack: container.pack,
    });
  },
  async markAllItemsAsUnidentifiedForContainer(
    container: any,
    items: Item5e[]
  ) {
    const updates = items.map((i) => ({
      _id: i.id,
      'system.identified': false,
    }));
    await Item.updateDocuments(updates, {
      parent: container.actor,
      pack: container.pack,
    });
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
  openSummonConfig(item: Item5e) {
    new dnd5e.applications.item.SummoningConfig(item).render(true);
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
    return dnd5e.utils.formatNumber(num);
  },
  // TODO: Consolidate uses changed to one function
  handleItemUsesChanged(
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
  getFilteredClassOrOriginal(actor: Actor5e): Item5e | undefined | null {
    return (
      FoundryAdapter.getFilteredClass(actor) ??
      actor.items.get(actor.system.details.originalClass) ??
      actor.itemTypes.class[0]
    );
  },
  getFilteredClass(actor: Actor5e): Item5e | undefined {
    const classSpellbookFilter = actor.sheet.classSpellbookFilter;
    return actor.classes?.[classSpellbookFilter];
  },
  getSpellcastingInfo(actor: Actor5e): SpellcastingInfo {
    const currentFilteredClass =
      FoundryAdapter.getFilteredClassOrOriginal(actor);

    return {
      currentFilteredClass: currentFilteredClass,
      prepared: {
        value:
          currentFilteredClass?.system?.spellcasting?.preparation?.value ?? 0,
        max: currentFilteredClass?.system?.spellcasting?.preparation?.max ?? 0,
      },
      calculations: calculateSpellAttackAndDc(actor, currentFilteredClass),
    };
  },
  getSaveAbilityAbbreviation(save: any) {
    return save.ability?.size
      ? save.ability.size === 1
        ? CONFIG.DND5E.abilities[save.ability.first()]?.abbreviation
        : FoundryAdapter.localize('DND5E.AbbreviationDC')
      : null;
  },
  checkIfModernRules(document: any) {
    return document.system.source?.rules
      ? document.system.source?.rules === '2024'
      : game.settings.get('dnd5e', 'rulesVersion') === 'modern';
  },
  prepareLanguageTrait(actor: any, traits: any) {
    const languages = actor.system.traits?.languages?.labels;
    traits.languages ??= [];

    if (languages?.languages?.length)
      traits.languages = languages.languages.map((label: string) => ({
        label,
      }));
    for (const [key, { label }] of Object.entries(
      CONFIG.DND5E.communicationTypes
    )) {
      const data = actor.system.traits?.languages?.communication?.[key];
      if (!data?.value) continue;
      let value = data.value;
      if (data.units) {
        value += ` ${data.units}`;
      }
      traits.languages.push({ label, value: value });
    }
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
    >((obj, [k, label]) => {
      const value = movement[k];
      if (value) obj[k] = { label, value, unit: units.abbreviation };
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
  getSpellPreparationStatesMap() {
    return Object.entries(CONFIG.DND5E.spellPreparationStates).reduce<
      Record<number, { label: string; value: number; key: string }>
    >((prev, [key, config]) => {
      prev[config.value] = {
        key: key,
        label: config.label,
        value: config.value,
      };

      return prev;
    }, {});
  },
  getSpellIcon(item: Item5e): ClassValue {
    let classes: ClassValue = [];

    if (item.system.canPrepare) {
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

    switch (item.system.method) {
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
};
