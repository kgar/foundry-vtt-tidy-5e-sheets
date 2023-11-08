import type {
  CharacterSheetContext,
  ClassSummary,
  DropdownOption,
  NpcSheetContext,
} from 'src/types/types';
import { CONSTANTS } from '../constants';
import type { Actor5e } from 'src/types/types';
import type { Item5e } from 'src/types/item';
import type { FoundryDocument } from 'src/types/document';
import { SettingsProvider } from 'src/settings/settings';
import { debug, warn } from 'src/utils/logging';
import { clamp } from 'src/utils/numbers';

export const FoundryAdapter = {
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
    game.settings.register(CONSTANTS.MODULE_ID, key, data);
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
  hooksOn(hook: string, fn: Function, options?: { once: boolean }): number {
    return Hooks.on(hook, fn, options);
  },
  hooksOnce(hook: string, fn: Function): number {
    return Hooks.once(hook, fn);
  },
  hooksCall(hook: string, ...args: any[]): boolean {
    return Hooks.call(hook, ...args);
  },
  hooksCallAll(hook: string, ...args: any[]): boolean {
    return Hooks.callAll(hook, ...args);
  },
  onActor5eSheetRender(func: (...args: any[]) => void) {
    Hooks.on('renderActorSheet', (...args: any[]) => {
      func(args);
    });
  },
  onGetActiveEffectContextOptions(func: (...args: any[]) => void) {
    Hooks.on('dnd5e.getActiveEffectContextOptions', func);
  },
  // TODO: to the API, rename as getTidy5eTemplate
  getTemplate(templateName: string) {
    return `modules/${CONSTANTS.MODULE_ID}/templates/${templateName}`;
  },
  localize(value: string, options?: Record<string, unknown>) {
    if (options) {
      return game.i18n.format(value, options);
    }

    return game.i18n.localize(value);
  },
  addEffect(effectType: string, actor: Actor5e) {
    actor.createEmbeddedDocuments('ActiveEffect', [
      {
        label: game.i18n.localize('DND5E.EffectNew'),
        icon: 'icons/svg/aura.svg',
        origin: actor.uuid,
        'duration.rounds': effectType === 'temporary' ? 1 : undefined,
        disabled: effectType === 'inactive',
      },
    ]);
  },
  canPrepareSpell(item: Item5e) {
    return (
      item.system.preparation?.mode !==
        CONSTANTS.SPELL_PREPARATION_MODE_ATWILL &&
      item.system.preparation?.mode !==
        CONSTANTS.SPELL_PREPARATION_MODE_INNATE &&
      item.system.preparation?.mode !==
        CONSTANTS.SPELL_PREPARATION_MODE_ALWAYS &&
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
  mergeObject<T>(
    original: T,
    other: Partial<T>,
    options?: Partial<MergeObjectOptions>
  ) {
    return mergeObject(original, other, options);
  },
  expandObject(data: any) {
    return expandObject(data);
  },
  isEmpty(obj: any) {
    return isEmpty(obj);
  },
  tryGetFlag<T>(flagged: any, flagName: string) {
    return flagged.getFlag(CONSTANTS.MODULE_ID, flagName) as
      | T
      | null
      | undefined;
  },
  setFlag(flagged: any, flagName: string, value: unknown): Promise<void> {
    return flagged.setFlag(CONSTANTS.MODULE_ID, flagName, value);
  },
  unsetFlag(flagged: any, flagName: string): Promise<void> {
    return flagged.unsetFlag(CONSTANTS.MODULE_ID, flagName);
  },
  getClassAndSubclassSummaries(actor: Actor5e): Map<string, ClassSummary> {
    return actor.items.reduce(
      (map: Map<string, ClassSummary>, item: Item5e) => {
        if (item.type === 'class') {
          const data: ClassSummary = map.get(item.system.identifier) ?? {};
          data.class = item.name;
          data.level = item.system.levels?.toString();
          map.set(item.system.identifier, data);
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

    if (actorContext.system.details.race) {
      entries.push(actorContext.system.details.race);
    }

    if (actorContext.labels.background) {
      entries.push(actorContext.labels.background);
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
  createItem(dataset: Record<string, any>, actor: Actor5e) {
    if (
      dataset.type === 'class' &&
      actor.system.details.level + 1 > CONFIG.DND5E.maxLevel
    ) {
      const err = game.i18n.format('DND5E.MaxCharacterLevelExceededWarn', {
        max: CONFIG.DND5E.maxLevel,
      });
      return ui.notifications.error(err);
    }

    const itemData = {
      name: FoundryAdapter.localize('DND5E.ItemNew', {
        type: FoundryAdapter.localize(CONFIG.Item.typeLabels[dataset.type]),
      }),
      type: dataset.type,
      system: foundry.utils.expandObject({ ...dataset }),
    };
    delete itemData.system.type;
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

    if (FoundryAdapter.getProperty(item, 'system.properties.mgc')) {
      itemClasses.push('magic-item');
    }

    if (ctx?.attunement?.cls) {
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
      spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_INNATE
    ) {
      classes.push('innate');
    }

    return classes.join(' ');
  },
  getSpellAttackModAndTooltip(context: CharacterSheetContext) {
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
  ): Promise<FoundryDocument | undefined> {
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
      !SettingsProvider.settings.spellClassFilterIconReplace.get() ||
      context.isNPC
    ) {
      return spell.img;
    }

    const parentClass = FoundryAdapter.tryGetFlag<string>(spell, 'parentClass');

    const classImage = parentClass
      ? context.actorClassesToImages[parentClass]
      : undefined;

    return classImage ?? spell.img;
  },
  getFilteredItems(searchCriteria: string, items: Item5e[]) {
    return items.filter(
      (x: any) =>
        searchCriteria.trim() === '' ||
        x.name.toLowerCase().includes(searchCriteria.toLowerCase())
    );
  },
  getAllClassesDropdownOptions(
    spellClassFilterAdditionalClassesText: string = ''
  ) {
    const allClasses: DropdownOption[] = Object.entries(
      CONSTANTS.DND5E_CLASSES
    ).map((x) => ({
      value: x[0],
      text: x[1],
    }));

    if (spellClassFilterAdditionalClassesText?.trim() !== '') {
      const additionalClasses = spellClassFilterAdditionalClassesText
        .split(',')
        .reduce((arr: DropdownOption[], x: string) => {
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
  isItemFavorite(item: any) {
    if (!item) {
      return false;
    }
    let isFav =
      (game.modules.get('favorite-items')?.active &&
        item.flags['favorite-items']?.favorite) ||
      item.flags[CONSTANTS.MODULE_ID]?.favorite ||
      false;

    return isFav;
  },
  canEditActor(actor: any) {
    return (
      (actor.isOwner && FoundryAdapter.isSheetUnlocked(actor)) ||
      (FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.enablePermanentUnlockOnCharacterIfYouAreGM.get() &&
        actor.type === CONSTANTS.SHEET_TYPE_CHARACTER) ||
      (FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.enablePermanentUnlockOnNPCIfYouAreGM.get() &&
        actor.type === CONSTANTS.SHEET_TYPE_NPC) ||
      (FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.enablePermanentUnlockOnVehicleIfYouAreGM.get() &&
        actor.type === CONSTANTS.SHEET_TYPE_VEHICLE)
    );
  },
  /**
   * Determines whether an actor's sheet should be editable per the sheet lock feature (default `true`).
   * @param actor the actor
   * @returns whether the sheet should be editable per the sheet lock feature
   */
  isSheetUnlocked(actor: any) {
    return FoundryAdapter.tryGetFlag(actor, 'allow-edit') ?? true;
  },
  allowCharacterEffectsManagement(actor: any) {
    return (
      (SettingsProvider.settings.editEffectsGmOnlyEnabled.get() &&
        FoundryAdapter.userIsGm()) ||
      (!SettingsProvider.settings.editEffectsGmOnlyEnabled.get() &&
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
        !SettingsProvider.settings.expandedSheetEnabled.get()
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
  registerActorSheet(sheet: any, types: string[], label: string) {
    Actors.registerSheet(CONSTANTS.DND5E_SYSTEM_ID, sheet, {
      types,
      makeDefault: true,
      label,
    });
  },
  registerItemSheet(sheet: any, label: string) {
    Items.registerSheet(CONSTANTS.DND5E_SYSTEM_ID, sheet, {
      makeDefault: true,
      label,
    });
  },
  getModule(moduleId: string): any | undefined {
    return game.modules.get(moduleId);
  },
  debounce(callback: Function, delay: number): Function {
    return debounce(callback, delay);
  },
  roll(
    formula: string,
    rollData?: unknown,
    rollFnOptions: any = {}
  ): Promise<any> {
    return new Roll(formula, rollData).roll(rollFnOptions);
  },
  async rollNpcDeathSave(
    actor: Actor5e,
    options: any
  ): Promise<unknown | null> {
    const death = actor.flags[CONSTANTS.MODULE_ID].death ?? {};

    // Display a warning if we are not at zero HP or if we already have reached 3
    if (
      actor.system.attributes.hp.value > 0 ||
      death.failure >= 3 ||
      death.success >= 3
    ) {
      warn(FoundryAdapter.localize('DND5E.DeathSaveUnnecessary'), true);
      return null;
    }

    // Evaluate a global saving throw bonus
    const speaker = options.speaker || ChatMessage.getSpeaker({ actor: this });
    const globalBonuses = actor.system.bonuses?.abilities ?? {};
    const parts = [];
    const data = actor.getRollData();

    // Diamond Soul adds proficiency
    if (actor.getFlag('dnd5e', 'diamondSoul')) {
      parts.push('@prof');
      data.prof = new dnd5e.documents.Proficiency(
        actor.system.attributes.prof,
        1
      ).term;
    }

    // Include a global actor ability save bonus
    if (globalBonuses.save) {
      parts.push('@saveBonus');
      data.saveBonus = Roll.replaceFormulaData(globalBonuses.save, data);
    }

    // Evaluate the roll
    const flavor = FoundryAdapter.localize('DND5E.DeathSavingThrow');
    const rollData = FoundryAdapter.mergeObject<any>(
      {
        data,
        title: `${flavor}: ${actor.name}`,
        flavor,
        halflingLucky: actor.getFlag('dnd5e', 'halflingLucky'),
        targetValue: 10,
        messageData: {
          speaker: speaker,
          'flags.dnd5e.roll': { type: 'death' },
        },
      },
      options
    );
    rollData.parts = parts.concat(options.parts ?? []);

    const roll = await FoundryAdapter.d20Roll(rollData);
    if (!roll) return null;

    // Take action depending on the result
    const details: Record<string, any> = {};

    // Save success
    if (roll.total >= (roll.options.targetValue ?? 10)) {
      let successes = (death.success || 0) + 1;

      // Critical Success = revive with 1hp
      if (roll.isCritical) {
        details.updates = {
          [`flags.${CONSTANTS.MODULE_ID}.death.success`]: 0,
          [`flags.${CONSTANTS.MODULE_ID}.death.failure`]: 0,
          'system.attributes.hp.value': 1,
        };
        details.chatString = 'DND5E.DeathSaveCriticalSuccess';
      }

      // 3 Successes = survive and reset checks
      else if (successes === 3) {
        details.updates = {
          [`flags.${CONSTANTS.MODULE_ID}.death.success`]: 0,
          [`flags.${CONSTANTS.MODULE_ID}.death.failure`]: 0,
        };
        details.chatString = 'DND5E.DeathSaveSuccess';
      }

      // Increment successes
      else
        details.updates = {
          [`flags.${CONSTANTS.MODULE_ID}.death.success`]: clamp(
            successes,
            0,
            3
          ),
        };
    }

    // Save failure
    else {
      let failures = (death.failure || 0) + (roll.isFumble ? 2 : 1);
      details.updates = {
        [`flags.${CONSTANTS.MODULE_ID}.death.failure`]: clamp(failures, 0, 3),
      };
      if (failures >= 3) {
        // 3 Failures = death
        details.chatString = 'DND5E.DeathSaveFailure';
      }
    }

    if (!FoundryAdapter.isEmpty(details.updates))
      await actor.update(details.updates);

    // Display success/failure chat message
    if (details.chatString) {
      let chatData = {
        content: FoundryAdapter.localize(details.chatString, {
          name: actor.name,
        }),
        speaker,
      };
      ChatMessage.applyRollMode(chatData, roll.options.rollMode);
      await ChatMessage.create(chatData);
    }

    // Return the rolled result
    return roll;
  },
  async d20Roll({
    parts = [],
    data = {},
    event,
    advantage,
    disadvantage,
    critical = 20,
    fumble = 1,
    targetValue,
    elvenAccuracy,
    halflingLucky,
    reliableTalent,
    fastForward,
    chooseModifier = false,
    template,
    title,
    dialogOptions,
    chatMessage = true,
    messageData = {},
    rollMode,
    flavor,
  }: any = {}) {
    // Handle input arguments
    const formula = ['1d20'].concat(parts).join(' + ');
    const { advantageMode, isFF } = CONFIG.Dice.D20Roll.determineAdvantageMode({
      advantage,
      disadvantage,
      fastForward,
      event,
    });
    const defaultRollMode = rollMode || game.settings.get('core', 'rollMode');
    if (chooseModifier && !isFF) {
      data.mod = '@mod';
      if ('abilityCheckBonus' in data)
        data.abilityCheckBonus = '@abilityCheckBonus';
    }

    // Construct the D20Roll instance
    const roll = new CONFIG.Dice.D20Roll(formula, data, {
      flavor: flavor || title,
      advantageMode,
      defaultRollMode,
      rollMode,
      critical,
      fumble,
      targetValue,
      elvenAccuracy,
      halflingLucky,
      reliableTalent,
    });

    // Prompt a Dialog to further configure the D20Roll
    if (!isFF) {
      const configured = await roll.configureDialog(
        {
          title,
          chooseModifier,
          defaultRollMode,
          defaultAction: advantageMode,
          defaultAbility: data?.item?.ability || data?.defaultAbility,
          template,
        },
        dialogOptions
      );
      if (configured === null) return null;
    } else roll.options.rollMode ??= defaultRollMode;

    // Evaluate the configured roll
    await roll.evaluate({ async: true });

    // Create a Chat Message
    if (roll && chatMessage) await roll.toMessage(messageData);
    return roll;
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
      FoundryAdapter.hooksCall(
        'dnd5e.preRollHitDie',
        actor,
        rollConfig,
        denomination
      ) === false
    )
      return;

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

    /**
     * A hook event that fires after a hit die has been rolled for an Actor, but before updates have been performed.
     * @function dnd5e.rollHitDie
     * @memberof hookEvents
     * @param {Actor5e} actor         Actor for which the hit die has been rolled.
     * @param {Roll} roll             The resulting roll.
     * @param {object} updates
     * @param {object} updates.actor  Updates that will be applied to the actor.
     * @param {object} updates.class  Updates that will be applied to the class.
     * @returns {boolean}             Explicitly return `false` to prevent updates from being performed.
     */
    if (
      FoundryAdapter.hooksCall('dnd5e.rollHitDie', actor, roll, updates) ===
      false
    )
      return roll;

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
    return new ContextMenu(...args);
  },
};

/* ------------------------------------------------------
* Facade Types
--------------------------------------------------------- */

export type ActorReference = {
  skills: Record<string, SkillReference>;
  skillsList: ({
    abbreviation: string;
  } & SkillReference)[];
  abilities: Record<string, AbilityReference>;
  abilitiesList: AbilityReference[];
};

/* ------------------------------------------------------
* Minimally stubbed foundry types to fuel the adapter.
--------------------------------------------------------- */

declare const Hooks: any;
declare const foundry: any;
declare const game: any;
declare const Actors: any;
declare const Items: any;
declare const CONFIG: any;
declare const Roll: any;
declare const dnd5e: any;
declare const ui: any;
declare const debounce: any;
declare const ChatMessage: any;
declare const AudioHelper: any;
declare const TextEditor: any;
declare const ContextMenu: any;

type AbilityReference = {
  abbreviation: string;
  defaults: Record<string, number>;
  label: string;
  type: string;
};

type SkillReference = {
  label: string;
  ability: string;
};

type TextEditorOptions = Partial<{
  target: string;
  button: boolean;
  class: string;
  editable: boolean;
  engine: string;
  collaborate: boolean;
  owner: boolean;
  documents: boolean;
  rollData: any;
  content: string;
}>;

declare var HandlebarsHelpers: {
  editor: (
    content: string,
    options?: {
      hash: TextEditorOptions;
    }
  ) => string;
};

type MergeObjectOptions = {
  insertKeys: boolean;
  insertValues: boolean;
  overwrite: boolean;
  recursive: boolean;
  inplace: boolean;
  enforceTypes: boolean;
  performDeletions: boolean;
};

declare var mergeObject: <T>(
  original: T,
  other: Partial<T>,
  options?: Partial<MergeObjectOptions>
) => T;

declare var expandObject: (obj: any) => any;
declare var isEmpty: (obj: any) => boolean;
