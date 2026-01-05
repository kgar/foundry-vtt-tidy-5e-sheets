import { CONSTANTS } from 'src/constants';

interface ContextMenuEntry {
  name: string;
  icon?: string;
  classes?: string;
  group?: string;
  callback: (target: any) => void;
  condition?: (html: any) => boolean | boolean;
}

type ContextMenuOptions = {
  /** Optionally override the triggering event which can spawn the menu. If the menu is using a fixed position, this event must be a MouseEvent. */
  eventName?: string;
  /** A function to call when the context menu is opened. */
  onOpen?: (target: any) => void;
  /** A function to call when the context menu is closed. */
  onClose?: (target: any) => void;
  /** If true, callbacks will be passed jQuery objects instead of HTMLElement instances. */
  jQuery?: false;
  /** If true, the context menu is given a fixed position rather than being injected into the target. */
  fixed?: boolean;
} & {
  layout: typeof CONSTANTS.SHEET_LAYOUT_QUADRONE;
};

/**
 * A specialized subclass of ContextMenu that places the menu in a fixed position.
 * @extends {ContextMenu}
 */
export default class FloatingContextMenu extends foundry.applications.ux
  .ContextMenu {
  #layout: string;

  constructor(
    container: any,
    selector: string,
    menuItems: ContextMenuEntry[],
    options: ContextMenuOptions
  ) {
    super(container, selector, menuItems, options);

    this.#layout = options.layout;
  }

  _setPosition(html: any, target: any, options: any) {
    html.classList.add('floating', 'tidy5e-sheet', this.#layout, 'context');
    return this._setFixedPosition(html, target, options);
  }
}
