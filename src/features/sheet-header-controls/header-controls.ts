export const tidyHeaderAttribute = 'data-tidy-header-control';

export function createHeaderButton(
  label: string,
  action: string,
  icon: string
) {
  return `<button type="button" class="header-control icon ${icon}" data-action="${action}" data-tooltip="${label}" aria-label="${label}" ${tidyHeaderAttribute}></button>`;
}

export function insertHeaderButton(
  app: any,
  sheetElement: HTMLElement,
  html: string
) {
  let anchor =
    sheetElement.querySelector('.window-header [data-action="copyUuid"]') ??
    sheetElement.querySelector('.window-header [data-action="configureSheet"]') ??
    app.window.close;

  if (anchor) {
    anchor.insertAdjacentHTML('beforebegin', html);
  }
}

export function removeTidyHeaderButtons(sheetElement: HTMLElement) {
  sheetElement
    .querySelectorAll<HTMLElement>(`.window-header [${tidyHeaderAttribute}]`)
    .forEach((el: HTMLElement) => el.remove());
}
