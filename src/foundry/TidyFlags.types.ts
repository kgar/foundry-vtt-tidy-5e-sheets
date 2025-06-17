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

export type ActorJournalEntry = {
  id: string;
  title: string;
  value: string;
}

export type ActorJournalEntries = ActorJournalEntries[];