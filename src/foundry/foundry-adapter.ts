import type {
  ActionItem,
  ActorSheetContext,
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
import { clamp } from 'src/utils/numbers';
import FloatingContextMenu from 'src/context-menu/FloatingContextMenu';

export const FoundryAdapter = {
  isFoundryV10() {
    return game.dnd5e.isV10;
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
    return owner.createEmbeddedDocuments('ActiveEffect', [
      {
        label: isActor ? game.i18n.localize('DND5E.EffectNew') : owner.name,
        icon: isActor ? 'icons/svg/aura.svg' : owner.img,
        origin: owner.uuid,
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
    return mergeObject(original, ...args) as T;
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
      spell.system.preparation.mode === CONSTANTS.SPELL_PREPARATION_MODE_INNATE
    ) {
      classes.push('innate');
    }

    return classes.join(' ');
  },
  getSpellAttackModAndTooltip(context: ActorSheetContext) {
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

    const parentClass = FoundryAdapter.tryGetFlag<string>(spell, 'parentClass');

    const classImage = parentClass
      ? context.actorClassesToImages[parentClass]
      : undefined;

    return classImage ?? spell.img;
  },
  searchItems(searchCriteria: string, items: Item5e[]): Set<string> {
    return new Set(
      items
        .filter(
          (item: any) =>
            searchCriteria.trim() === '' ||
            (item.system.identified === false &&
              item.system.unidentified?.name
                ?.toLowerCase()
                .includes(searchCriteria.toLowerCase())) ||
            (item.system.identified !== false &&
              item.name.toLowerCase().includes(searchCriteria.toLowerCase()))
        )
        .map((item) => item.id)
    );
  },
  getFilteredActionItems(searchCriteria: string, items: Set<ActionItem>) {
    return Array.from(items).filter(
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
  isDocumentFavorited(document: any) {
    if (!document) {
      return false;
    }

    return (
      FoundryAdapter.tryGetFlag<boolean | null>(document, 'favorite') ?? false
    );
  },
  toggleFavorite(document: any) {
    const favorited = FoundryAdapter.isDocumentFavorited(document);
    if (favorited) {
      FoundryAdapter.unsetFlag(document, 'favorite');
    } else {
      FoundryAdapter.setFlag(document, 'favorite', true);
    }
  },
  isActorSheetUnlocked(actor: any): boolean {
    return (
      (actor.isOwner && FoundryAdapter.isSheetUnlocked(actor)) ||
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
    const death = actor.flags[CONSTANTS.MODULE_ID]?.death ?? {};

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
      Hooks.call('dnd5e.preRollHitDie', actor, rollConfig, denomination) ===
      false
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
    if (Hooks.call('dnd5e.rollHitDie', actor, roll, updates) === false)
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
      Hooks.call('tidy5e-sheet.actorPreUseItem', item, config, options) ===
      false;

    if (suppressItemUse) {
      return;
    }

    item.use(config, options);
  },
  onActorItemButtonContextMenu(item: Item5e, options: { event: Event }) {
    // Allow another module to react to a context menu action on the item use button.
    Hooks.callAll('tidy5e-sheet.actorItemUseContextMenu', item, options);
  },
  /**
   * Fires appropriate hooks related to tab selection and reports whether tab selection was cancelled.
   * @param app the associated sheets
   * @param newTabId the new tab ID to select
   * @returns `true` to indicate proceeding with tab change; `false` to halt tab change
   */
  onTabSelecting(app: any & { currentTabId: string }, newTabId: string) {
    const canProceed = Hooks.call(
      'tidy5e-sheet.preSelectTab',
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
      Hooks.callAll(
        'tidy5e-sheet.selectTab',
        app,
        app.element.get(0),
        newTabId
      );
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
    if (!parentId) return document.effects.get(effectId);
    return document.items.get(parentId).effects.get(effectId);
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
  attunementContextRequired: {
    icon: 'fa-sun',
    cls: 'not-attuned',
    title: 'DND5E.AttunementRequired',
  },
  attunementContextAttune: {
    icon: 'fa-sun',
    cls: 'attuned',
    title: 'DND5E.AttunementAttuned',
  },
  getAttunementContext(
    item: Item5e
  ): { icon: string; cls: string; title: string } | undefined {
    return item.system.attunement === CONFIG.DND5E.attunementTypes.REQUIRED
      ? FoundryAdapter.attunementContextRequired
      : item.system.attunement === CONFIG.DND5E.attunementTypes.ATTUNED
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
};
