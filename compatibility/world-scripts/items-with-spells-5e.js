/*
    Compatibility world script for items-with-spells version 11.1.0 https://github.com/krbz999/foundryvtt-items-with-spells-5e
    How to add world scripts to a game world: https://foundryvtt.wiki/en/basics/world-scripts
    Alternatively, use World Scripter: https://foundryvtt.com/packages/world-scripter
    
    --------------
    | DISCLAIMER |
    --------------
    Use this world script at your own risk. If the module author provides compatibility with Tidy 5e sheets,
    it is advised to discontinue the use of a world script and instead update the module.
*/

// 👇 Make sure you specify the right path to the module
const pathToItemsWithSpells =
  '/modules/items-with-spells-5e/scripts/classes/item-sheet.js';
// 👆 Make sure you specify the right path to the module

// World Scripter integration 😉
const api =
  game.modules.get('tidy5e-sheet')?.api;

if (api) {
  addItemsWithSpellsTab(api);
} else {
  // This only fires when this module is active: https://github.com/kgar/foundry-vtt-tidy-5e-sheets
  Hooks.once('tidy5e-sheet.ready', (api) => {
    addItemsWithSpellsTab(api);
  });
}

async function addItemsWithSpellsTab(api) {
  if (!game.modules.get('items-with-spells-5e')?.active) {
    return;
  }

  const { ItemsWithSpells5eItemSheet } = await import(pathToItemsWithSpells);

  function includeTab(itemType) {
    let include = false;
    try {
      include = !!game.settings.get(
        'items-with-spells-5e',
        `includeItemType${itemType.titleCase()}`
      );
    } catch {}
    return include;
  }

  api.registerItemTab(
    new api.models.HtmlTab({
      tabId: 'items-with-spells-5e-tab',
      title: game.i18n.localize(`ITEM.TypeSpellPl`),
      html: ``,
      enabled(data) {
        return includeTab(data.item.type);
      },
      onRender(params) {
        if (includeTab(params.data.item.type)) {
          let instance = ItemsWithSpells5eItemSheet.instances.get(
            params.data.appId
          );
          instance.renderHeavy(params.tabContentsElement);
          // After HTML is added, flex the inner tab content area to the full height of the actual tab contents area
          setTimeout(() => {
            $(params.tabContentsElement)
              .find('>:first-child')
              .addClass('flex-1');
          });
        }
      },
    })
  );
}
