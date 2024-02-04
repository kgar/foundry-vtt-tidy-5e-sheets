/*
    Compatibility world script for 5esheet-resourcesPlus:
    - https://foundryvtt.com/packages/resourcesplus
    - https://github.com/ardittristan/5eSheet-resourcesPlus
    
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
  game.modules.get('tidy5e-sheet')?.api;

if (api) {
  wireUpResourcesPlus();
} else {
  // This only fires when this module is active: https://github.com/kgar/foundry-vtt-tidy-5e-sheets
  Hooks.once('tidy5e-sheet.ready', () => {
    wireUpResourcesPlus();
  });
}

function wireUpResourcesPlus() {
  if (!game.modules.get('resourcesplus').active) {
    return;
  }

  Hooks.on('tidy5e-sheet.prepareResources', hideResourcesWhichShouldBeHidden);
  Hooks.on('renderEntitySheetConfig', updateResourcesCountOnSubmit);
  Hooks.on('renderDocumentSheetConfig', updateResourcesCountOnSubmit);
}

function hideResourcesWhichShouldBeHidden(tidyResources, actor) {
  const configuredNumberOfResources = tidyResources.find(
    (r) => r.name === 'count'
  ).value;

  const globalLimit = game.settings.get('resourcesplus', 'globalLimit');
  const configuredLocalLimit = game.settings.get('resourcesplus', 'localLimit');
  const localLimit =
    configuredLocalLimit == -1 ? globalLimit : configuredLocalLimit;

  const numberOfResourcesToShow = Math.min(
    parseInt(configuredNumberOfResources),
    parseInt(localLimit),
    parseInt(globalLimit)
  );

  if (!isNaN(numberOfResourcesToShow)) {
    tidyResources
      .slice(numberOfResourcesToShow)
      .forEach((r) => r.cssClasses.push('hidden'));
  }
}

function updateResourcesCountOnSubmit(entity, html) {
  if (
    !game.settings.get('resourcesplus', 'useNewSettingsLocation') ||
    entity?.object?.type !== 'character'
  )
    return;

  html.find('button[type=submit]').on('click', (e) => {
    const oldValue = entity?.object?.system?.resources?.count?.value;
    const newValue = $(e.target.form).find('input#resourceCount').val();
    if (oldValue !== undefined) {
      entity.object.update({ 'system.resources.count.value': newValue });
    }
  });
}
