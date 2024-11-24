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
}
