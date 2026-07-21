import { FoundryAdapter } from './foundry/foundry-adapter';
import { Tidy5eCharacterSheet } from './sheets/classic/Tidy5eCharacterSheet.svelte';
import './less/tidy5e.less';
import './less/tidy5e.css';
import { SettingsProvider, initSettings } from './settings/settings.svelte';
import { Tidy5eItemSheetClassic } from './sheets/classic/Tidy5eItemSheetClassic.svelte';
import { Tidy5eNpcSheet } from './sheets/classic/Tidy5eNpcSheet.svelte';
import { Tidy5eVehicleSheet } from './sheets/classic/Tidy5eKgarVehicleSheet.svelte';
import { CONSTANTS } from './constants';
import { Tidy5eSheetsApi } from './api/Tidy5eSheetsApi';
import '../public/rpg-awesome/style/rpg-awesome.min.css';
import { initRuntimeOnReady, initRuntime } from './runtime/runtime-init';
import { MigrationTally } from 'src/migrations/MigrationTally';
import { setupIntegrations } from './integration/integration';
import { TidyHooks } from './foundry/TidyHooks';
import { initKeybindings } from './keybindings/keybind-init';
import { Tidy5eGroupSheetClassic } from './sheets/classic/Tidy5eGroupSheetClassic.svelte';
import { DebugTools } from './utils/DebugTools';
import { Tidy5eContainerSheetClassic } from './sheets/classic/Tidy5eContainerSheetClassic.svelte';
import { Tidy5eContainerSheetQuadrone } from './sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';
import { initReadyHooks } from './features/ready-hooks';
import '@melloware/coloris/dist/coloris.css';
import { debug } from './utils/logging';
import { Tidy5eItemSheetQuadrone } from './sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import { Tidy5eVehicleSheetQuadrone } from './sheets/quadrone/Tidy5eVehicleSheetQuadrone.svelte';
import { Tidy5eCharacterSheetQuadrone } from './sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import { Tidy5eNpcSheetQuadrone } from './sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';
import { ThemeQuadrone } from './theme/theme-quadrone.svelte';
import { TidyNotificationsManager } from './features/notifications/TidyNotificationsManager';
import { Tidy5eEncounterSheetClassic } from './sheets/classic/Tidy5eEncounterSheetClassic.svelte';
import { Tidy5eGroupSheetQuadrone } from './sheets/quadrone/Tidy5eGroupSheetQuadrone.svelte';
import { Tidy5eEncounterSheetQuadrone } from './sheets/quadrone/Tidy5eEncounterSheetQuadrone.svelte';
import { formatResourcePathForCss } from './utils/path';
import { preloadSheetImages } from './utils/preload-images';
import './theme/theme-quadrone-detached';
import { loadConditionalStyles } from './utils/css-loading';
import EditButton from './components/table-quadrone/table-buttons/EditButton.svelte';
import type {
  ActivityRowAction,
  AdvancementRowAction,
  VehicleCrewRowAction,
  VehicleDraftAnimalRowAction,
  EffectRowAction,
  EncounterCombatantMemberRowAction,
  EncounterMemberRowAction,
  GroupMemberRowAction,
  ItemRowAction,
  VehiclePassengerRowAction,
} from './types/row-actions.types';
import DeleteButton from './components/table-quadrone/table-buttons/DeleteButton.svelte';
import MenuButton from './components/table-quadrone/table-buttons/MenuButton.svelte';
import GenericActionButton from './components/table-quadrone/table-buttons/GenericActionButton.svelte';
import CharacterSheetTabToggleButton from './components/table-quadrone/table-buttons/CharacterSheetTabToggleButton.svelte';
import EffectToggleButton from './components/table-quadrone/table-buttons/EffectToggleButton.svelte';
import EncounterAddAsCombatPlaceholder from './components/table-quadrone/table-buttons/EncounterAddAsCombatPlaceholder.svelte';
import EncounterCombatVisibilityToggle from './components/table-quadrone/table-buttons/EncounterCombatVisibilityToggle.svelte';
import EncounterCombatInclusionToggle from './components/table-quadrone/table-buttons/EncounterCombatInclusionToggle.svelte';
import DeleteEncounterEntityButton from './components/table-quadrone/table-buttons/DeleteEncounterEntityButton.svelte';
import AttuneButton from './components/table-quadrone/table-buttons/AttuneButton.svelte';
import EquipButton from './components/table-quadrone/table-buttons/EquipButton.svelte';
import SpellButton from './components/table-quadrone/table-buttons/SpellButton.svelte';
import OpenActivityButton from './components/table-quadrone/table-buttons/OpenActivityButton.svelte';

