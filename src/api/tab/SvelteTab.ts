import type { ComponentType } from 'svelte';
import type { OnRenderTabParams } from 'src/types/types';
import type { RenderScheme } from '../api.types';
import { CustomTabBase, type CustomTabTitle } from './CustomTabBase';
import { warn } from 'src/utils/logging';

/**
 * The information necessary for rendering a svelte-based tab.
 *
 * @example Getting the API and creating a svelte-based tab with custom props and an extended context map.
 * ```js
 * Hooks.once('tidy5e-sheet.ready', (api) => {
 *   const myTab = new api.models.SvelteTab({
 *     tabId: 'my-module-id-my-example-svelte-tab',
 *     title: 'My Tab',
 *     component: MyCustomSvelteComponent,
 *     getProps(data) {
 *       return {
 *         message: `Hello, ${data.actor.name}! 👋`,
 *       };
 *     },
 *     getContext(context) {
 *       context.set(
 *         'custom-context',
 *         `This text came from some custom context that I injected during tab setup. It was rendered at ${new Date()}`
 *       );
 *       return context;
 *     },
 *   });
 *
 *   // To Do: Register this svelte-based tab!
 * });
 * ```
 */
/** @category Tabs */
export class SvelteTab extends CustomTabBase {
  /**
   * A reference to the `.svelte` component.
   */
  component?: ComponentType = undefined;
  title: CustomTabTitle = '';
  tabId: string = '';
  /**
   * For svelte-based tabs, the render scheme is set to 'force' and generally ignored.
   */
  renderScheme?: RenderScheme = 'force';
  tabContentsClasses?: string[] = [];

  private _activateDefaultSheetListeners?: boolean | undefined = false;
  public get activateDefaultSheetListeners(): boolean | undefined {
    return this._activateDefaultSheetListeners;
  }
  public set activateDefaultSheetListeners(value: boolean | undefined) {
    warn(
      'Tidy is moving to Application V2, and there will no longer be any default sheet listeners. Be sure to provide your own event handling for the content that is injected.'
    );
    this._activateDefaultSheetListeners = value;
  }

  constructor(props?: Partial<SvelteTab>) {
    super();

    const merged = foundry.utils.mergeObject(this, props);
    Object.assign(this, merged);
  }

  /**
   * An optional function that provides the relevant application context
   * (item sheet context, character sheet context, NPC sheet context, etc.)
   * and expects an object in return.
   * The return value is passed to the svelte component as its props.
   */
  getProps?: (data: any) => Record<string, any>;

  /**
   * An optional function that provides the relevant svelte context map and
   * expects the component's ideal context map in return.
   *
   * @remarks
   * For most sheets, a guaranteed entry in the context map is a readable store
   * of the sheet's application context
   * (item sheet context, character sheet context, NPC sheet context, etc.).
   */
  getContext?: (context: Map<any, any>) => Map<any, any>;

  enabled?: (data: any) => boolean;

  onRender?: (params: OnRenderTabParams) => void;
}
