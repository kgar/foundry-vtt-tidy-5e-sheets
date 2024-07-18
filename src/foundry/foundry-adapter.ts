import type {
  ActionItem,
  ActiveEffect5e,
  ActiveEffectContext,
  AttunementContext,
  CharacterSheetContext,
  ClassSummary,
  DropdownListOption,
  NpcSheetContext,
} from 'src/types/types';
import { CONSTANTS } from '../constants';
import type { Actor5e } from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import { SettingsProvider } from 'src/settings/settings';
import { debug, error, warn } from 'src/utils/logging';
import FloatingContextMenu from 'src/context-menu/FloatingContextMenu';
import { TidyFlags } from './TidyFlags';
import EnchantmentConfig from './shims/EnchantmentConfig';
import { TidyHooks } from './TidyHooks';

export const FoundryAdapter = {
  isFoundryV12OrHigher() {
    return foundry.utils.isNewerVersion(game.version, 12);
  },
  deepClone(obj: any) {
    return foundry.utils.deepClone(obj);
  },
  userIsGm() {
    return game.user.isGM;
  },
  getTidySetting<T = string>(settingName: string): T {
    return game.settings.get(CONSTANTS.MODULE_ID, settingName) as T;
  },
  async setTidySetting(key: string, value: unknown): Promise<void> {
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
  async setGameSetting(
    namespace: string,
    key: string,
    value: unknown
  ): Promise<void> {
    await game.settings.set(namespace, key, value);
  },
  onActor5eSheetRender(func: (...args: any[]) => void) {
    Hooks.on('renderActorSheet', (...args: any[]) => {
      func(args);
    });
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
      label: isActor ? game.i18n.localize('DND5E.EffectNew') : owner.name,
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

    return owner.createEmbeddedDocuments('ActiveEffect', [effectData]);
  },
  canPrepareSpell(item: Item5e) {
    return (
      item.system.preparation?.mode !==
        CONSTANTS.SPELL_PREPARATION_MODE_ATWILL &&
      item.system.preparation?.mode !==
        CONSTANTS.SPELL_PREPARATION_MODE_INNATE &&
      item.system.preparation?.mode !==
        CONSTANTS.SPELL_PREPARATION_MODE_ALWAYS &&
      item.system.preparation?.mode !== CONSTANTS.SPELL_PREPARATION_MODE_PACT &&
      (item.system.level !== 0 ||
        SettingsProvider.settings.allowCantripsToBePrepared.get())
    );
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
    return HandlebarsHelpers.editor(content, {
      hash: {
        target: targetDataField,
        button: true,
        engine: 'prosemirror',
        collaborate: false,
        editable,
      },
    });
  },
  createOpenEditorHtml(
    content: string,
    targetDataField: string,
    textEditorOptions?: Record<string, any>
  ) {
    return HandlebarsHelpers.editor(content, {
      hash: {
        target: targetDataField,
        button: false,
        engine: 'prosemirror',
        collaborate: false,
        editable: true,
        ...textEditorOptions,
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
  editOnMiddleClick(
    event: MouseEvent,
    entityWithSheet: {
      sheet: { render: (force: boolean) => void; isEditable: boolean };
    }
  ) {
    if (event.button !== CONSTANTS.MOUSE_BUTTON_AUXILIARY) {
      return;
    }

    event.preventDefault();

    if (!entityWithSheet.sheet.isEditable) {
      return;
    }

    entityWithSheet.sheet.render(true);
  },
  createItem({ type, ...data }: Record<string, any>, actor: Actor5e) {
    // Check to make sure the newly created class doesn't take player over level cap
    if (
      type === 'class' &&
      actor.system.details.level + 1 > CONFIG.DND5E.maxLevel
    ) {
      const err = game.i18n.format('DND5E.MaxCharacterLevelExceededWarn', {
        max: CONFIG.DND5E.maxLevel,
      });
      ui.notifications.error(err);
      return null;
    }

    const itemData = foundry.utils.mergeObject(
      {
        name: FoundryAdapter.localize('DND5E.ItemNew', {
          type: FoundryAdapter.localize(CONFIG.Item.typeLabels[type]),
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
    const classId = item.id;
    if (!delta || !classId) {
      return;
    }

    const classItem = actor.items.get(classId);

    if (!game.settings.get('dnd5e', 'disableAdvancements')) {
      const manager =
        dnd5e.applications.advancement.AdvancementManager.forLevelChange(
          actor,
          classId,
          delta
        );
      if (manager.steps.length) {
        if (delta > 0) return manager.render(true);
        try {
          const shouldRemoveAdvancements =
            await dnd5e.applications.advancement.AdvancementConfirmationDialog.forLevelDown(
              classItem
            );
          if (shouldRemoveAdvancements) return manager.render(true);
        } catch (err) {
          return;
        }
      }
    }

    return classItem.update({
      'system.levels': classItem.system.levels + delta,
    });
  },
  getSpellAbbreviationMap() {
    const map = new Map<string, string>();
    Object.values(CONFIG.DND5E.spellComponents).forEach((x: any) =>
      map.set(x.abbr, x.label)
    );
    Object.values(CONFIG.DND5E.spellTags).forEach((x: any) =>
      map.set(x.abbr, x.label)
    );
    return map;
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

    if (
      spell.system.preparation.mode ===
        CONSTANTS.SPELL_PREPARATION_MODE_PREPARED &&
      (spell.system.level > 0 ||
        SettingsProvider.settings.allowCantripsToBePrepared.get())
    ) {
      classes.push('preparable');
    }

    if (spell.system.preparation.prepared) {
      classes.push('prepared');
    }

    if (
      spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_ALWAYS
    ) {
      classes.push('always-prepared');
    }

    if (
      spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_PACT
    ) {
      classes.push('pact');
    }

    if (
      spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_ATWILL
    ) {
      classes.push('at-will');
    }

    if (
      spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_RITUAL
    ) {
      classes.push('ritual-only');
    }

    if (
      spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_INNATE
    ) {
      classes.push('innate');
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
  getSpellImageUrl(
    context: CharacterSheetContext | NpcSheetContext,
    spell: any
  ): string | undefined {
    if (
      !SettingsProvider.settings.useSpellClassFilterIcons.get() ||
      context.isNPC
    ) {
      return spell.img;
    }

    const parentClass = TidyFlags.parentClass.get(spell);

    const classImage =
      parentClass && 'actorClassesToImages' in context
        ? context.actorClassesToImages[parentClass]
        : undefined;

    return classImage ?? spell.img;
  },
  searchItems(searchCriteria: string, items: Item5e[]): Set<string> {
    return new Set(
      items
        .filter((item) => FoundryAdapter.searchItem(item, searchCriteria))
        .map((item) => item.id)
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
  getFilteredActionItems(searchCriteria: string, items: ActionItem[]) {
    return items.filter(
      (x: ActionItem) =>
        searchCriteria.trim() === '' ||
        x.item?.name?.toLowerCase().includes(searchCriteria.toLowerCase())
    );
  },
  getAllClassesDropdownOptions(
    spellClassFilterAdditionalClassesText: string = ''
  ) {
    const allClasses: DropdownListOption[] = Object.entries(
      CONSTANTS.DND5E_CLASSES
    ).map((x) => ({
      value: x[0],
      text: x[1],
    }));

    if (spellClassFilterAdditionalClassesText?.trim() !== '') {
      const additionalClasses = spellClassFilterAdditionalClassesText
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

      allClasses.push(...additionalClasses);
    }

    allClasses.sort((a, b) => a.text.localeCompare(b.text));

    return allClasses;
  },
  getClassLabel(id: string) {
    return (
      (CONSTANTS.DND5E_CLASSES as Record<string, string>)[id] ??
      FoundryAdapter.getAdditionalClassLabel(id)
    );
  },
  getAdditionalClassLabel(id: string) {
    const additionalClasses =
      SettingsProvider.settings.spellClassFilterAdditionalClasses.get();
    return FoundryAdapter.parseAdditionalClassesDropDownItems(
      additionalClasses
    ).find((c) => c.value === id)?.text;
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
  removeConfigureSettingsButtonWhenLockedForNonGm(buttons: any[]) {
    if (FoundryAdapter.shouldLockConfigureSheet()) {
      const configureSheetButtonIndex = buttons.findIndex((b) =>
        b.class.includes('configure-sheet')
      );
      if (configureSheetButtonIndex >= 0) {
        buttons.splice(configureSheetButtonIndex, 1);
      }
    }

    return buttons;
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
  isActorSheetUnlocked(actor: any): boolean {
    return (
      (actor.isOwner && TidyFlags.allowEdit.get(actor)) ||
      (FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.permanentlyUnlockCharacterSheetForGm.get() &&
        actor.type === CONSTANTS.SHEET_TYPE_CHARACTER) ||
      (FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.permanentlyUnlockNpcSheetForGm.get() &&
        actor.type === CONSTANTS.SHEET_TYPE_NPC) ||
      (FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.permanentlyUnlockVehicleSheetForGm.get() &&
        actor.type === CONSTANTS.SHEET_TYPE_VEHICLE)
    );
  },
  allowCharacterEffectsManagement(actor: any) {
    return (
      (SettingsProvider.settings.limitEffectsManagementToGm.get() &&
        FoundryAdapter.userIsGm()) ||
      (!SettingsProvider.settings.limitEffectsManagementToGm.get() &&
        actor.isOwner)
    );
  },
  shouldLockMoneyChanges() {
    return (
      !FoundryAdapter.userIsGm() &&
      SettingsProvider.settings.lockMoneyChanges.get()
    );
  },
  shouldLockExpChanges() {
    return (
      !FoundryAdapter.userIsGm() &&
      SettingsProvider.settings.lockExpChanges.get()
    );
  },
  shouldLockHpMaxChanges() {
    return (
      !FoundryAdapter.userIsGm() &&
      SettingsProvider.settings.lockHpMaxChanges.get()
    );
  },
  shouldLockLevelSelector() {
    return (
      !FoundryAdapter.userIsGm() &&
      SettingsProvider.settings.lockLevelSelector.get()
    );
  },
  shouldLockConfigureSheet() {
    return (
      !FoundryAdapter.userIsGm() &&
      SettingsProvider.settings.lockConfigureSheet.get()
    );
  },
  shouldLockItemQuantity() {
    return (
      !FoundryAdapter.userIsGm() &&
      SettingsProvider.settings.lockItemQuantity.get()
    );
  },
  showLimitedSheet(actor: any): boolean {
    const showLimitedSheet = !FoundryAdapter.userIsGm() && actor.limited;
    if (actor.type === CONSTANTS.SHEET_TYPE_CHARACTER) {
      return (
        showLimitedSheet &&
        !SettingsProvider.settings.showExpandedLimitedView.get()
      );
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
  async rollNpcHitDie(
    actor: Actor5e,
    flavor: string,
    denomination: string,
    options: any = {}
  ): Promise<any | null> {
    const rollConfig = FoundryAdapter.mergeObject(
      {
        formula: `max(0, 1${denomination} + @abilities.con.mod)`,
        data: actor.getRollData(),
        chatMessage: true,
        messageData: {
          speaker: ChatMessage.getSpeaker({ actor }),
          flavor,
          title: `${flavor}: ${actor.name}`,
          rollMode: FoundryAdapter.getGameSetting('core', 'rollMode'),
          'flags.dnd5e.roll': { type: 'hitDie' },
        },
      },
      options
    );

    /**
     * A hook event that fires before a hit die is rolled for an Actor.
     * @function dnd5e.preRollHitDie
     * @memberof hookEvents
     * @param {Actor5e} actor               Actor for which the hit die is to be rolled.
     * @param {object} config               Configuration data for the pending roll.
     * @param {string} config.formula       Formula that will be rolled.
     * @param {object} config.data          Data used when evaluating the roll.
     * @param {boolean} config.chatMessage  Should a chat message be created for this roll?
     * @param {object} config.messageData   Data used to create the chat message.
     * @param {string} denomination         Size of hit die to be rolled.
     * @returns {boolean}                   Explicitly return `false` to prevent hit die from being rolled.
     */
    if (
      TidyHooks.dnd5ePreRollHitDie(actor, rollConfig, denomination) === false
    ) {
      return;
    }

    const roll = await FoundryAdapter.roll(
      rollConfig.formula,
      rollConfig.data,
      {
        async: true,
      }
    );
    if (rollConfig.chatMessage) roll.toMessage(rollConfig.messageData);

    const hp = actor.system.attributes.hp;
    const dhp = Math.min(hp.max + (hp.tempmax ?? 0) - hp.value, roll.total);
    const updates = {
      actor: { 'system.attributes.hp.value': hp.value + dhp },
      //   class: {"system.hitDiceUsed": cls.system.hitDiceUsed + 1}
    };

    if (TidyHooks.dnd5eRollHitDie(actor, roll, updates) === false) return roll;

    // Re-evaluate dhp in the event that it was changed in the previous hook
    const updateOptions = {
      dhp:
        (updates.actor?.['system.attributes.hp.value'] ?? hp.value) - hp.value,
    };

    // Perform updates
    if (!FoundryAdapter.isEmpty(updates.actor)) {
      await actor.update(updates.actor, updateOptions);
    }
    return roll;
  },
  openActorTypeConfig(actor: Actor5e) {
    return new dnd5e.applications.actor.ActorTypeConfig(actor).render(true);
  },
  openCharacterActorTypeConfig(actor: Actor5e) {
    if (actor.system.details.race?.id) {
      return new dnd5e.applications.actor.ActorTypeConfig(
        actor.system.details.race,
        { keyPath: 'system.type' }
      ).render(true);
    }

    warn(
      'Unable to open actor type config for player character because they do not have a race.'
    );
  },
  playDiceSound() {
    return AudioHelper.play({ src: CONFIG.sounds.dice });
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
    return TextEditor.enrichHTML(value, options);
  },
  createContextMenu(...args: any[]): any {
    return new FloatingContextMenu(...args);
  },
  createAdvancementSelectionDialog(item: any) {
    return game.dnd5e.applications.advancement.AdvancementSelection.createDialog(
      item
    );
  },
  deleteAdvancement(advancementItemId: string, item: Item5e) {
    if (item.isEmbedded && !game.settings.get('dnd5e', 'disableAdvancements')) {
      let manager =
        dnd5e.applications.advancement.AdvancementManager.forDeletedAdvancement(
          item.actor,
          item.id,
          advancementItemId
        );
      if (manager.steps.length) return manager.render(true);
    }
    return item.deleteAdvancement(advancementItemId);
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
  renderImagePopout(...args: any[]) {
    return new ImagePopout(...args).render(true);
  },
  browseFilePicker(...args: any[]) {
    return new FilePicker(...args).browse();
  },
  renderArmorConfig(actor: any) {
    return new dnd5e.applications.actor.ActorArmorConfig(actor).render(true);
  },
  renderActorInitiativeConfig(actor: any) {
    return new dnd5e.applications.actor.ActorInitiativeConfig(actor).render(
      true
    );
  },
  renderActorAbilityConfig(actor: any, abbreviation: any) {
    return new dnd5e.applications.actor.ActorAbilityConfig(
      actor,
      null,
      abbreviation
    ).render(true);
  },
  renderActorMovementConfig(actor: any) {
    return new dnd5e.applications.actor.ActorMovementConfig(actor).render(true);
  },
  renderActorHitPointsDialog(actor: any) {
    return new dnd5e.applications.actor.ActorHitPointsConfig(actor).render(
      true
    );
  },
  renderActorHitDiceConfig(actor: any) {
    return new dnd5e.applications.actor.ActorHitDiceConfig(actor).render(true);
  },
  dialogConfirm(...args: any[]) {
    return Dialog.confirm(...args);
  },
  renderActorSheetFlags(actor: any) {
    return new dnd5e.applications.actor.ActorSheetFlags(actor).render(true);
  },
  renderToolSelector(actor: any) {
    return new dnd5e.applications.actor.ToolSelector(actor, 'tool').render(
      true
    );
  },
  renderActorSensesConfig(actor: any) {
    return new dnd5e.applications.actor.ActorSensesConfig(actor).render(true);
  },
  renderTraitsSelector(actor: any, trait: string) {
    return new dnd5e.applications.actor.TraitSelector(actor, trait).render(
      true
    );
  },
  renderProficiencyConfig(actor: any, property: string, key: string) {
    return new dnd5e.applications.actor.ProficiencyConfig(actor, {
      property,
      key,
    }).render(true);
  },
  renderItemTypeConfig(item: any) {
    return new dnd5e.applications.actor.ActorTypeConfig(item, {
      keyPath: 'system.type',
    }).render(true);
  },
  renderItemMovementConfig(item: any) {
    return new dnd5e.applications.actor.ActorMovementConfig(item, {
      keyPath: 'system.movement',
    }).render(true);
  },
  renderItemSensesConfig(item: any) {
    return new dnd5e.applications.actor.ActorSensesConfig(item, {
      keyPath: 'system.senses',
    }).render(true);
  },
  renderSourceConfig(document: any, keyPath: string) {
    return new dnd5e.applications.SourceConfig(document, {
      keyPath,
    }).render(true);
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
  actorTryUseItem(item: Item5e, config: any = {}, options: any = {}) {
    const suppressItemUse =
      TidyHooks.tidy5eSheetsActorPreUseItem(item, config, options) === false;

    if (suppressItemUse) {
      return;
    }

    item.use(config, options);
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
  onTabSelecting(app: any & { currentTabId: string }, newTabId: string) {
    const canProceed = TidyHooks.tidy5eSheetsPreSelectTab(
      app,
      app.element.get(0),
      {
        currentTab: app.currentTabId,
        newTab: newTabId,
      }
    );

    if (!canProceed) {
      return false;
    }

    setTimeout(() => {
      TidyHooks.tidy5eSheetsSelectTab(app, app.element.get(0), newTabId);
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
  countPreparedSpells(items: Item5e[]) {
    return items.filter(
      (item: Item5e) =>
        item.type === CONSTANTS.ITEM_TYPE_SPELL &&
        item.system.level > 0 &&
        item.system.preparation.mode ===
          CONSTANTS.SPELL_PREPARATION_MODE_PREPARED &&
        item.system.preparation.prepared
    ).length;
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
        SettingsProvider.settings.useClassicControlsForCharacter.get()) ||
      (document.type === CONSTANTS.SHEET_TYPE_NPC &&
        SettingsProvider.settings.useClassicControlsForNpc.get()) ||
      (document.type === CONSTANTS.SHEET_TYPE_VEHICLE &&
        SettingsProvider.settings.useClassicControlsForVehicle.get()) ||
      // Temporary stopgap: When we don't recognize a supported document for Classic Controls options, fall back to the character user setting
      SettingsProvider.settings.useClassicControlsForCharacter.get()
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
  getAttunementContext(item: Item5e): AttunementContext | undefined {
    return !!item.system.attunement && !item.system.attuned
      ? {
          ...FoundryAdapter.attunementContextApplicable,
          title: CONFIG.DND5E.attunementTypes[item.system.attunement],
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
      (SettingsProvider.settings.itemIdentificationPermission.get() ===
        CONSTANTS.SHEET_SETTINGS_OPTION_GM_AND_OWNERS &&
        item.isOwner)
    );
  },
  getJqueryWrappedElement(el: HTMLElement) {
    return $(el);
  },
  onAmmoChange(item: Item5e, ammoId: string) {
    const ammo = item.actor?.items.find((i: any) => i.id === ammoId);

    item.update({
      system: {
        consume: {
          amount: !ammo
            ? null
            : !!item.system.consume?.amount
            ? item.system.consume.amount
            : 1,
          target: !ammo ? '' : ammo.id,
          type: !ammo ? '' : ammo.system.type.value,
        },
      },
    });
  },
  openSpellSlotsConfig(actor: Actor5e) {
    new dnd5e.applications.actor.ActorSpellSlotsConfig(actor).render(true);
  },
  openSummonConfig(item: Item5e) {
    new dnd5e.applications.item.SummoningConfig(item).render(true);
  },
  openDamageModificationConfig(actor: Actor5e) {
    new dnd5e.applications.actor.DamageModificationConfig(actor).render(true);
  },
  openActorConcentrationConfig(actor: Actor5e) {
    new dnd5e.applications.actor.ActorConcentrationConfig(actor).render(true);
  },
  openStartingEquipmentConfig(item: Item5e) {
    new dnd5e.applications.item.StartingEquipmentConfig(item).render(true);
  },
  isConcentrationEffect(effect: ActiveEffect5e, app: any) {
    return (
      app.document instanceof dnd5e.documents.Actor5e &&
      app._concentration?.effects.has(effect)
    );
  },
  activateEditors(node: HTMLElement, sheet: any, bindSecrets: boolean = true) {
    try {
      const nodes = node.matches(
        CONSTANTS.TEXT_EDITOR_ACTIVATION_ELEMENT_SELECTOR
      )
        ? [node]
        : Array.from(
            node.querySelectorAll<HTMLElement>(
              CONSTANTS.TEXT_EDITOR_ACTIVATION_ELEMENT_SELECTOR
            )
          );

      for (let editorDiv of nodes) {
        sheet._activateEditor(editorDiv);
      }
      if (bindSecrets) {
        sheet._secrets.forEach((s: any) => s.bind(node));
      }
    } catch (e) {
      error('An error occurred while activating text editors', false, e);
      debug('Text editor error trobuleshooting info', { node, sheet });
    }
  },
  async openEnchantmentConfig(item: Item5e) {
    // TODO: Replace with dnd5e.application.item.EnchantmentConfig when this issue is resolved: https://github.com/foundryvtt/dnd5e/issues/3624
    // @ts-ignore
    return new EnchantmentConfig(item).render(true);
  },
  async renderFromUuid(uuid: string, force: boolean = true) {
    const doc = await fromUuid(uuid);
    return doc?.sheet?.render(force);
  },
  async removeEnchantment(enchantmentUuid: string, app: any) {
    const enchantment = fromUuidSync(enchantmentUuid);
    if (!enchantment) return;
    await enchantment.delete();
    await app.render();
  },
};
