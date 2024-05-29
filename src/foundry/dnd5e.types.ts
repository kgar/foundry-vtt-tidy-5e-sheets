export type CharacterFavorite = {
  type: 'item' | 'effect';
  sort: number;
  id: string;
};

export type UnsortedCharacterFavorite = {
  type: 'item' | 'effect';
  id: string;
};
