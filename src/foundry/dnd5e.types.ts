/* Actors */

export type RollConfigField = {
  ability: string;
  roll: {
    min: number;
    max: number;
    mode: number;
  };
};

export type ActorProficiency = {
  deterministic: boolean;
  multiplier: number;
  rounding: string;
  _baseProficiency: number;
  dice: string;
  flag: number;
  hasProficiency: boolean;
  term: string;
};

export type ToolData = {
  value: number;
  ability: string;
  bonuses: {
    check: string;
  };
  effectValue: number;
  bonus: number;
  mod: number;
  prof: ActorProficiency;
  total: number;
};

export type SkillData = {
  bonus: number;
  bonuses: {
    check: string;
    passive: string;
  };
  effectValue: number;
  mod: number;
  passive: number;
  prof: ActorProficiency;
  proficient: number;
  total: number; // mod + bonuses
  value: number;
} & RollConfigField;

export type CharacterFavorite = {
  type: 'item' | 'effect' | 'activity';
  sort: number;
  id: string;
};

export type FacilityOccupants = {
  value: string[];
  max: number;
};

export type UnsortedCharacterFavorite = {
  type: 'item' | 'effect' | 'activity';
  id: string;
};

export type RollConfig = {
  formula?: string;
  data?: object;
  chatMessage?: boolean;
  messageData?: object;
};

export type Roll = {
  formula: string;
  data: object;
};

/**
 * Configuration options for a rest.
 */
export type RestConfiguration = {
  type?: string;
  dialog: boolean;
  chat: boolean;
  duration?: number;
  newDay: boolean;
  advanceTime?: boolean;
  autoHD?: boolean;
  autoHDThreshold?: number;
};

// TODO
export type Activity5e = any;

export type ActivityFavoriteData = {
  img: string;
  title: string;
  subtitle: string[];
  range: ActivityRange;
  uses: ActivityUses & { name: string };
  modifier?: string;
  save?: ActivitySave;
};

export type ActivityRange = {
  value: string | null;
  units: string | null;
  special: string | null;
  override: boolean;
  long: number | null;
  reach: number | null;
  scalar: boolean;
};

export type ActivityUses = {
  value: number | null;
  max: number | null;
  name: string | null;
  spent: number | null;
  recovery: unknown;
};

export type ActivitySave = {
  dc: number;
  ability: string;
};
