import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/Tidy5eCharacterSheet';
import './scss/core.scss';
import { SettingsProvider, initSettings } from './settings/settings';
import { Tidy5eKgarItemSheet } from './sheets/Tidy5eItemSheet';
import { Tidy5eNpcSheet } from './sheets/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from './sheets/Tidy5eKgarVehicleSheet';
import { CONSTANTS } from './constants';
import { Tidy5eSheetsApi } from './api/Tidy5eSheetsApi';
import '../public/rpg-awesome/style/rpg-awesome.min.css';
import { initRuntime } from './runtime/runtime-init';
import MigrationNotificationFormApplication from 'src/migrations/notification/MigrationNotificationFormApplication';
import { MigrationTally } from 'src/migrations/MigrationTally';
import { Tidy5eKgarContainerSheet } from './sheets/Tidy5eContainerSheet';
import { setupModuleIntegrations } from './integration/integration';
import { TidyHooks } from './foundry/TidyHooks';
import { Tidy5eGroupSheet } from './sheets/Tidy5eGroupSheet';

Hooks.once('init', () => {
  DocumentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eCharacterSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_CHARACTER],
      label: 'TIDY5E.Tidy5eSheet',
    }
  );

  DocumentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eNpcSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_NPC],
      label: 'TIDY5E.Tidy5eNPC',
    }
  );

  DocumentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eVehicleSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_VEHICLE],
      label: 'TIDY5E.Tidy5eVehicle',
    }
  );

  DocumentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eKgarItemSheet,
    {
      types: [
        CONSTANTS.ITEM_TYPE_BACKGROUND,
        CONSTANTS.ITEM_TYPE_CLASS,
        CONSTANTS.ITEM_TYPE_CONSUMABLE,
        CONSTANTS.ITEM_TYPE_EQUIPMENT,
        CONSTANTS.ITEM_TYPE_FEAT,
        CONSTANTS.ITEM_TYPE_LOOT,
        CONSTANTS.ITEM_TYPE_RACE,
        CONSTANTS.ITEM_TYPE_SPELL,
        CONSTANTS.ITEM_TYPE_SUBCLASS,
        CONSTANTS.ITEM_TYPE_TOOL,
        CONSTANTS.ITEM_TYPE_WEAPON,
      ],
      label: 'TIDY5E.Tidy5eItemSheet',
    }
  );

  DocumentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eKgarContainerSheet,
    {
      types: [CONSTANTS.SHEET_TYPE_CONTAINER],
      label: 'TIDY5E.Tidy5eContainerSheet',
    }
  );

  if (FoundryAdapter.isFoundryV12OrHigher()) {
    DocumentSheetConfig.registerSheet(
      Actor,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eGroupSheet,
      {
        types: [CONSTANTS.SHEET_TYPE_GROUP],
        label: 'TIDY5E.Tidy5eGroupSheetClassic',
      }
    );
  }

  initSettings();
  initRuntime();
});

Hooks.once('ready', async () => {
  const tidy5eModule = FoundryAdapter.getModule(CONSTANTS.MODULE_ID);
  const api = Tidy5eSheetsApi._getApi();
  tidy5eModule.api = api;

  TidyHooks.tidy5eSheetsReady(api);

  setupModuleIntegrations(api);

  if (
    FoundryAdapter.userIsGm() &&
    SettingsProvider.settings.migrationsConfirmationTally.get() < MigrationTally
  ) {
    new MigrationNotificationFormApplication().render(true);
  }
});

Hooks.once('tidy5e-sheet.ready', (api: Tidy5eSheetsApi) => {
  api.registerGroupTab(
    new api.models.HtmlTab({
      title: 'My HTML Tab',
      html: `
      <div class='scroll-container'>
        <h1>Hello, world!</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
      </div>
      `,
      tabId: 'test-tidy-html-tab',
      onRender(params) {
        console.warn('✅ onRender', params);
      },
    })
  );

  api.registerGroupContent(
    new api.models.HtmlContent({
      html: `<a title="Example Button" class="my-custom-icon"><i class="fas fa-user"></i></a>`,
      injectParams: {
        selector: api.getSheetPartSelector(
          api.constants.SHEET_PARTS.NAME_CONTAINER
        ),
        position: 'beforebegin',
      },
      onContentReady: (params) => {
        console.log('content ready to render', params);
        console.log('my content', params.content);
      },
      onRender: (params) => {
        params.element
          ?.querySelector('.my-custom-icon')
          ?.addEventListener('click', () => alert('Clicked custom PC icon'));
      },
    })
  );

  api.registerGroupTab(
    new api.models.HandlebarsTab({
      title: 'My Handlebars Tab',
      path: '/modules/tidy5e-sheet/templates/test.hbs',
      tabId: 'my-module-id-registered-character-tab',
      getData: async (data) => {
        data['myMessage'] =
          '<span class="kgar-message">Hello, world! 🌊🏄‍♂️</span>';
        data['test1'] = data.actor.getFlag('tidy5e-sheet', 'test1');
        data['test2'] = data.actor.getFlag('tidy5e-sheet', 'test2');
        data['test3'] = data.actor.getFlag('tidy5e-sheet', 'test3');
        return Promise.resolve(data);
      },
      onRender(params) {
        const myTab = $(params.tabContentsElement);
        myTab
          .find('.kgar-message')
          .click(() => alert("watch out, it' a full alert 😬"));
      },
    })
  );

  api.registerCharacterTab(
    new api.models.HtmlTab({
      title: 'My HTML Tab',
      html: `
      <div class='scroll-container'>
        <h1>Hello, world!</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis quibusdam sed harum assumenda eveniet quo molestiae, corrupti quia provident sequi vero inventore, excepturi aliquid repellendus accusamus culpa reprehenderit natus.</p>
      </div>
      `,
      tabId: 'test-tidy-html-tab',
      onRender(params) {
        console.warn('✅ onRender', params);
      },
    })
  );

  api.registerCharacterContent(
    new api.models.HtmlContent({
      html: `<a title="Example Button" class="my-custom-icon"><i class="fas fa-user"></i></a>`,
      injectParams: {
        selector: api.getSheetPartSelector(
          api.constants.SHEET_PARTS.NAME_CONTAINER
        ),
        position: 'beforebegin',
      },
      onContentReady: (params) => {
        console.log('content ready to render', params);
        console.log('my content', params.content);
      },
      onRender: (params) => {
        params.element
          ?.querySelector('.my-custom-icon')
          ?.addEventListener('click', () => alert('Clicked custom PC icon'));
      },
    })
  );

  api.registerCharacterTab(
    new api.models.HandlebarsTab({
      title: 'My Handlebars Tab',
      path: '/modules/tidy5e-sheet/templates/test.hbs',
      tabId: 'my-module-id-registered-character-tab',
      getData: async (data) => {
        data['myMessage'] =
          '<span class="kgar-message">Hello, world! 🌊🏄‍♂️</span>';
        data['test1'] = data.actor.getFlag('tidy5e-sheet', 'test1');
        data['test2'] = data.actor.getFlag('tidy5e-sheet', 'test2');
        data['test3'] = data.actor.getFlag('tidy5e-sheet', 'test3');
        return Promise.resolve(data);
      },
      onRender(params) {
        const myTab = $(params.tabContentsElement);
        myTab
          .find('.kgar-message')
          .click(() => alert("watch out, it' a full alert 😬"));
      },
    })
  );
});
