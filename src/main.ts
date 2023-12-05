import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/Tidy5eCharacterSheet';
import './scss/core.scss';
import { initSettings } from './settings/settings';
import { Tidy5eKgarItemSheet } from './sheets/Tidy5eItemSheet';
import { Tidy5eNpcSheet } from './sheets/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from './sheets/Tidy5eKgarVehicleSheet';
import { CONSTANTS } from './constants';
import { Tidy5eSheetsApi } from './api/Tidy5eSheetsApi';
import { HandlebarsContent } from './api/HandlebarsContent';

FoundryAdapter.registerActorSheet(
  Tidy5eCharacterSheet,
  [CONSTANTS.SHEET_TYPE_CHARACTER],
  'T5EK.Tidy5eSheet'
);

FoundryAdapter.registerActorSheet(
  Tidy5eNpcSheet,
  [CONSTANTS.SHEET_TYPE_NPC],
  'T5EK.Tidy5eNPC'
);

FoundryAdapter.registerActorSheet(
  Tidy5eVehicleSheet,
  [CONSTANTS.SHEET_TYPE_VEHICLE],
  'T5EK.Tidy5eVehicle'
);

FoundryAdapter.registerItemSheet(Tidy5eKgarItemSheet, 'T5EK.Tidy5eItemSheet');

FoundryAdapter.hooksOnce('ready', async () => {
  initSettings();

  const tidy5eModule = FoundryAdapter.getModule(CONSTANTS.MODULE_ID);
  const api = Tidy5eSheetsApi.getApi();
  tidy5eModule.api = api;

  // TODO: Remove after taking over the live module ID
  const prodTidy5eModule = FoundryAdapter.getModule('tidy5e-sheet');
  if (prodTidy5eModule) {
    prodTidy5eModule.api = tidy5eModule.api;
  }

  Hooks.call(CONSTANTS.HOOK_TIDY5E_SHEETS_READY, api);
});

Hooks.once('tidy5e-sheet.ready', async (api: Tidy5eSheetsApi) => {
  api.registerItemDetailSection({
    sectionTitle: 'Kgar Custom Section 🦁',
    content: new HandlebarsContent({
      path: `modules/${CONSTANTS.MODULE_ID}/templates/test.hbs`,
    }),
    onPrepareData(data) {
      data.secretKgarMessage = '🤖';
    },
    enabled(data) {
      return (
        data.itemType === 'Spell' &&
        data.system.target.type in CONFIG.DND5E.areaTargetTypes
      );
    },
  });
});

Hooks.once('tidy5e-sheet.ready', async (api: Tidy5eSheetsApi) => {
  api.registerItemDetailSection({
    content: new HandlebarsContent({
      path: `modules/${CONSTANTS.MODULE_ID}/templates/walled-templates-test.hbs`,
    }),
    onPrepareData(data) {
      if (
        typeof data.document.getFlag('walledtemplates', 'wallsBlock') ===
        'undefined'
      ) {
        data.document.setFlag('walledtemplates', 'wallsBlock', 'globalDefault');
      }

      if (
        typeof data.document.getFlag('walledtemplates', 'wallRestriction') ===
        'undefined'
      ) {
        data.document.setFlag(
          'walledtemplates',
          'wallRestriction',
          'globalDefault'
        );
      }

      // Set variable to know if we are dealing with a template
      const areaType = data.system.target.type;
      data.isTemplate = areaType in CONFIG.DND5E.areaTargetTypes;
      data.walledtemplates = {
        blockoptions: {
          unwalled: 'walledtemplates.MeasuredTemplateConfiguration.unwalled',
          walled: 'walledtemplates.MeasuredTemplateConfiguration.walled',
          recurse: 'walledtemplates.MeasuredTemplateConfiguration.recurse',
        },
        walloptions: {
          light: 'WALLS.Light',
          move: 'WALLS.Movement',
          sight: 'WALLS.Sight',
          sound: 'WALLS.Sound',
        },
        attachtokenoptions: {
          na: 'walledtemplates.dnd5e-spell-config.attach-token.na',
          caster: 'walledtemplates.dnd5e-spell-config.attach-token.caster',
          target: 'walledtemplates.dnd5e-spell-config.attach-token.target',
        },
      };
    },
    enabled(data) {
      return data.itemType === 'Spell';
    },
  });
});
