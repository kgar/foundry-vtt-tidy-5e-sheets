export class EventHelper {
  static triggerContextMenu(
    event: (MouseEvent | PointerEvent) & { currentTarget: HTMLElement },
    targetSelector: string
  ) {
    event.preventDefault();
    event.stopPropagation();
    const { clientX, clientY } = event;
    event.currentTarget.closest(targetSelector)?.dispatchEvent(
      new PointerEvent('contextmenu', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX,
        clientY,
      })
    );
  }

  static triggerDynamicContentRenderedEvent(el: HTMLElement) {
    el.dispatchEvent(
      new CustomEvent('tidy5eDynamicContentRendered', { bubbles: true })
    );
  }

  static subscribeToDynamicContentRenderEvents(
    el: HTMLElement,
    listener: EventListenerOrEventListenerObject
  ) {
    el.addEventListener('tidy5eDynamicContentRendered', listener);
  }
}
