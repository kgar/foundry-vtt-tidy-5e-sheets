import type { SvelteComponent } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export function SvelteApplicationMixin<TContext>(BaseApplication: any) {
  class SvelteApplication extends BaseApplication {
    store: Writable<TContext> = writable<TContext>();
    component: SvelteComponent | undefined;

    async _prepareContext(
      options: ApplicationRenderOptions
    ): Promise<TContext> {
      throw new Error(
        'To implement a Tidy sheet, override _prepareContext and provide context data matching the specified sheet context type.'
      );
    }

    _createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
      throw new Error(
        'To implement a Tidy sheet, override _createComponent and provide svelte component that has been successfully created and mounted to the DOM.'
      );
    }

    async _renderHTML(context: TContext, options: ApplicationRenderOptions) {
      console.log('_renderHTML', context, options);

      if (options.isFirstRender) {
        // we've already set store context
        return;
      }

      this.store.set(context);
    }

    _replaceHTML(
      result: any,
      content: HTMLElement,
      options: ApplicationRenderOptions
    ) {
      super._replaceHTML(result, content, options);
      console.log('_replaceHTML', result, content, options);
    }

    async _renderFrame(options: ApplicationRenderOptions) {
      const frame = await super._renderFrame(options);
  
      const target = this.hasFrame
        ? frame.querySelector('.window-content')
        : frame;

      target.innerContent = '';
      const context = await this._prepareContext(options);
      this.store.set(context);
      this.component = this._createComponent(target);

      return frame;
    }

    async close(options: ApplicationClosingOptions = {}) {
      this.component?.$destroy();
      super.close(options);
    }
  }

  return SvelteApplication;
}

export function TidyHandlebarsIntegrationApplicationMixin<TContext>(
  BaseApplication: any
) {
  class TidyHandlebarsIntegrationApplication extends BaseApplication {
    async _renderHTML(context: TContext, options: ApplicationRenderOptions) {
      const result = await super._renderHTML(context, options);
      console.log('_renderHTML', context, options);
      // Prepare API-driven custom content here

      return result;
    }

    _replaceHTML(
      result: any,
      content: HTMLElement,
      options: ApplicationRenderOptions
    ) {
      super._replaceHTML(result, content, options);
      console.log('_replaceHTML', result, content, options);
      // Remove `data-tidy-render-scheme="handlebars"` content here?
      // Add replacement stuff; TODO: add TS types for this
    }
  }
}

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
