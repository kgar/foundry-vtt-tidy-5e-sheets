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

export function removeTidyHeaderButtons(header: HTMLElement) {
  header
    .querySelectorAll<HTMLElement>(`[${tidyHeaderAttribute}]`)
    .forEach((el: HTMLElement) => el.remove());
}
