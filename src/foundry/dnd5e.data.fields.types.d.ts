/// <reference path="./foundry.data.fields.types.d.ts" />

declare module 'dnd5e.data.fields' {
  type MappingFieldInitialValueBuilder = (
    key: string,
    initial: any,
    existing: object
  ) => object;

  type MappingFieldOptions = DataFieldOptions & {
    initialKeys?: string[];
    initialValue?: MappingFieldInitialValueBuilder;
    initialKeysOnly?: boolean;
  };

  declare class MappingField extends foundry.data.fields.ObjectField {
    constructor(
      model: DataField,
      options: MappingFieldOptions = {}
    ): MappingField;

    model: DataField;
  }

  type LocalDocumentFieldOptions = StringFieldOptions & {
    fallback?: boolean;
  };

  declare class LocalDocumentField extends foundry.data.fields.DocumentIdField {
    constructor(
      model: typeof FoundryDocument,
      options: LocalDocumentFieldOptions = {}
    );

    model: typeof FoundryDocument;
  }

  declare class IdentifierField extends foundry.data.fields.StringField {}

  type FormulaFieldOptions = StringFieldOptions & {
    deterministic?: boolean;
  };

  declare class FormulaField extends foundry.data.fields.StringField {
    constructor(
      options: FormulaFieldOptions = {},
      context: DataFieldContext = {}
    ): DataField;
  }

  interface AdvantageModeData {
    override: number | null;
    advantages: AdvantageModeCounts;
    disadvantages: AdvantageModeCounts;
  }

  interface AdvantageModeCounts {
    count: number;
    suppressed?: boolean;
  }

  declare class AdvantageModeField extends foundry.data.fields.NumberField {
    static getCounts(
      model: DataModel,
      change: EffectChangeData
    ): AdvantageModeData;

    static resolveMode(
      model: DataModel,
      change: EffectChangeData,
      counts: AdvantageModeData
    ): number;
  }

  declare class AdvancementField extends foundry.data.fields.ObjectField {
    getModelForType(type: string): BaseAdvancement | null;

    migrateSource(sourceData: object, fieldData: any);    
  }

  declare class AdvancementDataField extends foundry.data.fields.ObjectField {
    constructor(advancementType: Advancement, options: DataFieldOptions = {}): AdvancementDataField;

    advancementType: Advancement;

    getModel(): DataModel | null;

    getDefaults(): object;

    migrateSource(sourceData: object, fieldData: any): void;
  }

  declare class ActivitiesField extends MappingField {
    constructor(options: DataFieldOptions = {}): ActivitiesField;
  }
  
  declare class ActivityField extends foundry.data.fields.ObjectField {
    getModel(value: object): Activity | null;

    migrateSource(sourceData: object, fieldData: any): void;
  }
  
  declare class ActivityCollection extends Collection {
    constructor(model: DataMOdel, entries: Activity[]): ActivityCollection;

    getByType(type: string): Activity[];

    *getByTypes(...types: string[]);

    every(predicate: (value: any, num: number, collection: ActivityCollection) => boolean): boolean;

    toObject(source: boolean): object[];
  }
}
