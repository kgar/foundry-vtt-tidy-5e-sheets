import type { ClassSummary, ItemStub } from 'src/types/types';
import { CONSTANTS } from '../constants';
import { warn } from 'src/utils/logging';
import { Tidy5eKgarUserSettings } from 'src/settings/user-settings-form';

export const FoundryAdapter = {
  getActorSheetClass() {
    return dnd5e.applications.actor.ActorSheet5eCharacter;
  },
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
  registerCharacterSheet(
    sheet: typeof dnd5e.applications.actor.ActorSheet5eCharacter
  ) {
    return Actors.registerSheet('dnd5e', sheet, {
      types: ['character'],
      makeDefault: true,
      label: 'Tidy 5e kgar',
    });
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
  getClassAndSubclassSummaries(actor: Actor5e): Map<string, ClassSummary> {
    return actor.items.reduce(
      (map: Map<string, ClassSummary>, item: ItemStub) => {
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
      name: game.i18n.format('DND5E.ItemNew', {
        type: game.i18n.localize(CONFIG.Item.typeLabels[dataset.type]),
      }),
      type: dataset.type,
      system: foundry.utils.expandObject({ ...dataset }),
    };
    delete itemData.system.type;
    return actor.createEmbeddedDocuments('Item', [itemData]);
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
declare const dnd5e: {
  applications: {
    actor: {
      ActorSheet5eCharacter: typeof ActorSheet5eCharacter;
    };
  };
};
declare class ActorSheet5eCharacter {
  constructor(...args: any[]);
  actor: Actor5e;
  activateListeners(html: { get: (index: number) => HTMLElement }): void;
  submit(): void;
  static get defaultOptions(): Record<string, unknown>;
  close(options: unknown): Promise<void>;
}
export type Actor5e = {
  name: string;
  limited: boolean;
  isOwner: boolean;
  system: {
    attributes: {
      hp: {
        value: number | null;
        max: number | null;
      };
    };
    details: {
      background: string;
      bond: string;
      flaw: string;
    };
  };
  rollAbility(abbreviation: string, options: { event: Event }): void;
  rollAbilityTest(abbreviation: string, options: { event: Event }): void;
  rollAbilitySave(abbreviation: string, options: { event: Event }): void;
  rollSkill(abbreviation: string, options: { event: Event }): void;
};
export type CharacterSheetContext = { actor: Actor5e } & Record<string, any>;
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
  DND5E: any;
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
