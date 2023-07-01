import { CONSTANTS } from '../constants';

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
  localize(value: string) {
    return game.i18n.localize(value);
  },
  getActorReference(): ActorReference {
    return {
      skills: CONFIG.DND5E.skills,
      skillsList: Object.entries(CONFIG.DND5E.skills).map(
        (x: [string, any]) => ({
          abbreviation: x[0],
          ...x[1],
        })
      ),
      abilities: CONFIG.DND5E.abilities,
      abilitiesList: Object.values(CONFIG.DND5E.abilities),
    };
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
