/*
    How to add world scripts to a game world: https://foundryvtt.wiki/en/basics/world-scripts
    Alternatively, use World Scripter: https://foundryvtt.com/packages/world-scripter
    
    --------------
    | DISCLAIMER |
    --------------
    Use this world script at your own risk. If the module author provides compatibility with Tidy 5e sheets,
    it is advised to discontinue using the world script and update the module.
*/

// World Scripter integration 😉
const api =
  game.modules.get('tidy5e-sheet')?.api ??
  game.modules.get('tidy5e-sheet-kgar').api;

if (api) {
  mapActivationTypes(api);
} else {
  // This only fires when this module is active: https://github.com/kgar/foundry-vtt-tidy-5e-sheets
  Hooks.once('tidy5e-sheet.ready', (api) => {
    mapActivationTypes(api);
  });
}

function mapActivationTypes(api) {
  api.actionList.mapActivationTypesToSections({
    reactionpreattack: 'reaction',
    reactiondamage: 'reaction',
    reactionmanual: 'reaction',
  });
}
