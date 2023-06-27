import { CONSTANTS } from '../constants';

export const FoundryAdapter = {
  getActorSheetClass() {
    return dnd5e.applications.actor.ActorSheet5eCharacter;
  },
  userIsGm() {
    return game.user.isGM;
  },
  getGameSetting(moduleId: string, settingName: string): unknown {
    return game.settings.get(moduleId, settingName);
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
      label: 'TODO: Localize, but Tidy 5e kgar',
    });
  },
  getTemplate(templateName: string) {
    return `modules/${CONSTANTS.MODULE_ID}/templates/${templateName}`;
  },
  localize(value: string) {
    return game.i18n.localize(value);
  },
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
      ActorSheet5eCharacter: ConstructorOf<{
        actor: {
          limited: boolean;
          isOwner: boolean;
        };
        activateListeners(html: { get: (index: number) => HTMLElement }): void;
        submit(): void;
      }>;
    };
  };
};
declare const game: {
  user: {
    isGM: boolean;
  };
  settings: {
    get: (moduleId: string, settingName: string) => unknown;
  };
  i18n: {
    localize(value: string): string;
  };
};
declare const Actors: {
  registerSheet(
    system: string,
    sheet: ConstructorOf<any>,
    options: unknown
  ): unknown;
};
