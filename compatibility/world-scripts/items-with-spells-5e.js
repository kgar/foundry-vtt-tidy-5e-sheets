/*
    Compatibility world script for items-with-spells version 11.1.0 https://github.com/krbz999/foundryvtt-items-with-spells-5e
    How to add world scripts to a game world: https://foundryvtt.wiki/en/basics/world-scripts
    
    --------------
    | DISCLAIMER |
    --------------
    Use this world script at your own risk. If the module author provides compatibility with Tidy 5e sheets,
    it is advised to discontinue the use of a world script and instead update the module.
*/

// 👇 Make sure you specify the right path to the module
import { ItemsWithSpells5eItemSheet } from '/modules/items-with-spells-5e/scripts/classes/item-sheet.js';
// 👆 Make sure you specify the right path to the module

// This only fires when this module is active: https://github.com/kgar/foundry-vtt-tidy-5e-sheets
Hooks.on('tidy5e-sheet.ready', (api) => {
  if (!game.modules.get('items-with-spells-5e')?.active) {
    return;
  }

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
      tabId: 'items-with-spells-tab',
      title: game.i18n.localize(`ITEM.TypeSpellPl`),
      html: `<div class='sheet-body' role='presentation'></div>`,
      tabContentsClasses: ['items-with-spells-tab'],
      enabled(data) {
        return includeTab(data.item.type);
      },
      onRender(args) {
        if (includeTab(args.data.item.type)) {
          let instance = ItemsWithSpells5eItemSheet.instances.get(
            args.data.appId
          );
          instance.renderHeavy($(args.tabContentsElement));
        }
      },
    })
  );
});
