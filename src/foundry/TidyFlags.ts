import type { Item5e } from 'src/types/item.types';
import type { SheetTabSectionConfigs } from 'src/features/sections/sections.types';
import { CONSTANTS } from 'src/constants';
import { isNil } from 'src/utils/data';
import type { Actor5e } from 'src/types/types';
import type {
  TidyFlagNamedNotes,
  TidyFlagUnnamedNotes,
} from './TidyFlags.types';

/** Manages Tidy flags. */
export class TidyFlags {
  static getFlagPropertyPath(key: string) {
    return `flags.${CONSTANTS.MODULE_ID}.${key}`;
  }

  /**
   * Determines whether an item whose default Action List behavior has been overridden
   * to be included (`true`) or excluded (`false`).
   * `undefined` means there is no override and standard Action List logic should be used.
   * */
  static actionFilterOverride = {
    key: 'action-filter-override' as const,
    prop: TidyFlags.getFlagPropertyPath('action-filter-override'),
    /** Gets the item's Action Filter Override setting. */
    get(item: Item5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(
          item,
          TidyFlags.actionFilterOverride.key
        ) ?? undefined
      );
    },
    /** Sets the item's Action Filter Override setting. */
    set(item: Item5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(item, TidyFlags.actionFilterOverride.key, value);
    },
    /**
     * Clears the item's Action Filter Override setting,
     * meaning the item should use the standard Action List logic
     * for inclusion or exclusion. */
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.actionFilterOverride.key);
    },
  };

  /**
   * Indicates a custom section name for a given item,
   * which determines the item's section placement
   * in the Actions tab.
   */
  static actionSection = {
    key: 'actionSection' as const,
    prop: TidyFlags.getFlagPropertyPath('actionSection'),
    /** Gets the item's Action Section setting. */
    get(item: Item5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(item, TidyFlags.actionSection.key) ??
        undefined
      );
    },
    /** Sets the item's Action Section setting. */
    set(item: Item5e, value: string) {
      return TidyFlags.setFlag(item, TidyFlags.actionSection.key, value);
    },
    /**
     * Clears the item's Action Section setting,
     * meaning the item should use its default action section
     * in the Actions tab.
     */
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.actionSection.key);
    },
  };

  /**
   * The age of an actor.
   * For this module, it is only an informational biographical field.
   */
  static age = {
    key: 'age' as const,
    prop: TidyFlags.getFlagPropertyPath('age'),
    /** Gets the actor's age. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.age.key) ?? undefined
      );
    },
    /** Sets the actor's age. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.age.key, value);
    },
    /** Clears the actor's age. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.age.key);
    },
  };

  /**
   * Determines whether an actor's sheet should be editable per the sheet lock feature (default `true`).
   * @param actor the actor
   * @returns whether the sheet should be editable per the sheet lock feature
   */
  static allowEdit = {
    key: 'allow-edit',
    prop: TidyFlags.getFlagPropertyPath('allow-edit'),
    /** Denotes whether the sheet is in edit mode. */
    get(document: any): boolean {
      return TidyFlags.tryGetFlag<boolean>(document, 'allow-edit') ?? true;
    },
    /** Sets whether the sheet is in edit mode. */
    set(document: any, value: boolean) {
      return TidyFlags.setFlag(document, TidyFlags.allowEdit.key, value);
    },
    /** Removes the actor's edit mode setting. */
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.allowEdit.key);
    },
  };

  /**
   * The appearance of an actor.
   * For this module, it is only an informational biographical field.
   */
  static appearance = {
    key: 'appearance' as const,
    prop: TidyFlags.getFlagPropertyPath('appearance'),
    /** Gets the actor's appearance. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.appearance.key) ??
        undefined
      );
    },
    /** Sets the actor's appearance. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.appearance.key, value);
    },
    /** Clears the actor's appearance. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.appearance.key);
    },
  };

  /**
   * A field used to filter spells based on an indicated class,
   * showing only spells whose `parentClass` flag matches
   * this `classFilter` selection.
   */
  static classFilter = {
    key: 'classFilter' as const,
    prop: TidyFlags.getFlagPropertyPath('classFilter'),
    /** Gets the actor's class filter. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.classFilter.key) ??
        undefined
      );
    },
    /** Sets the actor's class filter. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.classFilter.key, value);
    },
    /** Clears the actor's class filter. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.classFilter.key);
    },
  };

  /**
   * The level exhaustion for a given actor.
   * This flag applies to actors which don't yet possess
   * standard exhaustion schema from the dnd5e system.
   */
  static exhaustion = {
    key: 'exhaustion' as const,
    prop: TidyFlags.getFlagPropertyPath('exhaustion'),
    /** Gets the actor's exhaustion level. */
    get(actor: Actor5e): number | undefined {
      return (
        TidyFlags.tryGetFlag<number>(actor, TidyFlags.exhaustion.key) ??
        undefined
      );
    },
    /** Sets the actor's exhaustion level. */
    set(actor: Actor5e, value: number): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.exhaustion.key, value);
    },
    /** Clears the actor's exhaustion level. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.exhaustion.key);
    },
  };

  /**
   * The eyes of an actor.
   * For this module, it is only an informational biographical field.
   */
  static eyes = {
    key: 'eyes' as const,
    prop: TidyFlags.getFlagPropertyPath('eyes'),
    /** Gets the actor's eyes. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.eyes.key) ?? undefined
      );
    },
    /** Sets the actor's eyes. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.eyes.key, value);
    },
    /** Clears the actor's eyes. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.eyes.key);
    },
  };

  /**
   * The faith of an actor.
   * For this module, it is only an informational biographical field.
   */
  static faith = {
    key: 'faith' as const,
    prop: TidyFlags.getFlagPropertyPath('faith'),
    /** Gets the actor's faith. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.faith.key) ?? undefined
      );
    },
    /** Sets the actor's faith. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.faith.key, value);
    },
    /** Clears the actor's faith. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.faith.key);
    },
  };

  /**
   * The gender of an actor.
   * For this module, it is only an informational biographical field.
   */
  static gender = {
    key: 'gender' as const,
    prop: TidyFlags.getFlagPropertyPath('gender'),
    /** Gets the actor's gender. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.gender.key) ?? undefined
      );
    },
    /** Sets the actor's gender. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.gender.key, value);
    },
    /** Clears the actor's gender. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.gender.key);
    },
  };

  /**
   * The hair of an actor.
   * For this module, it is only an informational biographical field.
   */
  static hair = {
    key: 'hair' as const,
    prop: TidyFlags.getFlagPropertyPath('hair'),
    /** Gets the actor's hair. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.hair.key) ?? undefined
      );
    },
    /** Sets the actor's hair. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.hair.key, value);
    },
    /** Clears the actor's hair. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.hair.key);
    },
  };

  /**
   * The height of an actor.
   * For this module, it is only an informational biographical field.
   */
  static height = {
    key: 'height' as const,
    prop: TidyFlags.getFlagPropertyPath('height'),
    /** Gets the actor's height. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.height.key) ?? undefined
      );
    },
    /** Sets the actor's height. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.height.key, value);
    },
    /** Clears the actor's height. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.height.key);
    },
  };

  /**
   * Denotes whether to show a grid for a given inventory screen.
   */
  static inventoryGrid = {
    key: 'inventory-grid',
    prop: TidyFlags.getFlagPropertyPath('inventory-grid'),
    /** Gets whether to show a grid for a given inventory screen. */
    get(document: any): boolean {
      return (
        TidyFlags.tryGetFlag<boolean>(document, TidyFlags.inventoryGrid.key) ===
        true
      );
    },
    /** Sets whether to show a grid for a given inventory screen. */
    set(document: any) {
      return TidyFlags.setFlag(document, TidyFlags.inventoryGrid.key, true);
    },
    /** Clears whether to show a grid for a given inventory screen. */
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.inventoryGrid.key);
    },
  };

  /**
   * A formula that determines the maximum number of
   * prepared spells an actor can have.
   */
  static maxPreparedSpells = {
    key: 'maxPreparedSpells' as const,
    prop: TidyFlags.getFlagPropertyPath('maxPreparedSpells'),
    /** Gets the actor's maximum number of prepared spells. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.maxPreparedSpells.key) ??
        undefined
      );
    },
    /** Sets the actor's maximum number of prepared spells. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.maxPreparedSpells.key, value);
    },
    /** Clears the actor's maximum number of prepared spells. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.maxPreparedSpells.key);
    },
  };

  /**
   * Denotes whether a vehicle is moving.
   */
  static motion = {
    key: 'motion' as const,
    prop: TidyFlags.getFlagPropertyPath('motion'),
    /** Gets whether a vehicle is moving. */
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(actor, TidyFlags.motion.key) ?? undefined
      );
    },
    /** Sets whether a vehicle is moving. */
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.motion.key, value);
    },
    /** Clears whether a vehicle is moving. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.motion.key);
    },
  };

  /**
   * Journal notes for an actor.
   * This flag is for actors which don't yet have the standard notes schema.
   */
  static notes = {
    key: 'notes' as const,
    prop: TidyFlags.getFlagPropertyPath('notes'),
    /** Gets the actor's journal notes. */
    get(actor: Actor5e): TidyFlagUnnamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagUnnamedNotes>(
          actor,
          TidyFlags.notes.key
        ) ?? undefined
      );
    },
    /** Sets the actor's journal notes. */
    set(actor: Actor5e, value: TidyFlagUnnamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes.key, value);
    },
    /** Clears the actor's journal notes. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes.key);
    },
    /** The individual members of this flag. For flags that are not primitive values. */
    members: {
      /** The notes HTML. */
      value: {
        key: 'notes.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes.value'),
        /** Gets the actor's notes HTML. */
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes.members.value.key
            ) ?? undefined
          );
        },
        /** Sets the actor's notes HTML. */
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes.members.value.key,
            value
          );
        },
        /** Clears the actor's notes HTML. */
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes.members.value.key);
        },
      },
    },
  };

  /**
   * Named journal notes for an actor.
   * These notes represent extra notes that are available
   * to actors for compartmentalizing notes.
   */
  static notes1 = {
    key: 'notes1' as const,
    prop: TidyFlags.getFlagPropertyPath('notes1'),
    /** Gets the actor's first named journal notes. */
    get(actor: Actor5e): TidyFlagNamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagNamedNotes>(actor, TidyFlags.notes1.key) ??
        undefined
      );
    },
    /** Sets the actor's first named journal notes. */
    set(actor: Actor5e, value: TidyFlagNamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes1.key, value);
    },
    /** Clears the actor's first named journal notes. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes1.key);
    },
    /** The individual members of this flag. For flags that are not primitive values. */
    members: {
      /** The notes name. */
      name: {
        key: 'notes1.name' as const,
        prop: TidyFlags.getFlagPropertyPath('notes1.name'),
        /** Gets the actor's first named journal notes name. */
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes1.members.name.key
            ) ?? undefined
          );
        },
        /** Sets the actor's first named journal notes name. */
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes1.members.name.key,
            value
          );
        },
        /** Clears the actor's first named journal notes name. */
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes1.members.name.key);
        },
      },
      /** The notes HTML. */
      value: {
        key: 'notes1.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes1.value'),
        /** Gets the actor's first named journal notes HTML. */
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes1.members.value.key
            ) ?? undefined
          );
        },
        /** Sets the actor's first named journal notes HTML. */
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes1.members.value.key,
            value
          );
        },
        /** Clears the actor's first named journal notes HTML. */
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes1.members.value.key);
        },
      },
    },
  };

  /**
   * Named journal notes for an actor.
   * These notes represent extra notes that are available
   * to actors for compartmentalizing notes.
   */
  static notes2 = {
    key: 'notes2' as const,
    prop: TidyFlags.getFlagPropertyPath('notes2'),
    /** Gets the actor's second named journal notes. */
    get(actor: Actor5e): TidyFlagNamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagNamedNotes>(actor, TidyFlags.notes2.key) ??
        undefined
      );
    },
    /** Sets the actor's second named journal notes. */
    set(actor: Actor5e, value: TidyFlagNamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes2.key, value);
    },
    /** Clears the actor's second named journal notes. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes2.key);
    },
    /** The individual members of this flag. For flags that are not primitive values. */
    members: {
      /** The notes name. */
      name: {
        key: 'notes2.name' as const,
        prop: TidyFlags.getFlagPropertyPath('notes2.name'),
        /** Gets the actor's second named journal notes name. */
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes2.members.name.key
            ) ?? undefined
          );
        },
        /** Sets the actor's second named journal notes name. */
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes2.members.name.key,
            value
          );
        },
        /** Clears the actor's second named journal notes name. */
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes2.members.name.key);
        },
      },
      /** The notes HTML. */
      value: {
        key: 'notes2.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes2.value'),
        /** Gets the actor's second named journal notes HTML. */
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes2.members.value.key
            ) ?? undefined
          );
        },
        /** Sets the actor's second named journal notes HTML. */
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes2.members.value.key,
            value
          );
        },
        /** Clears the actor's second named journal notes HTML. */
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes2.members.value.key);
        },
      },
    },
  };

  /**
   * Named journal notes for an actor.
   * These notes represent extra notes that are available
   * to actors for compartmentalizing notes.
   */
  static notes3 = {
    key: 'notes3' as const,
    prop: TidyFlags.getFlagPropertyPath('notes3'),
    /** Gets the actor's third named journal notes. */
    get(actor: Actor5e): TidyFlagNamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagNamedNotes>(actor, TidyFlags.notes3.key) ??
        undefined
      );
    },
    /** Sets the actor's third named journal notes. */
    set(actor: Actor5e, value: TidyFlagNamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes3.key, value);
    },
    /** Clears the actor's third named journal notes. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes3.key);
    },
    members: {
      name: {
        key: 'notes3.name' as const,
        prop: TidyFlags.getFlagPropertyPath('notes3.name'),
        /** Gets the actor's third named journal notes name. */
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes3.members.name.key
            ) ?? undefined
          );
        },
        /** Sets the actor's third named journal notes name. */
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes3.members.name.key,
            value
          );
        },
        /** Clears the actor's third named journal notes name. */
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes3.members.name.key);
        },
      },
      value: {
        key: 'notes3.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes3.value'),
        /** Gets the actor's third named journal notes HTML. */
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes3.members.value.key
            ) ?? undefined
          );
        },
        /** Sets the actor's third named journal notes HTML. */
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes3.members.value.key,
            value
          );
        },
        /** Clears the actor's third named journal notes HTML. */
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes3.members.value.key);
        },
      },
    },
  };

  /**
   * Named journal notes for an actor.
   * These notes represent extra notes that are available
   * to actors for compartmentalizing notes.
   */
  static notes4 = {
    key: 'notes4' as const,
    prop: TidyFlags.getFlagPropertyPath('notes4'),
    /** Gets the actor's fourth named journal notes. */
    get(actor: Actor5e): TidyFlagNamedNotes | undefined {
      return (
        TidyFlags.tryGetFlag<TidyFlagNamedNotes>(actor, TidyFlags.notes4.key) ??
        undefined
      );
    },
    /** Sets the actor's fourth named journal notes. */
    set(actor: Actor5e, value: TidyFlagNamedNotes): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.notes4.key, value);
    },
    /** Clears the actor's fourth named journal notes. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.notes4.key);
    },
    /** The individual members of this flag. For flags that are not primitive values. */
    members: {
      /** The notes name. */
      name: {
        key: 'notes4.name' as const,
        prop: TidyFlags.getFlagPropertyPath('notes4.name'),
        /** Gets the actor's fourth named journal notes name. */
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes4.members.name.key
            ) ?? undefined
          );
        },
        /** Sets the actor's fourth named journal notes name. */
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes4.members.name.key,
            value
          );
        },
        /** Clears the actor's fourth named journal notes name. */
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes4.members.name.key);
        },
      },
      /** The notes HTML. */
      value: {
        key: 'notes4.value' as const,
        prop: TidyFlags.getFlagPropertyPath('notes4.value'),
        /** Gets the actor's fourth named journal notes HTML. */
        get(actor: Actor5e): string | undefined {
          return (
            TidyFlags.tryGetFlag<string>(
              actor,
              TidyFlags.notes4.members.value.key
            ) ?? undefined
          );
        },
        /** Sets the actor's fourth named journal notes HTML. */
        set(actor: Actor5e, value: string): Promise<void> {
          return TidyFlags.setFlag(
            actor,
            TidyFlags.notes4.members.value.key,
            value
          );
        },
        /** Clears the actor's fourth named journal notes HTML. */
        unset(actor: Actor5e) {
          return TidyFlags.unsetFlag(actor, TidyFlags.notes4.members.value.key);
        },
      },
    },
  };

  /**
   * A class identifier which associates an item (usually a spell)
   * with a particular Class. This is used in conjunction with `classFilter`
   * to allow for filtering spells by class.
   */
  static parentClass = {
    key: 'parentClass' as const,
    prop: TidyFlags.getFlagPropertyPath('parentClass'),
    /** Gets the parent class of an item. */
    get(item: Item5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(item, TidyFlags.parentClass.key) ??
        undefined
      );
    },
    /** Sets the parent class of an item. */
    set(item: Item5e, value: string): Promise<void> {
      return TidyFlags.setFlag(item, TidyFlags.parentClass.key, value);
    },
    /** Clears the parent class of an item. */
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.parentClass.key);
    },
  };

  /**
   * The name of the player who owns the actor.
   * This is informational and not used for game logic.
   */
  static playerName = {
    key: 'playerName' as const,
    prop: TidyFlags.getFlagPropertyPath('playerName'),
    /** Gets the name of the player who owns the actor. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.playerName.key) ??
        undefined
      );
    },
    /** Sets the name of the player who owns the actor. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.playerName.key, value);
    },
    /** Clears the name of the player who owns the actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.playerName.key);
    },
  };

  /**
   * Indicates a custom section name for a given item
   * which determines the item's section placement
   * in the item's default tab, as well as any other locations
   * that aren't the Actions tab.
   */
  static section = {
    key: 'section' as const,
    prop: TidyFlags.getFlagPropertyPath('section'),
    /** Gets the custom section name for an item. */
    get(item: Item5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(item, TidyFlags.section.key) ?? undefined
      );
    },
    /** Sets the custom section name for an item. */
    set(item: Item5e, value: string) {
      return TidyFlags.setFlag(item, TidyFlags.section.key, value);
    },
    /**
     * Clears the item's custom section setting,
     * meaning the item should use its default section
     * in the item's default tab, as well as any other locations
     * that aren't the Actions tab.
     */
    unset(item: Item5e) {
      return TidyFlags.unsetFlag(item, TidyFlags.section.key);
    },
  };

  /** Determines the order of item table sections for a given document sheet. */
  static sectionConfig = {
    key: 'sheet-section-config' as const,
    prop: TidyFlags.getFlagPropertyPath('sheet-section-config'),
    /** Gets the document sheet's section configuration. `undefined` means to use the default settings. */
    get(document: any): SheetTabSectionConfigs | undefined {
      const sectionConfigs = TidyFlags.tryGetFlag<SheetTabSectionConfigs>(
        document,
        TidyFlags.sectionConfig.key
      );

      if (!sectionConfigs) {
        return undefined;
      }

      for (let section of Object.values(sectionConfigs)) {
        // Account for how localized keys are stored. For each top-level property, flatten until SheetTabSectionConfigs shape achieved.
        for (let [key, value] of Object.entries(section)) {
          if (Object.getOwnPropertyNames(value).length > 1) {
            continue;
          }

          let newKey = key;
          let newValue: any = value;

          while (true) {
            const propNames = Object.getOwnPropertyNames(newValue);

            let currentPropAtDepth = propNames[0];
            if (isNil(currentPropAtDepth) || propNames.length > 1) {
              break;
            }

            newKey += '.' + currentPropAtDepth;
            newValue = newValue[currentPropAtDepth];
          }

          delete section[key];
          section[newKey] = newValue;
        }
      }

      return sectionConfigs;
    },
    /** Sets the document sheet's configuration. */
    set(document: any, value: SheetTabSectionConfigs) {
      return TidyFlags.setFlag(document, TidyFlags.sectionConfig.key, value);
    },
    /**
     * Clears the document sheet's section config,
     * meaning the target actor should use default settings.
     * */
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.sectionConfig.key);
    },
  };

  /**
   * The tabs that are currently selected for a given actor.
   * This is used to determine which tabs are visible
   * in the actor's sheet.
   * When this field is empty, the actor uses the default tabs.
   */
  static selectedTabs = {
    key: 'selected-tabs' as const,
    prop: TidyFlags.getFlagPropertyPath('selected-tabs'),
    /** Gets the selected tabs for an actor. */
    get(actor: Actor5e): string[] | undefined {
      return (
        TidyFlags.tryGetFlag<string[]>(actor, TidyFlags.selectedTabs.key) ??
        undefined
      );
    },
    /** Sets the selected tabs for an actor. */
    set(actor: Actor5e, value: string[]): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.selectedTabs.key, value);
    },
    /** Clears the selected tabs for an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.selectedTabs.key);
    },
  };

  /**
   * Indicates whether the container panel should be shown for a given actor.
   * This is used to determine whether the container panel is visible
   * in the actor's inventory tab.
   */
  static showContainerPanel = {
    key: 'showContainerPanel' as const,
    prop: TidyFlags.getFlagPropertyPath('showContainerPanel'),
    /** Gets whether the container panel should be shown for an actor. */
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(
          actor,
          TidyFlags.showContainerPanel.key
        ) ?? undefined
      );
    },
    /** Sets whether the container panel should be shown for an actor. */
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.showContainerPanel.key, value);
    },
    /** Clears whether the container panel should be shown for an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.showContainerPanel.key);
    },
  };

  /**
   * Indicates whether the legendary toolbar should be shown for a given NPC.
   */
  static showLegendaryToolbar = {
    key: 'showLegendaryToolbar' as const,
    prop: TidyFlags.getFlagPropertyPath('showLegendaryToolbar'),
    /** Gets whether the legendary toolbar should be shown for an NPC. */
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(
          actor,
          TidyFlags.showLegendaryToolbar.key
        ) ?? undefined
      );
    },
    /** Sets whether the legendary toolbar should be shown for an NPC. */
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(
        actor,
        TidyFlags.showLegendaryToolbar.key,
        value
      );
    },
    /** Clears whether the legendary toolbar should be shown for an NPC. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.showLegendaryToolbar.key);
    },
  };

  /**
   * Indicates whether the additional personality info should be shown
   * for a given NPC on the biography tab.
   */
  static showNpcPersonalityInfo = {
    key: 'showNpcPersonalityInfo' as const,
    prop: TidyFlags.getFlagPropertyPath('showNpcPersonalityInfo'),
    /** Gets whether the additional personality info should be shown for an NPC. */
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(
          actor,
          TidyFlags.showNpcPersonalityInfo.key
        ) ?? undefined
      );
    },
    /** Sets whether the additional personality info should be shown for an NPC. */
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(
        actor,
        TidyFlags.showNpcPersonalityInfo.key,
        value
      );
    },
    /** Clears whether the additional personality info should be shown for an NPC. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.showNpcPersonalityInfo.key);
    },
  };

  /**
   * Indicates whether the skills section should be expanded for a given actor.
   * If this is set to `true`, all skills are shown.
   * If this is set to `false`, unproficient skills are hidden and the rest are shown.
   */
  static skillsExpanded = {
    key: 'skillsExpanded' as const,
    prop: TidyFlags.getFlagPropertyPath('skillsExpanded'),
    /** Gets whether the skills section should be expanded for an actor. */
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(actor, TidyFlags.skillsExpanded.key) ??
        undefined
      );
    },
    /** Sets whether the skills section should be expanded for an actor. */
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.skillsExpanded.key, value);
    },
    /** Clears whether the skills section should be expanded for an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.skillsExpanded.key);
    },
  };

  /**
   * The skin of an actor.
   * This is informational and not used for game logic.
   */
  static skin = {
    key: 'skin' as const,
    prop: TidyFlags.getFlagPropertyPath('skin'),
    /** Gets the skin of an actor. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.skin.key) ?? undefined
      );
    },
    /** Sets the skin of an actor. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.skin.key, value);
    },
    /** Clears the skin of an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.skin.key);
    },
  };

  /**
   * Denotes whether to show a grid for a given spellbook screen.
   */
  static spellbookGrid = {
    key: 'spellbook-grid',
    prop: TidyFlags.getFlagPropertyPath('spellbook-grid'),
    /** Gets whether to show a grid for a given spellbook screen. */
    get(document: any): boolean {
      return (
        TidyFlags.tryGetFlag<boolean>(document, TidyFlags.spellbookGrid.key) ===
        true
      );
    },
    /** Sets whether to show a grid for a given spellbook screen. */
    set(document: any) {
      return TidyFlags.setFlag(document, TidyFlags.spellbookGrid.key, true);
    },
    /** Clears whether to show a grid for a given spellbook screen. */
    unset(document: any) {
      return TidyFlags.unsetFlag(document, TidyFlags.spellbookGrid.key);
    },
  };

  /**
   * The trait of an actor.
   * This is informational and not used for game logic.
   */
  static trait = {
    key: 'trait' as const,
    prop: TidyFlags.getFlagPropertyPath('trait'),
    /** Gets the trait of an actor. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.trait.key) ?? undefined
      );
    },
    /** Sets the trait of an actor. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.trait.key, value);
    },
    /** Clears the trait of an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.trait.key);
    },
  };

  /**
   * The weight of an actor.
   * For this module, it is only an informational biographical field.
   */
  static weight = {
    key: 'weight' as const,
    prop: TidyFlags.getFlagPropertyPath('weight'),
    /** Gets the weight of an actor. */
    get(actor: Actor5e): string | undefined {
      return (
        TidyFlags.tryGetFlag<string>(actor, TidyFlags.weight.key) ?? undefined
      );
    },
    /** Sets the weight of an actor. */
    set(actor: Actor5e, value: string): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.weight.key, value);
    },
    /** Clears the weight of an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.weight.key);
    },
  };

  /**
   * Indicates whether the traits section should be expanded for a given actor.
   * If this is set to `true`, all traits are shown.
   * If this is set to `false`, empty traits sections are hidden and the rest are shown.
   * This does not apply to custom traits which are added through the Tidy API.
   */
  static traitsExpanded = {
    key: 'traitsExpanded' as const,
    prop: TidyFlags.getFlagPropertyPath('traitsExpanded'),
    /** Gets whether the traits section should be expanded for an actor. */
    get(actor: Actor5e): boolean | undefined {
      return (
        TidyFlags.tryGetFlag<boolean>(actor, TidyFlags.traitsExpanded.key) ??
        undefined
      );
    },
    /** Sets whether the traits section should be expanded for an actor. */
    set(actor: Actor5e, value: boolean): Promise<void> {
      return TidyFlags.setFlag(actor, TidyFlags.traitsExpanded.key, value);
    },
    /** Clears whether the traits section should be expanded for an actor. */
    unset(actor: Actor5e) {
      return TidyFlags.unsetFlag(actor, TidyFlags.traitsExpanded.key);
    },
  };

  /**
   * Attempts to get a flag from a document.
   * @param flagged A document which supports flags.
   * @param flagName The name of the flag to get.
   * @returns The flag's value, or `undefined` if the flag is not set.
   * 
   * @remarks
   * This function is generic, but it is not performing parsing of the flag's value.
   * It is simply doing an optimistic cast to the target type.
   */
  static tryGetFlag<T>(flagged: any, flagName: string) {
    return flagged.getFlag(CONSTANTS.MODULE_ID, flagName) as
      | T
      | null
      | undefined;
  }

  /**
   * Sets a flag on a document.
   * @param flagged A document to set the flag on.
   * @param flagName The name of the flag to set.
   * @param value The value to set the flag to.
   * @returns A promise that resolves when the flag is set.
   */
  static setFlag(
    flagged: any,
    flagName: string,
    value: unknown
  ): Promise<void> {
    return flagged.setFlag(CONSTANTS.MODULE_ID, flagName, value);
  }

  /**
   * Clears a flag from a document.
   * @param flagged A document to clear the flag from.
   * @param flagName The name of the flag to clear.
   * @returns A promise that resolves when the flag is cleared.
   */
  static unsetFlag(flagged: any, flagName: string): Promise<void> {
    return flagged.unsetFlag(CONSTANTS.MODULE_ID, flagName);
  }
}
