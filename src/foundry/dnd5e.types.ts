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
