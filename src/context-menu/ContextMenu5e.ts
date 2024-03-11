import type { ContextMenuPositionInfo } from './context-menu.types';

/**
 * A specialized subclass of ContextMenu that places the menu in a fixed position.
 * @extends {ContextMenu}
 */
export default class ContextMenu5e extends ContextMenu {
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
    const { clientWidth, clientHeight } = document.documentElement;
    const { width, height } = html.getBoundingClientRect();

    // TODO: Improve core ContextMenu class to provide this event rather than using the global event.
    const { clientX, clientY } = window.event as MouseEvent;
    const left = Math.min(clientX, clientWidth - width);
    this._expandUp = clientY + height > clientHeight;
    // html.classList.add('dnd5e2');
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
