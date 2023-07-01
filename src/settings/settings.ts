import { CONSTANTS } from '../constants';
import { FoundryAdapter } from '../foundry/foundry-adapter';
import { Tidy5eKgarUserSettings } from './user-settings-form';
import { RGBAToHexAFromColor } from '../utils/tidy5e-color-picker';
import { log } from 'src/utils/logging';

export function initSettings() {
  // General Settings
  game.settings.registerMenu(CONSTANTS.MODULE_ID, 'userMenu', {
    name: `T5EK.Settings.SheetMenu.name`,
    label: 'T5EK.Settings.SheetMenu.label',
    hint: `T5EK.Settings.SheetMenu.hint`,
    icon: 'fas fa-cog',
    type: Tidy5eKgarUserSettings,
    restricted: false,
  });

  game.settings.registerMenu(CONSTANTS.MODULE_ID, 'resetAllSettings', {
    name: `T5EK.Settings.Reset.name`,
    hint: `T5EK.Settings.Reset.hint`,
    icon: 'fas fa-database',
    type: ResetSettingsDialog,
    restricted: true,
  });

  // ========================================================================

  // Color Theme
  game.settings.register(CONSTANTS.MODULE_ID, 'colorScheme', {
    name: `${FoundryAdapter.localize('T5EK.Settings.SheetTheme.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.SheetTheme.hint'),
    scope: 'client',
    config: true,
    type: String,
    choices: {
      default: FoundryAdapter.localize('T5EK.Settings.SheetTheme.default'),
      dark: FoundryAdapter.localize('T5EK.Settings.SheetTheme.dark'),
    },
    default: 'default',
    onChange: (data: string) => {
      data === 'dark'
        ? document.querySelector('html')?.classList.add('tidy5eKGarDark')
        : document.querySelector('html')?.classList.remove('tidy5eKGarDark');
    },
  });

  const colorScheme = FoundryAdapter.getGameSetting('colorScheme');
  if (colorScheme === 'dark') {
    document.querySelector('html')?.classList.add('tidy5eKgarDark');
  }

  // Disable Right Click
  game.settings.register(CONSTANTS.MODULE_ID, 'rightClickDisabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.RightClickDisabled.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.RightClickDisabled.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  // Classic Item Controls
  game.settings.register(CONSTANTS.MODULE_ID, 'classicControlsEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ClassicControls.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ClassicControls.hint'),
    scope: 'client',
    config: false,
    default: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hideIconsNextToTheItemName', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.HideIconsNextToTheItemName.name'
    )}`,
    hint: FoundryAdapter.localize(
      'T5EK.Settings.HideIconsNextToTheItemName.hint'
    ),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  // Item Info Cards
  game.settings.register(CONSTANTS.MODULE_ID, 'itemCardsForAllItems', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ItemCardsForAllItems.name'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ItemCardsForAllItems.hint'),
    scope: 'client',
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'itemCardsForNpcs', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ItemCardsForNpcs.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ItemCardsForNpcs.hint'),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'itemCardsAreFloating', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ItemCardsAreFloating.name'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ItemCardsAreFloating.hint'),
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'itemCardsDelay', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ItemCardsDelay.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ItemCardsDelay.hint'),
    scope: 'client',
    config: true,
    default: 300,
    type: Number,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'itemCardsFixKey', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ItemCardsFixKey.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ItemCardsFixKey.hint'),
    scope: 'world',
    config: false,
    default: 'x',
    type: String,
  });

  // Show Roll buttons in context Menu
  game.settings.register(CONSTANTS.MODULE_ID, 'contextRollButtons', {
    name: `${FoundryAdapter.localize('T5EK.Settings.RollButtonsToCard.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.RollButtonsToCard.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  //Show trait labels
  game.settings.register(CONSTANTS.MODULE_ID, 'traitLabelsEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.TraitLabels.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.TraitLabels.hint'),
    scope: 'world',
    config: false,
    default: true,
    type: Boolean,
  });

  // Settings Menu

  // PC Sheet Settings
  game.settings.register(CONSTANTS.MODULE_ID, 'journalTabDisabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.JournalTab.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.JournalTab.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'journalTabNPCDisabled', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.JournalTabNPCDisabled.name'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.JournalTabNPCDisabled.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'classListDisabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ClassList.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ClassList.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'inspirationAnimationDisabled', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.InspirationAnimation.name'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.InspirationAnimation.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hideIfZero', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HideIfZero.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HideIfZero.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'inspirationOnHover', {
    name: `${FoundryAdapter.localize('T5EK.Settings.InspirationOnHover.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.InspirationOnHover.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'exhaustionOnHover', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ExhaustionOnHover.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ExhaustionOnHover.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hpBarDisabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HpBar.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HpBar.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hpOverlayDisabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HpOverlay.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HpOverlay.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'traitsTogglePc', {
    name: `${FoundryAdapter.localize('T5EK.Settings.TraitsTogglePc.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.TraitsTogglePc.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'traitsMovedBelowResource', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.TraitsMovedBelowResource.name'
    )}`,
    hint: FoundryAdapter.localize(
      'T5EK.Settings.TraitsMovedBelowResource.hint'
    ),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'ammoEquippedOnly', {
    name: `${FoundryAdapter.localize('T5EK.Settings.AmmoEquippedOnly.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.AmmoEquippedOnly.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  // NPC Sheet Settings

  game.settings.register(CONSTANTS.MODULE_ID, 'traitsMovedBelowResourceNpc', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.TraitsMovedBelowResource.name'
    )}`,
    hint: FoundryAdapter.localize(
      'T5EK.Settings.TraitsMovedBelowResource.hint'
    ),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hpBarDisabledNpc', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HpBar.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HpBar.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hpOverlayDisabledNpc', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HpOverlay.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HpOverlay.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'traitsAlwaysShownNpc', {
    name: `${FoundryAdapter.localize('T5EK.Settings.TraitsAlwaysShown.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.TraitsAlwaysShown.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'skillsAlwaysShownNpc', {
    name: `${FoundryAdapter.localize('T5EK.Settings.SkillsAlwaysShown.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.SkillsAlwaysShown.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hideSpellbookTabNpc', {
    name: `${FoundryAdapter.localize('T5EK.Settings.SkillsAlwaysShown.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.SkillsAlwaysShown.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  // Vehicle Sheet Settings

  game.settings.register(CONSTANTS.MODULE_ID, 'hpBarDisabledVehicle', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HpBar.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HpBar.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hpOverlayDisabledVehicle', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HpOverlay.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HpOverlay.hint'),
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  //
  // GM Options
  //
  // Show Player Name
  game.settings.register(CONSTANTS.MODULE_ID, 'playerNameEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.PlayerName.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.PlayerName.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Expanded Sheet
  game.settings.register(CONSTANTS.MODULE_ID, 'expandedSheetEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ExpandedSheet.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ExpandedSheet.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Portrait Settings
  // Portrait Style
  game.settings.register(CONSTANTS.MODULE_ID, 'portraitStyle', {
    name: `${FoundryAdapter.localize('T5EK.Settings.PortraitStyle.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.PortraitStyle.hint'),
    scope: 'world',
    config: false,
    type: String,
    choices: {
      default: FoundryAdapter.localize('T5EK.Settings.PortraitStyle.default'),
      pc: FoundryAdapter.localize('T5EK.Settings.PortraitStyle.pc'),
      npc: FoundryAdapter.localize('T5EK.Settings.PortraitStyle.npc'),
      all: FoundryAdapter.localize('T5EK.Settings.PortraitStyle.all'),
    },
    default: 'all',
    // TODO: This should be accomplished by virtue of the setting being changed and the views updating themselves in response (or the "rerender all views" function)
    // onChange: (data) => {

    // if (data == 'npc' || data == 'all') {
    //   $('.tidy5e-sheet.tidy5e-npc .profile').addClass('roundPortrait');
    //   $('.tidy5e-sheet.tidy5e-vehicle .profile').addClass('roundPortrait');
    // }
    // if (data == 'pc' || data == 'all') {
    //   $('.tidy5e-sheet .profile').addClass('roundPortrait');
    //   $('.tidy5e-sheet.tidy5e-npc .profile').removeClass('roundPortrait');
    //   $('.tidy5e-sheet.tidy5e-vehicle .profile').removeClass('roundPortrait');
    // }
    // if (data == 'default') {
    //   $('.tidy5e-sheet .profile').removeClass('roundPortrait');
    //   $('.tidy5e-sheet.tidy5e-npc .profile').removeClass('roundPortrait');
    //   $('.tidy5e-sheet.tidy5e-vehicle .profile').removeClass('roundPortrait');
    // }
    // },
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hpOverlayBorder', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HpOverlayBorder.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HpOverlayBorder.hint'),
    scope: 'world',
    config: false,
    default: 0,
    type: Number,
    onChange: () => {
      setDnd5eCssVariable(
        '--pc-border',
        FoundryAdapter.getGameSetting('hpOverlayBorder') + 'px'
      );
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hpOverlayBorderNpc', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HpOverlayBorder.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HpOverlayBorder.hint'),
    scope: 'world',
    config: false,
    default: 0,
    type: Number,
    onChange: (data) => {
      setDnd5eCssVariable(
        '--npc-border',
        FoundryAdapter.getGameSetting('hpOverlayBorderNpc') + 'px'
      );
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'hpOverlayBorderVehicle', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HpOverlayBorder.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HpOverlayBorder.hint'),
    scope: 'world',
    config: false,
    default: 0,
    type: Number,
    onChange: (data) => {
      setDnd5eCssVariable(
        '--vehicle-border',
        FoundryAdapter.getGameSetting('hpOverlayBorderVehicle') + 'px'
      );
    },
  });

  // Total Edit Lock
  game.settings.register(CONSTANTS.MODULE_ID, 'editTotalLockEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.EditTotalLock.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.EditTotalLock.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'editGmAlwaysEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.EditGmAlways.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.EditGmAlways.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'editEffectsGmOnlyEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.EditEffectsGmOnly.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.EditEffectsGmOnly.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Hidden Death Saves
  game.settings.register(CONSTANTS.MODULE_ID, 'hiddenDeathSavesEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.HiddenDeathSaves.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HiddenDeathSaves.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Hide marker spell slot
  game.settings.register(CONSTANTS.MODULE_ID, 'hideSpellSlotMarker', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.HideSpellSlotMarker.name'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.HideSpellSlotMarker.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Enable Spell Level Buttons
  game.settings.register(CONSTANTS.MODULE_ID, 'enableSpellLevelButtons', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.EnableSpellLevelButtons.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.EnableSpellLevelButtons.hint'
    )}`,
    scope: 'world',
    config: false,
    default: true,
    type: Boolean,
  });

  // Hide Standard Encumbrance Bar
  game.settings.register(CONSTANTS.MODULE_ID, 'hideStandardEncumbranceBar', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.HideStandardEncumbranceBar.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.HideStandardEncumbranceBar.hint'
    )}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Item quantity
  game.settings.register(CONSTANTS.MODULE_ID, 'quantityAlwaysShownEnabled', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.QuantityAlwaysShown.name'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.QuantityAlwaysShown.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Tracker Settings
  game.settings.register(CONSTANTS.MODULE_ID, 'exhaustionEffectsEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ExhaustionEffects.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ExhaustionEffects.hint'),
    scope: 'world',
    config: false,
    choices: {
      default: FoundryAdapter.localize(
        'T5EK.Settings.ExhaustionEffects.default'
      ),
      tidy5e: FoundryAdapter.localize(
        'T5EK.Settings.ExhaustionEffects.default'
      ),
      dfredce: FoundryAdapter.localize(
        'T5EK.Settings.ExhaustionEffects.dfredce'
      ),
      cub: FoundryAdapter.localize('T5EK.Settings.ExhaustionEffects.cub'),
    },
    type: String,
    default: 'default',
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'exhaustionEffectIcon', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.CustomExhaustionIcon.name'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.CustomExhaustionIcon.hint'),
    scope: 'world',
    config: false,
    type: String,
    default: 'modules/tidy5e-sheet/images/exhaustion.svg',
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'exhaustionEffectCustom', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.CustomExhaustionEffect.name'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.CustomExhaustionEffect.hint'),
    scope: 'world',
    config: false,
    default: 'Exhaustion',
    type: String,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'exhaustionEffectCustomTiers', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.CustomExhaustionEffect.tiers'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.CustomExhaustionEffect.hint'),
    scope: 'world',
    config: false,
    default: 5,
    type: Number,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'exhaustionDisabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ExhaustionDisabled.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ExhaustionDisabled.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'inspirationDisabled', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.InspirationDisabled.name'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.InspirationDisabled.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // NPC Resting
  game.settings.register(CONSTANTS.MODULE_ID, 'restingForNpcsEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.RestingForNpcs.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.RestingForNpcs.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'restingForNpcsChatDisabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.RestingForNpcsChat.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.RestingForNpcsChat.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Link Marker
  game.settings.register(CONSTANTS.MODULE_ID, 'linkMarkerNpc', {
    name: `${FoundryAdapter.localize('T5EK.Settings.LinkMarker.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.LinkMarker.hint'),
    scope: 'world',
    config: false,
    type: String,
    choices: {
      default: FoundryAdapter.localize('T5EK.Settings.LinkMarker.default'),
      unlinked: FoundryAdapter.localize('T5EK.Settings.LinkMarker.unlinked'),
      both: FoundryAdapter.localize('T5EK.Settings.LinkMarker.both'),
    },
    default: 'default',
  });

  // Show if item has active effects
  game.settings.register(CONSTANTS.MODULE_ID, 'activeEffectsMarker', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ActiveEffectsMarker.name'
    )}`,
    hint: FoundryAdapter.localize('T5EK.Settings.ActiveEffectsMarker.hint'),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Set default Tab for character actions list

  game.settings.register(
    CONSTANTS.MODULE_ID,
    'enableActionListOnFavoritePanel',
    {
      name: `${FoundryAdapter.localize(
        'T5EK.Settings.EnableActionListOnFavoritePanel.name'
      )}`,
      hint: FoundryAdapter.localize(
        'T5EK.Settings.EnableActionListOnFavoritePanel.hint'
      ),
      scope: 'client',
      config: false,
      default: false,
      type: Boolean,
    }
  );

  game.settings.register(CONSTANTS.MODULE_ID, 'defaultActionsTab', {
    name: `${FoundryAdapter.localize('T5EK.Settings.defaultActionsTab.name')}`,
    hint: FoundryAdapter.localize('T5EK.Settings.defaultActionsTab.hint'),
    scope: 'world',
    config: false,
    type: String,
    choices: {
      default: FoundryAdapter.localize(
        'T5EK.Settings.defaultActionsTab.default'
      ),
      attributes: FoundryAdapter.localize(
        'T5EK.Settings.defaultActionsTab.attributes'
      ),
      inventory: FoundryAdapter.localize(
        'T5EK.Settings.defaultActionsTab.inventory'
      ),
      spellbook: FoundryAdapter.localize(
        'T5EK.Settings.defaultActionsTab.spellbook'
      ),
      features: FoundryAdapter.localize(
        'T5EK.Settings.defaultActionsTab.features'
      ),
      effects: FoundryAdapter.localize(
        'T5EK.Settings.defaultActionsTab.effects'
      ),
      biography: FoundryAdapter.localize(
        'T5EK.Settings.defaultActionsTab.biography'
      ),
      journal: FoundryAdapter.localize(
        'T5EK.Settings.defaultActionsTab.journal'
      ),
      actions: FoundryAdapter.localize(
        'T5EK.Settings.defaultActionsTab.actions'
      ),
    },
    default: 'default',
  });

  // Default width for player sheet

  game.settings.register(CONSTANTS.MODULE_ID, 'playerSheetWidth', {
    name: `${FoundryAdapter.localize('T5EK.Settings.playerSheetWidth')}`,
    scope: 'client',
    config: false,
    type: Number,
    default: 740,
  });

  // Default width for NPC sheet

  game.settings.register(CONSTANTS.MODULE_ID, 'npsSheetWidth', {
    name: `${FoundryAdapter.localize('T5EK.Settings.npsSheetWidth')}`,
    scope: 'client',
    config: false,
    type: Number,
    default: 740,
  });

  // Default width for vehicle sheet

  game.settings.register(CONSTANTS.MODULE_ID, 'vehicleSheetWidth', {
    name: `${FoundryAdapter.localize('T5EK.Settings.vehicleSheetWidth')}`,
    scope: 'client',
    config: false,
    type: Number,
    default: 740,
  });

  // Lazy Money

  game.settings.register(CONSTANTS.MODULE_ID, 'lazyMoneyEnable', {
    name: `${FoundryAdapter.localize('T5EK.Settings.LazyMoneyEnable.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.LazyMoneyEnable.hint')}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'lazyMoneyAddConvert', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.LazyMoneyAddConvert.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.LazyMoneyAddConvert.hint'
    )}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'lazyMoneyIgnoreElectrum', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.LazyMoneyIgnoreElectrum.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.LazyMoneyIgnoreElectrum.hint'
    )}`,
    scope: 'world',
    config: false,
    default: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'lazyMoneyChatLog', {
    name: `${FoundryAdapter.localize('T5EK.Settings.LazyMoneyChatLog.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.LazyMoneyChatLog.hint')}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Favorites

  game.settings.register(
    CONSTANTS.MODULE_ID,
    'enableSortFavoritesItemsAlphabetically',
    {
      name: `${FoundryAdapter.localize(
        'T5EK.Settings.EnableSortFavoritesItemsAlphabetically.name'
      )}`,
      hint: `${FoundryAdapter.localize(
        'T5EK.Settings.EnableSortFavoritesItemsAlphabetically.hint'
      )}`,
      scope: 'world',
      config: false,
      default: false,
      type: Boolean,
    }
  );

  // Locks

  game.settings.register(CONSTANTS.MODULE_ID, 'lockMoneyChanges', {
    name: `${FoundryAdapter.localize('T5EK.Settings.LockMoneyChanges.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.LockMoneyChanges.hint')}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'lockExpChanges', {
    name: `${FoundryAdapter.localize('T5EK.Settings.LockExpChanges.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.LockExpChanges.hint')}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'lockHpMaxChanges', {
    name: `${FoundryAdapter.localize('T5EK.Settings.LockHpMaxChanges.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.LockHpMaxChanges.hint')}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'lockLevelSelector', {
    name: `${FoundryAdapter.localize('T5EK.Settings.LockLevelSelector.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.LockLevelSelector.hint')}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'lockConfigureSheet', {
    name: `${FoundryAdapter.localize('T5EK.Settings.LockConfigureSheet.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.LockConfigureSheet.hint')}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'lockItemQuantity', {
    name: `${FoundryAdapter.localize('T5EK.Settings.LockItemQuantity.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.LockItemQuantity.hint')}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // Other

  game.settings.register(
    CONSTANTS.MODULE_ID,
    'allowCantripToBePreparedOnContext',
    {
      name: `${FoundryAdapter.localize(
        'T5EK.Settings.AllowCantripToBePreparedOnContext.name'
      )}`,
      hint: `${FoundryAdapter.localize(
        'T5EK.Settings.AllowCantripToBePreparedOnContext.hint'
      )}`,
      scope: 'world',
      config: false,
      default: false,
      type: Boolean,
    }
  );

  game.settings.register(CONSTANTS.MODULE_ID, 'spellClassFilterSelect', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.SpellClassFilterSelect.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.SpellClassFilterSelect.hint'
    )}`,
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'spellClassFilterIconReplace', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.SpellClassFilterIconReplace.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.SpellClassFilterIconReplace.hint'
    )}`,
    scope: 'client',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(
    CONSTANTS.MODULE_ID,
    'spellClassFilterAdditionalClasses',
    {
      name: `${FoundryAdapter.localize(
        'T5EK.Settings.SpellClassFilterAdditionalClasses.name'
      )}`,
      hint: `${FoundryAdapter.localize(
        'T5EK.Settings.SpellClassFilterAdditionalClasses.hint'
      )}`,
      scope: 'client',
      config: false,
      default: '',
      type: String,
    }
  );

  game.settings.register(CONSTANTS.MODULE_ID, 'allowHpMaxOverride', {
    name: `${FoundryAdapter.localize('T5EK.Settings.AllowHpMaxOverride.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.AllowHpMaxOverride.hint')}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'allowHpConfigOverride', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.AllowHpConfigOverride.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.AllowHpConfigOverride.hint'
    )}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'betterAttackDialog', {
    name: `${FoundryAdapter.localize('T5EK.Settings.BetterAttackDialog.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.BetterAttackDialog.hint')}`,
    scope: 'world',
    config: false,
    default: true,
    type: Boolean,
    // TODO: Suspected to be dead feature.
    // onChange: (newValue) => {
    // const style = `<style id="tidy5e-better-attack">
    // .dialog-button.default.advantage {
    // border: 2px groove green !important;
    // }
    // .dialog-button.default.disadvantage {
    // border: 2px groove red !important;
    // }
    // </style>`;
    // const styleElement = $('#tidy5e-sheet-better-attack');
    // if (styleElement.length == 0 && newValue) {
    //   $('body').append(style);
    // } else if (styleElement.length != 0 && !newValue) {
    //   styleElement.remove();
    // }
    // },
  });

  // Color customization

  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerEnabled', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ColorPickerEnabled.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.ColorPickerEnabled.hint')}`,
    scope: 'client',
    type: Boolean,
    default: false,
    config: false,
  });

  // --t5e-equipped: 					rgba(50, 205, 50, 0.3);
  // --t5e-equipped-outline: 			rgba(50, 205, 50, 1);
  // --t5e-equipped-accent: 			rgba(173, 255, 47, 1);

  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerEquipped', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerEquipped.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerEquipped.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(50, 205, 50, 0.3),
    config: false,
  });
  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerEquippedOutline', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerEquippedOutline.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerEquippedOutline.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(50, 205, 50, 1),
    config: false,
  });
  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerEquippedAccent', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerEquippedAccent.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerEquippedAccent.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(173, 255, 47, 1),
    config: false,
  });

  // --t5e-prepared: 					rgba(50, 205, 50, 0.3);
  // --t5e-prepared-outline: 			rgba(50, 205, 50, 1);
  // --t5e-prepared-accent: 			rgba(173, 255, 47, 1);

  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerPrepared', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerPrepared.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerPrepared.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(50, 205, 50, 0.3),
    config: false,
  });
  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerPreparedOutline', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerPreparedOutline.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerPreparedOutline.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(50, 205, 50, 1),
    config: false,
  });
  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerPreparedAccent', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerPreparedAccent.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerPreparedAccent.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(173, 255, 47, 1),
    config: false,
  });

  // --t5e-pact:					    rgba(250, 0, 180, 0.3);
  // --t5e-pact-outline: 			    rgba(250, 50, 213, 1);
  // --t5e-pact-accent: 				rgba(198, 119, 193, 1);

  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerPact', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ColorPickerPact.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.ColorPickerPact.hint')}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(250, 0, 180, 0.3),
    config: false,
  });
  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerPactOutline', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerPactOutline.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerPactOutline.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(250, 50, 213, 1),
    config: false,
  });
  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerPactAccent', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerPactAccent.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerPactAccent.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(198, 119, 193, 1),
    config: false,
  });

  // --t5e-atwill: 					rgba(226, 246, 4, 0.3);
  // --t5e-atwill-outline: 			rgba(163, 165, 50, 1);
  // --t5e-atwill-accent: 		    rgba(255, 242, 0, 1);

  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerAtWill', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ColorPickerAtWill.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.ColorPickerAtWill.hint')}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(226, 246, 4, 0.3),
    config: false,
  });
  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerAtWillOutline', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerAtWillOutline.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerAtWillOutline.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(163, 165, 50, 1),
    config: false,
  });
  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerAtWillAccent', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerAtWillAccent.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerAtWillAccent.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(255, 242, 0, 1),
    config: false,
  });

  // --t5e-innate: 					rgba(255, 0, 0, 0.3);
  // --t5e-innate-outline: 			rgba(231, 23, 23, 1);
  // --t5e-innate-accent: 			rgba(195, 69, 69, 1);

  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerInnate', {
    name: `${FoundryAdapter.localize('T5EK.Settings.ColorPickerInnate.name')}`,
    hint: `${FoundryAdapter.localize('T5EK.Settings.ColorPickerInnate.hint')}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(255, 0, 0, 0.3),
    config: false,
  });
  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerInnateOutline', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerInnateOutline.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerInnateOutline.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(231, 23, 23, 1),
    config: false,
  });
  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerInnateAccent', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerInnateAccent.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerInnateAccent.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(195, 69, 69, 1),
    config: false,
  });

  // --t5e-alwaysprepared: 			rgba(0, 0, 255, 0.15);
  // --t5e-alwaysprepared-outline: 	rgba(65, 105, 225, 1);
  // --t5e-alwaysprepared-accent: 	rgba(0, 191, 255, 1);

  game.settings.register(CONSTANTS.MODULE_ID, 'colorPickerAlwaysPrepared', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerAlwaysPrepared.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.ColorPickerAlwaysPrepared.hint'
    )}`,
    scope: 'client',
    type: String,
    default: RGBAToHexAFromColor(0, 0, 255, 0.15),
    config: false,
  });
  game.settings.register(
    CONSTANTS.MODULE_ID,
    'colorPickerAlwaysPreparedOutline',
    {
      name: `${FoundryAdapter.localize(
        'T5EK.Settings.ColorPickerAlwaysPreparedOutline.name'
      )}`,
      hint: `${FoundryAdapter.localize(
        'T5EK.Settings.ColorPickerAlwaysPreparedOutline.hint'
      )}`,
      scope: 'client',
      type: String,
      default: RGBAToHexAFromColor(65, 105, 225, 1),
      config: false,
    }
  );
  game.settings.register(
    CONSTANTS.MODULE_ID,
    'colorPickerAlwaysPreparedAccent',
    {
      name: `${FoundryAdapter.localize(
        'T5EK.Settings.ColorPickerAlwaysPreparedAccent.name'
      )}`,
      hint: `${FoundryAdapter.localize(
        'T5EK.Settings.ColorPickerAlwaysPreparedAccent.hint'
      )}`,
      scope: 'client',
      type: String,
      default: RGBAToHexAFromColor(0, 191, 255, 1),
      config: false,
    }
  );

  // ===============================
  // Homebrew Rules
  // ===============================

  game.settings.register(CONSTANTS.MODULE_ID, 'hbEnableUpcastFreeSpell', {
    name: `${FoundryAdapter.localize(
      'T5EK.Settings.HBEnableUpcastFreeSpell.name'
    )}`,
    hint: `${FoundryAdapter.localize(
      'T5EK.Settings.HBEnableUpcastFreeSpell.hint'
    )}`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(
    CONSTANTS.MODULE_ID,
    'hbSetFeaturesForUpcastFreeSpell',
    {
      name: `${FoundryAdapter.localize(
        'T5EK.Settings.HBSetFeaturesForUpcastFreeSpell.name'
      )}`,
      hint: `${FoundryAdapter.localize(
        'T5EK.Settings.HBSetFeaturesForUpcastFreeSpell.hint'
      )}`,
      scope: 'world',
      config: false,
      default: '',
      type: String,
    }
  );

  // ========================================================================
  game.settings.register(CONSTANTS.MODULE_ID, 'debug', {
    name: `T5EK.Settings.Debug.name`,
    hint: `T5EK.Settings.Debug.hint`,
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });
}

class ResetSettingsDialog extends FormApplication {
  constructor(...args: any[]) {
    //@ts-ignore
    super(...args);
    //@ts-ignore
    return new Dialog({
      title: FoundryAdapter.localize(`T5EK.Settings.Reset.dialogs.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        FoundryAdapter.localize(`T5EK.Settings.Reset.dialogs.content`) +
        '</p>',
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: FoundryAdapter.localize(`T5EK.Settings.Reset.dialogs.confirm`),
          callback: async () => {
            for (let setting of game.settings.storage
              .get('world')
              .filter((setting) =>
                setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`)
              )) {
              log(`Reset setting '${setting.key}'`);
              await setting.delete();
            }
            //window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: FoundryAdapter.localize(`T5EK.Settings.Reset.dialogs.cancel`),
        },
      },
      default: 'cancel',
    });
  }

  async _updateObject(event, formData) {
    // do nothing
  }
}

function setDnd5eCssVariable(
  ...params: Parameters<CSSStyleDeclaration['setProperty']>
) {
  document
    .querySelector<HTMLElement>('.system-dnd5e')
    ?.style.setProperty(params[0], params[1]);
}
