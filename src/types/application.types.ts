import type {
  CustomHeaderControlsEntry,
  SheetHeaderControlPosition,
} from 'src/api/api.types';

/** For use with Tidy applications that apply updates to a document but are not necessarily full-fledged sheets. */
export type DocumentSheetApplicationConfiguration =
  Partial<ApplicationConfiguration> & { document: any };

export type DocumentSheetConfiguration = {
  document: any;
  viewPermission: number;
  editPermission: number;
  canCreate: boolean;
  sheetConfig: boolean;
} & ApplicationConfiguration;

export type ApplicationConfiguration = {
  id: string;
  uniqueId: string;
  classes: string[];
  tag: string;
  window: ApplicationWindowConfiguration;
  actions: Record<
    string,
    | ApplicationClickAction
    | { handler: ApplicationClickAction; buttons: number[] }
  >;
  form?: ApplicationFormConfiguration;
  position: Partial<ApplicationPosition>;
} & Record<string, unknown>;

export interface ApplicationPosition {
  top: number;
  left: number;
  width: number | 'auto';
  height: number | 'auto';
  scale: number;
  zIndex: number;
}

export interface ApplicationWindowConfiguration {
  frame?: boolean;
  positioned?: boolean;
  title?: string;
  icon?: string | false;
  controls?: (ApplicationHeaderControlsEntry | CustomHeaderControlsEntry)[];
  minimizable?: boolean;
  resizable?: boolean;
  contentTag?: string;
  contentClasses?: string[];
}

export interface ApplicationFormConfiguration {
  handler?: ApplicationFormSubmission;
  submitOnChange?: boolean;
  closeOnSubmit?: boolean;
}

export interface ApplicationHeaderControlsEntry {
  icon: string;
  label: string;
  action: string;
  visible?: boolean | ((this: any) => boolean);
  ownership?: string | number;
  /** Where the control should be placed, whether the header or the menu. Tidy-specific field */
  position?: SheetHeaderControlPosition;
  onClick?: (event: PointerEvent) => void;
}

export interface ApplicationConstructorParams {
  position: ApplicationPosition;
}

export interface ApplicationRenderOptions {
  force?: boolean;
  position?: ApplicationPosition;
  window?: ApplicationWindowRenderOptions;
  parts?: string[];
  isFirstRender?: boolean;
  renderContext?: string;
  renderData?: any;
  action?: string;
  data?: object;

  // Tidy-specific options
  /**
   * If possible, reuse the existing prepared context data and
   * proceed through the render lifecycle logic, particularly including
   * custom content management.
   */
  soft?: boolean;
}

export interface ApplicationWindowRenderOptions {
  title: string;
  icon: string | false;
  controls: boolean;
}

export interface ApplicationClosingOptions {
  animate?: boolean;
  closeKey?: boolean;
  bypassSubmitOnClose?: boolean;
  submit?: boolean;
}

export type ApplicationClickAction = (
  event: PointerEvent,
  target: HTMLElement
) => Promise<void>;

export type ApplicationFormSubmission = (
  event: SubmitEvent | Event,
  form: HTMLFormElement,
  formData: /*FormDataExtended*/ unknown
) => Promise<void>;

export interface ApplicationTab {
  id: string;
  group: string;
  icon: string;
  label: string;
  active: boolean;
  cssClass: string;
}

export interface FormNode {
  fieldset: boolean;
  legend?: string;
  fields?: FormNode[];
  field?: /*DataField*/ unknown;
  value?: any;
}

export interface FormFooterButton {
  type: string;
  name?: string;
  icon?: string;
  label?: string;
  action?: string;
  cssClass?: string;
  disabled?: boolean;
}
