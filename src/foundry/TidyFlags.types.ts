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
};

export type ItemAttributePin = AttributePinBase & {
  type: 'item';
  resource: 'limited-uses' | 'quantity';
};

export type ActivityAttributePin = AttributePinBase & {
  type: 'activity';
  resource: 'limited-uses';
};

export type AttributePin = ItemAttributePin | ActivityAttributePin;
