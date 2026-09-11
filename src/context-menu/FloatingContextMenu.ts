import { CONSTANTS } from 'src/constants';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';

interface ContextMenuOptions {
  eventName?: string;
  onOpen?: (target: HTMLElement) => void;
  onClose?: (target: HTMLElement) => void;
  fixed?: boolean;
  relative?: "target" | "cursor";
  jQuery?: boolean;
  closeOnSelect?: boolean;
}

/**
 * A specialized subclass of ContextMenu that places the menu in a fixed position.
 * @extends {ContextMenu}
 */
export default class FloatingContextMenu
  extends foundry.applications.ux.ContextMenu
{
  constructor(
    container: any,
    selector: string,
    menuItems: ContextMenuEntry[],
    options: ContextMenuOptions,
  ) {
    super(container, selector, menuItems, options);
  }

  _setPosition(html: any, target: any, options: any) {
    html.classList.add(
      'floating',
      'tidy5e-sheet',
      CONSTANTS.SHEET_LAYOUT_QUADRONE,
      'context',
    );
    return this._setFixedPosition(html, target, options);
  }
}
