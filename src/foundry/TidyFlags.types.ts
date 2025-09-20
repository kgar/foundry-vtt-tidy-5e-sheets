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
 * A record of actor member UUIDs to Initiative, for the purpose
 * of leveraging combat placeholders in encounter sheets.
 */
export type EncounterInitiative = Record<string, number | undefined>;

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
  note: string;
  /**
   * The image to display on the encounter sheet for the placeholder, as well as
   * the combat tracker when the placeholder has been added to the tracker.
   */
  img: string;
};