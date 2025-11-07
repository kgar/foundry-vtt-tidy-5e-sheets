export class EventHelper {
  static triggerContextMenu(
    event: (MouseEvent | PointerEvent | Event) & { currentTarget: HTMLElement },
    targetSelector?: string
  ) {
    event.preventDefault();
    event.stopPropagation();

    let clientX = 0;
    let clientY = 0;

    if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      var clientRect = event.currentTarget.getBoundingClientRect();
      clientX = clientRect.left;
      clientY = clientRect.top;
    }

    const target = targetSelector
      ? event.currentTarget.closest(targetSelector)
      : event.currentTarget;

    target?.dispatchEvent(
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
