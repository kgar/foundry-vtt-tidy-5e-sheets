import type {
  CharacterSheetContext,
  ClassSummary,
  DropdownOption,
  NpcSheetContext,
} from 'src/types/types';
import { CONSTANTS } from '../constants';
import type { ActorSheet5eCharacter } from 'src/types/actor5e-sheet';
import type { Actor5e } from 'src/types/actor';
import type { Item5e } from 'src/types/item';
import type { FoundryDocument } from 'src/types/document';
import { SettingsProvider } from 'src/settings/settings';

export const FoundryAdapter = {
  userIsGm() {
    return game.user.isGM;
  },
  getGameSetting<T = string>(settingName: string): T {
    return game.settings.get(CONSTANTS.MODULE_ID, settingName) as T;
  },
  async setGameSetting(key: string, value: unknown): Promise<void> {
    await game.settings.set(CONSTANTS.MODULE_ID, key, value);
  },
  onReady(func: Function) {
    Hooks.on('ready', func);
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
      item.system.preparation?.mode !== 'atwill' &&
      item.system.preparation?.mode !== 'innate' &&
      item.system.preparation?.mode !== 'always' &&
      (item.system.level !== 0 ||
        SettingsProvider.settings.allowCantripToBePreparedOnContext.get())
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
  createItem(dataset: Record<string, unknown>, actor: Actor5e) {
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
    Object.values(CONFIG.DND5E.spellComponents).forEach(
      (x: SpellComponentRef) => map.set(x.abbr, x.label)
    );
    Object.values(CONFIG.DND5E.spellTags).forEach((x: SpellTagRef) =>
      map.set(x.abbr, x.label)
    );
    return map;
  },
  getProperty(obj: any, path: string): unknown {
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
    if (spell.system.preparation.prepared) {
      classes.push('prepared');
    }
    if (spell.system.preparation.mode === 'always') {
      classes.push('always-prepared');
    }
    if (spell.system.preparation.mode === 'pact') {
      classes.push('pact');
    }
    if (spell.system.preparation.mode === 'atwill') {
      classes.push('at-will');
    }
    if (spell.system.preparation.mode === 'innate') {
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
        console.warn('removing configure-sheet button!');
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
    const allowEdit = FoundryAdapter.tryGetFlag(actor, 'allow-edit');
    return (
      (actor.isOwner && allowEdit) ||
      (FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.enablePermanentUnlockOnCharacterIfYouAreGM.get() &&
        actor.type === 'character') ||
      (FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.enablePermanentUnlockOnNPCIfYouAreGM.get() &&
        actor.type === 'npc') ||
      (FoundryAdapter.userIsGm() &&
        SettingsProvider.settings.enablePermanentUnlockOnVehicleIfYouAreGM.get() &&
        actor.type === 'vehicle')
    );
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
    const showLimitedSheet = !FoundryAdapter.userIsGm() && this.actor.limited;
    if (actor.type === 'character') {
      return (
        showLimitedSheet &&
        !SettingsProvider.settings.expandedSheetEnabled.get()
      );
    }
    return showLimitedSheet;
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

declare const Hooks: {
  on: any;
};

/**
 * References the constructor of type `T`
 * @internal
 */
type ConstructorOf<T> = new (...args: any) => T;

declare const foundry: any;

declare const game: {
  user: {
    isGM: boolean;
  };
  settings: {
    get: (moduleId: string, settingName: string) => unknown;
    set: (moduleId: string, key: string, value: unknown) => Promise<void>;
  };
  i18n: {
    localize(value: string): string;
    format(value: string, options: Record<string, unknown>): string;
    lang: string;
  };
};
declare const Actors: {
  registerSheet(
    system: string,
    sheet: typeof ActorSheet5eCharacter,
    options: unknown
  ): unknown;
};
declare const CONFIG: {
  DND5E: {
    spellComponents: Record<string, SpellComponentRef>;
    spellTags: Record<string, SpellTagRef>;
  };
};

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

type SpellComponentRef = { label: string; abbr: string };
type SpellTagRef = { label: string; abbr: string; tag: true };
