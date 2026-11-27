import { getSvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import type {
  ChooseMultipleArgs,
  ChooseFromOptionsArgs as ChooseOneArgs,
  Resolvable,
} from './tidy-dialog.types';
import { mount, type SvelteComponent } from 'svelte';
import ChooseOneDialog from './ChooseOneDialog.svelte';
import type { ComponentWithProps } from 'src/utils/component';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CONSTANTS } from 'src/constants';
import ChooseMultipleDialog from './ChooseMultipleDialog.svelte';

export type TidyDialogContext = {};

export type TidyDialogApplicationConfiguration =
  Partial<ApplicationConfiguration> & {
    callbacks: Resolvable;
    getComponentParts: TidyDialogComponentPartsFunction;
  };

export type TidyDialogComponentPartsFunction = (
  app: TidyDialog,
  node: HTMLElement,
  callbacks: Resolvable,
) => ComponentWithProps<any>;

export type WaitParams = {
  title: string;
  getComponentParts: TidyDialogComponentPartsFunction;
  valueOnClose?: any;
};

export class TidyDialog extends getSvelteApplicationMixin<
  TidyDialogApplicationConfiguration,
  TidyDialogContext
>(foundry.applications.api.ApplicationV2) {
  constructor(options: TidyDialogApplicationConfiguration) {
    super(options);
    this._getComponentParts = options.getComponentParts;
    this._callbacks = options.callbacks;
  }

  static DEFAULT_OPTIONS = {
    id: 'dialog-{id}',
    classes: [CONSTANTS.MODULE_ID, 'dialog', 'sheet', 'quadrone', 'flexcol'],
    tag: 'dialog',
    form: {
      closeOnSubmit: true,
    },
    window: {
      frame: true,
      positioned: true,
      minimizable: false,
    },
  };

  createComponentImplementation: (() => SvelteComponent<any>) | undefined;

  _callbacks: Resolvable;

  _getComponentParts: TidyDialogComponentPartsFunction;

  _createComponent(node: HTMLElement): Record<string, any> {
    const componentParts = this._getComponentParts(this, node, this._callbacks);

    const component = mount(componentParts.component, {
      target: node,
      props: componentParts.props,
    });

    return component;
  }

  static async chooseMultiple<T>(
    {
      title = 'TIDY5E.COMMON.Action.Choose',
      message,
      options,
    }: ChooseMultipleArgs<T>,
    waitParams?: WaitParams,
  ): Promise<T[]> {
    return this.wait({
      title,
      getComponentParts(app, _node, callbacks) {
        const componentParts: ComponentWithProps<typeof ChooseMultipleDialog> =
          {
            component: ChooseMultipleDialog,
            props: { app: app, ...callbacks, options, message },
          };

        return componentParts;
      },
      valueOnClose: [],
      ...waitParams,
    });
  }

  static async chooseOne<T>(
    {
      title = 'TIDY5E.COMMON.Action.ChooseOne',
      message,
      options,
    }: ChooseOneArgs<T>,
    waitParams?: WaitParams,
  ): Promise<T | undefined> {
    message ??= 'TIDY5E.COMMON.Actions.ChooseOne';

    return this.wait({
      title,
      getComponentParts(app, _node, callbacks) {
        const componentParts: ComponentWithProps<typeof ChooseOneDialog> = {
          component: ChooseOneDialog,
          props: { app: app, ...callbacks, options, message },
        };

        return componentParts;
      },
      ...waitParams,
    });
  }

  static async wait(params: WaitParams) {
    return new Promise<any>((resolve, reject) => {
      const dialog = new this({
        window: { title: params.title },
        getComponentParts: params.getComponentParts,
        callbacks: { resolve, reject },
      });

      dialog.addEventListener(
        'close',
        (event: Event) => {
          resolve(params.valueOnClose);
        },
        { once: true },
      );

      dialog.render({ /* render options? */ force: true });
    });
  }
}
