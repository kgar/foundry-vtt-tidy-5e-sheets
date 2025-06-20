import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { RegisteredContent } from 'src/runtime/types';
import type {
  ApplicationClickAction,
  ApplicationClosingOptions,
  ApplicationConfiguration,
  ApplicationHeaderControlsEntry,
  ApplicationPosition,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import type {
  CustomContent,
  DocumentSheetV2Context,
  Tab,
} from 'src/types/types';
import { error } from 'src/utils/logging';
import type { RenderResult } from './SvelteApplicationMixin.svelte';
import { CustomContentRendererV2 } from 'src/sheets/CustomContentRendererV2';
import { tick } from 'svelte';
import {
  applySheetAttributesToWindow,
  applyThemeToApplication,
} from 'src/utils/applications.svelte';
import { isNil } from 'src/utils/data';
import { processInputChangeDelta } from 'src/utils/form';
import type {
  CustomHeaderControlsEntry,
  SheetHeaderControlPosition,
} from 'src/api/api.types';
import { coalesce } from 'src/utils/formatting';
import { HeaderControlsRuntime } from 'src/runtime/header-controls/HeaderControlsRuntime';
import {
  createHeaderButton,
  insertHeaderButton,
  removeTidyHeaderButtons,
} from 'src/features/sheet-header-controls/header-controls';
import { CONSTANTS } from 'src/constants';
import { DragAndDropMixin, type DropEffectValue } from './DragAndDropBaseMixin';
import { ThemeSettingsQuadroneApplication } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';

export type TidyDocumentSheetRenderOptions = ApplicationRenderOptions & {
  mode?: number;
};

/**
 * A mixin which fills in the extensibility and common functionality
 * for Tidy actor and item sheets.
 */
export function TidyExtensibleDocumentSheetMixin<
  TConstructorArgs extends Partial<ApplicationConfiguration> | undefined,
  TContext extends Partial<{
    tabs: Tab[];
    customContent: CustomContent[];
  }>
>(sheetType: string, BaseApplication: any) {
  class TidyDocumentSheet extends DragAndDropMixin(BaseApplication) {
    _mode = $state<number | undefined>();

    constructor(options: TConstructorArgs) {
      super(options);
    }

    static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
      window: {
        controls: [
          {
            icon: 'fa-solid fa-palette',
            label: 'TIDY5E.ThemeSettings.SheetMenu.buttonLabel',
            action: 'themeSettings',
            ownership: 'OWNER',
          },
        ],
      },
      actions: {
        themeSettings: async function (this: TidyDocumentSheet) {
          await new ThemeSettingsQuadroneApplication({
            document: this.document,
          }).render({
            force: true,
          });
        },
      },
    };

    get sheetMode() {
      return this._mode;
    }

    /**
     * An array of selectors within this sheet whose scroll positions should
     * be persisted during a re-render operation.
     */
    static SCROLLABLE: string[] = [
      '.scroll-container',
      '[data-tidy-track-scroll-y]',
    ];

    #customHTMLTags: string[] = ['PROSE-MIRROR'];

    #customContentRenderer: CustomContentRendererV2 =
      new CustomContentRendererV2();

    #scrollPositions: Record<string, PriorElementScrollPosition[]> = {};

    #focusedInputSelector: string | undefined = '';

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

    async #persistSheetPositionPreferences(position?: ApplicationPosition) {
      if (!position || this.minimized) {
        return;
      }

      const { width, height } = position;

      const { width: configuredWidth, height: configuredHeight } =
        SheetPreferencesService.getByType(sheetType);

      if (width !== configuredWidth) {
        await SheetPreferencesService.setDocumentTypePreference(
          sheetType,
          'width',
          width
        );
      }

      if (height !== configuredHeight) {
        await SheetPreferencesService.setDocumentTypePreference(
          sheetType,
          'height',
          height
        );
      }
    }

    #debouncePersistSheetPositionPreferences = FoundryAdapter.debounce(
      this.#persistSheetPositionPreferences.bind(this),
      1000
    );

    _onPosition(position: ApplicationPosition) {
      super._onPosition(position);

      this.#debouncePersistSheetPositionPreferences(position);
    }

    _configureRenderOptions(options: TidyDocumentSheetRenderOptions) {
      super._configureRenderOptions(options);

      // Configure Sheet Mode
      let mode = options?.mode;

      if (mode === undefined && options.renderContext === 'createItem') {
        mode = CONSTANTS.SHEET_MODE_EDIT;
      }

      this._mode = mode ?? this._mode ?? CONSTANTS.SHEET_MODE_PLAY;
    }

    async _prepareContext(
      options: Partial<TidyDocumentSheetRenderOptions>
    ): Promise<DocumentSheetV2Context> {
      const context = await super._prepareContext(options);

      return {
        ...context,
        unlocked:
          this.sheetMode === CONSTANTS.SHEET_MODE_EDIT && this.isEditable,
      } as DocumentSheetV2Context;
    }

    async _renderHTML(
      context: TContext,
      options: TidyDocumentSheetRenderOptions
    ): Promise<RenderResult<TContext>> {
      const result = await super._renderHTML(context, options);

      // Allow svelte to process its synchronous microtask changes before entertaining custom content.
      await tick();

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

    _toggleDisabled(disabled: boolean) {
      // Ignored. Svelte/Tidy handles this.
    }

    async _renderFrame(options: TidyDocumentSheetRenderOptions) {
      const element = await super._renderFrame(options);

      try {
        // Support Tidy's common window attributes
        applySheetAttributesToWindow(
          this.document.documentName,
          this.document.uuid,
          this.document.type,
          element
        );

        applyThemeToApplication(element, this.document);

        // Support injected named inputs
        element.addEventListener(
          'change',
          async (ev: InputEvent & { target: HTMLInputElement }) => {
            if (
              ev.target.matches('input[name], textarea[name], select[name]') &&
              // Supports radio button group opt-out of this feature
              !ev.target.hasAttribute('data-skip-submit')
            ) {
              await this.submit();
              return;
            }

            if (
              ev.target.matches(
                'input[data-name], textarea[data-name], select[data-name]'
              )
            ) {
              await this._submitEmbeddedDocumentChange(ev);
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

    _updateFrame(options: TidyDocumentSheetRenderOptions) {
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
          controls: true,
        },
      });

      super._updateFrame(options);
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
      await item.update({ [field]: valueToSave });
    }

    getItem(id: string) {
      if (this.document.type === 'container')
        return this.document.system.getContainedItem(id);
      return this.document.items.get(id);
    }

    /**
     * Removes handlebars content so that it can be reinserted on the appropriate render hook.
     * @param result rendered sheets parts which are ready to be placed on the page
     * @param content the window content area
     * @param options render options
     */
    _replaceHTML(
      result: RenderResult<TContext>,
      content: HTMLElement,
      options: TidyDocumentSheetRenderOptions
    ) {
      super._replaceHTML(result, content, options);

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

    /* -------------------------------------------- */
    /*  Sheet Mode Management                       */
    /* -------------------------------------------- */

    /**
     * Changes the user toggling the sheet mode.
     * @protected
     */
    async changeSheetMode(mode: number) {
      this._mode = mode;
      await this.submit();
      this.render();
    }

    /**
     * Toggles the user's sheet mode relative to the current mode.
     * @protected
     */
    async toggleSheetMode() {
      const newMode =
        this._mode === CONSTANTS.SHEET_MODE_PLAY
          ? CONSTANTS.SHEET_MODE_EDIT
          : CONSTANTS.SHEET_MODE_PLAY;

      await this.changeSheetMode(newMode);
    }

    /* -------------------------------------------- */
    /*  Closing                                     */
    /* -------------------------------------------- */

    async close(options: ApplicationClosingOptions = {}) {
      // Trigger saving of the form if configured and allowed
      const submit =
        this.options.submitOnClose && this.document.isOwner && this.isEditable;

      if (submit) {
        try {
          await this.submit({ preventClose: true, preventRender: true });
        } catch (e) {
          error('An error occurred while submitting changes', false, e);
        }
      }

      await super.close(options);
    }

    /* -------------------------------------------- */
    /*  Rendering Life-Cycle Methods                */
    /* -------------------------------------------- */
    // settingsChangeHookId?: number;

    /**
     * Attach event listeners to the Application frame.
     * @protected
     */
    _attachFrameListeners() {
      game.user.apps[this.id] = this;

      super._attachFrameListeners();
    }

    async _onRender(
      context: TContext,
      options: TidyDocumentSheetRenderOptions
    ) {
      await super._onRender(context, options);

      // Some integrations will insert HTML even beyond this point,
      // so breaking off the current task gives another chance to restore state.
      setTimeout(() => {
        if (this.element) {
          this.#restoreScrollPositions(this.element);
          this.#restoreInputFocus(this.element);
        }
      });
    }

    /**
     * Actions performed after closing the Application.
     * Post-close steps are not awaited by the close process.
     * @param {RenderOptions} options Provided render options
     * @protected
     */
    _onClose(options: TidyDocumentSheetRenderOptions) {
      delete game.user.apps[this.id];

      super._onClose(options);
    }

    /* -------------------------------------------- */
    /*  Prior Element State                         */
    /* -------------------------------------------- */

    /**
     * Persist the scroll positions of containers within the app before re-rendering the content
     * @param element the application window element
     */
    #saveScrollPositions(element: HTMLElement) {
      const selectors = TidyDocumentSheet.SCROLLABLE || [];
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
      const selectors = TidyDocumentSheet.SCROLLABLE || [];
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

      let selector = '';

      if (focusedElement?.name) {
        selector += `${focusedElement.tagName}[name="${focusedElement.name}"]`;
      }

      if (focusedElement?.id) {
        selector += `[id="${focusedElement.id}"]`;
      }

      this.#focusedInputSelector = selector !== '' ? selector : undefined;
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

    /* -------------------------------------------- */
    /*  Application Initialization                  */
    /* -------------------------------------------- */

    _initializeApplicationOptions(options: ApplicationConfiguration) {
      const updatedOptions = super._initializeApplicationOptions(
        options
      ) as ApplicationConfiguration;

      const effectiveControls = [...(updatedOptions.window?.controls ?? [])];
      const effectiveActions = { ...(updatedOptions.actions ?? {}) };

      try {
        const { width, height } = SheetPreferencesService.getByType(sheetType);

        const position = (updatedOptions.position ??= {});

        if (width) {
          position.width = width;
        }

        if (height) {
          position.height = height;
        }

        const customControls = this._getCustomHeaderControls(
          updatedOptions.document
        );

        /* 
          Rather than update the source object, make a new one and spread the actions across.
          Otherwise, it has a chance of updating DEFAULT_OPTIONS.
          For controls, that causes the same control to be added each time the constructor fires.
          Assigning a new set of actions and controls will avoid any surprise mutations.
        */
        updatedOptions.actions = {
          ...effectiveActions,
          ...customControls.actions,
        };
        updatedOptions.window.controls = [
          ...effectiveControls,
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

    /* -------------------------------------------- */
    /*  Header Control Management                   */
    /* -------------------------------------------- */

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

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */

    /**
     * Adds a document when only one creation type is available. Presents the item creation dialog when multiple are available.
     * @param args The tab where this Add operation is occurring, and other optional parameters.
     */
    async _addDocument(args: {
      tabId: string;
      customSection?: string;
      creationItemTypes?: string[];
      data?: Record<string, any>;
    }): Promise<any> {}

    /* -------------------------------------------- */
    /*  Drag and Drop                               */
    /* -------------------------------------------- */

    _allowedDropBehaviors(event: DragEvent, data: any) {
      if (!data.uuid) {
        return new Set<DropEffectValue>(['copy', 'link']);
      }

      const allowed = new Set<DropEffectValue>(['copy', 'move', 'link']);
      const s = foundry.utils.parseUuid(data.uuid);
      const t = foundry.utils.parseUuid(this.document.uuid);
      const sCompendium =
        s.collection instanceof
        foundry.documents.collections.CompendiumCollection;
      const tCompendium =
        t.collection instanceof
        foundry.documents.collections.CompendiumCollection;

      // If either source or target are within a compendium, but not inside the same compendium, move not allowed
      if ((sCompendium || tCompendium) && s.collection !== t.collection) {
        allowed.delete('move');
      }

      return allowed;
    }

    _defaultDropBehavior(
      event: DragEvent & { currentTarget: HTMLElement; target: HTMLElement },
      data: any
    ): DropEffectValue {
      if (!data.uuid) {
        return 'copy';
      }

      const d = foundry.utils.parseUuid(data.uuid);
      const t = foundry.utils.parseUuid(this.document.uuid);
      const base = d.embedded?.length ? 'document' : 'primary';

      return d.collection === t.collection &&
        d[`${base}Id`] === t[`${base}Id`] &&
        d[`${base}Type`] === t[`${base}Type`]
        ? 'move'
        : 'copy';
    }
  }

  return TidyDocumentSheet;
}

interface PriorElementScrollPosition {
  scrollTop: number;
  scrollLeft: number;
}
