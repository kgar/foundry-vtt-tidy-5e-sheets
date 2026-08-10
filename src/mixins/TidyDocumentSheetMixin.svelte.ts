import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  ApplicationClickAction,
  ApplicationClosingOptions,
  ApplicationConfiguration,
  ApplicationHeaderControlsEntry,
  ApplicationPosition,
  ApplicationRenderOptions,
  DocumentSheetConfiguration,
} from 'src/types/application.types';
import type {
  ActiveEffect5e,
  Actor5e,
  CustomContent,
  DocumentSheetV2Context,
  Tab,
  TidySectionBase,
} from 'src/types/types';
import { error, warn } from 'src/utils/logging';
import type { RenderResult } from './SvelteApplicationMixin.svelte';
import {
  CustomContentRendererV2,
  type RenderedSheetPart,
} from 'src/sheets/CustomContentRendererV2';
import { tick } from 'svelte';
import { applySheetAttributesToWindow } from 'src/utils/applications.svelte';
import type {
  CustomHeaderControlsEntry,
  SheetHeaderControlPosition,
} from 'src/api/api.types';
import { coalesce } from 'src/utils/formatting';
import type { HeaderControlConfiguration } from 'src/settings/settings.types';
import { HeaderControlsRuntime } from 'src/runtime/header-controls/HeaderControlsRuntime';
import {
  insertHeaderButton,
  removeTidyHeaderButtons,
} from 'src/features/sheet-header-controls/header-controls';
import { CONSTANTS } from 'src/constants';
import {
  getDragAndDropMixin,
  type DropEffectValue,
} from './DragAndDropBaseMixin';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { SettingsProvider } from 'src/settings/settings.svelte';
import type { Item5e } from 'src/types/item.types';
import { TidySheetSettingsQuadroneApplication } from 'src/applications/settings/sheet/TidySheetSettingsQuadroneApplication.svelte';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import { isUserInteractable } from 'src/utils/element';

export type TidyDocumentSheetRenderOptions = ApplicationRenderOptions & {
  mode?: number;
};

export type TidyExtensibleDocumentSheetMixinInstance = InstanceType<
  ReturnType<typeof getTidyExtensibleDocumentSheetMixin>
>;

/**
 * A mixin which fills in the extensibility and common functionality
 * for Tidy actor and item sheets.
 */
export function getTidyExtensibleDocumentSheetMixin<
  TConstructorArgs extends Partial<ApplicationConfiguration> | undefined,
  TContext extends Partial<{
    tabs: Tab[];
    customContent: CustomContent[];
  }>,
