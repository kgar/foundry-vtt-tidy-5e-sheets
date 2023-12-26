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
