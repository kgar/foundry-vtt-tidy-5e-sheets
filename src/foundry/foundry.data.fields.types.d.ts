declare module 'foundry.data.fields' {
  type DataFieldValidator = (
    value: any,
    options: DataFieldValidationOptions
  ) => boolean | void;

  interface DataFieldOptions {
    required?: boolean;
    nullable?: boolean;
    gmOnly?: boolean;
    initial?: Function | any;
    label?: string;
    hint?: string;
    validate?: DataFieldValidator;
    validationError?: string;
  }

  interface DataFieldContext {
    name?: string;
    parent?: DataField;
  }

  interface DataFieldValidationOptions {
    partial?: boolean;
    fallback?: boolean;
    source?: object;
    dropInvalidEmbedded?: boolean;
  }

  interface FormGroupConfig {
    label: string;
    units?: string;
    input?: HTMLElement | HTMLCollection;
    hint?: string;
    rootId?: string;
    classes?: string[];
    stacked?: boolean;
    localize?: boolean;
    hidden?: boolean | 'until-found';
    widget?: CustomFormGroup;
  }

  /**
   * @template [FormInputValue=unknown]
   */
  interface FormInputConfig {
    name: string;
    value?: FormInputValue;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    autofocus?: boolean;
    localize?: boolean;
    dataset?: Record<string, string>;
    aria?: Record<string, string>;
    placeholder?: string;
    classes?: string;
    input?: CustomFormInput;
  }

  interface StringFieldInputConfig {
    elementType?: 'input' | 'textarea' | 'prose-mirror' | 'code-mirror';
  }

  type CodeMirrorLanguage =
    | 'javascript'
    | 'json'
    | 'html'
    | 'markdown'
    | ''
    | 'plain';

  interface CodeMirrorInputConfig {
    language?: CodeMirrorLanguage;
    indent?: number;
  }

  interface LightAnimationData {
    type: string;
    speed: number;
    intensity: number;
    reverse: boolean;
  }

  interface _NumberFieldOptions {
    min?: number;
    max?: number;
    step?: number;
    integer?: boolean;
    positive?: boolean;
    choices?: number[] | object | Function;
  }

  type NumberFieldOptions = DataFieldOptions & _NumberFieldOptions;

  interface _StringFieldOptions {
    blank?: boolean;
    trim?: boolean;
    choices?: string[] | object | Function;
    textSearch?: boolean;
  }

  type StringFieldOptions = DataFieldOptions & _StringFieldOptions;

  interface ChoiceInputConfig {
    options: FormSelectOption[];
    choices:
      | Record<string | number, any>
      | any[]
      | (() => Record<string | number, any> | any[]);
    labelAttr?: string;
    valueAttr?: string;
  }

  interface _ArrayFieldOptions {
    min?: number;
    max?: number;
  }

  type ArrayFieldOptions = DataFieldOptions & _ArrayFieldOptions;

  interface _DocumentUUIDFieldOptions {
    type?: string;
    embedded?: boolean;
  }

  type DocumentUUIDFieldOptions = StringFieldOptions &
    _DocumentUUIDFieldOptions;

  interface _FilePathFieldOptions {
    categories?: string[];
    base64?: boolean;
    virtual?: boolean;
    wildcard?: boolean;
    initial?: object;
  }

  type FilePathFieldOptions = StringFieldOptions & _FilePathFieldOptions;

  type DocumentFlags = Record<string, Record<string, unknown>>;

  interface DocumentStats {
    coreVersion: string | null;
    systemId: string | null;
    systemVersion: string | null;
    createdTime: number | null;
    modifiedTime: number | null;
    lastModifiedBy: string | null;
    compendiumSource: string | null;
    duplicateSource: string | null;
  }

  interface _JavaScriptFieldOptions {
    async?: boolean;
  }

  type JavaScriptFieldOptions = StringFieldOptions & _JavaScriptFieldOptions;

  interface ElementValidationFailure {
    id: string | number;
    name?: string;
    failure: DataModelValidationFailure;
  }

  export interface EffectChangeData {
    key: string;
    value: string;
    mode: number;
    priority: number;
  }

  interface DataModelValidationOptions {
    fields?: boolean;
    joint?: boolean;
    changes?: object;
    clean?: boolean;
    strict?: boolean;
    fallback?: boolean;
    dropInvalidEmbedded?: boolean;
  }

  interface DataModelConstructionOptions {
    parent?: DataModel | null;
  }

  type DataModelConstructionContext = DataModelConstructionOptions &
    Pick<
      DataModelValidationOptions,
      'strict' | 'fallback' | 'dropInvalidEmbedded'
    >;

  interface DataModelUpdateOptions {
    dryRun?: boolean;
    fallback?: boolean;
    recursive?: boolean;
    restoreDelta?: boolean;
  }

  declare class DataModel {
    constructor(
      data: Partial<ModelData> = {},
      context: DataModelConstructionContext = {}
    ): DataModel;

    _source: object;
    _schema: SchemaField;
    parent: DataModel | null;
    static defineSchema(): DataSchema;
    static get schema(): SchemaField;
    get schema(): SchemaField;
    get invalid(): boolean;
    get validationFailures(): {
      fields: DataModelValidationFailure | null;
      joint: DataModelValidationFailure | null;
    };
    static LOCALIZATION_PREFIXES: string[];
    static cleanData(source: object = {}, options: object = {}): object;
    reset(): void;
    clone(
      data: object = {},
      context: DataModelConstructionContext = {}
    ): DataModel;
    validate(options: Partial<DataModelValidationOptions>): boolean;
    validateJoint(data: object);
    updateSource(
      changes: object = {},
      options: DataModelUpdateOptions = {}
    ): object;
    toObject(source?: boolean): object;
    toJSON(): object;
    static fromSource(
      source: object,
      options: Omit<DataModelConstructionContext, 'strict'> &
        DataModelFromSourceOptions = {}
    ): DataModel;
    static fromJSON(json: string): DataModel;
    static migrateData(source: object): object;
    static migrateDataSafe(source: object): object;
    static shimData(data: object, options: { embedded: boolean });
  }

  type DataModelValidationFailureConstructionOptions = {
    invalidValue: any;
    fallback: any;
    dropped: boolean;
    message: string;
    unresolved: boolean;
  };

  declare class DataModelValidationFailure {
    constructor(
      options: Partial<DataModelValidationFailureConstructionOptions> = {}
    );

    invalidValue: any;

    fallback: any;

    dropped: boolean;

    message: string;

    fields: Record<string, DataModelValidationFailure>;

    elements: ElementValidationFailure[];

    unresolved: boolean;

    asError(): DataModelValidationError;

    isEmpty(): boolean;

    toObject(): Exclude<
      DataModelValidationFailureConstructionOptions,
      { unresolved: boolean }
    >;

    toString(): string;
  }

  declare class DataModelValidationError extends Error {
    constructor(
      failure: DataModelValidationFailure | string,
      ...params: any[]
    ): DataModelValidationError;

    getFailure(path: string): DataModelValidationFailure;

    getAllFailures(): Record<string, DataModelValidationFailure>;

    logAsTable(): void;

    asHTML(): string;
  }

  declare type DataSchema = Record<string, DataField>;

  declare class DataField {
    constructor(
      options: DataFieldOptions = {},
      context: DataFieldContext = {}
    ): DataField;

    name: string;
    parent: SchemaField;
    options: DataFieldOptions;
    static hierarchical: boolean;
    static recursive: boolean;
    static get _defaults(): DataFieldOptions;
    get fieldPath(): string;
    apply(fn: string | Function, value: any, options: Record<string, any> = {});
    clean(value: any, options: { partial: boolean; source: object } = {}): void;
    getInitialValue(data: any): any;
    toObject(value: any): any;
    validate(
      value: any,
      options: DataFieldValidationOptions = {}
    ): DataModelValidationFailure | void;
    initialize(value: any, model: Object, options: object = {}): any;
    toInput(config: FormInputConfig = {}): HTMLElement | HTMLCollection;
    toFormGroup(
      groupConfig: FormGroupConfig = {},
      inputConfig: FormInputConfig = {}
    ): HTMLDivElement;
    applyChange(value: any, model: DataModel, change: EffectChangeData): any;
  }

  interface DataField extends DataFieldOptions {}

  type ElementType = DataField;

  // Foundry
  declare class SchemaField extends DataField {
    constructor(
      fields: DataSchema,
      options: DataFieldOptions = {},
      context: DataFieldContext = {}
    ): DataField;
    fields: DataSchema;
    keys(): string[];
    values(): DataField[];
    entries(): [string, DataField][];
    has(fieldName: string): boolean;
    get(fieldName: string): DataField | void;
    getField(fieldName: string): SchemaField | DataField;
    migrateSource(sourceData: object, fieldData: any): void;
  }
  declare class BooleanField extends DataField {}
  declare class NumberField extends DataField {
    constructor(
      options: NumberFieldOptions = {},
      context: DataFieldContext = {}
    );
    options: NumberFieldOptions;
  }

  interface NumberField extends NumberFieldOptions {}

  declare class StringField extends DataField {
    constructor(
      options: StringFieldOptions = {},
      context: DataFieldContext = {}
    );

    options: StringFieldOptions;
    blank: boolean;
    trim: boolean;
    textSearch: boolean;
  }

  interface StringField extends StringFieldOptions {}

  declare class ObjectField extends DataField {}
  declare class TypedObjectField extends ObjectField {
    element: DataField;

    constructor(
      element: DataField,
      options: DataFieldOptions = {},
      context: DataFieldContext = {}
    ): DataField;
  }
  declare class ArrayField extends DataField {
    constructor(
      element: ElementType,
      options: ArrayFieldOptions = {},
      context: DataFieldContext = {}
    ): ArrayField;

    options: ArrayFieldOptions;
    element: ElementType;
  }

  interface ArrayField extends ArrayFieldOptions {}

  declare class SetField extends ArrayField {}
  declare class EmbeddedDataField extends SchemaField {
    constructor(
      model: typeof DataModel,
      options: DataFieldOptions = {},
      context: DataFieldContext = {}
    );

    model: DataModel;
  }
  declare class EmbeddedCollectionField extends ArrayField {
    constructor(
      element: typeof FoundryDocument,
      options: DataFieldOptions = {},
      context: DataFieldContext = {}
    ): EmbeddedCollectionField;

    readonly: boolean;

    static get implementation(): typeof EmbeddedCollection;

    get model(): typeof FoundryDocument;

    get schema(): SchemaField;
  }
  declare class EmbeddedCollectionDeltaField extends EmbeddedCollectionField {}
  declare class EmbeddedDocumentField extends EmbeddedDataField {
    constructor(
      model: typeof FoundryDocument,
      options: DataFieldOptions = {},
      context: DataFieldContext = {}
    ): EmbeddedDocumentField;

    getCollection(parent: FoundryDocument): Map<string, FoundryDocument>;
  }
  declare class DocumentIdField extends StringField {}
  declare class DocumentUUIDField extends StringField {}
  declare class ForeignDocumentField extends DocumentIdField {}
  declare class ColorField extends StringField {}
  declare class FilePathField extends StringField {
    constructor(
      options: FilePathFieldOptions = {},
      context: DataFieldContext = {}
    ): FilePathField;
    options: FilePathFieldOptions;
  }

  interface FilePathField extends FilePathFieldOptions {}

  declare class AngleField extends NumberField {}
  declare class AlphaField extends NumberField {}
  declare class HueField extends NumberField {}
  declare class DocumentAuthorField extends ForeignDocumentField {}
  declare class DocumentOwnershipField extends ObjectField {}
  declare class JSONField extends StringField {}
  declare class AnyField extends DataField {}
  declare class HTMLField extends StringField {}
  declare class IntegerSortField extends NumberField {}
  declare class DocumentFlagsField extends TypedObjectField {}
  declare class DocumentStatsField extends SchemaField {
    static fields: string[];
    static managedFields: string[];
  }
  declare class DocumentTypeField extends StringField {
    constructor(
      documentClass: typeof FoundryDocument,
      options: StringFieldOptions = {},
      context: DataFieldContext = {}
    ): DocumentTypeField;
  }

  interface DocumentTypeField extends StringFieldOptions {}

  declare class TypeDataField extends ObjectField {
    constructor(
      document: typeof FoundryDocument,
      options: DataFieldOptions = {},
      context: DataFieldContext = {}
    ): TypeDataField;
    document: typeof FoundryDocument;
    getModelProvider(model: DataModel): any | null;
    get documentName(): string;
    getModelForType(type: string): DataModel | null;
    migrateSource(sourceData: object, fieldData: any): void;
  }
  declare class TypedSchemaField extends DataField {
    constructor(
      types: Record<string, DataSchema | SchemaField | typeof DataModel>,
      options: DataFieldOptions = {},
      context: DataFieldContext = {}
    ): TypedSchemaField;

    types: Record<string, SchemaField>;

    migrateSource(sourceData: object, fieldData: any): void;
  }
  declare class JavaScriptField extends StringField {
    constructor(
      options: JavaScriptFieldOptions = {},
      context: DataFieldContext = {}
    ): JavaScriptField;
    options: JavaScriptFieldOptions;
  }

  interface JavaScriptField extends JavaScriptFieldOptions {}
}
