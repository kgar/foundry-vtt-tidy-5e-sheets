let newTruesightValue = !game.settings.get('tidy5e-sheet', 'truesight');

game.settings.set('tidy5e-sheet', 'truesight', newTruesightValue);

if (newTruesightValue) {
  ui.notifications.info(
    'Your vision expands. You can now see Tidy 5e works in progress which were once invisible to the eye.'
  );
} else {
  ui.notifications.info(
    'Your vision returns to normal. Truesight is disabled.'
  );
}
