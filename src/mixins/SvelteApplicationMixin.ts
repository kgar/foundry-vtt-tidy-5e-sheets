import { StoreSubscriptionsService } from 'src/features/store/StoreSubscriptionsService';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider, settingStore } from 'src/settings/settings';
import {
  applySheetAttributesToWindow,
  applyThemeDataAttributeToWindow,
  blurUntabbableButtonsOnClick,
} from 'src/utils/applications';
import { debug, error } from 'src/utils/logging';
import type { SvelteComponent } from 'svelte';
import { writable, type Unsubscriber, type Writable } from 'svelte/store';
import SheetHeaderEditModeToggle from 'src/sheets/shared/SheetHeaderEditModeToggle.svelte';
import { CONSTANTS } from 'src/constants';
import {
  CustomContentRendererV2,
  type RenderedSheetPart,
} from 'src/sheets/CustomContentRendererV2';
import type { CustomContent, Tab } from 'src/types/types';
import { delay } from 'src/utils/asynchrony';
import type { RegisteredContent } from 'src/runtime/types';

type RenderResult<TContext> = {
  customContents: RenderedSheetPart[];
  context: TContext;
};

/**
 * A context-oriented Svelte mixin to provide Application V2 windows with Svelte integration.
 *
 * @param BaseApplication the application which should adopt this mixin functionality.
 * @returns the resulting application with this mixin functionality applied.
 */
export function SvelteApplicationMixin<
  TContext extends Partial<{
    tabs: Tab[];
    customContent: RegisteredContent<TContext>[];
  }>
>(BaseApplication: any) {
  class SvelteApplication extends BaseApplication {
    /** The component which represents the UI. */
    #components: SvelteComponent[] = [];

    #customHTMLTags: string[] = ['PROSE-MIRROR'];

    #customContentRenderer: CustomContentRendererV2 =
      new CustomContentRendererV2();

    // TODO: Figure out best way to incorporate this into the options.
    _useHeaderSheetLock: boolean = false;

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
    _getSubscriptions(): Unsubscriber[] {
      return [];
    }

    /**
     * Triggers possible reactive rendering by updating the application store
     * with the latest context data.
     *
     * Renders non-Svelte sheet parts in preparation for injecting custom content during the HTML replacement phase.
     *
     * @returns any non-Svelte sheet parts that need to be rendered to the sheet.
     */
    async _renderHTML(
      context: TContext,
      options: ApplicationRenderOptions
    ): Promise<RenderResult<TContext>> {
      debug('Group Sheet context data', context);
      this._store.set(context);

      // Allow svelte to process its synchronous microtask changes before entertaining custom content.
      await delay(0);

      let result: RenderResult<TContext> = {
        context: context,
        customContents: [],
      };

      try {
        const renderedTabParts = context.tabs
          ? await this.#customContentRenderer.renderTabContents(
              context.tabs,
              context,
              options
            )
          : [];
        const renderedContentParts = context.customContent
          ? await this.#customContentRenderer.renderCustomContent(
              context.customContent,
              context,
              options
            )
          : [];
        result.customContents = [...renderedTabParts, ...renderedContentParts];
      } catch (e) {
        error(
          'An error occurred while rendering custom tabs and content.',
          false,
          e
        );
      }

      return result;
    }

    /**
     * Creates and mounts the Svelte component on first render.
     * Removes handlebars content so that it can be reinserted on the appropriate render hook.
     * @param result rendered sheets parts which are ready to be placed on the page
     * @param content the window content area
     * @param options render options
     */
    _replaceHTML(
      result: RenderResult<TContext>,
      content: HTMLElement,
      options: ApplicationRenderOptions
    ) {
      if (options.isFirstRender) {
        this.#components.push(this._createComponent(content));
        if (this._useHeaderSheetLock) {
          const windowHeader = this.element.querySelector('.window-header');
          const sheetLock = new SheetHeaderEditModeToggle({
            target: windowHeader,
            anchor: windowHeader.querySelector('.window-title'),
            context: new Map<string, any>([
              [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._store],
            ]),
          });
          this.#components.push(sheetLock);
        }
      }

      // TODO: Capture named input focus
      // TODO: Handle scroll memoization?
      try {
        this.#customContentRenderer.replaceCustomContent(
          result.customContents,
          this,
          result.context,
          options
        );
      } catch (e) {
        error(
          'An error occured while replacing custom content on the sheet.',
          false,
          e
        );
      }
    }

    async _renderFrame(options: ApplicationRenderOptions) {
      const element = await super._renderFrame(options);

      try {
        // Support Tidy's common window attributes
        applySheetAttributesToWindow(
          this.actor.documentName,
          this.actor.uuid,
          this.actor.type,
          SettingsProvider.settings.colorScheme.get(),
          element
        );

        // Support injected named inputs
        element.addEventListener(
          'change',
          (ev: InputEvent & { target: HTMLElement }) => {
            if (
              ev.target.matches('input[name], textarea[name], select[name]')
            ) {
              this.submit();
            }
          }
        );
      } catch (e) {
        error(
          'An error occurred while preparing the rendered frame of the application.',
          false,
          { error: e, sheet: this }
        );
      }

      return element;
    }

    _attachFrameListeners() {
      super._attachFrameListeners();

      try {
        // Support Foundry's hotkeys feature by blurring tabindex -1 clicked elements
        blurUntabbableButtonsOnClick(this.element);

        // Manage application subscriptions
        this.#subscriptionsService.unsubscribeAll();
        const subscriptions = this._getSubscriptions();
        this.#subscriptionsService.registerSubscriptions(
          ...subscriptions,
          settingStore.subscribe((settings) => {
            applyThemeDataAttributeToWindow(settings.colorScheme, this.element);
          })
        );
      } catch (e) {
        error(
          'An error occurred while attaching frame listeners for the application.',
          false,
          { error: e, sheet: this }
        );
      }
    }

    _updateFrame(options: ApplicationRenderOptions) {
      options ??= {};
      // For whatever reason, application v2 titles don't update themselves on _updateFrame without an implementing class specifiying window settings.
      FoundryAdapter.mergeObject(options, { window: { title: this.title } });
      super._updateFrame(options);
    }

    async close(options: ApplicationClosingOptions = {}) {
      this.#subscriptionsService.unsubscribeAll();
      this.#components.forEach((c) => c.$destroy());
      this.#components = [];
      await super.close(options);
    }

    _onChangeForm(formConfig: unknown, event: any) {
      super._onChangeForm(formConfig, event);

      if (event.type !== 'change') return;
      if (!this.document) return;

      const { target } = event;
      if (!target) return;

      // TODO: Consider expanding this logic so that named input elements can also be saved according to their input name.
      if (!this.#customHTMLTags.includes(target.tagName)) return;

      const value = target._getValue();
      this.document.update({ [target.name]: value });
    }

    _onRender(...args: any[]) {
      super._onRender(...args);

      // TODO: Perform end-of-render tasks like restoring focus and sroll-top.
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
