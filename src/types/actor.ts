import type { FoundryDocument } from './document';
import type { Flags } from './flags';
import type { Item5e } from './item';

export type Actor5e = Actor & {
  limited: boolean;
  isOwner: boolean;
  name: string;
  type: string;
  _id: any;
  img: string;
  system: {
    currency: {
      pp: number;
      gp: number;
      ep: number;
      sp: number;
      cp: number;
    };
    abilities: {
      str: Ability;
      dex: Ability;
      con: Ability;
      int: Ability;
      wis: Ability;
      cha: Ability;
    } & Record<string, Ability>;
    bonuses: Bonuses;
    skills: ActorSkills;
    tools: Tools;
    spells: Spells;
    attributes: Attributes;
    details: Details;
    traits: Traits;
    resources: Resources;
  };
  prototypeToken: PrototypeToken;
  items: Map<string, Item5e> & Item5e[];
  effects: any[];
  folder: any;
  sort: number;
  ownership: Ownership;
  flags: Flags;
  _stats: Stats;

  rollAbility(abbreviation: string, options: { event: Event }): void;
  rollAbilityTest(abbreviation: string, options: { event: Event }): void;
  rollAbilitySave(abbreviation: string, options: { event: Event }): void;
  rollSkill(abbreviation: string, options: { event: Event }): void;
  rollDeathSave(options?: { event: Event }): void;
  getRollData(options?: { deterministic: boolean }): any;
  convertCurrency: () => Promise<Actor5e>;
};

type Ability = {
  value: number;
  proficient: number;
  bonuses: AbilityModifiers;
  mod?: number;
  checkProf?: AbilityProficiency;
  saveBonus?: number;
  saveProf?: AbilityProficiency;
  checkBonus?: number;
  save?: number;
  dc?: number;
};

type AbilityModifiers = {
  check: string;
  save: string;
};

type AbilityProficiency = {
  _baseProficiency: number;
  multiplier: number;
  rounding: string;
};

type Bonuses = {
  mwak: AttackDamageBonus;
  rwak: AttackDamageBonus;
  msak: AttackDamageBonus;
  rsak: AttackDamageBonus;
  abilities: AbilitySkillBonuses;
  spell: SpellDc;
};

type AttackDamageBonus = {
  attack: string;
  damage: string;
};

type AbilitySkillBonuses = {
  check: string;
  save: string;
  skill: string;
};

type SpellDc = {
  dc: string;
};

export type ActorSkills = {
  acr: ActorSkill;
  ani: ActorSkill;
  arc: ActorSkill;
  ath: ActorSkill;
  dec: ActorSkill;
  his: ActorSkill;
  ins: ActorSkill;
  itm: ActorSkill;
  inv: ActorSkill;
  med: ActorSkill;
  nat: ActorSkill;
  prc: ActorSkill;
  prf: ActorSkill;
  per: ActorSkill;
  rel: ActorSkill;
  slt: ActorSkill;
  ste: ActorSkill;
  sur: ActorSkill;
};

export type ActorSkill = {
  value: number;
  ability: string;
  bonuses: SkillBonuses;
};

type SkillBonuses = {
  check: string;
  passive: string;
};

type Tools = {};

type Spells = {
  spell1: SpellDc;
  spell2: SpellDc;
  spell3: SpellDc;
  spell4: SpellDc;
  spell5: SpellDc;
  spell6: SpellDc;
  spell7: SpellDc;
  spell8: SpellDc;
  spell9: SpellDc;
  pact: SpellDc;
};

type Spell = {
  value: number;
  override: any;
};

type Attributes = {
  init: Init;
  movement: Movement;
  attunement: Attunement;
  senses: Senses;
  spellcasting: string;
  ac: Ac;
  hp: Hp;
  death: DeathSaves;
  exhaustion: number;
  inspiration: boolean;
  hd?: number;
  prof?: number;
  encumbrance?: Encumbrance;
  spelldc?: number;
};

