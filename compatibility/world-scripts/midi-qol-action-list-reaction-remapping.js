Hooks.once('tidy5e-sheet.ready', (api) => {
  api.actionList.mapActivationTypesToSections({
    reactionpreattack: 'reaction',
    reactiondamage: 'reaction',
    reactionmanual: 'reaction',
  });
});
