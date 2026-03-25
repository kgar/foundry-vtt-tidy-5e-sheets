/* Actors */

export type RollConfigField = {
  roll: {
    min: number | null;
    max: number | null;
    mode: number;
    modeCounts: {
      advantages: { count: number; suppressed: boolean };
      disadvantages: { count: number; suppressed: boolean };
      override: boolean | null;
    };
  };
};

export type ActorAttributeEncumbrance = {
  value: number;
  thresholds: {
    encumbered: number;
    heavilyEncumbered: number;
    maximum: number;
  };
  max: number;
  mod: number;
  stops: {
    encumbered: number;
    heavilyEncumbered: number;
  };
  pct: number;
  encumbered: boolean;
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

export type Proficiency = {
    deterministic: boolean;
    multiplier: number;
    rounding: string;
    _baseProficiency: number;
    dice: string;
    flat: number;
    hasProficiency: boolean;
    term: string;
  }

export type AbilityData = {
  attack: number;
  bonuses: {
    check: string;
    save: string;
  };
  check: {
    roll: RollConfigField;
  };
  checkBonus: number;
  checkProf: Proficiency;
  dc: number;
  max: number;
  mod: number;
  proficient: number;
  save: {
    roll: RollConfigField;
    value: number;
  };
  saveBonus: number;
  saveProf: Proficiency;
  value: number;
};

export type SkillData = {
  ability: string;
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
  roll: RollConfigField;
  /** mod + bonuses */
  total: number;
  value: number;
};

export type CharacterFavoriteType =
  | 'activity'
  | 'effect'
  | 'item'
  | 'skill'
  | 'slots'
  | 'tool';

export type CharacterFavorite = {
  type: CharacterFavoriteType;
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
