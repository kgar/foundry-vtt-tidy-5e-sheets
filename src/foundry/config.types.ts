import type { Actor5e, GroupableSelectOption } from 'src/types/types';

type CurrencyItemConfig = {
  label: string;
  abbreviation: string;
  conversion: number;
};

interface MovementUnitConfig {
  label: string;
  abbreviation: string;
  conversion: number;
  formattingUnit: string;
  type: string;
}

interface IndividualTargetTypesConfig {
  label: string;
  scalar?: boolean;
  counted: string;
}

interface RecoveryOption {
  value: string;
  label: string;
  group?: string;
}

interface VolumeUnitConfig {
  label: string;
  abbreviation: string;
  counted?: string;
  conversion: number;
  type: string;
}

interface TreasureConfig {
  label: string;
}

interface CommunicationTypeConfig {
  label: string;
}

export type SpellSchool = {
  label: string;
  icon: string;
  fullKey: string;
  reference: string;
};

interface CreatureTypeConfig {
  label: string;
  plural: string;
  icon: string;
  reference: string;
  detectAlignment?: boolean;
}

type Skill = {
  label: string;
  ability: string;
  fullKey: string;
  reference: string;
  icon: string;
};

export type ConditionType = {
  name: string;
  img: string;
  reference?: string;
  statuses?: Array<string>;
  riders?: Array<string>;
  pseudo?: boolean;
  special?: string;
  levels?: number;
  reduction?: {
    rolls: number;
    speed: number;
  };
};

export type ToolConfig = { ability: string; id: string };

