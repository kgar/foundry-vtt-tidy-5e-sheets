/** The ordering of sections for a given actor. */
export type ActorSectionOrder = {
  /** A mapping from tab IDs to arrays of section keys, where the arrays represent the order of the sections. */
  [tabId: string]: string[];
};
