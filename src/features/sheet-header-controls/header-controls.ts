export function createHeaderButton(
  label: string,
  action: string,
  icon: string
) {
  return `<button type="button" class="header-control ${icon}" data-action="${action}" data-tooltip="${label}" aria-label="${label}"></button>`;
}

export function insertHeaderButton(app: any, frame: HTMLElement, html: string) {
  let anchor =
    frame.querySelector('[data-action="copyUuid"]') ?? app.window.close;

  if (anchor) {
    anchor.insertAdjacentHTML('beforebegin', html);
  }
}
