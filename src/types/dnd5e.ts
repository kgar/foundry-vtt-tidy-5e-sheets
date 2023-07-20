import type { ActorSheet5eCharacter } from './actor5e-sheet';
import type { Flags } from './flags';

export type globalThisDnd5e = {
  id: string;
  title: string;
  description: string;
  authors: Author[];
  url: string;
  flags: Flags & {
    needsMigrationVersion: string;
    compatibleMigrationVersion: string;
  };
  media: Media[];
  version: string;
  compatibility: Compatibility;
  scripts: any[];
  esmodules: string[];
  styles: string[];
  languages: Language[];
  packs: Pack[];
  relationships: Relationships;
  socket: boolean;
  manifest: string;
  download: string;
  protected: boolean;
  exclusive: boolean;
  background: string;
  initiative: string;
  gridDistance: number;
  gridUnits: string;
  primaryTokenAttribute: string;
  secondaryTokenAttribute: string;
  actor: {
    ActorSheet5eCharacter: typeof ActorSheet5eCharacter;
  };
};

type Author = {
  name: string;
  url: string;
  flags: Flags;
};

type Media = {
  type: string;
  loop: boolean;
  flags: Flags;
};

type Compatibility = {
  minimum: string;
  verified: string;
};

type Language = {
  lang: string;
  name: string;
  path: string;
  flags: Flags;
};

type Pack = {
  name: string;
  label: string;
  path: string;
  private: boolean;
  type: string;
  system: string;
  flags: Flags;
};

type Relationships = {
  systems: any[];
  requires: any[];
  conflicts: any[];
  flags: Flags;
};
