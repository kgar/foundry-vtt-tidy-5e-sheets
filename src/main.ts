import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/Tidy5eCharacterSheet';
import './scss/core.scss';
import { initSettings } from './settings/settings';
import { Tidy5eKgarItemSheet } from './sheets/Tidy5eItemSheet';
import { Tidy5eNpcSheet } from './sheets/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from './sheets/Tidy5eKgarVehicleSheet';
import { CONSTANTS } from './constants';
import { Tidy5eSheetsApi } from './api/Tidy5eSheetsApi';
import { HandlebarsTemplateContent } from './api/HandlebarsTemplateContent';

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

// Hooks.once('tidy5e-sheet.ready', async (api: Tidy5eSheetsApi) => {
//   api.registerItemDetailSection({
//     sectionTitle: 'Kgar Custom Section 🦁',
//     content: new HandlebarsTemplateContent({
//       path: `modules/${CONSTANTS.MODULE_ID}/templates/test.hbs`,
//     }),
//     onPrepareData(data) {
//       data.secretKgarMessage = '🤖';
//     },
//     enabled(data) {
//       return (
//         data.itemType === 'Spell' &&
//         data.system.target.type in CONFIG.DND5E.areaTargetTypes
//       );
//     },
//     onRender(args) {
//       const appId = args.app.appId;
//       const classList = args.element.classList;
//       const secretMessage = args.data.secretKgarMessage;
//       console.log(
//         `App ID ${appId} | item ${args.data.item.name} | With classes ${classList} | Secret Message: ${secretMessage}`
//       );

//       // ⚠ only update the HTML you are injecting, because rendering works differently on these sheets.
//       $(args.element)
//         .find(`[id="kgar-secret-message-button-${appId}"]`)
//         .on('click', function () {
//           alert(secretMessage);
//         });
//     },
//   });
// });

Hooks.on('tidy5e-sheet.ready', (api: Tidy5eSheetsApi) => {
  const handlebarsTab = new api.models.HandlebarsTab({
    path: `modules/${CONSTANTS.MODULE_ID}/templates/test.hbs`,
    title: 'Test',
    
    // enabled: (data) => {
    //   // let enabled = false;
    //   // try {
    //   //   enabled = !!game.settings.get(
    //   //     'items-with-spells-5e',
    //   //     `includeItemType${data.item.type.titleCase()}`
    //   //   );
    //   // } catch {}
    //   // return enabled;
    //   return true;
    // },
  });

  api.registerItemTab(handlebarsTab);
});