Hooks.once('init', () => {
  const documentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

  initSettings();

  CONFIG.TIDY5E = {
    components: {
      rowActions: {
        generic: GenericActionButton,
      },
    },
    partitions: {
      rowActions: {
        activity: ['edit', 'delete', 'menu'],
        containerContents: ['edit', 'delete', 'toggleSheetTab', 'menu'],
        effect: ['toggle', 'edit', 'delete', 'menu'],
        encounterCombatant: [
          'addAsPlaceholder',
          'toggleVisibility',
          'toggleInclusion',
          'delete',
          'menu',
        ],
        encounterMember: ['remove', 'menu'],
        feature: ['edit', 'delete', 'toggleSheetTab', 'menu'],
        groupMember: ['remove', 'menu'],
        inventory: [
          'edit',
          'delete',
          'attune',
          'equip',
          'toggleSheetTab',
          'menu',
        ],
        itemAdvancement: ['edit', 'delete', 'menu'],
        spell: [
          'spell',
          'edit',
          'delete',
          'openActivity',
          'toggleSheetTab',
          'menu',
        ],
        vehicleAssignedCrew: ['unassign', 'menu'],
        vehicleDraftAnimal: ['remove', 'menu'],
        vehiclePassenger: ['remove', 'menu'],
        vehicleUnassignedCrew: ['remove', 'menu'],
      },
    },
    rowActions: {
      activity: {
        edit: {
          component: EditButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({ doc: args.activity }),
        } satisfies ActivityRowAction<typeof EditButton>,
        delete: {
          component: DeleteButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            doc: args.activity,
          }),
        } satisfies ActivityRowAction<typeof DeleteButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies ActivityRowAction<typeof MenuButton>,
      },
      containerContents: {
        edit: {
          component: EditButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({ doc: args.item }),
        } satisfies ItemRowAction<typeof EditButton>,
        delete: {
          component: DeleteButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            doc: args.item,
          }),
        } satisfies ItemRowAction<typeof DeleteButton>,
        toggleSheetTab: {
          component: CharacterSheetTabToggleButton,
          condition: (args) =>
            // TODO: remove doc type logic after partitioning
            args.sheetDocument.system.isCharacter &&
            args.data.editable &&
            !args.data.unlocked,
          props: (args) => ({
            doc: args.item,
            ctx: args.ctx,
          }),
        } satisfies ItemRowAction<typeof CharacterSheetTabToggleButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies ItemRowAction<typeof MenuButton>,
      },
      effect: {
        toggle: {
          component: EffectToggleButton,
          props: (args) => ({
            effect: args.effect,
          }),
          condition: (args) =>
            args.sheetDocument.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR ||
            args.rowDocument.type !== CONSTANTS.EFFECT_TYPE_ENCHANTMENT,
        } satisfies EffectRowAction<typeof EffectToggleButton>,
        edit: {
          component: EditButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({ doc: args.effect }),
        } satisfies EffectRowAction<typeof EditButton>,
        delete: {
          component: DeleteButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            doc: args.effect,
          }),
        } satisfies EffectRowAction<typeof DeleteButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies EffectRowAction<typeof MenuButton>,
      },
      encounterCombatant: {
        addAsPlaceholder: {
          component: EncounterAddAsCombatPlaceholder,
          condition: (args) => args.data.editable,
          props: () => ({}),
        } satisfies EncounterCombatantMemberRowAction<
          typeof EncounterAddAsCombatPlaceholder
        >,
        toggleVisibility: {
          component: EncounterCombatVisibilityToggle,
          condition: (args) => args.data.editable,
          props: (args) => ({
            rowContext: args,
          }),
        } satisfies EncounterCombatantMemberRowAction<
          typeof EncounterCombatVisibilityToggle
        >,
        toggleInclusion: {
          component: EncounterCombatInclusionToggle,
          condition: (args) => args.data.editable,
          props: (args) => ({
            rowContext: args,
          }),
        } satisfies EncounterCombatantMemberRowAction<
          typeof EncounterCombatInclusionToggle
        >,
        delete: {
          component: DeleteEncounterEntityButton,

          condition: (args) => args.data.unlocked,
          props: (args) => ({
            rowContext: args,
          }),
        } satisfies EncounterCombatantMemberRowAction<
          typeof DeleteEncounterEntityButton
        >,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies EncounterCombatantMemberRowAction<typeof MenuButton>,
      },
      encounterMember: {
        remove: {
          component: GenericActionButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            'data-action': 'removeMember',
            'data-uuid': args.actor.uuid,
            iconClasses: 'fa-solid fa-trash fa-fw',
            tooltip: FoundryAdapter.localize('DND5E.Group.Action.Remove'),
          }),
        } satisfies EncounterMemberRowAction<typeof GenericActionButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies EncounterMemberRowAction<typeof MenuButton>,
      },
      feature: {
        edit: {
          component: EditButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({ doc: args.item }),
        } satisfies ItemRowAction<typeof EditButton>,
        delete: {
          component: DeleteButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            doc: args.item,
          }),
        } satisfies ItemRowAction<typeof DeleteButton>,
        toggleSheetTab: {
          component: CharacterSheetTabToggleButton,
          condition: (args) =>
            // TODO: remove doc type logic after partitioning
            args.sheetDocument.system.isCharacter &&
            args.data.editable &&
            !args.data.unlocked,
          props: (args) => ({
            doc: args.item,
            ctx: args.ctx,
          }),
        } satisfies ItemRowAction<typeof CharacterSheetTabToggleButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies ItemRowAction<typeof MenuButton>,
      },
      groupMember: {
        remove: {
          component: GenericActionButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            'data-action': 'removeMember',
            'data-uuid': args.actor.uuid,
            iconClasses: 'fa-solid fa-trash fa-fw',
            tooltip: FoundryAdapter.localize('DND5E.Group.Action.Remove'),
          }),
        } satisfies GroupMemberRowAction<typeof GenericActionButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies GroupMemberRowAction<typeof MenuButton>,
      },
      inventory: {
        edit: {
          component: EditButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({ doc: args.item }),
        } satisfies ItemRowAction<typeof EditButton>,
        delete: {
          component: DeleteButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            doc: args.item,
          }),
        } satisfies ItemRowAction<typeof DeleteButton>,
        attune: {
          component: AttuneButton,
          condition: (args) =>
            args.rowDocument.editable &&
            !args.data.unlocked &&
            // TODO: remove doc type logic after partitioning
            (args.sheetDocument.system.isCharacter ||
              args.sheetDocument.system.isNPC) &&
            FoundryAdapter.isAttunementApplicable(args.rowDocument),
          props: (args) => ({
            doc: args.item,
            ctx: args.ctx,
          }),
        } satisfies ItemRowAction<typeof AttuneButton>,
        equip: {
          component: EquipButton,
          props: (args) => ({ doc: args.item }),
          condition: (args) =>
            args.data.editable &&
            !args.data.unlocked &&
            // TODO: remove doc type logic after partitioning
            (args.sheetDocument.system.isCharacter ||
              args.sheetDocument.system.isNPC) &&
            'equipped' in args.rowDocument.system,
        } satisfies ItemRowAction<typeof EquipButton>,
        toggleSheetTab: {
          component: CharacterSheetTabToggleButton,
          condition: (args) =>
            // TODO: remove doc type logic after partitioning
            args.sheetDocument.system.isCharacter &&
            args.data.editable &&
            !args.data.unlocked,
          props: (args) => ({
            doc: args.item,
            ctx: args.ctx,
          }),
        } satisfies ItemRowAction<typeof CharacterSheetTabToggleButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies ItemRowAction<typeof MenuButton>,
      },
      itemAdvancement: {
        edit: {
          component: EditButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            doc: args.item.system.advancement?.get(args.id),
          }),
        } satisfies AdvancementRowAction<typeof EditButton>,
        delete: {
          component: DeleteButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            doc: args.item.system.advancement?.get(args.id),
            deleteFn: () =>
              args.item.system.advancement
                ?.get(args.id)
                ?.deleteDialog({ sheet: args.item }),
          }),
        } satisfies AdvancementRowAction<typeof DeleteButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '.advancement-item',
          }),
        } satisfies AdvancementRowAction<typeof MenuButton>,
      },
      vehicleAssignedCrew: {
        unassign: {
          component: GenericActionButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            'data-action': 'unassignCrew',
            'data-member-uuid': args.actor.uuid,
            'data-item-uuid': args.ctx?.assignedTo?.uuid,
            iconClasses: 'fa-solid fa-user-minus',
            tooltip: FoundryAdapter.localize(
              'TIDY5E.ContextMenuActionUnassign',
            ),
          }),
        } satisfies VehicleCrewRowAction<typeof GenericActionButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies VehicleCrewRowAction<typeof MenuButton>,
      },
      vehicleDraftAnimal: {
        remove: {
          component: GenericActionButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            'data-action': 'removeDraftAnimal',
            'data-uuid': args.actor.uuid,
            iconClasses: 'fa-solid fa-trash fa-fw',
            tooltip: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
              name: FoundryAdapter.localize(
                'TIDY5E.Vehicle.Member.DraftAnimal.Label',
              ),
            }),
          }),
        } satisfies VehicleDraftAnimalRowAction<typeof GenericActionButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies VehicleDraftAnimalRowAction<typeof MenuButton>,
      },
      vehiclePassenger: {
        remove: {
          component: GenericActionButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            'data-action': 'removePassengers',
            'data-uuid': args.actor.uuid,
            iconClasses: 'fa-solid fa-trash fa-fw',
            tooltip: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
              name: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Passengers'),
            }),
          }),
        } satisfies VehiclePassengerRowAction<typeof GenericActionButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies VehiclePassengerRowAction<typeof MenuButton>,
      },
      spell: {
        spell: {
          component: SpellButton,
          condition: (args) =>
            args.data.editable &&
            !args.rowDocument.system.linkedActivity &&
            // TODO: remove doc type logic after partitioning
            (args.sheetDocument.system.isCharacter ||
              args.sheetDocument.system.isNPC),
          props: (args) => ({ doc: args.item }),
        } satisfies ItemRowAction<typeof SpellButton>,
        edit: {
          component: EditButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({ doc: args.item }),
        } satisfies ItemRowAction<typeof EditButton>,
        delete: {
          component: DeleteButton,
          props: (args) => ({
            doc: args.item,
          }),
          condition: (args) =>
            args.data.unlocked && !args.rowDocument.system.linkedActivity,
        } satisfies ItemRowAction<typeof DeleteButton>,
        openActivity: {
          component: OpenActivityButton,
          props: (args) => ({
            doc: args.item,
          }),
          condition: (args) =>
            args.data.unlocked && !!args.rowDocument.system.linkedActivity,
        } satisfies ItemRowAction<typeof OpenActivityButton>,
        toggleSheetTab: {
          component: CharacterSheetTabToggleButton,
          condition: (args) =>
            // TODO: remove doc type logic after partitioning
            args.sheetDocument.system.isCharacter &&
            args.data.editable &&
            !args.data.unlocked,
          props: (args) => ({
            doc: args.item,
            ctx: args.ctx,
          }),
        } satisfies ItemRowAction<typeof CharacterSheetTabToggleButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies ItemRowAction<typeof MenuButton>,
      },
      vehicleUnassignedCrew: {
        remove: {
          component: GenericActionButton,
          condition: (args) => args.data.unlocked,
          props: (args) => ({
            'data-action': 'removeUnassignedCrew',
            'data-uuid': args.actor.uuid,
            iconClasses: 'fa-solid fa-trash fa-fw',
            tooltip: FoundryAdapter.localize('TIDY5E.RemoveSpecific', {
              name: FoundryAdapter.localize(
                'TIDY5E.Vehicle.Section.Crew.Unassigned.Label',
              ),
            }),
          }),
        } satisfies VehicleCrewRowAction<typeof GenericActionButton>,
        menu: {
          component: MenuButton,
          props: () => ({
            targetSelector: '[data-context-menu]',
          }),
        } satisfies VehicleCrewRowAction<typeof MenuButton>,
      },
    },
  };

  if (!SettingsProvider.settings.hideClassic.get()) {
    documentSheetConfig.registerSheet(
      Actor,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eCharacterSheet,
      {
        types: [CONSTANTS.SHEET_TYPE_CHARACTER],
        label: 'TIDY5E.Tidy5eCharacterSheetClassic',
      },
    );

    documentSheetConfig.registerSheet(
      Actor,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eNpcSheet,
      {
        types: [CONSTANTS.SHEET_TYPE_NPC],
        label: 'TIDY5E.Tidy5eNpcSheetClassic',
      },
    );

    documentSheetConfig.registerSheet(
      Actor,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eVehicleSheet,
      {
        types: [CONSTANTS.SHEET_TYPE_VEHICLE],
        label: 'TIDY5E.Tidy5eVehicleSheetClassic',
      },
    );

    const supportedItemTypes = [
      CONSTANTS.ITEM_TYPE_BACKGROUND,
      CONSTANTS.ITEM_TYPE_CLASS,
      CONSTANTS.ITEM_TYPE_CONSUMABLE,
      CONSTANTS.ITEM_TYPE_EQUIPMENT,
      CONSTANTS.ITEM_TYPE_FACILITY,
      CONSTANTS.ITEM_TYPE_FEAT,
      CONSTANTS.ITEM_TYPE_LOOT,
      CONSTANTS.ITEM_TYPE_RACE,
      CONSTANTS.ITEM_TYPE_SPELL,
      CONSTANTS.ITEM_TYPE_SUBCLASS,
      CONSTANTS.ITEM_TYPE_TOOL,
      CONSTANTS.ITEM_TYPE_WEAPON,
    ];

    documentSheetConfig.registerSheet(
      Item,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eItemSheetClassic,
      {
        types: supportedItemTypes,
        label: 'TIDY5E.Tidy5eItemSheetClassic',
      },
    );

    documentSheetConfig.registerSheet(
      Item,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eContainerSheetClassic,
      {
        types: [CONSTANTS.SHEET_TYPE_CONTAINER],
        label: 'TIDY5E.Tidy5eContainerSheetClassic',
      },
    );

    documentSheetConfig.registerSheet(
      Actor,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eGroupSheetClassic,
      {
        types: [CONSTANTS.SHEET_TYPE_GROUP],
        label: 'TIDY5E.Tidy5eGroupSheetClassic',
      },
    );

    documentSheetConfig.registerSheet(
      Actor,
      CONSTANTS.DND5E_SYSTEM_ID,
      Tidy5eEncounterSheetClassic,
      {
        types: [CONSTANTS.SHEET_TYPE_ENCOUNTER],
        label: 'TIDY5E.Tidy5eEncounterSheetClassic',
      },
    );
  }

  documentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eCharacterSheetQuadrone,
    {
      types: [CONSTANTS.SHEET_TYPE_CHARACTER],
      label: 'TIDY5E.Tidy5eCharacterSheetQuadrone',
    },
  );

  initRuntime();
  initKeybindings();

  const betaQuadroneItemTypes = [
    CONSTANTS.ITEM_TYPE_BACKGROUND,
    CONSTANTS.ITEM_TYPE_CLASS,
    CONSTANTS.ITEM_TYPE_CONSUMABLE,
    CONSTANTS.ITEM_TYPE_EQUIPMENT,
    CONSTANTS.ITEM_TYPE_FACILITY,
    CONSTANTS.ITEM_TYPE_FEAT,
    CONSTANTS.ITEM_TYPE_LOOT,
    CONSTANTS.ITEM_TYPE_RACE,
    CONSTANTS.ITEM_TYPE_SPELL,
    CONSTANTS.ITEM_TYPE_SUBCLASS,
    CONSTANTS.ITEM_TYPE_TOOL,
    CONSTANTS.ITEM_TYPE_WEAPON,
  ];

  documentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eItemSheetQuadrone,
    {
      types: betaQuadroneItemTypes,
      label: 'TIDY5E.Tidy5eItemSheetQuadrone',
    },
  );

  documentSheetConfig.registerSheet(
    Item,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eContainerSheetQuadrone,
    {
      types: [CONSTANTS.SHEET_TYPE_CONTAINER],
      label: 'TIDY5E.Tidy5eContainerSheetQuadrone',
    },
  );

  documentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eNpcSheetQuadrone,
    {
      types: [CONSTANTS.SHEET_TYPE_NPC],
      label: 'TIDY5E.Tidy5eNpcSheetQuadrone',
    },
  );

  documentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eGroupSheetQuadrone,
    {
      types: [CONSTANTS.SHEET_TYPE_GROUP],
      label: 'TIDY5E.Tidy5eGroupSheetQuadrone',
    },
  );

  documentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eEncounterSheetQuadrone,
    {
      types: [CONSTANTS.SHEET_TYPE_ENCOUNTER],
      label: 'TIDY5E.Tidy5eEncounterSheetQuadrone',
    },
  );

  documentSheetConfig.registerSheet(
    Actor,
    CONSTANTS.DND5E_SYSTEM_ID,
    Tidy5eVehicleSheetQuadrone,
    {
      types: [CONSTANTS.SHEET_TYPE_VEHICLE],
      label: 'TIDY5E.Tidy5eVehicleSheetQuadrone',
    },
  );
});

