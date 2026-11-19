import { Theme } from './theme';

const _detachedWindowIdsToStylesheets = new Map<string, CSSStyleSheet>();

Hooks.on('openDetachedWindow', function (id: string, window: Window) {
  const detachedDocument = window.document;
  const detachedWindow = detachedDocument.defaultView;

  if (!detachedWindow) {
    return;
  }

  const copiedStylesheet = new detachedWindow.CSSStyleSheet();

  _detachedWindowIdsToStylesheets.set(id, copiedStylesheet);
  Theme.subscribeStylesheet(copiedStylesheet);

  detachedDocument.adoptedStyleSheets.push(copiedStylesheet);
});

Hooks.on('closeDetachedWindow', function (id: string) {
  const stylesheet = _detachedWindowIdsToStylesheets.get(id);
  if (stylesheet) {
    _detachedWindowIdsToStylesheets.delete(id);
    Theme.unsubscribeStylesheet(stylesheet);
  }
});
