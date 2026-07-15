import { CONSTANTS } from 'src/constants';

interface ContextMenuEntry {
  name: string;
  icon?: string;
  classes?: string;
  group?: string;
  callback: (target: any) => void;
  condition?: (html: any) => boolean | boolean;
}

type ContextMenuOptionsV13 = {
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
  layout:
    | typeof CONSTANTS.SHEET_LAYOUT_CLASSIC
    | typeof CONSTANTS.SHEET_LAYOUT_QUADRONE;
};

/**
 * A specialized subclass of ContextMenu that places the menu in a fixed position.
 * @extends {ContextMenu}
 */
export default class FloatingContextMenu
  extends foundry.applications.ux.ContextMenu
{
  #layout: string;

  constructor(
    container: any,
    selector: string,
    menuItems: ContextMenuEntry[],
    options: ContextMenuOptionsV13,
  ) {
    super(container, selector, menuItems, options);

    options.layout ??=
      // TODO: remove _inferLayout when we are 14-only.
      game.release.generation <= 14
        ? this._inferLayout(container)
        : CONSTANTS.SHEET_LAYOUT_QUADRONE;

    this.#layout = options.layout;
  }

  _inferLayout(container: any): ContextMenuOptionsV13['layout'] {
    const el = container.get?.(0) ?? container;

    return el
      .closest(`.${CONSTANTS.MODULE_ID}`)
      ?.classList?.contains(CONSTANTS.SHEET_LAYOUT_CLASSIC)
      ? CONSTANTS.SHEET_LAYOUT_CLASSIC
      : CONSTANTS.SHEET_LAYOUT_QUADRONE;
  }

  _setPosition(html: any, target: any, options: any) {
    html.classList.add('floating', 'tidy5e-sheet', this.#layout, 'context');
    return this._setFixedPosition(html, target, options);
  }
}