export type CONFIG = {
  debug: {
    applications: boolean;
    audio: boolean;
    combat: boolean;
    dice: boolean;
    documents: boolean;
    fog: {
      extractor: boolean;
      manager: boolean;
    };
    hooks: boolean;
    av: boolean;
    avclient: boolean;
    mouseInteraction: boolean;
    time: boolean;
    keybindings: boolean;
    polygons: boolean;
    gamepad: boolean;
    canvas: {
      primary: {
        bounds: boolean;
      };
    };
    rollParsing: boolean;
  };
  compatibility: {
    mode: number;
    includePatterns: Array<any>;
    excludePatterns: Array<{}>;
  };
  compendium: {
    uuidRedirects: {};
  };
  DatabaseBackend: {};
  Actor: {
    compendiumIndexFields: Array<any>;
    compendiumBanner: string;
    sidebarIcon: string;
    dataModels: {};
    typeLabels: {
      base: string;
      character: string;
      npc: string;
      vehicle: string;
      group: string;
    } & Record<string, string>;
    typeIcons: {};
    trackableAttributes: {
      character: {
        bar: Array<string>;
        value: Array<string>;
      };
      npc: {
        bar: Array<string>;
        value: Array<string>;
      };
      vehicle: {
        bar: Array<string>;
        value: Array<string>;
      };
      group: {
        bar: Array<any>;
        value: Array<any>;
      };
    };
    sheetClasses: {
      base: {};
      character: {
        'dnd5e.ActorSheet5eCharacter': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.ActorSheet5eCharacter2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eCharacterSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      npc: {
        'dnd5e.ActorSheet5eNPC': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.ActorSheet5eNPC2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eNpcSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      vehicle: {
        'dnd5e.ActorSheet5eVehicle': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eVehicleSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      group: {
        'dnd5e.GroupActorSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eGroupSheetClassic': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
  };
  Adventure: {
    compendiumIndexFields: Array<any>;
    compendiumBanner: string;
    sidebarIcon: string;
    sheetClasses: {
      base: {
        'core.AdventureImporter': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  Cards: {
    compendiumIndexFields: Array<any>;
    compendiumBanner: string;
    sidebarIcon: string;
    dataModels: {};
    presets: {
      pokerDark: {
        type: string;
        label: string;
        src: string;
      };
      pokerLight: {
        type: string;
        label: string;
        src: string;
      };
    };
    typeLabels: {
      deck: string;
      hand: string;
      pile: string;
    };
    typeIcons: {
      deck: string;
      hand: string;
      pile: string;
    };
    sheetClasses: {
      deck: {
        'core.CardsConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      hand: {
        'core.CardsHand': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      pile: {
        'core.CardsPile': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
  };
  ChatMessage: {
    template: string;
    sidebarIcon: string;
    dataModels: {};
    typeLabels: {
      base: string;
    };
    typeIcons: {};
    batchSize: number;
    sheetClasses: {
      base: {};
    };
    documentClass: any;
  };
  Combat: {
    sidebarIcon: string;
    dataModels: {};
    typeLabels: {
      base: string;
    };
    typeIcons: {};
    initiative: {
      formula: any;
      decimals: number;
    };
    sounds: {
      epic: {
        label: string;
        startEncounter: Array<string>;
        nextUp: Array<string>;
        yourTurn: Array<string>;
      };
      mc: {
        label: string;
        startEncounter: Array<string>;
        nextUp: Array<string>;
        yourTurn: Array<string>;
      };
    };
    sheetClasses: {
      base: {};
    };
  };
  Dice: {
    types: Array<any>;
    rollModes: {
      publicroll: string;
      gmroll: string;
      blindroll: string;
      selfroll: string;
    };
    rolls: Array<any>;
    termTypes: {};
    terms: {};
    functions: {};
    fulfillment: {
      dice: {
        d4: {
          label: string;
          icon: string;
        };
        d6: {
          label: string;
          icon: string;
        };
        d8: {
          label: string;
          icon: string;
        };
        d10: {
          label: string;
          icon: string;
        };
        d12: {
          label: string;
          icon: string;
        };
        d20: {
          label: string;
          icon: string;
        };
        d100: {
          label: string;
          icon: string;
        };
      };
      methods: {
        mersenne: {
          label: string;
          interactive: boolean;
        };
        manual: {
          label: string;
          icon: string;
          interactive: boolean;
        };
      };
      defaultMethod: string;
    };
  };
  FogExploration: {
    sheetClasses: {
      base: {};
    };
    typeLabels: {
      base: string;
    };
  };
  Folder: {
    sidebarIcon: string;
    sheetClasses: {
      Actor: {
        'core.FolderConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      Adventure: {
        'core.FolderConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      Item: {
        'core.FolderConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      Scene: {
        'core.FolderConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      JournalEntry: {
        'core.FolderConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      Playlist: {
        'core.FolderConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      RollTable: {
        'core.FolderConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      Cards: {
        'core.FolderConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      Macro: {
        'core.FolderConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      Compendium: {
        'core.FolderConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      Actor: string;
      Adventure: string;
      Item: string;
      Scene: string;
      JournalEntry: string;
      Playlist: string;
      RollTable: string;
      Cards: string;
      Macro: string;
      Compendium: string;
    };
  };
  Item: {
    compendiumIndexFields: Array<string>;
    compendiumBanner: string;
    sidebarIcon: string;
    dataModels: any;
    typeLabels: {
      base: string;
      weapon: string;
      equipment: string;
      consumable: string;
      tool: string;
      loot: string;
      race: string;
      background: string;
      class: string;
      subclass: string;
      spell: string;
      feat: string;
      container: string;
      backpack: string;
    } & Record<string, string>;
    typeIcons: {};
    sheetClasses: {
      base: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      weapon: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      equipment: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      consumable: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      tool: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      loot: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      race: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      background: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      class: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      subclass: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      spell: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      feat: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarItemSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      container: {
        'dnd5e.ContainerSheet2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.Tidy5eKgarContainerSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      backpack: {
        'dnd5e.ItemSheet5e2': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
  };
  JournalEntry: {
    compendiumIndexFields: Array<any>;
    compendiumBanner: string;
    noteIcons: {
      Anchor: string;
      Barrel: string;
      Book: string;
      Bridge: string;
      Cave: string;
      Castle: string;
      Chest: string;
      City: string;
      Coins: string;
      Fire: string;
      'Hanging Sign': string;
      House: string;
      Mountain: string;
      'Oak Tree': string;
      Obelisk: string;
      Pawprint: string;
      Ruins: string;
      Skull: string;
      Statue: string;
      Sword: string;
      Tankard: string;
      Temple: string;
      Tower: string;
      Trap: string;
      Village: string;
      Waterfall: string;
      Windmill: string;
    };
    sidebarIcon: string;
    sheetClasses: {
      base: {
        'core.JournalSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'dnd5e.JournalSheet5e': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  Macro: {
    compendiumIndexFields: Array<any>;
    compendiumBanner: string;
    sidebarIcon: string;
    sheetClasses: {
      script: {
        'core.MacroConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      chat: {
        'core.MacroConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      script: string;
      chat: string;
    };
  };
  Playlist: {
    compendiumIndexFields: Array<any>;
    compendiumBanner: string;
    sidebarIcon: string;
    autoPreloadSeconds: number;
    sheetClasses: {
      base: {
        'core.PlaylistConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  RollTable: {
    compendiumIndexFields: Array<string>;
    compendiumBanner: string;
    sidebarIcon: string;
    resultIcon: string;
    resultTemplate: string;
    sheetClasses: {
      base: {
        'core.RollTableConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  Scene: {
    compendiumIndexFields: Array<any>;
    compendiumBanner: string;
    sidebarIcon: string;
    sheetClasses: {
      base: {
        'core.SceneConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  Setting: {
    sheetClasses: {
      base: {};
    };
    typeLabels: {
      base: string;
    };
  };
  User: {
    sheetClasses: {
      base: {
        'core.UserConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  Canvas: {
    blurStrength: number;
    blurQuality: number;
    darknessColor: number;
    daylightColor: number;
    brightestColor: number;
    darknessLightPenalty: number;
    dispositionColors: {
      HOSTILE: number;
      NEUTRAL: number;
      FRIENDLY: number;
      INACTIVE: number;
      PARTY: number;
      CONTROLLED: number;
      SECRET: number;
    };
    exploredColor: number;
    unexploredColor: number;
    darknessToDaylightAnimationMS: number;
    daylightToDarknessAnimationMS: number;
    groups: {
      hidden: {
        parent: string;
      };
      rendered: {
        parent: string;
      };
      environment: {
        parent: string;
      };
      primary: {
        parent: string;
      };
      effects: {
        parent: string;
      };
      visibility: {
        parent: string;
      };
      interface: {
        parent: string;
        zIndexDrawings: number;
        zIndexScrollingText: number;
      };
      overlay: {
        parent: string;
      };
    };
    layers: {
      weather: {
        group: string;
      };
      grid: {
        group: string;
      };
      regions: {
        group: string;
      };
      drawings: {
        group: string;
      };
      templates: {
        group: string;
      };
      tiles: {
        group: string;
      };
      walls: {
        group: string;
      };
      tokens: {
        group: string;
      };
      sounds: {
        group: string;
      };
      lighting: {
        group: string;
      };
      notes: {
        group: string;
      };
      controls: {
        group: string;
      };
    };
    lightLevels: {
      dark: number;
      halfdark: number;
      dim: number;
      bright: number;
    };
    polygonBackends: {};
    darknessSourcePaddingMultiplier: number;
    dragSpeedModifier: number;
    maxZoom: number;
    objectBorderThickness: number;
    gridStyles: {
      solidLines: {
        label: string;
        shaderOptions: {
          style: number;
        };
      };
      dashedLines: {
        label: string;
        shaderOptions: {
          style: number;
        };
      };
      dottedLines: {
        label: string;
        shaderOptions: {
          style: number;
        };
      };
      squarePoints: {
        label: string;
        shaderOptions: {
          style: number;
        };
      };
      diamondPoints: {
        label: string;
        shaderOptions: {
          style: number;
        };
      };
      roundPoints: {
        label: string;
        shaderOptions: {
          style: number;
        };
      };
    };
    lightAnimations: {
      flame: {
        label: string;
      };
      torch: {
        label: string;
      };
      revolving: {
        label: string;
      };
      siren: {
        label: string;
      };
      pulse: {
        label: string;
      };
      chroma: {
        label: string;
      };
      wave: {
        label: string;
      };
      fog: {
        label: string;
      };
      sunburst: {
        label: string;
      };
      dome: {
        label: string;
      };
      emanation: {
        label: string;
      };
      hexa: {
        label: string;
      };
      ghost: {
        label: string;
      };
      energy: {
        label: string;
      };
      vortex: {
        label: string;
      };
      witchwave: {
        label: string;
      };
      rainbowswirl: {
        label: string;
      };
      radialrainbow: {
        label: string;
      };
      fairy: {
        label: string;
      };
      grid: {
        label: string;
      };
      starlight: {
        label: string;
      };
      smokepatch: {
        label: string;
      };
    };
    darknessAnimations: {
      magicalGloom: {
        label: string;
      };
      roiling: {
        label: string;
      };
      hole: {
        label: string;
      };
    };
    managedScenes: {};
    pings: {
      types: {
        PULSE: string;
        ALERT: string;
        PULL: string;
        ARROW: string;
      };
      styles: {
        alert: {
          color: string;
          size: number;
          duration: number;
        };
        arrow: {
          size: number;
          duration: number;
        };
        chevron: {
          size: number;
          duration: number;
        };
        pulse: {
          size: number;
          duration: number;
        };
      };
      pullSpeed: number;
    };
    targeting: {
      size: number;
    };
    hoverFade: {
      delay: number;
      duration: number;
    };
    transcoders: {
      basis: boolean;
    };
    visionModes: {
      basic: {
        id: string;
        label: string;
        vision: {
          defaults: {
            attenuation: number;
            contrast: number;
            saturation: number;
            brightness: number;
          };
          preferred: boolean;
          background: {
            uniforms: {};
          };
          coloration: {
            uniforms: {};
          };
          illumination: {
            uniforms: {};
          };
          darkness: {
            adaptive: boolean;
          };
        };
        tokenConfig: boolean;
        canvas: {
          uniforms: {};
        };
        lighting: {
          background: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          coloration: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          illumination: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          darkness: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          levels: {};
          multipliers: {};
        };
      };
      darkvision: {
        id: string;
        label: string;
        canvas: {
          uniforms: {
            contrast: number;
            saturation: number;
            brightness: number;
          };
        };
        lighting: {
          levels: {
            '1': number;
          };
          background: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          coloration: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          illumination: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          darkness: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          multipliers: {};
        };
        vision: {
          darkness: {
            adaptive: boolean;
          };
          defaults: {
            attenuation: number;
            contrast: number;
            saturation: number;
            brightness: number;
          };
          background: {
            uniforms: {};
          };
          coloration: {
            uniforms: {};
          };
          illumination: {
            uniforms: {};
          };
          preferred: boolean;
        };
        tokenConfig: boolean;
      };
      monochromatic: {
        id: string;
        label: string;
        canvas: {
          uniforms: {
            contrast: number;
            saturation: number;
            brightness: number;
          };
        };
        lighting: {
          background: {
            postProcessingModes: Array<string>;
            uniforms: {
              saturation: number;
              tint: Array<number>;
            };
            visibility: number;
          };
          illumination: {
            postProcessingModes: Array<string>;
            uniforms: {
              saturation: number;
              tint: Array<number>;
            };
            visibility: number;
          };
          coloration: {
            postProcessingModes: Array<string>;
            uniforms: {
              saturation: number;
              tint: Array<number>;
            };
            visibility: number;
          };
          darkness: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          levels: {};
          multipliers: {};
        };
        vision: {
          darkness: {
            adaptive: boolean;
          };
          defaults: {
            attenuation: number;
            contrast: number;
            saturation: number;
            brightness: number;
          };
          background: {
            uniforms: {};
          };
          coloration: {
            uniforms: {};
          };
          illumination: {
            uniforms: {};
          };
          preferred: boolean;
        };
        tokenConfig: boolean;
      };
      blindness: {
        id: string;
        label: string;
        tokenConfig: boolean;
        canvas: {
          uniforms: {
            contrast: number;
            saturation: number;
            exposure: number;
          };
        };
        lighting: {
          background: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          illumination: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          coloration: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          darkness: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          levels: {};
          multipliers: {};
        };
        vision: {
          darkness: {
            adaptive: boolean;
          };
          defaults: {
            color: any;
            attenuation: number;
            contrast: number;
            saturation: number;
            brightness: number;
          };
          background: {
            uniforms: {};
          };
          coloration: {
            uniforms: {};
          };
          illumination: {
            uniforms: {};
          };
          preferred: boolean;
        };
      };
      tremorsense: {
        id: string;
        label: string;
        canvas: {
          uniforms: {
            contrast: number;
            saturation: number;
            exposure: number;
          };
        };
        lighting: {
          background: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          illumination: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          coloration: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          darkness: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          levels: {};
          multipliers: {};
        };
        vision: {
          darkness: {
            adaptive: boolean;
          };
          defaults: {
            attenuation: number;
            contrast: number;
            saturation: number;
            brightness: number;
          };
          background: {
            uniforms: {};
          };
          coloration: {
            uniforms: {};
          };
          illumination: {
            uniforms: {};
          };
          preferred: boolean;
        };
        tokenConfig: boolean;
      };
      lightAmplification: {
        id: string;
        label: string;
        canvas: {
          uniforms: {
            saturation: number;
            tint: Array<number>;
          };
        };
        lighting: {
          background: {
            visibility: number;
            postProcessingModes: Array<string>;
            uniforms: {
              saturation: number;
              exposure: number;
              tint: Array<number>;
            };
          };
          illumination: {
            postProcessingModes: Array<string>;
            uniforms: {
              saturation: number;
            };
            visibility: number;
          };
          coloration: {
            postProcessingModes: Array<string>;
            uniforms: {
              saturation: number;
              exposure: number;
              tint: Array<number>;
            };
            visibility: number;
          };
          levels: {
            '1': number;
            '2': number;
          };
          darkness: {
            visibility: number;
            postProcessingModes: Array<any>;
            uniforms: {};
          };
          multipliers: {};
        };
        vision: {
          darkness: {
            adaptive: boolean;
          };
          defaults: {
            attenuation: number;
            contrast: number;
            saturation: number;
            brightness: number;
          };
          background: {
            uniforms: {};
          };
          coloration: {
            uniforms: {};
          };
          illumination: {
            uniforms: {};
          };
          preferred: boolean;
        };
        tokenConfig: boolean;
      };
    };
    detectionModes: {
      lightPerception: {
        id: string;
        label: string;
        type: number;
        tokenConfig: boolean;
        walls: boolean;
        angle: boolean;
      };
      basicSight: {
        id: string;
        label: string;
        type: number;
        tokenConfig: boolean;
        walls: boolean;
        angle: boolean;
      };
      seeInvisibility: {
        id: string;
        label: string;
        type: number;
        tokenConfig: boolean;
        walls: boolean;
        angle: boolean;
      };
      senseInvisibility: {
        id: string;
        label: string;
        walls: boolean;
        angle: boolean;
        type: number;
        tokenConfig: boolean;
      };
      feelTremor: {
        id: string;
        label: string;
        walls: boolean;
        angle: boolean;
        type: number;
        tokenConfig: boolean;
      };
      seeAll: {
        id: string;
        label: string;
        type: number;
        tokenConfig: boolean;
        walls: boolean;
        angle: boolean;
      };
      senseAll: {
        id: string;
        label: string;
        walls: boolean;
        angle: boolean;
        type: number;
        tokenConfig: boolean;
      };
      blindsight: {
        id: string;
        label: string;
        type: number;
        walls: boolean;
        angle: boolean;
        tokenConfig: boolean;
      };
    };
  };
  canvasTextStyle: {
    styleID: number;
    _align: string;
    _breakWords: boolean;
    _dropShadow: boolean;
    _dropShadowAlpha: number;
    _dropShadowAngle: number;
    _dropShadowBlur: number;
    _dropShadowColor: string;
    _dropShadowDistance: number;
    _fill: string;
    _fillGradientType: number;
    _fillGradientStops: Array<any>;
    _fontFamily: string;
    _fontSize: number;
    _fontStyle: string;
    _fontVariant: string;
    _fontWeight: string;
    _leading: number;
    _letterSpacing: number;
    _lineHeight: number;
    _lineJoin: string;
    _miterLimit: number;
    _padding: number;
    _stroke: string;
    _strokeThickness: number;
    _textBaseline: string;
    _trim: boolean;
    _whiteSpace: string;
    _wordWrap: boolean;
    _wordWrapWidth: number;
  };
  weatherEffects: {
    leaves: {
      id: string;
      label: string;
      effects: Array<{
        id: string;
      }>;
    };
    rain: {
      id: string;
      label: string;
      filter: {
        enabled: boolean;
      };
      effects: Array<{
        id: string;
        blendMode: number;
        config: {
          opacity: number;
          tint: Array<number>;
          intensity: number;
          strength: number;
          rotation: number;
          speed: number;
        };
      }>;
    };
    rainStorm: {
      id: string;
      label: string;
      filter: {
        enabled: boolean;
      };
      effects: Array<{
        id: string;
        blendMode: number;
        performanceLevel?: number;
        config: {
          slope?: number;
          intensity: number;
          speed: number;
          scale?: number;
          opacity?: number;
          tint?: Array<number>;
          strength?: number;
          rotation?: number;
        };
      }>;
    };
    fog: {
      id: string;
      label: string;
      filter: {
        enabled: boolean;
      };
      effects: Array<{
        id: string;
        blendMode: number;
        config: {
          slope: number;
          intensity: number;
          speed: number;
        };
      }>;
    };
    snow: {
      id: string;
      label: string;
      filter: {
        enabled: boolean;
      };
      effects: Array<{
        id: string;
        blendMode: number;
        config: {
          tint: Array<number>;
          direction: number;
          speed: number;
          scale: number;
        };
      }>;
    };
    blizzard: {
      id: string;
      label: string;
      filter: {
        enabled: boolean;
      };
      effects: Array<{
        id: string;
        blendMode: number;
        config: {
          tint?: Array<number>;
          direction?: number;
          speed: number;
          scale?: number;
          slope?: number;
          intensity?: number;
        };
        performanceLevel?: number;
      }>;
    };
  };
  controlIcons: {
    combat: string;
    visibility: string;
    effects: string;
    lock: string;
    up: string;
    down: string;
    defeated: string;
    light: string;
    lightOff: string;
    template: string;
    sound: string;
    soundOff: string;
    doorClosed: string;
    doorOpen: string;
    doorSecret: string;
    doorLocked: string;
    wallDirection: string;
  };
  fontDefinitions: {
    Arial: {
      editor: boolean;
      fonts: Array<any>;
    };
    Amiri: {
      editor: boolean;
      fonts: Array<{
        urls: Array<string>;
        weight?: number;
      }>;
    };
    'Bruno Ace': {
      editor: boolean;
      fonts: Array<{
        urls: Array<string>;
      }>;
    };
    Courier: {
      editor: boolean;
      fonts: Array<any>;
    };
    'Courier New': {
      editor: boolean;
      fonts: Array<any>;
    };
    'Modesto Condensed': {
      editor: boolean;
      fonts: Array<{
        urls: Array<string>;
        weight?: number;
      }>;
    };
    Signika: {
      editor: boolean;
      fonts: Array<{
        urls: Array<string>;
        weight?: number;
      }>;
    };
    Times: {
      editor: boolean;
      fonts: Array<any>;
    };
    'Times New Roman': {
      editor: boolean;
      fonts: Array<any>;
    };
    Roboto: {
      editor: boolean;
      fonts: Array<{
        urls: Array<string>;
        weight?: string;
        style?: string;
      }>;
    };
    'Roboto Condensed': {
      editor: boolean;
      fonts: Array<{
        urls: Array<string>;
        weight?: string;
        style?: string;
      }>;
    };
    'Roboto Slab': {
      editor: boolean;
      fonts: Array<{
        urls: Array<string>;
        weight?: string;
      }>;
    };
  };
  defaultFontFamily: string;
  statusEffects: Array<{
    id: string;
    name: string;
    img: string;
    _id: string;
    pseudo?: boolean;
    reference?: string;
    hud?: boolean;
    levels?: number;
    reduction?: {
      rolls: number;
      speed: number;
    };
    statuses?: Array<string>;
    riders?: Array<string>;
  }>;
  specialStatusEffects: {
    DEFEATED: string;
    INVISIBLE: string;
    BLIND: string;
    BURROW: string;
    HOVER: string;
    FLY: string;
    CONCENTRATING: string;
  };
  sounds: {
    dice: string;
    lock: string;
    notification: string;
    combat: string;
  };
  supportedLanguages: {
    en: string;
    es: string;
    fr: string;
    it: string;
    cn: string;
    'pt-BR': string;
    de: string;
    ja: string;
    ko: string;
    'zh-tw': string;
    cs: string;
    hu: string;
    pl: string;
  };
  i18n: {
    searchMinimumCharacterLength: number;
  };
  time: {
    turnTime: number;
    roundTime: number;
  };
  ActiveEffect: {
    dataModels: {};
    typeLabels: {
      base: string;
      enchantment: string;
    };
    typeIcons: {};
    legacyTransferral: boolean;
    sheetClasses: {
      base: {
        'core.ActiveEffectConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      enchantment: {
        'core.ActiveEffectConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
  };
  ActorDelta: {
    sheetClasses: {
      base: {};
    };
    typeLabels: {
      base: string;
    };
  };
  Card: {
    dataModels: {};
    typeLabels: {
      base: string;
    };
    typeIcons: {};
    sheetClasses: {
      base: {
        'core.CardConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
  };
  TableResult: {
    sheetClasses: {
      text: {};
      document: {};
      pack: {};
    };
    typeLabels: {
      text: string;
      document: string;
      pack: string;
    };
  };
  JournalEntryPage: {
    dataModels: {};
    typeLabels: {
      text: string;
      image: string;
      pdf: string;
      video: string;
      class: string;
      map: string;
      rule: string;
      spells: string;
      subclass: string;
    };
    typeIcons: {
      image: string;
      pdf: string;
      text: string;
      video: string;
    };
    defaultType: string;
    sidebarIcon: string;
    sheetClasses: {
      text: {
        'core.JournalTextTinyMCESheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'core.JournalTextPageSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
        'core.MarkdownJournalPageSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      image: {
        'core.JournalImagePageSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      pdf: {
        'core.JournalPDFPageSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      video: {
        'core.JournalVideoPageSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      class: {
        'dnd5e.JournalClassPageSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      map: {
        'dnd5e.JournalMapLocationPageSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      rule: {
        'dnd5e.JournalRulePageSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      spells: {
        'dnd5e.JournalSpellListPageSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      subclass: {
        'dnd5e.JournalClassPageSheet': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
  };
  PlaylistSound: {
    sidebarIcon: string;
    sheetClasses: {
      base: {
        'core.PlaylistSoundConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  AmbientLight: {
    sheetClasses: {
      base: {
        'core.AmbientLightConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  AmbientSound: {
    sheetClasses: {
      base: {
        'core.AmbientSoundConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  Combatant: {
    dataModels: {};
    typeLabels: {
      base: string;
    };
    typeIcons: {};
    sheetClasses: {
      base: {
        'core.CombatantConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
  };
  Drawing: {
    sheetClasses: {
      base: {
        'core.DrawingConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  MeasuredTemplate: {
    defaults: {
      angle: number;
      width: number;
    };
    types: {
      circle: string;
      cone: string;
      rect: string;
      ray: string;
    };
    sheetClasses: {
      base: {
        'core.MeasuredTemplateConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  Note: {
    sheetClasses: {
      base: {
        'core.NoteConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  Region: {
    sheetClasses: {
      base: {
        'core.RegionConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  RegionBehavior: {
    dataModels: {};
    typeLabels: {
      adjustDarknessLevel: string;
      displayScrollingText: string;
      executeMacro: string;
      executeScript: string;
      pauseGame: string;
      suppressWeather: string;
      teleportToken: string;
      toggleBehavior: string;
    };
    typeIcons: {
      adjustDarknessLevel: string;
      displayScrollingText: string;
      executeMacro: string;
      executeScript: string;
      pauseGame: string;
      suppressWeather: string;
      teleportToken: string;
      toggleBehavior: string;
    };
    sheetClasses: {
      adjustDarknessLevel: {
        'core.RegionBehaviorConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      displayScrollingText: {
        'core.RegionBehaviorConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      executeMacro: {
        'core.RegionBehaviorConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      executeScript: {
        'core.RegionBehaviorConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      pauseGame: {
        'core.RegionBehaviorConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      suppressWeather: {
        'core.RegionBehaviorConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      teleportToken: {
        'core.RegionBehaviorConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
      toggleBehavior: {
        'core.RegionBehaviorConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
  };
  Tile: {
    sheetClasses: {
      base: {
        'core.TileConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  Token: {
    adjectivesPrefix: string;
    ring: {
      subjectPaths: {};
      debugColorBands: boolean;
    };
    prototypeSheetClass: any;
    sheetClasses: {
      base: {
        'dnd5e.TokenConfig5e': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  Wall: {
    thresholdAttenuationMultiplier: number;
    doorSounds: {
      futuristicFast: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      futuristicHydraulic: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      futuristicForcefield: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      industrial: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      industrialCreaky: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      jail: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      magicDoor: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      magicWall: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      metal: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      slidingMetal: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      slidingModern: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      slidingWood: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      stoneBasic: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      stoneRocky: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      stoneSandy: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      woodBasic: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      woodCreaky: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
      woodHeavy: {
        label: string;
        close: string;
        lock: string;
        open: string;
        test: string;
        unlock: string;
      };
    };
    sheetClasses: {
      base: {
        'core.WallConfig': {
          id: string;
          label: string;
          canBeDefault: boolean;
          canConfigure: boolean;
          default: boolean;
        };
      };
    };
    typeLabels: {
      base: string;
    };
  };
  soundEffects: {
    lowpass: {
      label: string;
    };
    highpass: {
      label: string;
    };
    reverb: {
      label: string;
    };
  };
  TinyMCE: {
    branding: boolean;
    menubar: boolean;
    statusbar: boolean;
    content_css: Array<string>;
    plugins: string;
    toolbar: string;
    save_enablewhendirty: boolean;
    table_default_styles: {};
    style_formats: Array<{
      title: string;
      items: Array<{
        title: string;
        block: string;
        classes: string;
        wrapper: boolean;
      }>;
    }>;
    style_formats_merge: boolean;
  };
  TextEditor: {
    enrichers: Array<{
      pattern: {};
    }>;
  };
  WebRTC: {
    detectPeerVolumeInterval: number;
    detectSelfVolumeInterval: number;
    emitVolumeInterval: number;
    speakingThresholdEvents: number;
    speakingHistoryLength: number;
    connectedUserPollIntervalS: number;
  };
  ui: {};
  DND5E: {
    ASCII: string;
    abilities: {
      str: Dnd5eAbility;
      dex: Dnd5eAbility;
      con: Dnd5eAbility;
      int: Dnd5eAbility;
      wis: Dnd5eAbility;
      cha: Dnd5eAbility;
    } & Record<string, Dnd5eAbility>;
    areaTargetOptions: GroupableSelectOption[];
    communicationTypes: {
      telepathy: CommunicationTypeConfig;
    } & Record<string, CommunicationTypeConfig>;
    defaultAbilities: {
      meleeAttack: string;
      rangedAttack: string;
      initiative: string;
      hitPoints: string;
      concentration: string;
    };
    skills: {
      acr: Skill;
      ani: Skill;
      arc: Skill;
      ath: Skill;
      dec: Skill;
      his: Skill;
      ins: Skill;
      itm: Skill;
      inv: Skill;
      med: Skill;
      nat: Skill;
      prc: Skill;
      prf: Skill;
      per: Skill;
      rel: Skill;
      slt: Skill;
      ste: Skill;
      sur: Skill;
    } & Record<string, Skill>;
    alignments: {
      lg: string;
      ng: string;
      cg: string;
      ln: string;
      tn: string;
      cn: string;
      le: string;
      ne: string;
      ce: string;
    };
    attunementTypes: {
      required: string;
      optional: string;
    } & Record<string, string>;
    attunements: {
      '0': string;
      '1': string;
      '2': string;
    };
    facilities: {
      advancement: {
        basic: {
          '5': number;
        };
        special: {
          '5': number;
          '9': number;
          '13': number;
          '17': number;
        };
      } & Record<string, Record<string, number>>;
      orders: {
        build: FacilityOrder;
        change: FacilityOrder;
        craft: FacilityOrder;
        empower: FacilityOrder;
        enlarge: FacilityOrder;
        harvest: FacilityOrder;
        maintain: FacilityOrder;
        recruit: FacilityOrder;
        repair: FacilityOrder;
        research: FacilityOrder;
        trade: FacilityOrder;
      } & Record<string, FacilityOrder>;
      sizes: {
        cramped: {
          label: string;
          days: number;
          squares: number;
          value: number;
        };
        roomy: {
          label: string;
          days: number;
          squares: number;
          value: number;
        };
        vast: {
          label: string;
          days: number;
          squares: number;
          value: number;
        };
      } & Record<
        string,
        {
          label: string;
          days: number;
          squares: number;
          value: number;
        }
      >;
      types: {
        basic: {
          label: string;
          subtypes: {
            bedroom: string;
            courtyard: string;
            diningRoom: string;
            kitchen: string;
            parlor: string;
            storage: string;
          };
        };
        special: {
          label: string;
          subtypes: {
            arcaneStudy: string;
            archive: string;
            armory: string;
            barrack: string;
            demiplane: string;
            gamingHall: string;
            garden: string;
            greenhouse: string;
            guildhall: string;
            laboratory: string;
            library: string;
            meditationChamber: string;
            menagerie: string;
            observatory: string;
            pub: string;
            reliquary: string;
            sacristy: string;
            sanctuary: string;
            sanctum: string;
            scriptorium: string;
            smithy: string;
            stable: string;
            storehouse: string;
            teleportationCircle: string;
            theater: string;
            trainingArea: string;
            trophyRoom: string;
            warRoom: string;
            workshop: string;
          };
        };
      };
    };
    weaponTypes: {
      simpleM: string;
      simpleR: string;
      martialM: string;
      martialR: string;
      natural: string;
      improv: string;
      siege: string;
    } & Record<string, string>;
    weaponProficiencies: {
      sim: string;
      mar: string;
    };
    weaponMasteries: {
      cleave: {
        label: string;
      };
      graze: {
        label: string;
      };
      nick: {
        label: string;
      };
      push: {
        label: string;
      };
      sap: {
        label: string;
      };
      slow: {
        label: string;
      };
      topple: {
        label: string;
      };
      vex: {
        label: string;
      };
    };
    weaponProficienciesMap: {
      simpleM: string;
      simpleR: string;
      martialM: string;
      martialR: string;
    };
    weaponClassificationMap: {};
    weaponTypeMap: {
      simpleM: string;
      simpleR: string;
      martialM: string;
      martialR: string;
      siege: string;
    };
    weaponIds: {
      battleaxe: string;
      blowgun: string;
      club: string;
      dagger: string;
      dart: string;
      flail: string;
      glaive: string;
      greataxe: string;
      greatclub: string;
      greatsword: string;
      halberd: string;
      handaxe: string;
      handcrossbow: string;
      heavycrossbow: string;
      javelin: string;
      lance: string;
      lightcrossbow: string;
      lighthammer: string;
      longbow: string;
      longsword: string;
      mace: string;
      maul: string;
      morningstar: string;
      net: string;
      pike: string;
      quarterstaff: string;
      rapier: string;
      scimitar: string;
      shortsword: string;
      sickle: string;
      spear: string;
      shortbow: string;
      sling: string;
      trident: string;
      warpick: string;
      warhammer: string;
      whip: string;
    };
    ammoIds: {
      arrow: string;
      blowgunNeedle: string;
      crossbowBolt: string;
      slingBullet: string;
    };
    toolTypes: {
      art: string;
      game: string;
      music: string;
    } & Record<string, string>;
    toolProficiencies: {
      art: string;
      game: string;
      music: string;
      vehicle: string;
    };
    tools: {
      alchemist: ToolConfig;
      bagpipes: ToolConfig;
      brewer: ToolConfig;
      calligrapher: ToolConfig;
      card: ToolConfig;
      carpenter: ToolConfig;
      cartographer: ToolConfig;
      chess: ToolConfig;
      cobbler: ToolConfig;
      cook: ToolConfig;
      dice: ToolConfig;
      disg: ToolConfig;
      drum: ToolConfig;
      dulcimer: ToolConfig;
      flute: ToolConfig;
      forg: ToolConfig;
      glassblower: ToolConfig;
      herb: ToolConfig;
      horn: ToolConfig;
      jeweler: ToolConfig;
      leatherworker: ToolConfig;
      lute: ToolConfig;
      lyre: ToolConfig;
      mason: ToolConfig;
      navg: ToolConfig;
      painter: ToolConfig;
      panflute: ToolConfig;
      pois: ToolConfig;
      potter: ToolConfig;
      shawm: ToolConfig;
      smith: ToolConfig;
      thief: ToolConfig;
      tinker: ToolConfig;
      viol: ToolConfig;
      weaver: ToolConfig;
      woodcarver: ToolConfig;
    } & Record<string, ToolConfig>;
    scalarTimePeriods: {
      turn: string;
      round: string;
      minute: string;
      hour: string;
      day: string;
      month: string;
      year: string;
    };
    permanentTimePeriods: {
      disp: string;
      dstr: string;
      perm: string;
    };
    specialTimePeriods: {
      inst: string;
      spec: string;
    };
    timePeriods: {
      inst: string;
      spec: string;
      disp: string;
      dstr: string;
      perm: string;
      turn: string;
      round: string;
      minute: string;
      hour: string;
      day: string;
      month: string;
      year: string;
    };
    staticAbilityActivationTypes: {
      none: string;
      special: string;
    };
    abilityActivationTypes: {
      none: string;
      special: string;
      action: string;
      bonus: string;
      reaction: string;
      minute: string;
      hour: string;
      day: string;
      legendary: string;
      mythic: string;
      lair: string;
      crew: string;
    };
    activityActivationTypes: {
      action: {
        label: string;
        group: string;
      };
      bonus: {
        label: string;
        group: string;
      };
      reaction: {
        label: string;
        group: string;
      };
      minute: {
        label: string;
        group: string;
        scalar: boolean;
      };
      hour: {
        label: string;
        group: string;
        scalar: boolean;
      };
      day: {
        label: string;
        group: string;
        scalar: boolean;
      };
      longRest: {
        label: string;
        group: string;
        passive: boolean;
      };
      shortRest: {
        label: string;
        group: string;
        passive: boolean;
      };
      encounter: {
        label: string;
        group: string;
        passive: boolean;
      };
      turnStart: {
        label: string;
        group: string;
        passive: boolean;
      };
      turnEnd: {
        label: string;
        group: string;
        passive: boolean;
      };
      legendary: {
        label: string;
        group: string;
        scalar: boolean;
      };
      mythic: {
        label: string;
        group: string;
        scalar: boolean;
      };
      lair: {
        label: string;
        group: string;
      };
      crew: {
        label: string;
        group: string;
        scalar: boolean;
      };
      special: {
        label: string;
      };
    } & Record<
      string,
      { label: string; group?: string; scalar?: boolean; passive?: boolean }
    >;
    abilityConsumptionTypes: {
      ammo: string;
      attribute: string;
      hitDice: string;
      charges: string;
      material: string;
    };
    activityConsumptionTypes: {
      activityUses: {
        label: string;
      };
      itemUses: {
        label: string;
        targetRequiresEmbedded: boolean;
      };
      material: {
        label: string;
        targetRequiresEmbedded: boolean;
      };
      hitDice: {
        label: string;
      };
      spellSlots: {
        label: string;
        scalingModes: Array<{
          value: string;
          label: string;
        }>;
      };
      attribute: {
        label: string;
        targetRequiresEmbedded: boolean;
      };
    };
    actorSizes: {
      tiny: {
        label: string;
        abbreviation: string;
        hitDie: number;
        token: number;
        capacityMultiplier: number;
      };
      sm: {
        label: string;
        abbreviation: string;
        hitDie: number;
        dynamicTokenScale: number;
      };
      med: {
        label: string;
        abbreviation: string;
        hitDie: number;
      };
      lg: {
        label: string;
        abbreviation: string;
        hitDie: number;
        token: number;
        capacityMultiplier: number;
      };
      huge: {
        label: string;
        abbreviation: string;
        hitDie: number;
        token: number;
        capacityMultiplier: number;
      };
      grg: {
        label: string;
        abbreviation: string;
        hitDie: number;
        token: number;
        capacityMultiplier: number;
      };
    } & Record<
      string,
      {
        label: string;
        abbreviation: string;
        hitDie: number;
        token?: number;
        capacityMultiplier?: number;
        dynamicTokenScale?: number;
      }
    >;
    tokenHPColors: {
      damage: number;
      healing: number;
      temp: number;
      tempmax: number;
      negmax: number;
    };
    tokenRingColors: {
      damage: number;
      defeated: number;
      healing: number;
      temp: number;
    };
    mapLocationMarker: {
      default: {
        backgroundColor: number;
        borderColor: number;
        borderHoverColor: number;
        fontFamily: string;
        shadowColor: number;
        textColor: number;
      };
    };
    creatureTypes: {
      aberration: CreatureTypeConfig;
      beast: CreatureTypeConfig;
      celestial: CreatureTypeConfig;
      construct: CreatureTypeConfig;
      dragon: CreatureTypeConfig;
      elemental: CreatureTypeConfig;
      fey: CreatureTypeConfig;
      fiend: CreatureTypeConfig;
      giant: CreatureTypeConfig;
      humanoid: CreatureTypeConfig;
      monstrosity: CreatureTypeConfig;
      ooze: CreatureTypeConfig;
      plant: CreatureTypeConfig;
      undead: CreatureTypeConfig;
    } & Record<string, CreatureTypeConfig>;
    itemActionTypes: {
      mwak: string;
      rwak: string;
      msak: string;
      rsak: string;
      abil: string;
      save: string;
      ench: string;
      summ: string;
      heal: string;
      util: string;
      other: string;
    } & Record<string, string>;
    itemCapacityTypes: {
      items: string;
      weight: string;
    };
    itemRarity: {
      common: string;
      uncommon: string;
      rare: string;
      veryRare: string;
      legendary: string;
      artifact: string;
    } & Record<string, string>;
    limitedUsePeriods: {
      lr: {
        label: string;
        abbreviation: string;
      };
      sr: {
        label: string;
        abbreviation: string;
      };
      day: {
        label: string;
        abbreviation: string;
      };
      charges: {
        label: string;
        abbreviation: string;
        formula: boolean;
        deprecated: boolean;
      };
      dawn: {
        label: string;
        abbreviation: string;
        formula: boolean;
      };
      dusk: {
        label: string;
        abbreviation: string;
        formula: boolean;
      };
      recoveryOptions: RecoveryOption[];
    };
    enchantmentPeriods: {
      sr: {
        label: string;
      };
      lr: {
        label: string;
      };
      atwill: {
        label: string;
      };
    };
    armorTypes: {
      light: string;
      medium: string;
      heavy: string;
      natural: string;
      shield: string;
    };
    miscEquipmentTypes: {
      clothing: string;
      trinket: string;
      vehicle: string;
    };
    equipmentTypes: {
      clothing: string;
      heavy: string;
      light: string;
      medium: string;
      natural: string;
      shield: string;
      trinket: string;
      vehicle: string;
    };
    vehicleTypes: {
      air: string;
      land: string;
      space: string;
      water: string;
    } & Record<string, string>;
    armorProficiencies: {
      lgt: string;
      med: string;
      hvy: string;
      shl: string;
    };
    armorProficienciesMap: {
      natural: boolean;
      clothing: boolean;
      light: string;
      medium: string;
      heavy: string;
      shield: string;
    };
    armorIds: {
      breastplate: string;
      chainmail: string;
      chainshirt: string;
      halfplate: string;
      hide: string;
      leather: string;
      padded: string;
      plate: string;
      ringmail: string;
      scalemail: string;
      splint: string;
      studded: string;
    };
    shieldIds: {
      shield: string;
    };
    armorClasses: {
      flat: {
        label: string;
        formula: string;
      };
      natural: {
        label: string;
        formula: string;
      };
      default: {
        label: string;
        formula: string;
      };
      mage: {
        label: string;
        formula: string;
      };
      draconic: {
        label: string;
        formula: string;
      };
      unarmoredMonk: {
        label: string;
        formula: string;
      };
      unarmoredBarb: {
        label: string;
        formula: string;
      };
      unarmoredBard: {
        label: string;
        formula: string;
      };
      custom: {
        label: string;
      };
    };
    consumableTypes: {
      ammo: {
        label: string;
        subtypes: {
          arrow: string;
          crossbowBolt: string;
          firearmBullet: string;
          slingBullet: string;
          blowgunNeedle: string;
        };
      };
      food: {
        label: string;
      };
      poison: {
        label: string;
        subtypes: {
          contact: string;
          ingested: string;
          inhaled: string;
          injury: string;
        };
      };
      potion: {
        label: string;
      };
      rod: {
        label: string;
      };
      scroll: {
        label: string;
      };
      trinket: {
        label: string;
      };
      wand: {
        label: string;
      };
    } & Record<string, { label: string; subtypes?: Record<string, string> }>;
    containerTypes: {
      backpack: string;
      barrel: string;
      basket: string;
      boltcase: string;
      bottle: string;
      bucket: string;
      case: string;
      chest: string;
      flask: string;
      jug: string;
      pot: string;
      pitcher: string;
      pouch: string;
      quiver: string;
      sack: string;
      saddlebags: string;
      tankard: string;
      vial: string;
    };
    focusTypes: {
      arcane: {
        label: string;
        itemIds: {
          crystal: string;
          orb: string;
          rod: string;
          staff: string;
          wand: string;
        };
      };
      druidic: {
        label: string;
        itemIds: {
          mistletoe: string;
          totem: string;
          woodenstaff: string;
          yewwand: string;
        };
      };
      holy: {
        label: string;
        itemIds: {
          amulet: string;
          emblem: string;
          reliquary: string;
        };
      };
    };
    featureTypes: {
      background: {
        label: string;
      };
      class: {
        label: string;
        subtypes: {
          arcaneShot: string;
          artificerInfusion: string;
          channelDivinity: string;
          defensiveTactic: string;
          eldritchInvocation: string;
          elementalDiscipline: string;
          fightingStyle: string;
          huntersPrey: string;
          ki: string;
          maneuver: string;
          metamagic: string;
          multiattack: string;
          pact: string;
          psionicPower: string;
          rune: string;
          superiorHuntersDefense: string;
        };
      };
      monster: {
        label: string;
      };
      race: {
        label: string;
      };
      enchantment: {
        label: string;
        subtypes: {
          artificerInfusion: string;
          rune: string;
        };
      };
      feat: {
        label: string;
        subtypes: {
          epicBoon: string;
          fightingStyle: string;
          general: string;
          origin: string;
        } & Record<string, string>;
      };
      supernaturalGift: {
        label: string;
        subtypes: {
          blessing: string;
          charm: string;
          epicBoon: string;
        } & Record<string, string>;
      };
    } & Record<string, { label: string; subtypes?: Record<string, string> }>;
    itemProperties: {
      ada: {
        label: string;
        isPhysical: boolean;
      };
      amm: {
        label: string;
      };
      concentration: {
        label: string;
        abbreviation: string;
        icon: string;
        reference: string;
        isTag: boolean;
      };
      fin: {
        label: string;
      };
      fir: {
        label: string;
      };
      foc: {
        label: string;
      };
      hvy: {
        label: string;
      };
      lgt: {
        label: string;
      };
      lod: {
        label: string;
      };
      mgc: {
        label: string;
        icon: string;
        isPhysical: boolean;
      };
      material: {
        label: string;
        abbreviation: string;
        reference: string;
      };
      rch: {
        label: string;
      };
      rel: {
        label: string;
      };
      ret: {
        label: string;
      };
      ritual: {
        label: string;
        abbreviation: string;
        icon: string;
        reference: string;
        isTag: boolean;
      };
      sil: {
        label: string;
        isPhysical: boolean;
      };
      somatic: {
        label: string;
        abbreviation: string;
        reference: string;
      };
      spc: {
        label: string;
      };
      stealthDisadvantage: {
        label: string;
      };
      thr: {
        label: string;
      };
      two: {
        label: string;
      };
      vocal: {
        label: string;
        abbreviation: string;
        reference: string;
      };
      ver: {
        label: string;
      };
      weightlessContents: {
        label: string;
      };
    } & Record<
      string,
      { abbreviation?: string; label: string; isPhysical?: boolean }
    >;
    validProperties: {
      consumable: Set<string>;
      container: Set<string>;
      equipment: Set<string>;
      feat: Set<string>;
      loot: Set<string>;
      weapon: Set<string>;
      spell: Set<string>;
      tool: Set<string>;
    };
    lootTypes: {
      art: {
        label: string;
      };
      gear: {
        label: string;
      };
      gem: {
        label: string;
      };
      junk: {
        label: string;
      };
      material: {
        label: string;
      };
      resource: {
        label: string;
      };
      treasure: {
        label: string;
      };
    } & Record<string, { label: string; subtypes: Record<string, string> }>;
    currencies: {
      pp: CurrencyItemConfig;
      gp: CurrencyItemConfig;
      ep: CurrencyItemConfig;
      sp: CurrencyItemConfig;
      cp: CurrencyItemConfig;
    } & Record<string, CurrencyItemConfig>;
    dieSteps: Array<number>;
    damageScalingModes: {
      whole: {
        label: string;
        labelCantrip: string;
      };
      half: {
        label: string;
        labelCantrip: string;
      };
    };
    damageTypes: {
      acid: {
        label: string;
        icon: string;
        reference: string;
        color: string;
      };
      bludgeoning: {
        label: string;
        icon: string;
        isPhysical: boolean;
        reference: string;
        color: string;
      };
      cold: {
        label: string;
        icon: string;
        reference: string;
        color: string;
      };
      fire: {
        label: string;
        icon: string;
        reference: string;
        color: string;
      };
      force: {
        label: string;
        icon: string;
        reference: string;
        color: string;
      };
      lightning: {
        label: string;
        icon: string;
        reference: string;
        color: string;
      };
      necrotic: {
        label: string;
        icon: string;
        reference: string;
        color: string;
      };
      piercing: {
        label: string;
        icon: string;
        isPhysical: boolean;
        reference: string;
        color: string;
      };
      poison: {
        label: string;
        icon: string;
        reference: string;
        color: string;
      };
      psychic: {
        label: string;
        icon: string;
        reference: string;
        color: string;
      };
      radiant: {
        label: string;
        icon: string;
        reference: string;
        color: string;
      };
      slashing: {
        label: string;
        icon: string;
        isPhysical: boolean;
        reference: string;
        color: string;
      };
      thunder: {
        label: string;
        icon: string;
        reference: string;
        color: string;
      };
    } & Record<
      string,
      {
        label: string;
        icon: string;
        reference: string;
        isPhysical?: boolean;
        color: string;
      }
    >;
    aggregateDamageDisplay: boolean;
    healingTypes: {
      healing: {
        label: string;
        icon: string;
        color: string;
      };
      temphp: {
        label: string;
        icon: string;
        color: string;
      };
    } & Record<
      string,
      {
        label: string;
        icon: string;
        color: string;
      }
    >;
    movementTypes: {
      burrow: string;
      climb: string;
      fly: string;
      swim: string;
      walk: string;
    } & Record<string, string>;
    movementUnits: {
      ft: MovementUnitConfig;
      mi: MovementUnitConfig;
      m: MovementUnitConfig;
      km: MovementUnitConfig;
    } & Record<string, MovementUnitConfig>;
    rangeTypes: {
      self: string;
      touch: string;
      spec: string;
      any: string;
    };
    distanceUnits: {
      ft: string;
      mi: string;
      m: string;
      km: string;
      self: string;
      touch: string;
      spec: string;
      any: string;
    };
    weightUnits: {
      lb: {
        label: string;
        abbreviation: string;
        conversion: number;
        type: string;
      };
      tn: {
        label: string;
        abbreviation: string;
        conversion: number;
        type: string;
      };
      kg: {
        label: string;
        abbreviation: string;
        conversion: number;
        type: string;
      };
      Mg: {
        label: string;
        abbreviation: string;
        conversion: number;
        type: string;
      };
    };
    encumbrance: {
      currencyPerWeight: {
        imperial: number;
        metric: number;
      };
      effects: {
        encumbered: {
          name: string;
          icon: string;
        };
        heavilyEncumbered: {
          name: string;
          icon: string;
        };
        exceedingCarryingCapacity: {
          name: string;
          icon: string;
        };
      };
      threshold: {
        encumbered: {
          imperial: number;
          metric: number;
        };
        heavilyEncumbered: {
          imperial: number;
          metric: number;
        };
        maximum: {
          imperial: number;
          metric: number;
        };
      };
      speedReduction: {
        encumbered: {
          ft: number;
          m: number;
        };
        heavilyEncumbered: {
          ft: number;
          m: number;
        };
        exceedingCarryingCapacity: {
          ft: number;
          m: number;
        };
      };
      baseUnits: {
        default: {
          imperial: string;
          metric: string;
        };
        vehicle: {
          imperial: string;
          metric: string;
        };
      };
    };
    individualTargetTypes: {
      self: IndividualTargetTypesConfig;
      ally: IndividualTargetTypesConfig;
      enemy: IndividualTargetTypesConfig;
      creature: IndividualTargetTypesConfig;
      object: IndividualTargetTypesConfig;
      space: IndividualTargetTypesConfig;
      creatureOrObject: IndividualTargetTypesConfig;
      any: IndividualTargetTypesConfig;
      willing: IndividualTargetTypesConfig;
    } & Record<string, IndividualTargetTypesConfig>;
    areaTargetTypes: {
      circle: {
        label: string;
        template: string;
        sizes: Array<string>;
      };
      cone: {
        label: string;
        template: string;
        reference: string;
        sizes: Array<string>;
        standard: boolean;
      };
      cube: {
        label: string;
        template: string;
        reference: string;
        sizes: Array<string>;
        standard: boolean;
      };
      cylinder: {
        label: string;
        template: string;
        reference: string;
        sizes: Array<string>;
        standard: boolean;
      };
      radius: {
        label: string;
        template: string;
        standard: boolean;
      };
      line: {
        label: string;
        template: string;
        reference: string;
        sizes: Array<string>;
        standard: boolean;
      };
      sphere: {
        label: string;
        template: string;
        reference: string;
        sizes: Array<string>;
        standard: boolean;
      };
      square: {
        label: string;
        template: string;
        sizes: Array<string>;
      };
      wall: {
        label: string;
        template: string;
        sizes: Array<string>;
      };
    };
    targetTypes: {
      ally: string;
      any: string;
      circle: string;
      cone: string;
      creature: string;
      creatureOrObject: string;
      cube: string;
      cylinder: string;
      radius: string;
      enemy: string;
      line: string;
      object: string;
      self: string;
      space: string;
      sphere: string;
      square: string;
      wall: string;
      willing: string;
    };
    hitDieTypes: Array<string>;
    restTypes: {
      short: {
        duration: {
          normal: number;
          gritty: number;
          epic: number;
        };
        recoverPeriods: Array<string>;
        recoverSpellSlotTypes: {};
      };
      long: {
        duration: {
          normal: number;
          gritty: number;
          epic: number;
        };
        recoverHitDice: boolean;
        recoverHitPoints: boolean;
        recoverPeriods: Array<string>;
        recoverSpellSlotTypes: {};
      };
    };
    senses: {
      blindsight: string;
      darkvision: string;
      tremorsense: string;
      truesight: string;
    } & Record<string, string>;
    attackClassifications: {
      weapon: {
        label: string;
      };
      spell: {
        label: string;
      };
      unarmed: {
        label: string;
      };
    };
    attackTypes: {
      melee: {
        label: string;
      };
      ranged: {
        label: string;
      };
    };
    SPELL_SLOT_TABLE: Array<Array<number>>;
    pactCastingProgression: Record<string, { slots: number; level: number }>;
    spellPreparationStates: {
      unprepared: LabelValuePair<number>;
      prepared: LabelValuePair<number>;
      always: LabelValuePair<number>;
    } & Record<string, LabelValuePair<number>>;
    spellcasting: {
      atwill: SpellcastingConfigEntry;
      innate: SpellcastingConfigEntry;
      ritual: SpellcastingConfigEntry;
      pact: SpellcastingConfigEntry;
      spell: SpellcastingConfigEntry;
    } & Record<string, SpellcastingConfigEntry>;
    spellcastingTypes: {
      leveled: {
        label: string;
        img: string;
        progression: {
          full: {
            label: string;
            divisor: number;
          };
          half: {
            label: string;
            divisor: number;
            roundUp: boolean;
          };
          third: {
            label: string;
            divisor: number;
          };
          artificer: {
            label: string;
            divisor: number;
            roundUp: boolean;
          };
        };
        shortRest?: boolean;
      };
    } & Record<string, any>;
    spellProgression: {
      none: SpellProgressionConfig;
      full: SpellProgressionConfig;
      half: SpellProgressionConfig;
      third: SpellProgressionConfig;
      pact: SpellProgressionConfig;
      artificer: SpellProgressionConfig;
    } & Record<string, SpellProgressionConfig>;
    spellLevels: {
      '0': string;
      '1': string;
      '2': string;
      '3': string;
      '4': string;
      '5': string;
      '6': string;
      '7': string;
      '8': string;
      '9': string;
    } & Record<string, string>;
    spellScalingModes: {
      cantrip: string;
      none: string;
      level: string;
    };
    spellSchools: {
      abj: SpellSchool;
      con: SpellSchool;
      div: SpellSchool;
      enc: SpellSchool;
      evo: SpellSchool;
      ill: SpellSchool;
      nec: SpellSchool;
      trs: SpellSchool;
    } & Record<string, SpellSchool>;
    spellListTypes: {
      class: string;
      subclass: string;
      background: string;
      race: string;
      other: string;
    };
    spellScrollIds: {
      '0': string;
      '1': string;
      '2': string;
      '3': string;
      '4': string;
      '5': string;
      '6': string;
      '7': string;
      '8': string;
      '9': string;
    };
    spellScrollValues: {
      '0': {
        dc: number;
        bonus: number;
      };
      '3': {
        dc: number;
        bonus: number;
      };
      '5': {
        dc: number;
        bonus: number;
      };
      '7': {
        dc: number;
        bonus: number;
      };
      '9': {
        dc: number;
        bonus: number;
      };
    };
    sourcePacks: {
      BACKGROUNDS: string;
      CLASSES: string;
      ITEMS: string;
      RACES: string;
    };
    polymorphSettings: {
      addTemp: string;
      keepBio: string;
      keepType: string;
      keepItems: string;
      keepFeats: string;
      keepHP: string;
      keepMental: string;
      keepPhysical: string;
      keepClass: string;
      keepSaves: string;
      keepSelf: string;
      keepSkills: string;
      keepSpells: string;
      keepVision: string;
      mergeSaves: string;
      mergeSkills: string;
    };
    polymorphEffectSettings: {
      keepAE: string;
      keepOtherOriginAE: string;
      keepOriginAE: string;
      keepBackgroundAE: string;
      keepClassAE: string;
      keepEquipmentAE: string;
      keepFeatAE: string;
      keepSpellAE: string;
    };
    transformationPresets: {
      polymorphSelf: {
        icon: string;
        label: string;
        options: {
          keepSelf: boolean;
          preset: string;
        };
      };
      polymorph: {
        icon: string;
        label: string;
        options: {
          addTemp: boolean;
          keepHP: boolean;
          keepType: boolean;
          keepEquipmentAE: boolean;
          keepClassAE: boolean;
          keepFeatAE: boolean;
          keepBackgroundAE: boolean;
          preset: string;
        };
      };
      wildshape: {
        icon: string;
        label: string;
        options: {
          keepBio: boolean;
          keepClass: boolean;
          keepFeats: boolean;
          keepHP: boolean;
          keepMental: boolean;
          keepType: boolean;
          mergeSaves: boolean;
          mergeSkills: boolean;
          keepEquipmentAE: boolean;
          preset: string;
        };
      };
    };
    proficiencyLevels: {
      '0': string;
      '1': string;
      '2': string;
      '0.5': string;
    } & Record<string, string>;
    weaponAndArmorProficiencyLevels: {
      '0': string;
      '1': string;
    } & Record<string, string>;
    cover: {
      '0': string;
      '1': string;
      '0.5': string;
      '0.75': string;
    };
    trackableAttributes: {
      attributes: {
        ac: {
          value: boolean;
        };
        init: {
          bonus: boolean;
        };
        movement: boolean;
        senses: boolean;
        spelldc: boolean;
        spellLevel: boolean;
      };
      details: {
        cr: boolean;
        spellLevel: boolean;
        xp: {
          value: boolean;
        };
      };
      skills: {
        '*': {
          passive: boolean;
        };
      };
      abilities: {
        '*': {
          value: boolean;
        };
      };
    };
    consumableResources: Array<string>;
    conditionTypes: {
      bleeding: {
        name: string;
        img: string;
        pseudo: boolean;
      };
      blinded: {
        name: string;
        img: string;
        reference: string;
        special: string;
      };
      burning: {
        name: string;
        img: string;
        reference: string;
        pseudo: boolean;
      };
      charmed: {
        name: string;
        img: string;
        reference: string;
      };
      cursed: {
        name: string;
        img: string;
        pseudo: boolean;
      };
      deafened: {
        name: string;
        img: string;
        reference: string;
      };
      dehydration: {
        name: string;
        img: string;
        reference: string;
        pseudo: boolean;
      };
      diseased: {
        name: string;
        img: string;
        pseudo: boolean;
        reference: string;
      };
      exhaustion: {
        name: string;
        img: string;
        reference: string;
        levels: number;
        reduction: {
          rolls: number;
          speed: number;
        };
      };
      falling: {
        name: string;
        img: string;
        reference: string;
        pseudo: boolean;
      };
      frightened: {
        name: string;
        img: string;
        reference: string;
      };
      grappled: {
        name: string;
        img: string;
        reference: string;
      };
      incapacitated: {
        name: string;
        img: string;
        reference: string;
      };
      invisible: {
        name: string;
        img: string;
        reference: string;
      };
      malnutrition: {
        name: string;
        img: string;
        reference: string;
        pseudo: boolean;
      };
      paralyzed: {
        name: string;
        img: string;
        reference: string;
        statuses: Array<string>;
      };
      petrified: {
        name: string;
        img: string;
        reference: string;
        statuses: Array<string>;
      };
      poisoned: {
        name: string;
        img: string;
        reference: string;
      };
      prone: {
        name: string;
        img: string;
        reference: string;
      };
      restrained: {
        name: string;
        img: string;
        reference: string;
      };
      silenced: {
        name: string;
        img: string;
        pseudo: boolean;
      };
      stunned: {
        name: string;
        img: string;
        reference: string;
        statuses: Array<string>;
      };
      suffocation: {
        name: string;
        img: string;
        reference: string;
        pseudo: boolean;
      };
      surprised: {
        name: string;
        img: string;
        pseudo: boolean;
      };
      transformed: {
        name: string;
        img: string;
        pseudo: boolean;
      };
      unconscious: {
        name: string;
        img: string;
        reference: string;
        statuses: Array<string>;
        riders: Array<string>;
      };
    } & Record<string, ConditionType>;
    conditionEffects: {
      noMovement: {};
      halfMovement: {};
      crawl: {};
      petrification: {};
      halfHealth: {};
    };
    statusEffects: {
      burrowing: {
        name: string;
        icon: string;
        special: string;
      };
      concentrating: {
        name: string;
        icon: string;
        special: string;
      };
      dead: {
        name: string;
        icon: string;
        special: string;
      };
      dodging: {
        name: string;
        icon: string;
      };
      ethereal: {
        name: string;
        icon: string;
      };
      flying: {
        name: string;
        icon: string;
        special: string;
      };
      hiding: {
        name: string;
        icon: string;
      };
      hovering: {
        name: string;
        icon: string;
        special: string;
      };
      marked: {
        name: string;
        icon: string;
      };
      sleeping: {
        name: string;
        icon: string;
        statuses: Array<string>;
      };
      stable: {
        name: string;
        icon: string;
      };
    };
    bloodied: {
      name: string;
      icon: string;
      threshold: number;
    };
    languages: {
      standard: {
        label: string;
        children: {
          common: string;
          dwarvish: string;
          elvish: string;
          giant: string;
          gnomish: string;
          goblin: string;
          halfling: string;
          orc: string;
        };
      };
      exotic: {
        label: string;
        children: {
          primordial: {
            label: string;
            children: {
              aquan: string;
              auran: string;
              ignan: string;
              terran: string;
            };
          };
          aarakocra: string;
          abyssal: string;
          celestial: string;
          deep: string;
          draconic: string;
          gith: string;
          gnoll: string;
          infernal: string;
          sylvan: string;
          undercommon: string;
        };
      };
      druidic: string;
      cant: string;
    };
    maxLevel: number;
    maxAbilityScore: number;
    CHARACTER_EXP_LEVELS: Array<number>;
    CR_EXP_LEVELS: Array<number>;
    epicBoonInterval: number;
    traits: {
      saves: {
        labels: {
          title: string;
          localization: string;
        };
        icon: string;
        actorKeyPath: string;
        configKey: string;
        labelKeyPath: string;
      };
      skills: {
        labels: {
          title: string;
          localization: string;
        };
        icon: string;
        actorKeyPath: string;
        labelKeyPath: string;
        expertise: boolean;
      };
      languages: {
        labels: {
          title: string;
          localization: string;
          all: string;
        };
        icon: string;
      };
      armor: {
        labels: {
          title: string;
          localization: string;
        };
        icon: string;
        actorKeyPath: string;
        configKey: string;
        subtypes: {
          keyPath: string;
          ids: Array<string>;
        };
      };
      weapon: {
        labels: {
          title: string;
          localization: string;
        };
        icon: string;
        actorKeyPath: string;
        configKey: string;
        subtypes: {
          keyPath: string;
          ids: Array<string>;
        };
        mastery: boolean;
      };
      tool: {
        labels: {
          title: string;
          localization: string;
        };
        icon: string;
        actorKeyPath: string;
        configKey: string;
        subtypes: {
          keyPath: string;
          ids: Array<string>;
        };
        children: {
          vehicle: string;
        };
        sortCategories: boolean;
        expertise: boolean;
      };
      di: {
        labels: {
          title: string;
          localization: string;
        };
        icon: string;
        configKey: string;
      };
      dr: {
        labels: {
          title: string;
          localization: string;
        };
        icon: string;
        configKey: string;
      };
      dv: {
        labels: {
          title: string;
          localization: string;
        };
        icon: string;
        configKey: string;
      };
      dm: {
        labels: {
          title: string;
          localization: string;
        };
        configKey: string;
      };
      ci: {
        labels: {
          title: string;
          localization: string;
        };
        icon: string;
        configKey: string;
      };
    } & Record<
      string,
      {
        labels: {
          title: string;
          localization: string;
        };
        actorKeyPath?: string;
        icon: string;
        configKey: string;
      }
    >;
    traitModes: {
      default: {
        label: string;
        hint: string;
      };
      expertise: {
        label: string;
        hint: string;
      };
      forcedExpertise: {
        label: string;
        hint: string;
      };
      upgrade: {
        label: string;
        hint: string;
      };
      mastery: {
        label: string;
        hint: string;
      };
    };
    characterFlags: {
      diamondSoul: {
        name: string;
        hint: string;
        section: string;
      };
      enhancedDualWielding: {
        name: string;
        hint: string;
        section: string;
      };
      elvenAccuracy: {
        name: string;
        hint: string;
        section: string;
        abilities: Array<string>;
      };
      halflingLucky: {
        name: string;
        hint: string;
        section: string;
      };
      initiativeAdv: {
        name: string;
        hint: string;
        section: string;
      };
      initiativeAlert: {
        name: string;
        hint: string;
        section: string;
      };
      jackOfAllTrades: {
        name: string;
        hint: string;
        section: string;
      };
      observantFeat: {
        name: string;
        hint: string;
        skills: Array<string>;
        section: string;
      };
      tavernBrawlerFeat: {
        name: string;
        hint: string;
        section: string;
      };
      powerfulBuild: {
        name: string;
        hint: string;
        section: string;
      };
      reliableTalent: {
        name: string;
        hint: string;
        section: string;
      };
      remarkableAthlete: {
        name: string;
        hint: string;
        abilities: Array<string>;
        section: string;
      };
      weaponCriticalThreshold: {
        name: string;
        hint: string;
        section: string;
        placeholder: number;
      };
      spellCriticalThreshold: {
        name: string;
        hint: string;
        section: string;
        placeholder: number;
      };
      meleeCriticalDamageDice: {
        name: string;
        hint: string;
        section: string;
        placeholder: number;
      };
    } & Record<
      string,
      {
        name: string;
        hint: string;
        section: string;
        placeholder?: number;
        abilities?: Array<string>;
        type?: any;
      }
    >;
    allowedActorFlags: Array<string>;
    groupTypes: {
      party: string;
      encounter: string;
    };
    activityTypes: {
      attack: ActivityType;
      check: ActivityType;
      damage: ActivityType;
      enchant: ActivityType;
      heal: ActivityType;
      save: ActivityType;
      summon: ActivityType;
      utility: ActivityType;
    } & Record<string, ActivityType>;
    advancementTypes: {
      AbilityScoreImprovement: {
        validItemTypes: {};
      };
      HitPoints: {
        validItemTypes: {};
      };
      ItemChoice: {
        validItemTypes: {};
      };
      ItemGrant: {
        validItemTypes: {};
      };
      ScaleValue: {
        validItemTypes: {};
      };
      Size: {
        validItemTypes: {};
      };
      Subclass: {
        validItemTypes: {};
      };
      Trait: {
        validItemTypes: {};
      };
    };
    defaultArtwork: {
      Item: {
        background: string;
        class: string;
        consumable: string;
        container: string;
        equipment: string;
        feat: string;
        loot: string;
        race: string;
        spell: string;
        subclass: string;
        tool: string;
        weapon: string;
      };
    };
    ruleTypes: {
      rule: {
        label: string;
        references: string;
      };
      ability: {
        label: string;
        references: string;
      };
      areaOfEffect: {
        label: string;
        references: string;
      };
      condition: {
        label: string;
        references: string;
      };
      creatureType: {
        label: string;
        references: string;
      };
      damage: {
        label: string;
        references: string;
      };
      skill: {
        label: string;
        references: string;
      };
      spellComponent: {
        label: string;
        references: string;
      };
      spellSchool: {
        label: string;
        references: string;
      };
      spellTag: {
        label: string;
        references: string;
      };
      weaponMastery: {
        label: string;
        references: string;
      };
    };
    rules: {
      inspiration: string;
      carryingcapacity: string;
      push: string;
      lift: string;
      drag: string;
      encumbrance: string;
      hiding: string;
      passiveperception: string;
      time: string;
      speed: string;
      travelpace: string;
      forcedmarch: string;
      difficultterrainpace: string;
      climbing: string;
      swimming: string;
      longjump: string;
      highjump: string;
      falling: string;
      suffocating: string;
      vision: string;
      light: string;
      lightlyobscured: string;
      heavilyobscured: string;
      brightlight: string;
      dimlight: string;
      darkness: string;
      blindsight: string;
      darkvision: string;
      tremorsense: string;
      truesight: string;
      food: string;
      water: string;
      resting: string;
      shortrest: string;
      longrest: string;
      surprise: string;
      initiative: string;
      bonusaction: string;
      reaction: string;
      difficultterrain: string;
      beingprone: string;
      droppingprone: string;
      standingup: string;
      crawling: string;
      movingaroundothercreatures: string;
      flying: string;
      size: string;
      space: string;
      squeezing: string;
      attack: string;
      castaspell: string;
      dash: string;
      disengage: string;
      dodge: string;
      help: string;
      hide: string;
      ready: string;
      search: string;
      useanobject: string;
      attackrolls: string;
      unseenattackers: string;
      unseentargets: string;
      rangedattacks: string;
      range: string;
      rangedattacksinclosecombat: string;
      meleeattacks: string;
      reach: string;
      unarmedstrike: string;
      opportunityattacks: string;
      twoweaponfighting: string;
      grappling: string;
      escapingagrapple: string;
      movingagrappledcreature: string;
      shoving: string;
      cover: string;
      halfcover: string;
      threequarterscover: string;
      totalcover: string;
      hitpoints: string;
      damagerolls: string;
      criticalhits: string;
      damagetypes: string;
      damageresistance: string;
      damagevulnerability: string;
      healing: string;
      instantdeath: string;
      deathsavingthrows: string;
      deathsaves: string;
      stabilizing: string;
      knockingacreatureout: string;
      temporaryhitpoints: string;
      temphp: string;
      mounting: string;
      dismounting: string;
      controllingamount: string;
      underwatercombat: string;
      spelllevel: string;
      knownspells: string;
      preparedspells: string;
      spellslots: string;
      castingatahigherlevel: string;
      upcasting: string;
      castinginarmor: string;
      cantrips: string;
      rituals: string;
      castingtime: string;
      bonusactioncasting: string;
      reactioncasting: string;
      longercastingtimes: string;
      spellrange: string;
      components: string;
      verbal: string;
      spellduration: string;
      instantaneous: string;
      concentrating: string;
      spelltargets: string;
      areaofeffect: string;
      pointoforigin: string;
      spellsavingthrows: string;
      spellattackrolls: string;
      combiningmagicaleffects: string;
      schoolsofmagic: string;
      detectingtraps: string;
      disablingtraps: string;
      curingmadness: string;
      damagethreshold: string;
      poisontypes: string;
      contactpoison: string;
      ingestedpoison: string;
      inhaledpoison: string;
      injurypoison: string;
      attunement: string;
      wearingitems: string;
      wieldingitems: string;
      multipleitemsofthesamekind: string;
      paireditems: string;
      commandword: string;
      consumables: string;
      itemspells: string;
      charges: string;
      spellscroll: string;
      creaturetags: string;
      telepathy: string;
      legendaryactions: string;
      lairactions: string;
      regionaleffects: string;
      disease: string;
    };
    tokenRings: {
      effects: {
        RING_PULSE: string;
        RING_GRADIENT: string;
        BKG_WAVE: string;
      };
      spriteSheet: string;
      shaderClass: any;
    };
    sourceBooks: {
      'SRD 5.1': string;
    };
    themes: {
      light: string;
      dark: string;
    };
    enrichmentLookup: {
      abilities: {
        str: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        dex: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        con: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        int: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
          defaults: {
            vehicle: number;
          };
        };
        wis: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
          defaults: {
            vehicle: number;
          };
        };
        cha: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
          defaults: {
            vehicle: number;
          };
        };
        strength: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        dexterity: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        constitution: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        intelligence: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
          defaults: {
            vehicle: number;
          };
          key: string;
        };
        wisdom: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
          defaults: {
            vehicle: number;
          };
          key: string;
        };
        charisma: {
          label: string;
          abbreviation: string;
          type: string;
          fullKey: string;
          reference: string;
          icon: string;
          defaults: {
            vehicle: number;
          };
          key: string;
        };
      };
      skills: {
        acr: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        ani: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        arc: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        ath: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        dec: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        his: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        ins: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        itm: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        inv: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        med: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        nat: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        prc: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        prf: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        per: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        rel: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        slt: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        ste: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        sur: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
        };
        acrobatics: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        animalhandling: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        arcana: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        athletics: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        deception: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        history: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        insight: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        intimidation: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        investigation: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        medicine: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        nature: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        perception: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        performance: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        persuasion: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        religion: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        sleightofhand: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        stealth: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
        survival: {
          label: string;
          ability: string;
          fullKey: string;
          reference: string;
          icon: string;
          key: string;
        };
      };
      spellSchools: {
        abj: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
        };
        con: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
        };
        div: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
        };
        enc: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
        };
        evo: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
        };
        ill: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
        };
        nec: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
        };
        trs: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
        };
        abjuration: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
          key: string;
        };
        conjuration: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
          key: string;
        };
        divination: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
          key: string;
        };
        enchantment: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
          key: string;
        };
        evocation: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
          key: string;
        };
        illusion: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
          key: string;
        };
        necromancy: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
          key: string;
        };
        transmutation: {
          label: string;
          icon: string;
          fullKey: string;
          reference: string;
          key: string;
        };
      };
      tools: {
        alchemist: string;
        bagpipes: string;
        brewer: string;
        calligrapher: string;
        card: string;
        carpenter: string;
        cartographer: string;
        chess: string;
        cobbler: string;
        cook: string;
        dice: string;
        disg: string;
        drum: string;
        dulcimer: string;
        flute: string;
        forg: string;
        glassblower: string;
        herb: string;
        horn: string;
        jeweler: string;
        leatherworker: string;
        lute: string;
        lyre: string;
        mason: string;
        navg: string;
        painter: string;
        panflute: string;
        pois: string;
        potter: string;
        shawm: string;
        smith: string;
        thief: string;
        tinker: string;
        viol: string;
        weaver: string;
        woodcarver: string;
      };
    };
    habitats: {
      any: {
        label: string;
      };
      arctic: {
        label: string;
      };
      coastal: {
        label: string;
      };
      desert: {
        label: string;
      };
      forest: {
        label: string;
      };
      grassland: {
        label: string;
      };
      hill: {
        label: string;
      };
      mountain: {
        label: string;
      };
      planar: {
        label: string;
        subtypes: boolean;
      };
      swamp: {
        label: string;
      };
      underdark: {
        label: string;
      };
      underwater: {
        label: string;
      };
      urban: {
        label: string;
      };
    } & Record<string, { label: string; subtypes?: boolean }>;
    treasure: {
      any: TreasureConfig;
      arcana: TreasureConfig;
      armaments: TreasureConfig;
      implements: TreasureConfig;
      individual: TreasureConfig;
      relics: TreasureConfig;
    } & Record<string, TreasureConfig>;
    volumeUnits: {
      cubicFoot: VolumeUnitConfig;
      liter: VolumeUnitConfig;
    } & Record<string, VolumeUnitConfig>;
  };
  ux: any;
};

type ActivityType = {
  documentClass: any;
  configurable?: boolean;
};

type FacilityOrder = {
  label: string;
  icon: string;
  hidden?: boolean;
  basic?: boolean;
  duration?: number;
};

export type Dnd5eAbility = {
  label: string;
  abbreviation: string;
  type: string;
  fullKey: string;
  reference: string;
  icon: string;
  defaults?: {
    vehicle: number;
  };
};

type SpellcastingLevelMapTable = Record<
  string,
  { label: string; divisor: number; roundUp: boolean }
>;
type SpellcastingLevelArraysTable = number[][];
type SpellcastingConfigEntryTable =
  | SpellcastingLevelMapTable
  | SpellcastingLevelArraysTable;

export type SpellcastingConfigEntry = {
  label: string;
  order: number;
  img: string;
  type: string;
  key?: string;
  cantrips?: boolean;
  prepares?: boolean;
  table?: SpellcastingConfigEntryTable;
  progression?: Record<
    string,
    { label: string; divisor: number; roundUp: boolean }
  >;
  exclusive?: {
    slots: boolean;
    spells: boolean;
  };
  slots?: boolean;
  getAvailableLevels: ((actor: Actor5e) => number[]) | undefined;
  getSpellSlotKey: ((level: number) => string) | undefined;
  getLabel: (options?: { level?: number; format?: 'short' | 'long' }) => string;
};

type LabelValuePair<TValue = string> = {
  label: string;
  value: TValue;
};

export type SpellProgressionConfig = {
  label: string;
  divisor?: number;
  roundUp?: boolean;
  type?: string;
};
