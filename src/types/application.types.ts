export interface ApplicationConfiguration {
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
}

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
  controls?: ApplicationHeaderControlsEntry[];
  minimizable?: boolean;
  resizable?: boolean;
  contentTag?: string;
  contentClasses?: string[];
}

export interface ApplicationFormConfiguration {
  handler: ApplicationFormSubmission;
  submitOnChange: boolean;
  closeOnSubmit: boolean;
}

export interface ApplicationHeaderControlsEntry {
  icon: string;
  label: string;
  action: string;
  visible?: boolean;
  ownership?: string | number;
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
}

export interface ApplicationWindowRenderOptions {
  title: string;
  icon: string | false;
  controls: boolean;
}

export interface ApplicationClosingOptions {
  animate?: boolean;
  closeKey?: boolean;
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