type Encumbrance = {
  value: number;
  max: number;
  pct: number;
  encumbered: boolean;
};

type Init = {
  ability: string;
  bonus: string;
};

type Movement = {
  burrow: number;
  climb: number;
  fly: number;
  swim: number;
  walk: number;
  units: string;
  hover: boolean;
};

type Attunement = {
  max: number;
  value: number;
};

type Senses = {
  darkvision: number;
  blindsight: number;
  tremorsense: number;
  truesight: number;
  units: string;
  special: string;
};

type Ac = {
  flat: any;
  calc: string;
  formula: string;
  armor?: number;
  cover?: number;
  bonus?: number;
  shield?: number;
  dex?: number;
  equippedArmor?: Item5e;
  base?: number;
  equippedShield?: Item5e;
  value?: number;
};

type Hp = {
  value: number;
  max: any;
  temp: number;
  tempmax: number;
  bonuses: HpBonus;
};

type HpBonus = {
  level: string;
  overall: string;
};

type DeathSaves = {
  success: number;
  failure: number;
};

type Details = {
  biography: Biography;
  alignment: string;
  race: string;
  background: string;
  originalClass: string;
  xp: Xp;
  appearance: string;
  trait: string;
  ideal: string;
  bond: string;
  flaw: string;
};

type Biography = {
  value: string;
  public: string;
};

type Xp = {
  value: number;
};

type Traits = {
  size: string;
  di: DamageImmunity;
  dr: DamageResistance;
  dv: DamageVulnerability;
  ci: ConditionImmunity;
  languages: Languages;
  weaponProf: WeaponProf;
  armorProf: ArmorProf;
};

type DamageImmunity = {
  bypasses: any[];
  value: any[];
  custom: string;
};

type DamageResistance = {
  bypasses: any[];
  value: any[];
  custom: string;
};

type DamageVulnerability = {
  bypasses: any[];
  value: any[];
  custom: string;
};

type ConditionImmunity = {
  value: any[];
  custom: string;
};

type Languages = {
  value: any[];
  custom: string;
};

type WeaponProf = {
  value: any[];
  custom: string;
};

type ArmorProf = {
  value: any[];
  custom: string;
};

type Resources = {
  primary: Resource;
  secondary: Resource;
  tertiary: Resource;
};

type Resource = {
  value: number;
  max: number;
  sr: boolean;
  lr: boolean;
  label: string;
};

type PrototypeToken = {
  name: string;
  displayName: number;
  actorLink: boolean;
  texture: Texture;
  width: number;
  height: number;
  lockRotation: boolean;
  rotation: number;
  alpha: number;
  disposition: number;
  displayBars: number;
  bar1: Bar1;
  bar2: Bar2;
  light: Light;
  sight: Sight;
  detectionModes: any[];
  flags: Flags;
  randomImg: boolean;
};

type Texture = {
  src: string;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  tint: any;
};

type Bar1 = {
  attribute: string;
};

type Bar2 = {
  attribute: any;
};

type Light = {
  alpha: number;
  angle: number;
  bright: number;
  color: any;
  coloration: number;
  dim: number;
  attenuation: number;
  luminosity: number;
  saturation: number;
  contrast: number;
  shadows: number;
  animation: LightAnimation;
  darkness: Darkness;
};

type LightAnimation = {
  type: any;
  speed: number;
  intensity: number;
  reverse: boolean;
};

type Darkness = {
  min: number;
  max: number;
};

type Sight = {
  enabled: boolean;
  range: any;
  angle: number;
  visionMode: string;
  color: any;
  attenuation: number;
  brightness: number;
  saturation: number;
  contrast: number;
};

type Ownership = {
  default: number;
};

type Stats = {
  systemId: any;
  systemVersion: any;
  coreVersion: any;
  createdTime: any;
  modifiedTime: any;
  lastModifiedBy: any;
};

type Actor = BaseActor & {};

type BaseActor = FoundryDocument & {};
