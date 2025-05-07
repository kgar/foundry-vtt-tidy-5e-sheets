export type Ability = {
  attack: number;
  bonuses: AbilityBonus;
  check: AbilityCheck;
  checkBonus: number;
  checkProf: AbilityProficiency;
  dc: number;
  max: number;
  mod: number;
  proficient: number;
  save: AbilitySave;
  saveBonus: number;
  saveProf: AbilityProficiency;
  value: number;
};

export type AbilityBonus = {
  check: string;
  save: string;
};

export type RollConfig = {
  min: number | null;
  max: number | null;
  mode: number; // AdvantageMode
};

export type AbilityCheck = {
  roll: RollConfig;
};

export type AbilityProficiency = {
  deterministic: boolean;
  multiplier: number;
  rounding: string;
  _baseProficiency: number;
  get dice(): string;
  get flat(): number;
  get hasProficiency(): boolean;
  get term(): string;
};

export type AbilitySave = {
  roll: RollConfig;
  toJSON: () => string;
  toString: () => string;
  value: number;
};
