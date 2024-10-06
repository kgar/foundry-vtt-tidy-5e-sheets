import { StoreSubscriptionsService } from 'src/features/store/StoreSubscriptionsService';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider } from 'src/settings/settings';
import {
  applySheetAttributesToWindow,
  applyThemeDataAttributeToWindow,
  blurButtonsOnClick,
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
import type { Tab } from 'src/types/types';
import { delay } from 'src/utils/asynchrony';
import type { RegisteredContent } from 'src/runtime/types';
import type {
  ApplicationRenderOptions,
  ApplicationClosingOptions,
} from 'src/types/application.types';

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
    constructor(...args: any[]) {
      super(...args);

      this.#subscriptionsService = new StoreSubscriptionsService();
    }

    /**
     * An array of selectors within this sheet whose scroll positions should
     * be persisted during a re-render operation.
     */
    static SCROLLABLE: string[] = [
      '.scroll-container',
      '[data-tidy-track-scroll-y]',
    ];

    /**
     * Determines whether to use a sheet lock svelte component in the header.
     * This requires the application to mount another svelte component.
     */
    static USE_HEADER_SHEET_LOCK: boolean = false;

    /** The component which represents the UI. */
    #components: SvelteComponent[] = [];

    #customHTMLTags: string[] = ['PROSE-MIRROR'];

    #customContentRenderer: CustomContentRendererV2 =
      new CustomContentRendererV2();

    /**
     * Any subscriptions which should be managed during the lifetime of the application window.
     * They are retrieved once, during _renderFrame, and then unsubscribed during close.
     */
    #subscriptionsService: StoreSubscriptionsService;

    #scrollPositions: Record<string, PriorElementScrollPosition[]> = {};

    #focusedInputSelector: string | undefined = '';

    /* -------------------------------------------- */
    /*  Svelte-specific                             */
    /* -------------------------------------------- */

    /**
     * The context store which underpins the application Svelte component.
     * This store is made available as Svelte context to the component
     * and can be retrieved from any child component within.
     */
    _store: Writable<TContext> = writable<TContext>();

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

    /* -------------------------------------------- */
    /*  Rendering                                   */
    /* -------------------------------------------- */

    /** Prepares context data which matches the request data type. */
    async _prepareContext(
      options: ApplicationRenderOptions
    ): Promise<TContext> {
      const errorMessage =
        'Unable to render Svelte application. To implement a Svelte application, override _prepareContext and provide context data matching the specified sheet context type.';
      error(errorMessage, false, { options });
      throw new Error(errorMessage);
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
        const thisConstructor = this.constructor as typeof SvelteApplication;
        if (thisConstructor.USE_HEADER_SHEET_LOCK) {
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

      try {
        this.#saveScrollPositions(content);
        this.#saveInputFocus(content);
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

    _updateFrame(options: ApplicationRenderOptions) {
      options ??= {};
      // For whatever reason, application v2 titles don't update themselves on _updateFrame without an implementing class specifiying window settings.
      FoundryAdapter.mergeObject(options, { window: { title: this.title } });
      super._updateFrame(options);
    }

    /* -------------------------------------------- */
    /*  Closing                                     */
    /* -------------------------------------------- */

    async close(options: ApplicationClosingOptions = {}) {
      this.#subscriptionsService.unsubscribeAll();
      this.#components.forEach((c) => c.$destroy());
      this.#components = [];
      await super.close(options);
    }

    /* -------------------------------------------- */
    /*  Rendering Life-Cycle Methods                */
    /* -------------------------------------------- */

    _onRender(...args: any[]) {
      super._onRender(...args);

      this.#restoreScrollPositions(this.element);
      this.#restoreInputFocus(this.element);
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */

    _attachFrameListeners() {
      super._attachFrameListeners();

      try {
        if (!SettingsProvider.settings.useAccessibleKeyboardSupport.get()) {
          blurButtonsOnClick(this.element);
        }

        // Manage application subscriptions
        this.#subscriptionsService.unsubscribeAll();
        const subscriptions = this._getSubscriptions();
        this.#subscriptionsService.registerSubscriptions(
          ...subscriptions,

          SettingsProvider.getSettingsChangedSubscription(this, () => {
            applyThemeDataAttributeToWindow(
              SettingsProvider.settings.colorScheme.get(),
              this.element
            );
            this.render();
          })
        );

        // If a controls dropdown button is clicked, close the controls dropdown.
        this.element.addEventListener('click', (ev: MouseEvent) => {
          const target = ev.target;
          if (!(target instanceof HTMLElement)) {
            return;
          }

          if (target.closest('.controls-dropdown button')) {
            super.toggleControls(false);
          }
        });
      } catch (e) {
        error(
          'An error occurred while attaching frame listeners for the application.',
          false,
          { error: e, sheet: this }
        );
      }
    }

    _onChangeForm(formConfig: unknown, event: any) {
      super._onChangeForm(formConfig, event);

      if (event.type !== 'change') {
        return;
      }
      if (!this.document) {
        return;
      }

      const { target } = event;
      if (!target) {
        return;
      }

      if (!this.#customHTMLTags.includes(target.tagName)) {
        return;
      }

      const value = target._getValue();
      this.document.update({ [target.name]: value });
    }

    /**
     * Augments the base toggleControls with "Click Outside" handling to close the dropdown.
     */
    toggleControls(expanded: boolean | undefined) {
      // If the controls dropdown is being opened,
      // listen for clicks outside of the controls dropdown.
      // If the user clicks anywhere outside the dropdown, close it.
      if (this.element.querySelector('.controls-dropdown:not(.expanded)')) {
        if (expanded === undefined || expanded === true) {
          const controller = new AbortController();
          window.addEventListener(
            'click',
            (ev: MouseEvent) => {
              if (!(ev.target instanceof HTMLElement)) {
                return;
              }

              const controls = this.element.querySelector(
                '.controls-dropdown'
              ) as HTMLElement;

              if (!controls || !controls.contains(ev.target)) {
                controller.abort();
                super.toggleControls(false);
              }
            },
            {
              signal: controller.signal,
            }
          );
        }
      }

      super.toggleControls(expanded);
    }

    /* -------------------------------------------- */
    /*  Prior Element State                         */
    /* -------------------------------------------- */

    /**
     * Persist the scroll positions of containers within the app before re-rendering the content
     * @param element the application window element
     */
    #saveScrollPositions(element: HTMLElement) {
      const selectors = SvelteApplication.SCROLLABLE || [];
      this.#scrollPositions = selectors.reduce<
        Record<string, PriorElementScrollPosition[]>
      >((state, sel) => {
        const scrollableElements = element.querySelectorAll<HTMLElement>(sel);
        state[sel] = Array.from(
          scrollableElements
        ).map<PriorElementScrollPosition>((el) => ({
          scrollTop: el.scrollTop,
          scrollLeft: el.scrollLeft,
        }));
        return state;
      }, {});
    }

    /**
     * Restore the scroll positions of containers within the app after re-rendering the content
     * @param element the application window element
     */
    #restoreScrollPositions(element: HTMLElement) {
      const selectors = SvelteApplication.SCROLLABLE || [];
      const positions = this.#scrollPositions || {};
      for (let sel of selectors) {
        const scrollableElements = element.querySelectorAll(sel);
        for (let [index, el] of Array.from(scrollableElements).entries()) {
          Object.assign(el, positions[sel]?.[index]);
        }
      }
    }

    /**
     * Persist the currently focused element, if any.
     * @param element the application window element
     */
    #saveInputFocus(element: HTMLElement) {
      const focusedElement = element.querySelector<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >(':focus');

      this.#focusedInputSelector = focusedElement?.id
        ? `#${focusedElement.id}`
        : focusedElement?.name
        ? `${focusedElement.tagName}[name="${focusedElement.name}"]`
        : undefined;
    }

    /**
     * Restore focus to the prior focused element, if able.
     * @param element the application window element
     */
    #restoreInputFocus(element: HTMLElement) {
      if (this.#focusedInputSelector) {
        const newFocus = element.querySelector<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >(this.#focusedInputSelector);

        if (newFocus) {
          newFocus.focus?.();
        }
      }
    }
  }

  return SvelteApplication;
}

interface PriorElementScrollPosition {
  scrollTop: number;
  scrollLeft: number;
}