Hooks.once('ready', async () => {
  const tidy5eModule = FoundryAdapter.getModule(CONSTANTS.MODULE_ID);
  const api = Tidy5eSheetsApi._getApi();
  tidy5eModule.api = api;

  if (!SettingsProvider.settings.hideClassic.get()) {
    import('./less/classic/classic.less');
    loadConditionalStyles('classic');
  }

  initRuntimeOnReady();

  TidyHooks.tidy5eSheetsReady(api);

  setupIntegrations(api);

  handleMigrationNotification();

  initReadyHooks();

  DebugTools.onReady(api);

  ThemeQuadrone.onReady();

  TidyNotificationsManager.onReady();

  registerCustomTidyRollRequests();

  preloadSheetImages();
});

Hooks.once('setup', async () => {
  const style = document.createElement('style');
  style.id = 'tidy5e-sheet-generated-styles';
  document.head.append(style);

  // Note: When popout is added to core, this may need to be changed to use .sheet.insertRule
  style.textContent = Object.entries(CONFIG.DND5E.currencies)
    .map(
      ([key, val]) =>
        `.tidy5e-sheet .currency.${key} { --currency-icon-url: url("${formatResourcePathForCss(
          val.icon,
        )}"); }`,
    )
    .join('\n\n');
});

function registerCustomTidyRollRequests() {
  CONFIG.DND5E.requests[CONSTANTS.ROLL_REQUEST_ABILITY_KEY] ??= async (
    actor,
    request,
    config,
    { event } = {},
  ) => {
    const data = {};
    foundry.utils.setProperty(data, 'flags.dnd5e.requestResult', {
      actorUuid: actor.uuid,
      requestId: request.id,
    });
    const [roll] =
      (await actor.rollAbilityCheck({ ...config, event }, {}, { data })) ?? [];
    return roll?.parent ?? null;
  };

  CONFIG.DND5E.requests[CONSTANTS.ROLL_REQUEST_SAVE_KEY] ??= async (
    actor,
    request,
    config,
    { event } = {},
  ) => {
    const data = {};
    foundry.utils.setProperty(data, 'flags.dnd5e.requestResult', {
      actorUuid: actor.uuid,
      requestId: request.id,
    });
    const [roll] =
      (await actor.rollSavingThrow({ ...config, event }, {}, { data })) ?? [];
    return roll?.parent ?? null;
  };
}

function handleMigrationNotification() {
  let tally = SettingsProvider.settings.migrationsConfirmationTally.get();

  if (FoundryAdapter.userIsGm() && tally === 0) {
    debug(
      'Skipping migration notification because this appears to be a new Tidy installation.',
    );
    tally = MigrationTally;
  }

  if (FoundryAdapter.userIsGm() && tally < MigrationTally) {
    let migrationNotification = {
      user: game.user._id,
      whisper: game.users.filter((u: any) => u.isGM).map((u: any) => u._id),
      content: `
      <h2>${game.i18n.localize('TIDY5E.ModuleName')}</h2>
      <p>
        ${game.i18n.localize('TIDY5E.Settings.Migrations.chatNotification')}
      </p>
      `,
    };

    ChatMessage.create(migrationNotification, {});

    FoundryAdapter.setTidySetting(
      'migrationsConfirmationTally',
      MigrationTally,
    );
  }
}
