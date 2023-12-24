// World Scripter integration 😉
const api =
  game.modules.get('tidy5e-sheet')?.api ??
  game.modules.get('tidy5e-sheet-kgar').api;

if (api) {
  applyCompatibility(api);
} else {
  Hooks.once('tidy5e-sheet.ready', async (api) => {
    applyCompatibility(api);
  });
}

async function applyCompatibility(api) {
  if (!game.modules.get('beavers-crafting').active) {
    return;
  }

  const { Settings } = await import(
    '/modules/beavers-crafting/src/Settings.js'
  );
  const { ActorSheetTab } = await import(
    '/modules/beavers-crafting/src/apps/ActorSheetTab.js'
  );
  const { ActorSheetCraftedInventory } = await import(
    '/modules/beavers-crafting/src/apps/ActorSheetCraftedInventory.js'
  );

  function createCraftingTab(api) {
    return new api.models.HtmlTab({
      html: '<div class="sheet-body scroll-container"></div>',
      title: 'beaversCrafting.actorSheet.tab',
      tabId: 'beavers-crafting-tab',
      tabContentsClasses: ['beavers-crafting'],
      enabled: (data) => !Settings.isDisabledActor(data.actor),
      onRender: ({ app, data, tabContentsElement, isFullRender }) => {
        // prevent tab activation console errors on my sheets
        for (let tab of app._tabs ?? []) {
          tab.activate = () => {};
        }
        const html = $(tabContentsElement);
        if (!isFullRender) {
          if (!Settings.isDisabledActor(app.actor)) {
            new ActorSheetTab(app, html, data);
          }
          new ActorSheetCraftedInventory(app, html, data);
        }
      },
    });
  }

  api.registerActorTab(createCraftingTab(api));
}