>(sheetType: string, BaseApplication: any) {
  class TidyDocumentSheet extends getDragAndDropMixin(BaseApplication) {
    // TODO: Remove _fixedMode when classic sheets are gone
    _fixedMode: number | undefined;
    _mode = $state<number | undefined>();
    _headerControlSettings: Map<string, SheetHeaderControlPosition> = new Map();
    _sectionForMenu?: TidySectionBase;

    constructor(options: TConstructorArgs) {
      super(options);
    }

    static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
      form: {
        submitOnChange: true,
      },
      window: {
        controls: [],
      },
      actions: {
        'activity-use': TidyDocumentSheet.#useActivity,
        configureTab: TidyDocumentSheet.#configureTab,
        currency: TidyDocumentSheet.#currency,
        deleteDocument: TidyDocumentSheet.#deleteDocument,
        editDocument: TidyDocumentSheet.#showDocument,
        editImage: TidyDocumentSheet.#editImage,
        increase: TidyDocumentSheet.#increase,
        decrease: TidyDocumentSheet.#decrease,
        recharge: TidyDocumentSheet.#recharge,
        sheetSettings: TidyDocumentSheet.#sheetSettings,
        showContextMenu: TidyDocumentSheet.#showContextMenu,
        showDocument: TidyDocumentSheet.#showDocument,
        toggle: TidyDocumentSheet.#toggle,
        togglePip: TidyDocumentSheet.#togglePip,
        'transfer-currency': TidyDocumentSheet.#transferCurrency,
        use: TidyDocumentSheet.#useItem,
      },
    };

    get sheetMode() {
      return this._fixedMode ?? this._mode;
    }

    set sheetMode(value) {
      if (this._fixedMode !== undefined) {
        return;
      }
      this._mode = value;
    }

    /**
     * An array of selectors within this sheet whose scroll positions should
     * be persisted during a re-render operation.
     */
    static SCROLLABLE: string[] = [
      '.scroll-container',
      '[data-tidy-track-scroll-y]',
    ];

    _customContentRenderer: CustomContentRendererV2 =
      new CustomContentRendererV2();

    #scrollPositions: Record<string, PriorElementScrollPosition[]> = {};

    #focusedInputSelector: string | undefined = '';

    async _onChangeForm(formConfig: unknown, event: any) {
      if (
        FoundryAdapter.isElementInstanceOf(
          event.target,
          foundry.applications.elements.HTMLSecretBlockElement,
        )
      ) {
        return this._onRevealSecret(event);
      }

      if (event.type !== 'change') {
        return;
      }

      if (!this.document) {
        return;
      }

      if (!event.target) {
        return;
      }

      // Only apply sheet-level processing to inputs that opt into standard Foundry form management via name and data-name attributes.
      const isSelfSufficientInput =
        !event.target.name && !event.target.dataset.name;
      if (isSelfSufficientInput) {
        return;
      }

      const { targetDocument } = this._getDocumentSubmissionInformation(
        event.target,
      );

      // Process delta changes
      if (
        event.target.matches(
          `input:is([name], [data-name]):is([data-dtype="Number"], [inputmode="numeric"], [type="number"])`,
        )
      ) {
        dnd5e.utils.parseInputDelta(event.target, targetDocument);
      }

      try {
        const proceedWithDefaultFormHandling =
          await this._onChangeFormReadyToSave(event);

        if (proceedWithDefaultFormHandling === false) {
          return;
        }

        if (event.target.matches('[data-name]')) {
          await this._onSingleInputChange(event);
          return;
        }

        // TODO: when a save fails, this returns `undefined`. An input with a bogus delta value can be stuck with the inaccurate value until the sheet is closed and reopened. Figure out how to make the input be restored to its intended value cleanly.
        const result = await super._onChangeForm(formConfig, event);
        if (result === undefined) {
          // TODO: if undefined, use `target` to fetch the real value and force-correct the input with bad data
        }
      } catch (e: any) {
        Object.values(e.getAllFailures()).forEach((failure: any) =>
          ui.notifications.error(failure.message),
        );
      }
    }

    /**
     * Optional override for sheet to perform document-specific changes.
     * Return `false` to prevent the default form change save behavior.
     */
    protected async _onChangeFormReadyToSave(
      _event: any,
    ): Promise<false | undefined> {
      return undefined;
    }

    /** @override */
    async _onRevealSecret(event: any) {
      if (super._onRevealSecret(event)) {
        return;
      }

      const { target, uuid } =
        event.target.closest('[data-target]')?.dataset ?? {};

      if (!target) {
        return;
      }

      const doc = uuid ? await fromUuid(uuid) : this.document;

      if (!doc) {
        return;
      }

      const content = foundry.utils.getProperty(doc, target);
      const modified = event.target.toggleRevealed(content);

      doc.update({ [target]: modified });
    }

    async #persistSheetPositionPreferences(position?: ApplicationPosition) {
      if (
        !position ||
        this.minimized ||
        this.element?.matches(':is(.minimizing, .minimized, .maximizing)')
      ) {
        return;
      }

      const { width, height } = position;

      const { width: configuredWidth, height: configuredHeight } =
        UserSheetPreferencesService.getByType(sheetType);

      if (width !== configuredWidth) {
        await UserSheetPreferencesService.setDocumentTypePreference(
          sheetType,
          'width',
          width,
        );
      }

      if (height !== configuredHeight) {
        await UserSheetPreferencesService.setDocumentTypePreference(
          sheetType,
          'height',
          height,
        );
      }
    }

    #debouncePersistSheetPositionPreferences = FoundryAdapter.debounce(
      this.#persistSheetPositionPreferences.bind(this),
      1000,
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

      this.sheetMode = mode ?? this.sheetMode ?? CONSTANTS.SHEET_MODE_PLAY;
    }

    async _prepareContext(
      options: Partial<TidyDocumentSheetRenderOptions>,
    ): Promise<DocumentSheetV2Context> {
      const context = await super._prepareContext(options);

      const sheetModeConfig = {
        unlocked:
          this.sheetMode === CONSTANTS.SHEET_MODE_EDIT && context.editable,
      };

      TidyHooks.tidy5eSheetsSheetModeConfiguring(
        this,
        this.element,
        sheetModeConfig,
      );

      return {
        ...context,
        defaultCurrency: FoundryAdapter.getDefaultCurrencyConfig(),
        unlocked: sheetModeConfig.unlocked,
        config: CONFIG.DND5E,
      } as DocumentSheetV2Context;
    }

    async _renderHTML(
      context: TContext,
      options: TidyDocumentSheetRenderOptions,
    ): Promise<RenderResult<TContext>> {
      const result = await super._renderHTML(context, options);

      // Allow svelte to process its synchronous microtask changes before entertaining custom content.
      await tick();

      try {
        const renderedTabParts = context.tabs
          ? await this._customContentRenderer.renderTabContents(
              context.tabs,
              context,
              options,
            )
          : [];

        const renderedContentParts = context.customContent
          ? await this._customContentRenderer.renderCustomContent(
              context.customContent,
              context,
              options,
            )
          : [];

        const implementationCustomContents = await this._getCustomContents(
          context,
          options,
        );

        result.customContents = [
          ...renderedTabParts,
          ...renderedContentParts,
          ...implementationCustomContents,
        ];
      } catch (e) {
        error(
          'An error occurred while rendering custom tabs and content.',
          false,
          e,
        );
      }

      return result;
    }

    /**
     * An overridable method whose array members will be included
     * in the custom content rendering logic.
     * @param context the document sheet context data
     * @param options render options for this particular render
     * @returns
     */
    _getCustomContents(
      context: TContext,
      options: TidyDocumentSheetRenderOptions,
    ): Promise<RenderedSheetPart[]> {
      return Promise.resolve([]);
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
          element,
        );

        this._applySheetModeClass(element);
      } catch (e) {
        error(
          'An error occurred while preparing the rendered frame of the application.',
          false,
          { error: e, sheet: this },
        );
      }

      return element;
    }

    _updateFrame(options: TidyDocumentSheetRenderOptions) {
      options ??= {};

      // Update header control position settings
      this._headerControlSettings = this._getHeaderControlSettings(
        this.document,
      );

      // Remove header bar controls
      removeTidyHeaderButtons(this.element);

      // Add header bar controls
      for (const c of this._headerControlButtons('header')) {
        insertHeaderButton(this, this.element, c);
      }

      // For whatever reason, application v2 titles don't update themselves on _updateFrame without an implementing class specifiying window settings.
      FoundryAdapter.mergeObject(options, {
        window: {
          title: this.title,
          controls: true,
        },
      });

      super._updateFrame(options);
    }

    async _onSingleInputChange(
      event: InputEvent & { target: HTMLInputElement },
    ) {
      const { name } = event.target.dataset;

      // Current User updates
      const isCurrentUserUpdate = name?.startsWith('currentUser:');

      if (isCurrentUserUpdate && !!name) {
        const prop = name.split('currentUser:').at(-1);
        return prop ? await this._onCurrentUserUpdated(event, prop) : undefined;
      }

      // Standard Embedded or Top-Level Document Submission Information
      const { targetDocument } = this._getDocumentSubmissionInformation(
        event.target,
      );

      return await this._processSingleInputChange(event, targetDocument);
    }

    _onCurrentUserUpdated(event: any, prop: string): Promise<any> {
      let value = event.target.value;
      return game.user.update({ [prop]: value });
    }

    async _processSingleInputChange(
      event: InputEvent & { target: HTMLInputElement },
      doc: any,
    ) {
      event.stopImmediatePropagation();

      const field = event.target.getAttribute('data-name')!;

      let valueToSave: string | number = event.target.value;

      if (
        event.target.matches(
          '[type="number"], [data-dype="Number"], [inputmode="numeric"]',
        )
      ) {
        const valueAsNumber = Number.isNumeric(valueToSave)
          ? Number(valueToSave)
          : valueToSave;

        return await this._updateNumericProperty(doc, field, valueAsNumber);
      }

      return await doc.update({ [field]: valueToSave });
    }

    async _updateNumericProperty(
      targetDocument: any,
      prop: string,
      value: number | string,
    ) {
      // Special case handling for Item uses.
      if (
        targetDocument.documentName === CONSTANTS.DOCUMENT_NAME_ITEM &&
        prop === 'system.uses.value'
      ) {
        return await targetDocument.update({
          'system.uses.spent': targetDocument.system.uses.max - (value as any),
        });
      } else if (
        targetDocument.documentName === CONSTANTS.DOCUMENT_NAME_ACTIVITY &&
        prop === 'uses.value'
      ) {
        return await targetDocument.item.updateActivity(targetDocument.id, {
          'uses.spent': targetDocument.uses.max - (value as any),
        });
      }

      // Standard case: save the intended value.
      return await targetDocument.update({ [prop]: value });
    }

    getItem(id?: string) {
      return this.document.type === 'container'
        ? this.document.system.getContainedItem(id)
        : this.actor?.items.get(id);
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
      options: TidyDocumentSheetRenderOptions,
    ) {
      super._replaceHTML(result, content, options);

      try {
        this.#saveScrollPositions(content);
        this.#saveInputFocus(content);

        this._customContentRenderer.replaceCustomContent(
          result.customContents,
          this,
          result.context,
          options,
        );
      } catch (e) {
        error(
          'An error occured while replacing custom content on the sheet.',
          false,
          e,
        );
      }
    }

    _getDocumentSubmissionInformation(target: HTMLElement): Partial<{
      itemId: string;
      item: Item5e;
      activityId: string;
      activity: Activity5e;
      effectId: string;
      effect: ActiveEffect5e;
      targetDocument: Actor5e | Item5e | Activity5e;
    }> {
      const { itemId } =
        target.closest<HTMLElement>('[data-item-id]')?.dataset ?? {};
      const sheetDocument = this.document;
      const sheetDocumentIsRelatedItem =
        sheetDocument.documentName === CONSTANTS.DOCUMENT_NAME_ITEM &&
        (sheetDocument.id === itemId || !itemId);
      const item = sheetDocumentIsRelatedItem
        ? sheetDocument
        : sheetDocument?.items?.get(itemId);

      const { activityId } =
        target.closest<HTMLElement>('[data-activity-id]')?.dataset ?? {};
      const activity = item?.system.activities?.get(activityId);

      const { effectId } =
        target.closest<HTMLElement>('[data-effect-id]')?.dataset ?? {};
      const { parentId } =
        target.closest<HTMLElement>('[data-parent-id]')?.dataset ?? {};
      const effect = effectId
        ? FoundryAdapter.getEffect({
            document: this.document,
            effectId,
            parentId,
          })
        : undefined;

      const targetDocument = effect ?? activity ?? item ?? sheetDocument;

      return {
        itemId,
        item,
        activityId,
        activity,
        targetDocument,
        effectId,
        effect,
      };
    }

    /* -------------------------------------------- */
    /*  Sheet Mode Management                       */
    /* -------------------------------------------- */

    /**
     * Is the sheet in edit mode?
     */
    get isEditMode() {
      return this._mode === CONSTANTS.SHEET_MODE_EDIT;
    }

    /**
     * Applies the current sheet mode as a class to the sheet element.
     */
    _applySheetModeClass(element: HTMLElement) {
      if (!element) {
        return;
      }

      element.className = element.className.replace(/sheet-mode-\w+/g, '');
      let mode = this.sheetMode === CONSTANTS.SHEET_MODE_EDIT ? 'edit' : 'play';
      element.classList.add(`sheet-mode-${mode}`);
    }

    /**
     * Changes the user toggling the sheet mode.
     * @protected
     */
    async changeSheetMode(mode: number) {
      this.sheetMode = mode;
      await this.submit();
      this._applySheetModeClass(this.element);
      await this.render();
    }

    /**
     * Toggles the user's sheet mode relative to the current mode.
     * @protected
     */
    async toggleSheetMode() {
      const newMode =
        this.sheetMode === CONSTANTS.SHEET_MODE_PLAY
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
        (options.submit ?? true) &&
        this.options.submitOnClose &&
        this.document.isOwner &&
        this.isEditable;

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
      options: TidyDocumentSheetRenderOptions,
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
          scrollableElements,
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

    _initializeApplicationOptions(options: DocumentSheetConfiguration) {
      const updatedOptions = super._initializeApplicationOptions(
        options,
      ) as DocumentSheetConfiguration;

      const headerControls = new Map<string, CustomHeaderControlsEntry>();

      [...(updatedOptions.window?.controls ?? [])].forEach((c) =>
        headerControls.set(c.label, c),
      );

      const effectiveActions = { ...(updatedOptions.actions ?? {}) };

      try {
        const { width, height } =
          UserSheetPreferencesService.getByType(sheetType);

        const position = (updatedOptions.position ??= {});

        if (width) {
          position.width = width;
        }

        if (height) {
          position.height = height;
        }

        const customControls = this._getCustomHeaderControls(
          updatedOptions.document,
        );

        customControls.controls.forEach((c) => headerControls.set(c.label, c));

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
        updatedOptions.window.controls = [...headerControls.values()];

        this._headerControlSettings = this._getHeaderControlSettings(
          options.document,
        );

        updatedOptions.window.controls.forEach((c) => {
          if (
            c.action === 'configureToken' ||
            c.action === 'configurePrototypeToken' ||
            c.action === 'attach' ||
            c.action === 'detach'
          ) {
            c.position = 'header';
          }
        });
      } catch (e) {
        error('An error occurred while setting up custom controls.', false, {
          error: e,
          app: this,
          options: updatedOptions,
        });
      }

      return updatedOptions;
    }

    private _getHeaderControlSettings(document: any) {
      // SettingsProvider is assigned in initSettings(); optional chaining covers
      // circular-import / ordering edge cases. Fall back to the raw game setting.
      const settings =
        (SettingsProvider.settings.headerControlConfiguration.get() ??
          FoundryAdapter.getTidySetting<HeaderControlConfiguration>(
            'headerControlConfiguration',
          ))?.[document.documentName]?.[document.type];

      if (!settings) {
        return new Map();
      }

      return new Map<string, SheetHeaderControlPosition>([
        ...settings.header.map((s) => [s, 'header'] as const),
        ...settings.menu.map((s) => [s, 'menu'] as const),
      ]);
    }

    /* -------------------------------------------- */
    /*  Header Control Management                   */
    /* -------------------------------------------- */

    _getCustomHeaderControls(document: any): {
      controls: ApplicationHeaderControlsEntry[];
      actions: any;
    } {
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

    getAllHeaderControlButtons() {
      const uniqueControls = new Map<string, ApplicationHeaderControlsEntry>();

      this._doEvent(this._getHeaderControls, {
        async: false,
        debugText: 'Header Control Buttons',
        hookName: 'getHeaderControls',
        hookResponse: true,
      }).forEach(
        (c: ApplicationHeaderControlsEntry) =>
          !uniqueControls.has(c.label) && uniqueControls.set(c.label, c),
      );

      // Some controls, such as Portrait Artwork, do not show when calling the event.
      this.options.window.controls?.forEach(
        (c: ApplicationHeaderControlsEntry) =>
          !uniqueControls.has(c.label) && uniqueControls.set(c.label, c),
      );

      return [...uniqueControls.values()];
    }

    /**
     * Get visible header control buttons from sheet options and hook subscribers.
     * The header position is defaulted to 'menu' because the App V2 framework
     * is calling this generator with no parameters in order to populate
     * the header menu.
     * Header controls are deduplicated by label, preferring Tidy registrations,
     * then window controls, then hook subscribers.
     * @param position the desired header position. (default: 'menu')
     */
    *_headerControlButtons(position: SheetHeaderControlPosition = 'menu') {
      const uniqueControls = new Set<string>();

      for (const c of super._headerControlButtons()) {
        const id = coalesce(c.label, c.icon);

        if (uniqueControls.has(id)) {
          continue;
        }

        uniqueControls.add(id);

        if (this._headerControlIsConfiguredForPosition(c, id, position)) {
          yield c;
        }
      }
    }

    private _headerControlIsConfiguredForPosition(
      c: CustomHeaderControlsEntry,
      id: string,
      position: string,
    ) {
      return (
        this._headerControlSettings.get(id) === position ||
        (!this._headerControlSettings.has(id) &&
          coalesce(c.position, 'menu') === position)
      );
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */

    _onPointerDown(event: PointerEvent, target: HTMLElement) {
      if (event.button !== CONSTANTS.MOUSE_BUTTON_AUXILIARY) {
        return;
      }

      this._openAnything(event, target, CONSTANTS.SHEET_MODE_EDIT);
    }

    _onDblClick(event: PointerEvent, target: HTMLElement) {
      if (isUserInteractable(target)) {
        return;
      }

      this._openAnything(event, target, CONSTANTS.SHEET_MODE_PLAY);
    }

    _openAnything(event: PointerEvent, target: HTMLElement, mode?: number) {
      // Standard Case

      const { targetDocument } = this._getDocumentSubmissionInformation(target);

      if (targetDocument && targetDocument !== this.document) {
        event.stopPropagation();
        event.preventDefault();
        return this._renderChild(targetDocument.sheet, {
          mode,
        });
      }

      // Special Case - Slot

      const isActor =
        this.document.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR;

      if (!!target.closest('[data-slots]') && isActor) {
        event.stopPropagation();
        event.preventDefault();
        return FoundryAdapter.openSpellSlotsConfig(this.document);
      }

      // Special Case - Skill / Tool

      const { trait } =
        target.closest<HTMLElement>('[data-trait]')?.dataset ?? {};
      const { key } = target.closest<HTMLElement>('[data-key]')?.dataset ?? {};

      if (trait && key && isActor) {
        event.stopPropagation();
        event.preventDefault();
        FoundryAdapter.renderSkillToolConfig(
          this.document,
          trait as 'skills' | 'tool',
          key,
        );
      }

      // Special Case - Item Advancement

      const { id } = target.closest<HTMLElement>('[data-id]')?.dataset ?? {};

      if (this.document.documentName === CONSTANTS.DOCUMENT_NAME_ITEM && id) {
        event.stopPropagation();
        event.preventDefault();
        return this._renderChild(this.document.advancement?.byId[id]?.sheet);
      }

      // Direct UUID reference

      const { uuid } =
        target.closest<HTMLElement>('[data-uuid]')?.dataset ?? {};

      if (uuid) {
        event.stopPropagation();
        event.preventDefault();
        return fromUuid(uuid).then((doc: any) => {
          if (doc !== this.document) {
            return this._renderChild(doc.sheet, {
              mode,
            });
          }
        });
      }
    }

    /* -------------------------------------------- */
    /*  Sheet Actions                               */
    /* -------------------------------------------- */

    /**
     * Handle configuring a tab on a sheet.
     * @param this {TidyDocumentSheet}
     * @param _event {Event}
     * @param target The clicked element, with a data-tab-id attribute containing the tab ID
     * @returns Nothing, loads the tab configuration application
     */
    static async #configureTab(
      this: TidyDocumentSheet,
      _event: Event,
      target: HTMLElement,
    ) {
      if (!this.isEditable) {
        return;
      }

      this.openSheetSettings(target.dataset.tabId);
    }

    openSheetSettings(tabId?: string) {
      const settings = new TidySheetSettingsQuadroneApplication({
        document: this.document,
        initialTabId: tabId,
      });

      return this._renderChild(settings);
    }

    /* -------------------------------------------- */

    static async #currency(
      this: TidyDocumentSheet,
      _event: Event,
      _target: HTMLElement,
    ) {
      return new dnd5e.applications.CurrencyManager({
        document: this.document,
      }).render({ force: true });
    }

    /* -------------------------------------------- */

    static async #decrease(
      this: TidyDocumentSheet,
      event: Event,
      target: HTMLElement,
    ) {
      if ((await this._decrease(event, target)) === false) {
        return;
      }

      this._onAdjustProperty(event, target, -1);
    }

    protected async _decrease(
      event: Event,
      target: HTMLElement,
    ): Promise<any> {}

    /* -------------------------------------------- */

    /**
     * Handle removing an document.
     * @this {PrimarySheet5e}
     * @param {Event} event         Triggering click event.
     * @param {HTMLElement} target  Button that was clicked.
     */
    static async #deleteDocument(
      this: TidyDocumentSheet,
      event: Event,
      target: HTMLElement,
    ) {
      if ((await this._deleteDocument(event, target)) === false) {
        return;
      }
      const uuid = target.closest<HTMLElement>('[data-uuid]')?.dataset.uuid;
      const doc = await fromUuid(uuid);
      doc?.deleteDialog({ sheet: this });
    }

    /**
     * Handle removing an document.
     * @param {Event} event         Triggering click event.
     * @param {HTMLElement} target  Button that was clicked.
     * @returns {any}               Return `false` to prevent default behavior.
     */
    async _deleteDocument(event: Event, target: HTMLElement): Promise<any> {}

    /* -------------------------------------------- */

    static async #editImage(
      this: TidyDocumentSheet,
      _event: Event,
      target: HTMLElement,
    ) {
      const attr = target.dataset.edit;

      if (!attr) {
        return;
      }

      const current = foundry.utils.getProperty(this.document._source, attr);

      const defaultArtwork =
        this.document.constructor.getDefaultArtwork?.(this.document._source) ??
        {};

      const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);

      const schemaTypes = this.document.schema.getField(attr)?.categories ?? [];
      const acceptsImage = schemaTypes.includes('IMAGE');
      const acceptsVideo = schemaTypes.includes('VIDEO');
      const type = [acceptsImage && 'image', acceptsVideo && 'video']
        .filter(Boolean)
        .join('');
      if (!type)
        throw new Error(`Unsupported Schema type. Received: ${schemaTypes}`);

      const fp = new CONFIG.ux.FilePicker({
        current,
        type: type,
        redirectToRoot: defaultImage ? [defaultImage] : [],
        callback: (path: string) => {
          if (
            target instanceof HTMLVideoElement ||
            target instanceof HTMLImageElement
          ) {
            target.src = path;
          }
          this._onEditPortrait(attr, path);
        },
        position: {
          top: this.position.top + 40,
          left: this.position.left + 10,
        },
      });
      await fp.browse();
    }

    /* -------------------------------------------- */

    static async #increase(
      this: TidyDocumentSheet,
      event: Event,
      target: HTMLElement,
    ) {
      if ((await this._increase(event, target)) === false) {
        return;
      }

      return await this._onAdjustProperty(event, target, 1);
    }

    protected async _increase(
      _event: Event,
      _target: HTMLElement,
    ): Promise<any> {}

    async _onAdjustProperty(event: Event, target: HTMLElement, amount: number) {
      const { targetDocument } = this._getDocumentSubmissionInformation(target);

      const prop = target.dataset.property;

      if (!prop) {
        return;
      }

      let value = FoundryAdapter.getProperty<number>(targetDocument, prop) ?? 0;

      value += amount;

      const input = target.parentElement?.querySelector('input');
      const min = Number.isNumeric(input?.dataset.min)
        ? Number(input?.dataset.min)
        : -Infinity;
      const max = Number.isNumeric(input?.dataset.max)
        ? Number(input?.dataset.max)
        : Infinity;

      value = Math.clamp(value, min, max);

      if (isNaN(value)) {
        return;
      }

      return await this._updateNumericProperty(targetDocument, prop, value);
    }

    /* -------------------------------------------- */

    static async #recharge(
      this: TidyDocumentSheet,
      event: Event,
      target: HTMLElement,
    ) {
      const { item, activity } = this._getDocumentSubmissionInformation(target);

      this._onRollRecharge(activity ?? item, { event });
    }

    _onRollRecharge(
      entry: Item5e | Activity5e,
      { event }: Partial<{ event: Event }> = {},
    ) {
      const isItem = entry instanceof dnd5e.documents.Item5e;
      const autoSucceed = event && 'shiftKey' in event && event.shiftKey;

      if (autoSucceed && isItem) {
        return entry.update({ ['system.uses.spent']: 0 });
      }

      if (autoSucceed) {
        return entry.item.updateActivity(entry.id, { ['uses.spent']: 0 });
      }

      if (isItem) {
        return entry.system.uses?.rollRecharge({ apply: true, event });
      }

      return entry.uses?.rollRecharge({ apply: true, event });
    }

    /* -------------------------------------------- */

    static async #sheetSettings(this: TidyDocumentSheet) {
      this.openSheetSettings();
    }

    /* -------------------------------------------- */

    /**
     * Handle triggering a context menu. [data-target-selector] on the sheet action node
     * indicates the closest node (self or ancestor) where the
     * context menu to look for context-menu-specific data.
     * @this {PrimarySheet5e}
     * @param {Event} event         Triggering click event.
     * @param {HTMLElement} target  Button that was clicked.
     */
    static async #showContextMenu(
      this: TidyDocumentSheet,
      event: Event,
      target: HTMLElement,
    ) {
      event.preventDefault();
      event.stopPropagation();

      let clientX = 0;
      let clientY = 0;

      if (event instanceof PointerEvent || event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      } else {
        var clientRect = target.getBoundingClientRect();
        clientX = clientRect.left;
        clientY = clientRect.top;
      }

      const targetSelector = target.getAttribute('data-target-selector');

      const elementTarget = targetSelector
        ? target?.closest(targetSelector)
        : target;

      elementTarget?.dispatchEvent(
        new PointerEvent('contextmenu', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX,
          clientY,
        }),
      );
    }

    /* -------------------------------------------- */

    /**
     * Handle opening a document sheet.
     * @this {PrimarySheet5e}
     * @param {Event} event         Triggering click event.
     * @param {HTMLElement} target  Button that was clicked.
     */
    static async #showDocument(
      this: TidyDocumentSheet,
      event: Event,
      target: HTMLElement,
    ) {
      if ((await this._showDocument(event, target)) === false) {
        return;
      }

      if (
        [HTMLInputElement, HTMLSelectElement].some(
          (el) => event.target instanceof el,
        )
      ) {
        return;
      }

      const uuid = target.closest<HTMLElement>('[data-uuid]')?.dataset.uuid;
      const doc = await fromUuid(uuid);
      const mode =
        target.dataset.action === 'showDocument'
          ? CONSTANTS.SHEET_MODE_PLAY
          : CONSTANTS.SHEET_MODE_EDIT;

      this._openDocumentSheet(doc, { mode: mode });
    }

    /**
     * Handle opening a document sheet.
     * @param event         Triggering click event.
     * @param target  Button that was clicked.
     * @returns {any}               Return `false` to prevent default behavior.
     */
    async _showDocument(event: Event, target: HTMLElement): Promise<any> {}

    /**
     * Open a document's sheet, rendering it as a child of this application if supported.
     */
    _openDocumentSheet(doc: any, options: ApplicationRenderOptions = {}) {
      if (doc?.sheet) {
        this._renderChild(doc.sheet, options);
      }
    }

    /* -------------------------------------------- */

    static async #toggle(
      this: TidyDocumentSheet,
      event: Event,
      target: HTMLElement,
    ) {
      // Effects
      const { effectId, parentId } =
        target.closest<HTMLElement>('[data-effect-id]')?.dataset ?? {};
      if (effectId) {
        const effect = FoundryAdapter.getEffect({
          document: this.document,
          effectId,
          parentId,
        });
        const isConcentrationEffect =
          this.document instanceof dnd5e.documents.Actor5e &&
          this._concentration?.effects.has(effect);

        // Concentration Break
        if (isConcentrationEffect) {
          return this.document.endConcentration(effect);
        }

        // Active Effect
        return effect.update({ disabled: !effect.disabled });
      }

      // todo etc.
    }

    /* -------------------------------------------- */

    static async #togglePip(
      this: TidyDocumentSheet,
      _event: Event,
      target: HTMLElement,
    ) {
      if (!this.isEditable) {
        return;
      }

      const n = Number(target.closest<HTMLElement>('[data-n]')?.dataset.n);
      const prop =
        target.dataset.prop ??
        target.closest<HTMLElement>('[data-prop]')?.dataset.prop;

      if (!Number.isNumeric(n) || !prop) {
        return;
      }

      let value = foundry.utils.getProperty(this.actor, prop);

      value =
        value === n && prop.endsWith('.spent')
          ? // `spent` needs special inverse treatment
            value + 1
          : value === n
            ? // popping off the top pip
              value - 1
            : value > n
              ? // expending all pips beyond and including the clicked pip
                // note: this is how Tidy has historically done this,
                // whereas the default sheets will keep the clicked
                // pip unexpended.
                n - 1
              : // increase value to match the clicked empty pip
                n;

      this.submit({ updateData: { [prop]: value } });
    }

    /* -------------------------------------------- */

    static async #transferCurrency(
      this: TidyDocumentSheet,
      _event: Event,
      target: HTMLElement,
    ) {
      const currencyKeys = Object.keys(CONFIG.DND5E.currencies);
      const { itemId } =
        target.closest<HTMLElement>('[data-item-id]')?.dataset ?? {};

      const actor = this.actor;

      if (!actor) {
        warn(`No actor found for container ${itemId}.`);
        return;
      }

      const container = actor.items.get(itemId);

      if (!container) {
        warn(`Container ${itemId} not found on this actor.`);
        return;
      }

      // Build update objects for both documents
      const containerUpdate: Record<string, number> = {};
      const actorUpdate: Record<string, number> = {};

      for (const key of currencyKeys) {
        const containerValue = container.system.currency[key] ?? 0;
        const actorValue = actor.system.currency[key] ?? 0;

        if (containerValue > 0) {
          containerUpdate[`system.currency.${key}`] = 0;
          actorUpdate[`system.currency.${key}`] = actorValue + containerValue;
        }
      }

      // Update both documents
      await Promise.all([
        container.update(containerUpdate),
        actor.update(actorUpdate),
      ]);
    }

    /* -------------------------------------------- */

    static async #useActivity(
      this: TidyDocumentSheet,
      event: Event,
      target: HTMLElement,
    ) {
      if (target.ariaDisabled === 'true' || !this.isEditable) {
        return;
      }

      const { activity } = this._getDocumentSubmissionInformation(target);

      if (!activity) {
        return;
      }

      await activity.use({ event, options: { sheet: this } });
    }

    /* -------------------------------------------- */

    static async #useItem(
      this: TidyDocumentSheet,
      event: Event,
      target: HTMLElement,
    ) {
      if (target.ariaDisabled === 'true' || !this.isEditable) {
        return;
      }

      const { item } = this._getDocumentSubmissionInformation(target);

      if (!item) {
        return;
      }

      this.tryUseItem(item, event);
    }

    async tryUseItem(item: Item5e, event: Event) {
      item.use({ event }, { options: { sheet: this } });
    }

    /* -------------------------------------------- */
    /*  Form Handling                               */
    /* -------------------------------------------- */

    /**
     * Customize how form data is extracted into an expanded object.
     * @param event              The originating form submission event
     * @param form                The form element that was submitted
     * @param formData           Processed data for the submitted form
     * @returns {object}                            An expanded object of processed form data
     * @throws {Error}                              Subclasses may throw validation errors here to prevent form submission
     * @protected
     */
    _processFormData(
      event: SubmitEvent | null,
      form: HTMLFormElement,
      formData: /*FormDataExtended*/ unknown,
    ) {
      const submitData = super._processFormData(event, form, formData);

      // Correctly process data-edit video elements.
      form
        .querySelectorAll<HTMLVideoElement>('video[data-edit]')
        .forEach((v) => {
          foundry.utils.setProperty(submitData, v.dataset.edit, v.src);
        });

      // Prevent wildcard textures from being clobbered.
      const proto = submitData.prototypeToken;
      if (proto) {
        const randomImg =
          proto.randomImg ?? this.actor.prototypeToken.randomImg;
        if (randomImg) delete submitData.prototypeToken;
      }

      return submitData;
    }

    /* -------------------------------------------- */

    /**
     * Handle editing the portrait.
     * @param target  The target property being edited.
     * @param path    The image or video path.
     * @protected
     */
    async _onEditPortrait(target: string, path: string) {
      if (target.startsWith('token.'))
        await this.token.update({ [target.slice(6)]: path });
      else {
        const submit = new Event('submit', { cancelable: true });
        this.form.dispatchEvent(submit);
      }
    }

    /* -------------------------------------------- */

    /**
     * Adds a document when only one creation type is available. Presents the item creation dialog when multiple are available.
     * @param args The tab where this Add operation is occurring, and other optional parameters.
     */
    async _addDocument(_args: {
      tabId: string;
      customSection?: string;
      creationItemTypes?: string[];
      data?: Record<string, any>;
    }): Promise<any> {}

    /* -------------------------------------------- */
    /*  Drag and Drop                               */
    /* -------------------------------------------- */

    _allowedDropBehaviors(event: DragEvent, data?: { uuid?: string }) {
      if (!data?.uuid) {
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
      data: any,
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
