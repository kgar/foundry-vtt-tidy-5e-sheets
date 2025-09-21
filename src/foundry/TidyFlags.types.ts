export type TidyFlagNamedNotes = {
  name: string;
  value: string;
};

export type TidyFlagUnnamedNotes = {
  value: string;
};

type AttributePinBase = {
  /** The Item UUID, generally relative to the owning character */
  id: string;
  /** The sort value */
  sort: number;
  alias?: string;
};

export type AttributeItemPinFlag = AttributePinBase & {
  type: 'item';
  resource: 'limited-uses' | 'quantity';
};

export type AttributeActivityPinFlag = AttributePinBase & {
  type: 'activity';
  resource: 'limited-uses';
};

export type AttributePinFlag = AttributeItemPinFlag | AttributeActivityPinFlag;

export type DocumentJournalEntry = {
  id: string;
  title: string;
  value: string;
  sort: number;
};

export type DocumentJournalEntries = Record<string, DocumentJournalEntry>;

/**
 * A record of placeholder IDs to placeholder models, for the purpose
 * of storing flag data for placeholders for encounter sheets.
 */
export type EncounterPlaceholders = Record<string, EncounterPlaceholder>;

/**
 * A synthetic combatant that can be inserted into the combat tracker
 * to represent an idea like "Lair Action" or a batch of combatants for ease of use.
 */
export type EncounterPlaceholder = {
  /**
   * A random ID representing the placeholder.
   */
  id: string;
  /**
   * The name of the placeholder.
   */
  name: string;
  /**
   * A note about the placeholder, displayed as a subtitle on the placeholder,
   * to help remind about the purpose of the placeholder or some other detail.
   */
  note?: string;
  /**
   * The image to display on the encounter sheet for the placeholder, as well as
   * the combat tracker when the placeholder has been added to the tracker.
   */
  img: string;
};

/** An object of identifiers to Encounter Combatant Settings. */
export type EncounterCombatantsSettings = Record<string, EncounterCombatantSettings>;

/**
 * Settings related to a combatant in the Encounter Sheet combat tab.
 */
export type EncounterCombatantSettings = {
  /**
   * A unique identifier for retrieving/storing settings. Dots "." are replaced with hyphens "-" on storage and are reverted on retrieval.
   */
  identifier: string;
  /**
   * When `true`, include this combatant when adding placeholders to the current encounter.
   * Default: `true`
   */
  include: boolean;
  /**
   * When `false`, this combatant is added to the combat tracker as `hidden`.
   * Default: `true` (visible)
   */
  visible: boolean;
  /**
   * Optional prerolled/prefilled initiative count which is included
   * when adding a combatant to the combat tracker.
   */
  initiative: number | undefined;
};
