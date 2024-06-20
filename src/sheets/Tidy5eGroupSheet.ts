import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from './SvelteApplicationMixin';

export class Tidy5eGroupSheet extends SvelteApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
    classes: [CONSTANTS.MODULE_ID, 'group'],
    tag: 'div',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
    },
    position: {
      width: 480,
      height: 'auto',
    },
  };
}
