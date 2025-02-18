import { CONSTANTS } from 'src/constants';
import type { ContextMenuPositionInfo } from './context-menu.types';
import { TidyHooks } from 'src/foundry/TidyHooks';

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
  jQuery?: boolean;
  /** If true, the context menu is given a fixed position rather than being injected into the target. */
  fixed?: boolean;
};

/**
 * A specialized subclass of ContextMenu that places the menu in a fixed position.
 * @extends {ContextMenu}
 */
export default class FloatingContextMenu extends ContextMenu {
  constructor(
    container: any,
    selector: string,
    menuItems: ContextMenuEntry[] = [],
    options: ContextMenuOptionsV13 = {}
  ) {
    super(container, selector, menuItems, options);
  }

  /** TODO: When Foundry V13 only, remove typing for jQuery */
  _setPosition(html: any, target: any, options: any) {
    if ('classList' in html && 'classList' in target) {
      html.classList.add('tidy5e-sheet');
      return this._setFixedPosition(html, target, options);
    } else {
      html = html[0];
      target = target[0];
    }

    const positionInfo: ContextMenuPositionInfo = {
      insertTarget: document.body,
      html: html,
      target: target,
    };

    if (
      !TidyHooks.tidy5eSheetsPrepareFloatingContextMenuPosition(positionInfo)
    ) {
      return;
    }

    positionInfo.insertTarget.appendChild(html);
    const { clientWidth, clientHeight } = positionInfo.insertTarget;
    const { width, height } = html.getBoundingClientRect();

    const { clientX, clientY } = window.event as MouseEvent;
    const left = Math.min(clientX + 1, clientWidth - width);
    this._expandUp = clientY + height > clientHeight;
    html.classList.add('floating');
    html.classList.add('tidy5e-sheet');
    html.classList.toggle('expand-up', this._expandUp);
    html.classList.toggle('expand-down', !this._expandUp);
    html.style.visibility = '';
    html.style.left = `${left}px`;
    if (this._expandUp) html.style.bottom = `${clientHeight - clientY}px`;
    else html.style.top = `${clientY}px`;
    target.classList.add('context');
  }
}
