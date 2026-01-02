import type { CONSTANTS } from 'src/constants';

export type ContextMenuEntry = {
  name?: string;
  icon?: string;
  group?: string;
  callback?: ($entryElement: any) => void;
  condition?: ($entryElement: any) => void;
};

/**
 * Configuration data for the process of creating one or more basic rolls.
 */
export interface BasicRollProcessConfiguration {
  rolls: BasicRollConfiguration[];
  evaluate?: boolean;
  event?: Event;
  hookNames?: string[];
  subject?: Document;
  target?: number;
}

/**
 * Configuration data for an individual roll.
 */
export interface BasicRollConfiguration {
  parts?: string[];
  data?: object;
  situational?: boolean;
  options?: BasicRollOptions;
  subject: any;
}

/**
 * Options allowed on a basic roll.
 */
export interface BasicRollOptions {
  target?: number;
  [key: string]: any;
}

/* -------------------------------------------- */

/**
 * Configuration data for the roll prompt.
 */
export interface BasicRollDialogConfiguration {
  configure?: boolean;
  applicationClass?: any;
  options?: Record<string, any>;
}

/* -------------------------------------------- */

/**
 * Configuration data for creating a roll message.
 */
export interface BasicRollMessageConfiguration {
  create?: boolean;
  rollMode?: string;
  data?: object;
}

export type D20Roll = {
  build(
    config: BasicRollProcessConfiguration,
    dialog: BasicRollDialogConfiguration,
    message: BasicRollMessageConfiguration
  ): D20Roll;
};

/* -------------------------------------------- */

export type CrewArea5e =
  | [typeof CONSTANTS.SECTION_TYPE_DRAFT_ANIMALS]
  | [typeof CONSTANTS.SECTION_TYPE_CREW]
  | [typeof CONSTANTS.SECTION_TYPE_PASSENGERS]
  | (string & {});
