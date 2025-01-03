import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { settings } from 'src/settings/settings.svelte';
import {
  applySheetAttributesToWindow,
  applyMutableSettingAttributesToWindow,
  blurUntabbableButtonsOnClick,
} from 'src/utils/applications.svelte';
import { debug, error } from 'src/utils/logging';
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
  ApplicationConfiguration,
  ApplicationHeaderControlsEntry,
  ApplicationClickAction,
} from 'src/types/application.types';
import { HeaderControlsRuntime } from 'src/runtime/header-controls/HeaderControlsRuntime';
import type {
  CustomHeaderControlsEntry,
  SheetHeaderControlPosition,
} from 'src/api/api.types';
import { tick, unmount } from 'svelte';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import { coalesce } from 'src/utils/formatting';
import {
  createHeaderButton,
  insertHeaderButton,
  removeTidyHeaderButtons,
} from 'src/features/sheet-header-controls/header-controls';
import { processInputChangeDelta } from 'src/utils/form';
import { isNil } from 'src/utils/data';

type RenderResult<TContext> = {
  customContents: RenderedSheetPart[];
  context: TContext;
};

const HEADER_CONTROLS_DROPDOWN_SELECTOR = '.controls-dropdown';
const HEADER_CONTROLS_DROPDOWN_EXPANDED_SELECTOR = '.expanded';
const HEADER_CONTROLS_DROPDOWN_TOGGLE_SELECTOR =
  '[data-action="toggleControls"]';

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
    #components: Record<string, any>[] = [];

    #customHTMLTags: string[] = ['PROSE-MIRROR'];

    #customContentRenderer: CustomContentRendererV2 =
      new CustomContentRendererV2();

    #scrollPositions: Record<string, PriorElementScrollPosition[]> = {};

    #focusedInputSelector: string | undefined = '';

    /**
     * Compatibility shim from Application V1.
     */
    get object() {
      return this.document;
    }

    /* -------------------------------------------- */
    /*  Svelte-specific                             */
    /* -------------------------------------------- */

    /**
     * The context store which underpins the application Svelte component.
     * This store is made available as Svelte context to the component
     * and can be retrieved from any child component within.
     */
    _context = new CoarseReactivityProvider<TContext | undefined>(undefined);

    /** Creates the component which represents the window content area. */
    _createComponent(node: HTMLElement): Record<string, any> {
      const errorMessage =
        'Unable to render Svelte application. To implement a Svelte application, override _createComponent and provide context data matching the specified sheet context type.';
      throw new Error(errorMessage);
    }

    _createAdditionalComponents(content: HTMLElement): Record<string, any>[] {
      return [];
    }

    /**
     * Allows for configuring any effects related to the sheet.
     */
    _configureEffects(): void {}

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
      this._context.data = context;

      if (options.isFirstRender) {
        const content = this.hasFrame
          ? this.element.querySelector('.window-content')
          : this.element;
        this.#components.push(this._createComponent(content));
        this.#components.push(...this._createAdditionalComponents(content));
      }

      // Allow svelte to process its synchronous microtask changes before entertaining custom content.
      await tick();

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

      if (this.document) {
        try {
          // Support Tidy's common window attributes
          applySheetAttributesToWindow(
            this.document.documentName,
            this.document.uuid,
            this.document.type,
            element
          );

          // Support injected named inputs
          element.addEventListener(
            'change',
            (ev: InputEvent & { target: HTMLInputElement }) => {
              if (
                ev.target.matches('input[name], textarea[name], select[name]')
              ) {
                this.submit();
                return;
              }

              if (
                ev.target.matches(
                  'input[data-name], textarea[data-name], select[data-name]'
                )
              ) {
                this._submitEmbeddedDocumentChange(ev);
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
      } else {
        debug(
          'Skipping common window attributes and form submit shim. No document provided.'
        );
      }

      return element;
    }

    async _submitEmbeddedDocumentChange(
      event: InputEvent & { target: HTMLInputElement }
    ) {
      const itemId =
        event.target.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
      if (itemId) {
        await this._submitEmbeddedItemChange(event, itemId);
      }
    }

    async _submitEmbeddedItemChange(
      event: InputEvent & { target: HTMLInputElement },
      itemId: string
    ) {
      event.stopImmediatePropagation();

      const item = await this.getItem(itemId);
      const field = event.target.getAttribute('data-name')!;

      let valueToSave: string | number = event.target.value;

      // For deltas, parse the resulting delta value
      if (event.target.matches('[inputmode="numeric"]')) {
        valueToSave = processInputChangeDelta(
          event.target.value,
          item,
          field
        )?.toString();
      }

      // For numeric changes, enforce min/max on the value to save
      if (event.target.matches('[inputmode="numeric"], [type="number"]')) {
        const minAttribute = event.target.getAttribute('min');
        const min = !isNil(minAttribute, '') ? Number(minAttribute) : -Infinity;

        const maxAttribute = event.target.getAttribute('max');
        const max = !isNil(maxAttribute, '') ? Number(maxAttribute) : Infinity;

        const valueAsNumber = Number(valueToSave);
        valueToSave = Math.clamp(valueAsNumber, min, max);

        if (item && !Number.isNaN(valueToSave)) {
          event.target.value = valueToSave?.toString();
        }
      }

      // Save the value to the document, whatever that value ultimately became
      item.update({ [field]: valueToSave });
    }

    getItem(id: string) {
      if (this.document.type === 'container')
        return this.document.system.getContainedItem(id);
      return this.document.items.get(id);
    }

    _updateFrame(options: ApplicationRenderOptions) {
      options ??= {};

      // Remove header bar controls
      removeTidyHeaderButtons(this.window.header);

      // Add header bar controls
      this._getVisibleHeaderControlsForPosition('header').forEach((x) =>
        insertHeaderButton(
          this,
          this.window.header,
          createHeaderButton(x.label, x.action ?? '', x.icon)
        )
      );

      // For whatever reason, application v2 titles don't update themselves on _updateFrame without an implementing class specifiying window settings.
      FoundryAdapter.mergeObject(options, {
        window: {
          title: this.title,
          // TODO: Determine whether it's bad to keep this true always
          controls: true,
        },
      });

      super._updateFrame(options);
    }

    /* -------------------------------------------- */
    /*  Closing                                     */
    /* -------------------------------------------- */

    async close(options: ApplicationClosingOptions = {}) {
      this._effectCleanup?.();
      // Trigger saving of the form if configured and allowed
      const submit = this.options.submitOnClose && this.document.isOwner;
      if (submit) {
        await this.submit({ preventClose: true, preventRender: true });
      }

      await super.close(options);

      this.#components.forEach((c) => unmount(c));
      this.#components = [];
    }

    /* -------------------------------------------- */
    /*  Rendering Life-Cycle Methods                */
    /* -------------------------------------------- */

    _onRender(context: TContext, options: ApplicationRenderOptions) {
      super._onRender(context, options);

      // Some integrations will insert HTML even beyond this point,
      // so breaking off the current task gives another chance to restore state.
      setTimeout(() => {
        this.#restoreScrollPositions(this.element);
        this.#restoreInputFocus(this.element);
      });
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */
    _effectCleanup?: () => void;
    _attachFrameListeners() {
      super._attachFrameListeners();

      try {
        // Support Foundry's hotkeys feature by blurring tabindex -1 clicked elements
        blurUntabbableButtonsOnClick(this.element);

        // Manage application effects
        this._effectCleanup?.();
        this._effectCleanup = $effect.root(() => {
          this._configureEffects();

          $effect(() => {
            applyMutableSettingAttributesToWindow(settings.value, this.element);
          });
        });

        // If a controls dropdown button is clicked, close the controls dropdown.
        this.element.addEventListener('click', (ev: MouseEvent) => {
          const target = ev.target;
          if (!(target instanceof HTMLElement)) {
            return;
          }

          if (target.closest(`${HEADER_CONTROLS_DROPDOWN_SELECTOR} button`)) {
            this.toggleControls(false);
          }
        });
        this.element
          .querySelector(HEADER_CONTROLS_DROPDOWN_SELECTOR)
          ?.addEventListener(
            'focusout',
            (
              ev: FocusEvent & {
                currentTarget: HTMLElement;
                relatedTarget?: HTMLElement;
              }
            ) => {
              if (
                ev.relatedTarget?.closest(
                  `${HEADER_CONTROLS_DROPDOWN_SELECTOR}, ${HEADER_CONTROLS_DROPDOWN_TOGGLE_SELECTOR}`
                )
              ) {
                return;
              }

              if (
                !ev.currentTarget.matches(
                  HEADER_CONTROLS_DROPDOWN_EXPANDED_SELECTOR
                )
              ) {
                return;
              }

              this.toggleControls(false);
            },
            {}
          );
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
     * Augments the base toggleControls with handling for closing menu when focus is lost.
     */
    toggleControls(expanded: boolean | undefined) {
      super.toggleControls(expanded);

      const controlsDropdown = this.element.querySelector(
        HEADER_CONTROLS_DROPDOWN_SELECTOR
      );
      const menuIsExpanded = controlsDropdown?.matches(
        HEADER_CONTROLS_DROPDOWN_EXPANDED_SELECTOR
      );
      if (menuIsExpanded) {
        debug('App V2 - On Menu Opened');
        controlsDropdown.tabIndex = 0;
        controlsDropdown.focus();
      } else if (controlsDropdown) {
        debug('App V2 - On Menu Closed');
        controlsDropdown.blur();
        controlsDropdown.tabIndex = -1;
      }
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
      >(':is(input, select, textarea):focus');

      this.#focusedInputSelector = focusedElement?.name
        ? `${focusedElement.tagName}[name="${focusedElement.name}"]`
        : focusedElement?.id
        ? `[id="${focusedElement.id}"]`
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

    _initializeApplicationOptions(options: ApplicationConfiguration) {
      const updatedOptions = super._initializeApplicationOptions(
        options
      ) as ApplicationConfiguration;

      try {
        const customControls = this._getCustomHeaderControls(options.document);

        /* 
          Rather than update the source object, make a new one and spread the actions across.
          Otherwise, it has a chance of updating DEFAULT_OPTIONS.
          For controls, that causes the same control to be added each time the constructor fires.
          Assigning a new set of actions and controls will avoid any surprise mutations.
        */
        updatedOptions.actions = {
          ...updatedOptions.actions,
          ...customControls.actions,
        };
        updatedOptions.window.controls = [
          ...(updatedOptions.window.controls ?? []),
          ...customControls.controls,
        ];
      } catch (e) {
        error('An error occurred while setting up custom controls.', false, {
          error: e,
          app: this,
          options: updatedOptions,
        });
      }

      return updatedOptions;
    }

    _getCustomHeaderControls(document: any): { controls: any[]; actions: any } {
      const controls: ApplicationHeaderControlsEntry[] = [];
      const actions: Record<
        string,
        | ApplicationClickAction
        | {
            handler: ApplicationClickAction;
            buttons: number[];
          }
      > = {};

      // TODO: Figure out how we're going to handle this for apps without documents. Having it in the core mixin seems wrong.
      if (!document) {
        debug('Skipping custom header controls. No document provided');
        return {
          actions,
          controls,
        };
      }

      const customControls = HeaderControlsRuntime.getHeaderControls({
        documentName: document.documentName,
        documentType: document.type,
      });

      for (let control of customControls) {
        const actionId = `custom-control-action-${foundry.utils.randomID()}`;

        control.action = control.action ?? actionId;

        if (control.onClickAction) {
          actions[control.action ?? actionId] =
            control.onClickAction?.bind(this);
        }

        controls.push(control as ApplicationHeaderControlsEntry);
      }

      return {
        controls,
        actions,
      };
    }

    /**
     * Configure the array of header control menu options
     */
    _getHeaderControls() {
      return this._getVisibleHeaderControlsForPosition('menu');
    }

    _getVisibleHeaderControlsForPosition(
      position: SheetHeaderControlPosition
    ): CustomHeaderControlsEntry[] {
      const controls = super._getHeaderControls();
      return controls.filter((c: CustomHeaderControlsEntry) => {
        try {
          return (
            (typeof c.visible !== 'function' || c.visible.call(this)) &&
            coalesce(c.position, 'menu') === position
          );
        } catch (e) {
          error('Failed to get custom control', false, {
            control: c,
            error: e,
          });
          return false;
        }
      });
    }
  }

  return SvelteApplication;
}

interface PriorElementScrollPosition {
  scrollTop: number;
  scrollLeft: number;
}
