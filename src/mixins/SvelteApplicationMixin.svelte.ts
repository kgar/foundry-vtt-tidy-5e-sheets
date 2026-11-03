import { debug, error } from 'src/utils/logging';
import { type RenderedSheetPart } from 'src/sheets/CustomContentRendererV2';
import type {
  ApplicationRenderOptions,
  ApplicationClosingOptions,
  ApplicationConfiguration,
  ApplicationPosition,
} from 'src/types/application.types';
import { unmount } from 'svelte';
import { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import { applyThemeToApplication } from 'src/utils/applications.svelte';
import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
import type {
  ThemeSettingsConfigurationOptions,
  ThemeSettingsV3,
} from 'src/theme/theme-quadrone.types';
import { CONSTANTS } from 'src/constants';
import type { Ref } from 'src/features/reactivity/reactivity.types';
import { EventHelper } from 'src/utils/events';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { getTidyPerformanceSettings } from 'src/settings/settings.svelte';
import FloatingContextMenu from 'src/context-menu/FloatingContextMenu';
import { DisposablesRegistry } from '../features/resource-disposal/DisposablesRegistry';

export type RenderResult<TContext> = {
  customContents: RenderedSheetPart[];
  context: TContext;
};

export type SvelteApplicationMixinInstance = InstanceType<
  ReturnType<typeof getSvelteApplicationMixin>
>;

/**
 * A context-oriented Svelte mixin to provide Application V2 windows with Svelte integration.
 *
 * @param BaseApplication the application which should adopt this mixin functionality.
 * @returns the resulting application with this mixin functionality applied.
 */
export function getSvelteApplicationMixin<
  TConstructorArgs extends Partial<ApplicationConfiguration> | undefined,
  TContext extends any = {},
>(BaseApplication: any) {
  class SvelteApplication extends BaseApplication {
    constructor(args?: TConstructorArgs) {
      super(args);

      DisposablesRegistry.disposeAll(this.id);
    }

    /** The component which represents the UI. */
    #components: Record<string, any>[] = [];

    /**
     * Compatibility shim from Application V1.
     */
    get object() {
      return this.document;
    }

    get windowContent() {
      return this.hasFrame
        ? this.element.querySelector('.window-content')
        : this.element;
    }

    themeConfigOptions(): ThemeSettingsConfigurationOptions {
      return {
        doc: this.document,
        callback: ({ settingsOverride }) =>
          this.onThemeConfigChanged(settingsOverride),
      };
    }

    protected onThemeConfigChanged(_settingsOverride?: ThemeSettingsV3) {}

    /* -------------------------------------------- */
    /*  Svelte-specific                             */
    /* -------------------------------------------- */

    /**
     * The context store which underpins the application Svelte component.
     * This store is made available as Svelte context to the component
     * and can be retrieved from any child component within.
     */
    _context = new CoarseReactivityProvider<TContext | undefined>(undefined);

    _position = $state<Ref<ApplicationPosition>>({
      value: {
        height: 0,
        left: 0,
        scale: 0,
        top: 0,
        width: 0,
        zIndex: 0,
      },
    });

    /** Creates the component which represents the window content area. */
    _createComponent(
      node: HTMLElement,
      context: TContext,
    ): Record<string, any> {
      const errorMessage =
        'Unable to render Svelte application. To implement a Svelte application, override _createComponent and provide context data matching the specified sheet context type.';
      throw new Error(errorMessage);
    }

    _createAdditionalComponents(
      content: HTMLElement,
      context: TContext,
    ): Record<string, any>[] {
      return [];
    }

    /* -------------------------------------------- */
    /*  Rendering                                   */
    /* -------------------------------------------- */

    async render(
      options: boolean | ApplicationRenderOptions = {},
      _options: ApplicationRenderOptions = {},
    ) {
      if (
        _options.renderContext === CONSTANTS.RENDER_CONTEXT_UPDATE_USER &&
        !_options.renderData?.flags?.[CONSTANTS.MODULE_ID]
      ) {
        debug(
          'Ignoring non-Tidy-related user update and preventing re-render.',
        );
        return;
      }

      DisposablesRegistry.dispose(this.id, 'render');

      return await super.render(options, _options);
    }

    #debouncedRerenderForSettings = FoundryAdapter.debounce(
      this.render.bind(this),
      150,
    );

    #throttleSoftRendering = FoundryAdapter.throttle(
      this.#renderSoftly.bind(this),
      50,
    );

    /** Run the standard render cycle while reusing the existing prepared context data. */
    #renderSoftly() {
      this.render({ tidy: { soft: true } });
    }

    async _renderFrame(options: ApplicationRenderOptions) {
      const element = await super._renderFrame(options);

      const abortController = new AbortController();

      EventHelper.subscribeToDynamicContentRenderEvents(
        element,
        () => {
          this.#throttleSoftRendering();
        },
        abortController.signal,
      );

      DisposablesRegistry.register(this.id, 'close', () =>
        abortController.abort(),
      );

      this.applyTidyTheming(element);

      this.#trackApplicationWindowDrag(element);

      const hookId = Hooks.on('updateSetting', (setting: any) => {
        if (setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`)) {
          debug('Tidy setting update detected. Requesting sheet re-render');
          this.#debouncedRerenderForSettings();
          this.applyTidyTheming();
        }
      });

      DisposablesRegistry.registerHook(
        this.id,
        'updateSetting',
        hookId,
        'close',
      );

      return element;
    }

    #trackApplicationWindowDrag(element: HTMLElement) {
      try {
        let dragging = false;

        const startDrag = (ev: PointerEvent) => {
          if ((ev.target as HTMLElement)?.closest('[data-action]')) {
            return;
          }

          if (ev?.button != null && ev.button !== 0) return;

          dragging = true;
          element.classList.add('tidy-dragging');
        };

        const stopDrag = () => {
          if (!dragging) {
            return;
          }

          dragging = false;

          // Defer class removal so Foundry’s final position updates happen
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              element.classList.remove('tidy-dragging');
            });
          });
        };

        const abortController = new AbortController();

        const header =
          element.querySelector<HTMLElement>('.window-header') ??
          element.querySelector<HTMLElement>('header') ??
          element;

        header.addEventListener('pointerdown', startDrag, {
          signal: abortController.signal,
        });
        window.addEventListener('pointerup', stopDrag, {
          signal: abortController.signal,
          capture: true,
        });
        window.addEventListener('pointercancel', stopDrag, {
          signal: abortController.signal,
          capture: true,
        });
        window.addEventListener('blur', stopDrag, {
          signal: abortController.signal,
        });

        DisposablesRegistry.register(this.id, 'close', () => {
          abortController.abort();
          element.classList.remove('tidy-dragging');
        });
      } catch (e) {
        error(
          'An error occurred while installing Tidy drag performance mode.',
          false,
          { error: e, sheet: this },
        );
      }
    }

    applyTidyTheming(element: HTMLElement = this.element) {
      const themeConfigOptions = this.themeConfigOptions();

      applyThemeToApplication(element, themeConfigOptions.doc ?? this.document);

      ThemeQuadrone.applyCurrentThemeSettingsToStylesheet(themeConfigOptions);
    }

    _updateFrame(options: ApplicationRenderOptions) {
      const performanceSettings = getTidyPerformanceSettings();

      for (const [cssClass, toggle] of performanceSettings) {
        this.element?.classList.toggle(cssClass, toggle);
      }

      super._updateFrame(options);
    }

    /**
     * Prepares context data which matches the request data type.
     * It is intentionally anemic to provide intellisense until the author can add sufficient additional typings for Application V2.
     */
    async _prepareContext(
      options: ApplicationRenderOptions,
    ): Promise<TContext> {
      return await super._prepareContext(options);
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
      options: ApplicationRenderOptions,
    ): Promise<RenderResult<TContext>> {
      this._context.data = context;

      if (options.isFirstRender) {
        const content = this.windowContent;
        this.#components.push(this._createComponent(content, context));
        this.#components.push(
          ...this._createAdditionalComponents(content, context),
        );
      }

      return {
        context: context,
        customContents: [],
      };
    }

    _replaceHTML(
      _result: RenderResult<TContext>,
      _content: HTMLElement,
      _options: ApplicationRenderOptions,
    ) {
      // Stop it here so the underlying App V2 code doesn't insert `result` "beforeend"
    }

    /* -------------------------------------------- */
    /*  Closing                                     */
    /* -------------------------------------------- */

    async close(options: ApplicationClosingOptions = {}) {
      DisposablesRegistry.disposeAll(this.id);

      await super.close(options);
    }

    _tearDown(options: ApplicationClosingOptions = {}) {
      this.#components.forEach((c) => unmount(c));
      this.#components = [];

      super._tearDown(options);
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */

    /**
     * Attach event listeners to the Application frame
     * once per application lifetime.
     */
    _attachFrameListeners() {
      const originalContextImpl = CONFIG.ux.ContextMenu;

      // Tidy swaps in its Floating Context Menu for the menu header wire-up.
      // This is one of precious few ways to apply the appropriate
      // Tidy sheet classes to the context menu.
      CONFIG.ux.ContextMenu = FloatingContextMenu;

      try {
        super._attachFrameListeners();
      } finally {
        CONFIG.ux.ContextMenu = originalContextImpl;
      }

      const frameListenerController = new AbortController();

      DisposablesRegistry.register(this.id, 'close', () => {
        frameListenerController.abort();
      });

      this.element.addEventListener(
        'plugins',
        this._onConfigurePlugins.bind(this),
        { signal: frameListenerController.signal },
      );

      this.element.addEventListener(
        'pointerdown',
        this.#onPointerDown.bind(this),
        {
          signal: frameListenerController.signal,
        },
      );

      this.element.addEventListener('dblclick', this.#onDblClick.bind(this), {
        signal: frameListenerController.signal,
      });

      const themeSettingUnsubscribable =
        ThemeQuadrone.subscribeAndReactToThemeSettingsChanges(
          this.themeConfigOptions(),
        );

      DisposablesRegistry.register(this.id, 'close', () =>
        themeSettingUnsubscribable.unsubscribe(),
      );
    }

    _updatePosition(position: ApplicationPosition) {
      const newPosition = super._updatePosition(position);

      // Only update the Svelte-reactive position ref when size/scale/zIndex changes.
      const prev = this._position.value;
      const shouldUpdateReactivePosition =
        !prev ||
        prev.width !== newPosition.width ||
        prev.height !== newPosition.height ||
        prev.scale !== newPosition.scale ||
        prev.zIndex !== newPosition.zIndex;

      if (shouldUpdateReactivePosition) {
        this._position.value = newPosition;
      }

      return newPosition;
    }

    /**
     * Configure plugins for the ProseMirror instance.
     * @param {ProseMirrorPluginsEvent} event
     * @protected
     */
    _onConfigurePlugins(event: any) {
      event.plugins.highlightDocumentMatches =
        ProseMirror.ProseMirrorHighlightMatchesPlugin.build(
          ProseMirror.defaultSchema,
        );
    }

    #onDblClick(event: MouseEvent) {
      this._onDblClick(event, event.target as HTMLElement);
    }

    _onDblClick(event: MouseEvent, target: HTMLElement) {}

    #onPointerDown(event: PointerEvent) {
      this._onPointerDown(event, event.target as HTMLElement);
    }

    _onPointerDown(event: PointerEvent, target: HTMLElement) {}

    /* -------------------------------------------- */
    /*  Detached Windows                            */
    /* -------------------------------------------- */

    /**
     * Render a confirm dialog as a child of this application.
     */
    _confirmDialog(config: Record<string, any>): Promise<any> {
      const { promise, resolve } = Promise.withResolvers();
      const { yes = {}, no = {}, ...rest } = config;
      const app = new foundry.applications.api.DialogV2({
        ...rest,
        buttons: [
          foundry.utils.mergeObject(
            {
              action: 'yes',
              icon: 'fa-solid fa-check',
              label: game.i18n.localize('Yes'),
              default: true,
            },
            yes,
          ),
          foundry.utils.mergeObject(
            {
              action: 'no',
              icon: 'fa-solid fa-xmark',
              label: game.i18n.localize('No'),
            },
            no,
          ),
        ],
        submit: (result: unknown) => resolve(result),
      });
      app.addEventListener('close', () => resolve(null), { once: true });
      this._renderChild(app);
      return promise;
    }

    /**
     * Get render options to open an application as its own detached window.
     * @returns options for a detached window.
     */
    _detachOptions(): Record<string, any> {
      const { windowId } = (this.parent ?? this).window ?? {};
      return windowId ? { window: { detached: true, windowId } } : {};
    }

    /**
     * Render an application in the same workspace as this one.
     * @param app        The application to render.
     * @param [options]  Options passed to render.
     * @returns an app v2 instance
     */
    _renderChild(app: any, options = {}) {
      return (
        this.parent?.sheet?.renderChild?.(app, options) ??
        this.renderChild(app, options)
      );
    }
  }

  return SvelteApplication;
}
