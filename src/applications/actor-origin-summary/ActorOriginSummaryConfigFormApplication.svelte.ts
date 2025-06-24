import { mount } from 'svelte';
import ActorOriginSummaryConfig from './ActorOriginSummaryConfig.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CONSTANTS } from 'src/constants';
import { error } from 'src/utils/logging';
import type {
  ApplicationClosingOptions,
  ApplicationRenderOptions,
  DocumentSheetConfiguration,
} from 'src/types/application.types';
import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';

export type ActorOriginSummaryContext = {
  isCharacter: boolean;
  race: string;
  canEditBackground: boolean;
  background: boolean;
  alignment: string;
  isNpc: boolean;
  environment: string;
  isVehicle: boolean;
  dimensions: string;
};

export default class ActorOriginSummaryConfigFormApplication extends DocumentSheetDialog<
  Partial<DocumentSheetConfiguration> | undefined,
  ActorOriginSummaryContext
>() {
  static DEFAULT_OPTIONS: Partial<DocumentSheetConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'quadrone',
      'tidy-origin-summary-application',
      'scrollable-window-content',
    ],
    window: {
      frame: true,
      positioned: true,
      resizable: false,
      controls: [],
    },
    position: {
      width: 380,
    },
    actions: {},
    submitOnClose: true,
    sheetConfig: false,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(ActorOriginSummaryConfig, {
      target: node,
      props: {
        sheet: this,
        context: this._context,
      },
    });
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.OriginSummaryConfig', {
      actorName: this.document.name,
    });
  }

  async _renderHTML(
    context: ActorOriginSummaryContext,
    options: ApplicationRenderOptions
  ) {
    game.user.apps[this.id] = this;
    this.document.apps[this.id] = this;

    return await super._renderHTML(context, options);
  }

  async close(options: ApplicationClosingOptions = {}) {
    delete game.user.apps[this.id];
    delete this.document.apps[this.id];

    return await super.close(options);
  }

  async _prepareContext() {
    return {
      race:
        this.document.system.details.race?.name ??
        this.document.system.details.race,
      background:
        this.document.system.details.background?.name ??
        this.document.system.details.background,
      environment: this.document.system.details.environment,
      alignment: this.document.system.details.alignment,
      dimensions: this.document.system.traits.dimensions,

      isCharacter: this.document.type === CONSTANTS.SHEET_TYPE_CHARACTER,
      canEditBackground: !this.document.system.details.background?.name,
      isNpc: this.document.type === CONSTANTS.SHEET_TYPE_NPC,
      isVehicle: this.document.type === CONSTANTS.SHEET_TYPE_VEHICLE,
    } satisfies ActorOriginSummaryContext;
  }

  async save() {
    if (!this.context) {
      error('Unable to save data due to an error.', true);
      console.error(
        'Unable to save Actor Origin Summary Config because the context is unexpectedly null.',
        this.document,
        this.context
      );
      return;
    }

    if (this.context.isCharacter) {
      const update: Record<string, any> = {
        'system.details.alignment': this.context.alignment,
      };
      if (this.context.canEditBackground) {
        update['system.details.background'] = this.context.background;
      }
      await this.document.update(update);
    } else if (this.context.isNpc) {
      await this.document.update({
        'system.details.environment': this.context.environment,
        'system.details.alignment': this.context.alignment,
      });
    } else if (this.context.isVehicle) {
      await this.document.update({
        'system.traits.dimensions': this.context.dimensions,
      });
    }
    this.close();
  }
}
