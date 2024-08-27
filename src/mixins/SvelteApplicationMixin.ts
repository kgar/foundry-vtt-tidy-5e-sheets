import { StoreSubscriptionsService } from 'src/features/store/StoreSubscriptionsService';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import {
  applySheetAttributesToWindow,
  applyThemeDataAttributeToWindow,
} from 'src/utils/applications';
import { error } from 'src/utils/logging';
import type { SvelteComponent } from 'svelte';
import { writable, type Writable } from 'svelte/store';

/**
 * A context-oriented Svelte mixin to provide Application V2 windows with Svelte integration.
 *
 * @param BaseApplication the application which should adopt this mixin functionality.
 * @returns the resulting application with this mixin functionality applied.
 */
export function SvelteApplicationMixin<TContext>(BaseApplication: any) {
  class SvelteApplication extends BaseApplication {
    /** The component which represents the UI. */
    #component: SvelteComponent | null = null;

    /** The entire application frame. Starts as a stub form until a render occurs. */
    #element: HTMLElement = document.createElement('form');

    /**
     * Any subscriptions which should be managed during the lifetime of the application window.
     * They are retrieved once, during _renderFrame, and then unsubscribed during close.
     */
    #subscriptionsService: StoreSubscriptionsService;

    /**
     * The context store which underpins the application Svelte component.
     * This store is made available as Svelte context to the component
     * and can be retrieved from any child component within.
     */
    _store: Writable<TContext> = writable<TContext>();

    constructor(...args: any[]) {
      super(...args);

      this.#subscriptionsService = new StoreSubscriptionsService();
    }

    /* Required Overrides */

    /** Prepares context data which matches the request data type. */
    async _prepareContext(
      options: ApplicationRenderOptions
    ): Promise<TContext> {
      const errorMessage =
        'Unable to render Svelte application. To implement a Svelte application, override _prepareContext and provide context data matching the specified sheet context type.';
      error(errorMessage, false, { options });
      throw new Error(errorMessage);
    }

    /** Creates the component which represents the window content area. */
    _createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
      const errorMessage =
        'Unable to render Svelte application. To implement a Svelte application, override _createComponent and provide context data matching the specified sheet context type.';
      throw new Error(errorMessage);
    }

    /**
     * Retrieves and manages any application-specific subscriptions related to the
     * lifetime of the application, from first render to close.
     */
    _getSubscriptions(): (() => void)[] {
      return [];
    }

    /**
     * Triggers possible reactive rendering by updating the application store
     * with the latest context data.
     */
    async _renderHTML(context: TContext, _options: ApplicationRenderOptions) {
      this._store.set(context);
    }

    /**
     * Creates and mounts the Svelte component on first render.
     * @param result not in use by this mixin.
     * @param content the window content area
     * @param options render options
     */
    _replaceHTML(
      _result: any,
      content: HTMLElement,
      options: ApplicationRenderOptions
    ) {
      if (options.isFirstRender) {
        this.#component = this._createComponent(content);
      }
    }

    async _renderFrame(options: ApplicationRenderOptions) {
      this.#element = await super._renderFrame(options);

      if (!this.#element) {
        throw new Error(
          'Application frame was not correctly rendered. The `_renderFrame` function must return an HTMLElement.'
        );
      }

      applySheetAttributesToWindow(
        this.actor.documentName,
        this.actor.type,
        SettingsProvider.settings.colorScheme.get(),
        this.#element
      );

      // Manage application subscriptions
      this.#subscriptionsService.unsubscribeAll();
      const subscriptions = this._getSubscriptions();
      this.#subscriptionsService.registerSubscriptions(
        ...subscriptions,
        settingStore.subscribe((settings) => {
          applyThemeDataAttributeToWindow(settings.colorScheme, this.#element);
        })
      );

      return this.#element;
    }

    async close(options: ApplicationClosingOptions = {}) {
      this.#subscriptionsService.unsubscribeAll();
      this.#component?.$destroy();
      this.#component = null;
      this.#element = document.createElement('form');
      await super.close(options);
    }
  }

  return SvelteApplication;
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
