export type CharacterFavorite = {
  type: 'item' | 'effect';
  sort: number;
  id: string;
};

export type UnsortedCharacterFavorite = {
  type: 'item' | 'effect';
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