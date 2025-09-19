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
