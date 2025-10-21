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
  CustomContent,
  DocumentSheetV2Context,
  Tab,
} from 'src/types/types';
import { debug, error } from 'src/utils/logging';
import type { RenderResult } from './SvelteApplicationMixin.svelte';
import {
  CustomContentRendererV2,
  type RenderedSheetPart,
} from 'src/sheets/CustomContentRendererV2';
import { tick } from 'svelte';
import { applySheetAttributesToWindow } from 'src/utils/applications.svelte';
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
import { TidyHooks } from 'src/foundry/TidyHooks';
import { SettingsProvider } from 'src/settings/settings.svelte';

export type TidyDocumentSheetRenderOptions = ApplicationRenderOptions & {
  mode?: number;
};

export type TidyExtensibleDocumentSheetMixinInstance = InstanceType<
  ReturnType<typeof TidyExtensibleDocumentSheetMixin>
>;

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
    _headerControlSettings: Map<string, SheetHeaderControlPosition> = new Map();

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
        editImage: async function (this: TidyDocumentSheet, _event, target) {
          const attr = target.dataset.edit;

          if (!attr) {
            return;
          }

          const current = foundry.utils.getProperty(
            this.document._source,
            attr
          );

          const defaultArtwork =
            this.document.constructor.getDefaultArtwork?.(
              this.document._source
            ) ?? {};

          const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);

          const schemaTypes =
            this.document.schema.getField(attr)?.categories ?? [];
          const acceptsImage = schemaTypes.includes('IMAGE');
          const acceptsVideo = schemaTypes.includes('VIDEO');
          const type = [acceptsImage && 'image', acceptsVideo && 'video']
            .filter(Boolean)
            .join('');
          if (!type)
            throw new Error(
              `Unsupported Schema type. Received: ${schemaTypes}`
            );

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

    _customContentRenderer: CustomContentRendererV2 =
      new CustomContentRendererV2();

    #scrollPositions: Record<string, PriorElementScrollPosition[]> = {};

    #focusedInputSelector: string | undefined = '';

    async _onChangeForm(formConfig: unknown, event: any) {
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

      try {
        if (event.target.matches('[data-name]')) {
          await this._onEmbeddedDocumentInputChange(event);
          return;
        }

        const isSelfSufficientInput = !event.target.name;
        if (isSelfSufficientInput) {
          return;
        }

        super._onChangeForm(formConfig, event);
      } catch (e: any) {
        Object.values(e.getAllFailures()).forEach((failure: any) =>
          ui.notifications.error(failure.message)
        );
      }
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
          width
        );
      }

      if (height !== configuredHeight) {
        await UserSheetPreferencesService.setDocumentTypePreference(
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

      const sheetModeConfig = {
        unlocked:
          this.sheetMode === CONSTANTS.SHEET_MODE_EDIT && this.isEditable,
      };

      TidyHooks.tidy5eSheetsSheetModeConfiguring(
        this,
        this.element,
        sheetModeConfig
      );

      return {
        ...context,
        unlocked: sheetModeConfig.unlocked,
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
          ? await this._customContentRenderer.renderTabContents(
              context.tabs,
              context,
              options
            )
          : [];

        const renderedContentParts = context.customContent
          ? await this._customContentRenderer.renderCustomContent(
              context.customContent,
              context,
              options
            )
          : [];

        const implementationCustomContents = await this._getCustomContents(
          context,
          options
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
          e
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
      options: TidyDocumentSheetRenderOptions
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
          element
        );

        this._applySheetModeClass(element);
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

      // Update header control position settings
      this._headerControlSettings = this._getHeaderControlSettings(
        this.document
      );

      // Remove header bar controls
      removeTidyHeaderButtons(this.element);

      // Add header bar controls
      this._getVisibleHeaderControlsForPosition('header').forEach((x) =>
        insertHeaderButton(
          this,
          this.element,
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

    async _onEmbeddedDocumentInputChange(
      event: InputEvent & { target: HTMLInputElement }
    ) {
      const itemId =
        event.target.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;

      const item = !!itemId ? await this.getItem(itemId) : null;

      const activityId =
        event.target.closest<HTMLElement>('[data-activity-id]')?.dataset
          .activityId;

      const activity = item?.system.activities?.get(activityId);

      if (activity) {
        return await this._processEmbeddedDocumentChange(event, activity);
      }

      if (itemId) {
        return await this._processEmbeddedDocumentChange(event, item);
      }
    }

    private async _processEmbeddedDocumentChange(
      event: InputEvent & { target: HTMLInputElement },
      doc: any
    ) {
      event.stopImmediatePropagation();

      const field = event.target.getAttribute('data-name')!;

      let valueToSave: string | number = event.target.value;

      // For deltas, parse the resulting delta value
      if (event.target.matches('[inputmode="numeric"]')) {
        valueToSave = processInputChangeDelta(
          event.target.value,
          doc,
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

        if (doc && !Number.isNaN(valueToSave)) {
          event.target.value = valueToSave?.toString();
        }
      }

      // Save the value to the document, whatever that value ultimately became
      await doc.update({ [field]: valueToSave });
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

        this._customContentRenderer.replaceCustomContent(
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
      this._mode = mode;
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

    _initializeApplicationOptions(options: DocumentSheetConfiguration) {
      const updatedOptions = super._initializeApplicationOptions(
        options
      ) as DocumentSheetConfiguration;

      const effectiveControls = [...(updatedOptions.window?.controls ?? [])];
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

        this._headerControlSettings = this._getHeaderControlSettings(
          options.document
        );

        updatedOptions.window.controls.forEach((c) => {
          if (this._headerControlSettings.has(c.label)) {
            c.position = this._headerControlSettings.get(c.label);
            return;
          }

          if (
            c.action === 'configureToken' ||
            c.action === 'configurePrototypeToken'
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
      const settings =
        SettingsProvider.settings.headerControlConfiguration.get()?.[
          document.documentName
        ]?.[document.type];

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

    getAllHeaderControls() {
      return this.options.window.controls?.slice() ?? [];
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
          const visible =
            typeof c.visible !== 'function' || c.visible.call(this);

          const configuredForThisPosition =
            this._headerControlSettings.get(c.label) === position ||
            (!this._headerControlSettings.has(c.label) &&
              coalesce(c.position, 'menu') === position);

          return visible && configuredForThisPosition;
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
      formData: /*FormDataExtended*/ unknown
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
