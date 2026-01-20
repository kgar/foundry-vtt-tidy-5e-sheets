To see various examples of the API in action, check out the API functions in this documentation and the [repo's world scripts](https://github.com/kgar/foundry-vtt-tidy-5e-sheets/tree/main/compatibility/world-scripts).

To see what API functionality is available, start at [the API class](classes/Tidy5eSheetsApi.html).

## Quick Start: Injecting HTML Into a Tidy Sheet

### For Tidy 5e Modern Sheets:

```js
// Every time an actor renders, whether a full render or a partial
Hooks.on("renderActorSheetV2", (sheet, element, data) => {
  const isTidySheet = element.classList.contains('tidy5e-sheet');

  if (!isTidySheet) {
    return;
  }

  // Here's some HTML
  const levelUpButton = `
    <button
      type="button"
      data-tidy-render-scheme="handlebars"
      class="inline-transparent-button"
    >
      <i class="fas fa-arrow-alt-circle-up"></i>
    </button>
  `;
  // pro tip: `data-tidy-render-scheme="handlebars"` causes this content to re-render on every Tidy render, full or partial

  // insert the HTML
  element
    .querySelector('[data-tidy-sheet-part="actor-name"]')
    .insertAdjacentHTML("afterend", levelUpButton);
});
```

### For Tidy 5e Classic Sheets:

```js
// Every time Tidy renders, whether a full render or a partial
Hooks.on("tidy5e-sheet.renderActorSheet", (sheet, element, data) => {
  // Here's some HTML
  const levelUpButton = `
    <button
      type="button"
      data-tidy-render-scheme="handlebars"
      class="inline-transparent-button"
    >
      <i class="fas fa-arrow-alt-circle-up"></i>
    </button>
  `;
  // pro tip: `data-tidy-render-scheme="handlebars"` causes this content to re-render on every Tidy render, full or partial

  // insert the HTML
  element
    .querySelector('[data-tidy-sheet-part="name-container"]')
    .insertAdjacentHTML("afterend", levelUpButton);
});
```

## Quick Reference

- [Flags](classes/TidyFlags.html)
- [Hooks](classes/TidyHooks.html)
