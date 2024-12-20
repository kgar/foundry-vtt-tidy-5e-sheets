export function createHeaderButton(
  label: string,
  action: string,
  icon: string
) {
  return `<button type="button" class="header-control ${icon}" data-action="${action}" data-tooltip="${label}" aria-label="${label}" data-tidy-header-control></button>`;
}

export function insertHeaderButton(
  app: any,
  header: HTMLElement,
  html: string
) {
  let anchor =
    header.querySelector('[data-action="copyUuid"]') ??
    header.querySelector('[data-action="configureSheet"]') ??
    app.window.close;

  if (anchor) {
    anchor.insertAdjacentHTML('beforebegin', html);
  }
}
