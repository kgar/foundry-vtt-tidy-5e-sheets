import type { ContextMenuPositionInfo } from './context-menu.types';

/**
 * A specialized subclass of ContextMenu that places the menu in a fixed position.
 * @extends {ContextMenu}
 */
export default class FloatingContextMenu extends ContextMenu {
  constructor(...args: any[]) {
    super(...args);
  }

  /** @override */
  _setPosition([html]: [html: HTMLElement], [target]: [target: HTMLElement]) {
    const positionInfo: ContextMenuPositionInfo = {
      insertTarget: document.body,
      html: html,
      target: target,
    };

    if (
      !Hooks.call(
        'tidy5e-sheet.prepareFloatingContextMenuPosition',
        positionInfo
      )
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
