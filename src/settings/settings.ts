import { CONSTANTS } from '../constants';
import { FoundryAdapter } from '../foundry/foundry-adapter';
import { Tidy5eKgarUserSettings } from './user-settings-form';
import { RGBAToHexAFromColor } from '../utils/tidy5e-color-picker';
import { ResetSettingsDialog } from './ResetSettingsDialog';
import type { RoundedPortaitStyleOptions } from 'src/types/types';
import { applyTheme } from 'src/theme/theme';
import { defaultLightTheme } from 'src/theme/default-light-theme';
import { defaultDarkTheme } from 'src/theme/default-dark-theme';
import { getCoreThemes } from 'src/theme/theme-reference';

export function createSettings() {
  return {
    menus: {
      userMenu: {
        options: {
          name: `T5EK.Settings.SheetMenu.name`,
          label: 'T5EK.Settings.SheetMenu.label',
          hint: `T5EK.Settings.SheetMenu.hint`,
          icon: 'fas fa-cog',
          type: Tidy5eKgarUserSettings,
          restricted: false,
        },
      },
      resetAllSettings: {
        options: {
          name: `T5EK.Settings.Reset.name`,
          hint: `T5EK.Settings.Reset.hint`,
          icon: 'fas fa-database',
          type: ResetSettingsDialog,
          restricted: true,
        },
      },
    },
    settings: {
      defaultTheme: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.DefaultTheme.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.DefaultTheme.hint'),
          scope: 'world',
          config: true,
          type: String,
          choices: () => getCoreThemes(false),
          default: 'light',
          onChange: (data: string) => {
            const theme =
              data === 'light'
                ? defaultLightTheme
                : data === 'dark'
                ? defaultDarkTheme
                : null;

            const colorScheme = SettingsProvider.settings.colorScheme.get();

            if (theme && colorScheme === 'default') {
              applyTheme(theme);
            } else {
              ui.notifications.warn(`Tidy 5e Theme "${data}" not found.`);
            }
          },
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('defaultTheme');
        },
      },
      // Color Theme
      colorScheme: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.SheetTheme.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.SheetTheme.hint'),
          scope: 'client',
          config: true,
          type: String,
          choices: () => getCoreThemes(true),
          default: 'default',
          onChange: (data: string) => {
            const theme =
              data === 'light'
                ? defaultLightTheme
                : data === 'dark'
                ? defaultDarkTheme
                : null;

            if (theme === null) {
              const defaultThemeSetting =
                SettingsProvider.settings.defaultTheme.get();

              const defaultTheme =
                defaultThemeSetting === 'light'
                  ? defaultLightTheme
                  : defaultThemeSetting === 'dark'
                  ? defaultDarkTheme
                  : null;

              defaultTheme && applyTheme(defaultTheme);
            } else {
              applyTheme(theme);
            }
          },
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorScheme');
        },
      },

      // Disable Right Click
      rightClickDisabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.RightClickDisabled.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.RightClickDisabled.hint'
          ),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('rightClickDisabled');
        },
      },

      // Classic Item Controls
      classicControlsEnabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ClassicControls.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.ClassicControls.hint'),
          scope: 'client',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'classicControlsEnabled'
          );
        },
      },

      hideIconsNextToTheItemName: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'hideIconsNextToTheItemName'
          );
        },
      },

      // Item Info Cards
      itemCardsForAllItems: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ItemCardsForAllItems.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.ItemCardsForAllItems.hint'
          ),
          scope: 'client',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('itemCardsForAllItems');
        },
      },

      itemCardsForNpcs: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ItemCardsForNpcs.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.ItemCardsForNpcs.hint'),
          scope: 'world',
          config: true,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('itemCardsForNpcs');
        },
      },

      itemCardsAreFloating: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ItemCardsAreFloating.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.ItemCardsAreFloating.hint'
          ),
          scope: 'client',
          config: true,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('itemCardsAreFloating');
        },
      },

      itemCardsDelay: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ItemCardsDelay.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.ItemCardsDelay.hint'),
          scope: 'client',
          config: true,
          default: 300,
          type: Number,
        },
        get() {
          return FoundryAdapter.getGameSetting<number>('itemCardsDelay');
        },
      },

      itemCardsFixKey: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ItemCardsFixKey.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.ItemCardsFixKey.hint'),
          scope: 'world',
          config: false,
          default: 'x',
          type: String,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('itemCardsFixKey');
        },
      },

      // Show Roll buttons in context Menu
      contextRollButtons: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.RollButtonsToCard.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.RollButtonsToCard.hint'),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('contextRollButtons');
        },
      },

      //Show trait labels
      traitLabelsEnabled: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.TraitLabels.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.TraitLabels.hint'),
          scope: 'world',
          config: false,
          default: true,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('traitLabelsEnabled');
        },
      },

      // Settings Menu

      // PC Sheet Settings
      journalTabDisabled: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.JournalTab.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.JournalTab.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('journalTabDisabled');
        },
      },

      journalTabNPCDisabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.JournalTabNPCDisabled.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.JournalTabNPCDisabled.hint'
          ),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'journalTabNPCDisabled'
          );
        },
      },

      classListDisabled: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.ClassList.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.ClassList.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('classListDisabled');
        },
      },

      inspirationAnimationDisabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.InspirationAnimation.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.InspirationAnimation.hint'
          ),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'inspirationAnimationDisabled'
          );
        },
      },

      hideIfZero: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.HideIfZero.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.HideIfZero.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hideIfZero');
        },
      },

      inspirationOnHover: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.InspirationOnHover.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.InspirationOnHover.hint'
          ),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('inspirationOnHover');
        },
      },

      exhaustionOnHover: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ExhaustionOnHover.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.ExhaustionOnHover.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('exhaustionOnHover');
        },
      },

      hpBarDisabled: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.HpBar.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.HpBar.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hpBarDisabled');
        },
      },

      hpOverlayDisabled: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.HpOverlay.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.HpOverlay.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hpOverlayDisabled');
        },
      },

      traitsTogglePc: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.TraitsTogglePc.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.TraitsTogglePc.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('traitsTogglePc');
        },
      },

      traitsMovedBelowResource: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'traitsMovedBelowResource'
          );
        },
      },

      ammoEquippedOnly: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.AmmoEquippedOnly.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.AmmoEquippedOnly.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('ammoEquippedOnly');
        },
      },

      // NPC Sheet Settings

      traitsMovedBelowResourceNpc: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'traitsMovedBelowResourceNpc'
          );
        },
      },

      hpBarDisabledNpc: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.HpBar.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.HpBar.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hpBarDisabledNpc');
        },
      },

      hpOverlayDisabledNpc: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.HpOverlay.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.HpOverlay.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hpOverlayDisabledNpc');
        },
      },

      traitsAlwaysShownNpc: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.TraitsAlwaysShown.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.TraitsAlwaysShown.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('traitsAlwaysShownNpc');
        },
      },

      skillsAlwaysShownNpc: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.SkillsAlwaysShown.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.SkillsAlwaysShown.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('skillsAlwaysShownNpc');
        },
      },

      hideSpellbookTabNpc: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.SkillsAlwaysShown.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.SkillsAlwaysShown.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hideSpellbookTabNpc');
        },
      },

      // Vehicle Sheet Settings

      hpBarDisabledVehicle: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.HpBar.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.HpBar.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hpBarDisabledVehicle');
        },
      },

      hpOverlayDisabledVehicle: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.HpOverlay.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.HpOverlay.hint'),
          scope: 'client',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'hpOverlayDisabledVehicle'
          );
        },
      },

      //
      // GM Options
      //
      // Show Player Name
      playerNameEnabled: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.PlayerName.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.PlayerName.hint'),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('playerNameEnabled');
        },
      },

      // Expanded Sheet
      expandedSheetEnabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ExpandedSheet.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.ExpandedSheet.hint'),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('expandedSheetEnabled');
        },
      },

      // Portrait Settings
      // Portrait Style
      portraitStyle: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.PortraitStyle.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.PortraitStyle.hint'),
          scope: 'world',
          config: false,
          type: String,
          choices: {
            default: FoundryAdapter.localize(
              'T5EK.Settings.PortraitStyle.default'
            ),
            pc: FoundryAdapter.localize('T5EK.Settings.PortraitStyle.pc'),
            npc: FoundryAdapter.localize('T5EK.Settings.PortraitStyle.npc'),
            all: FoundryAdapter.localize('T5EK.Settings.PortraitStyle.all'),
          },
          default: 'all',
        },
        get(): RoundedPortaitStyleOptions {
          return FoundryAdapter.getGameSetting<RoundedPortaitStyleOptions>(
            'portraitStyle'
          );
        },
      },

      // Total Edit Lock
      editTotalLockEnabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.EditTotalLock.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.EditTotalLock.hint'),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('editTotalLockEnabled');
        },
      },

      editGmAlwaysEnabled: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.EditGmAlways.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.EditGmAlways.hint'),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('editGmAlwaysEnabled');
        },
      },

      editEffectsGmOnlyEnabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.EditEffectsGmOnly.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.EditEffectsGmOnly.hint'),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'editEffectsGmOnlyEnabled'
          );
        },
      },

      // Hidden Death Saves
      hiddenDeathSavesEnabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.HiddenDeathSaves.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.HiddenDeathSaves.hint'),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'hiddenDeathSavesEnabled'
          );
        },
      },

      // Hide marker spell slot
      hideSpellSlotMarker: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.HideSpellSlotMarker.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.HideSpellSlotMarker.hint'
          ),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('hideSpellSlotMarker');
        },
      },

      // Enable Spell Level Buttons
      enableSpellLevelButtons: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'enableSpellLevelButtons'
          );
        },
      },

      // Hide Standard Encumbrance Bar
      hideStandardEncumbranceBar: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'hideStandardEncumbranceBar'
          );
        },
      },

      // Item quantity
      quantityAlwaysShownEnabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.QuantityAlwaysShown.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.QuantityAlwaysShown.hint'
          ),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'quantityAlwaysShownEnabled'
          );
        },
      },

      // Tracker Settings
      exhaustionEffectsEnabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ExhaustionEffects.name'
          )}`,
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'exhaustionEffectsEnabled'
          );
        },
      },

      exhaustionEffectIcon: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.CustomExhaustionIcon.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.CustomExhaustionIcon.hint'
          ),
          scope: 'world',
          config: false,
          type: String,
          default: `modules/${CONSTANTS.MODULE_ID}/images/exhaustion.svg`,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('exhaustionEffectIcon');
        },
      },

      exhaustionEffectCustom: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.CustomExhaustionEffect.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.CustomExhaustionEffect.hint'
          ),
          scope: 'world',
          config: false,
          default: 'Exhaustion',
          type: String,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'exhaustionEffectCustom'
          );
        },
      },

      exhaustionEffectCustomTiers: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.CustomExhaustionEffect.tiers'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.CustomExhaustionEffect.hint'
          ),
          scope: 'world',
          config: false,
          default: 5,
          type: Number,
        },
        get() {
          return FoundryAdapter.getGameSetting<number>(
            'exhaustionEffectCustomTiers'
          );
        },
      },

      exhaustionDisabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ExhaustionDisabled.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.ExhaustionDisabled.hint'
          ),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('exhaustionDisabled');
        },
      },

      inspirationDisabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.InspirationDisabled.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.InspirationDisabled.hint'
          ),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('inspirationDisabled');
        },
      },

      vehicleMotionDisabled: {
        options: {
          name: FoundryAdapter.localize(
            'T5EK.Settings.VehicleMotionDisabled.name'
          ),
          hint: FoundryAdapter.localize(
            'T5EK.Settings.VehicleMotionDisabled.hint'
          ),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'vehicleMotionDisabled'
          );
        },
      },

      // NPC Resting
      restingForNpcsEnabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.RestingForNpcs.name'
          )}`,
          hint: FoundryAdapter.localize('T5EK.Settings.RestingForNpcs.hint'),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'restingForNpcsEnabled'
          );
        },
      },

      restingForNpcsChatDisabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.RestingForNpcsChat.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.RestingForNpcsChat.hint'
          ),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'restingForNpcsChatDisabled'
          );
        },
      },

      // Link Marker
      linkMarkerNpc: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.LinkMarker.name'),
          hint: FoundryAdapter.localize('T5EK.Settings.LinkMarker.hint'),
          scope: 'world',
          config: false,
          type: String,
          choices: {
            default: FoundryAdapter.localize(
              'T5EK.Settings.LinkMarker.default'
            ),
            unlinked: FoundryAdapter.localize(
              'T5EK.Settings.LinkMarker.unlinked'
            ),
            both: FoundryAdapter.localize('T5EK.Settings.LinkMarker.both'),
          },
          default: 'default',
        },
        get() {
          return FoundryAdapter.getGameSetting<'default' | 'unlinked' | 'both'>(
            'linkMarkerNpc'
          );
        },
      },

      // Show if item has active effects
      activeEffectsMarker: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ActiveEffectsMarker.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.ActiveEffectsMarker.hint'
          ),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('activeEffectsMarker');
        },
      },

      // Set default Tab for character actions list

      enableActionListOnFavoritePanel: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'enableActionListOnFavoritePanel'
          );
        },
      },

      defaultActionsTab: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.defaultActionsTab.name'
          )}`,
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('defaultActionsTab');
        },
      },

      // Default width for player sheet

      playerSheetWidth: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.playerSheetWidth'),
          scope: 'client',
          config: false,
          type: Number,
          default: 740,
        },
        get() {
          return FoundryAdapter.getGameSetting<number>('playerSheetWidth');
        },
      },

      // Default width for NPC sheet

      npsSheetWidth: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.npsSheetWidth'),
          scope: 'client',
          config: false,
          type: Number,
          default: 740,
        },
        get() {
          return FoundryAdapter.getGameSetting<number>('npsSheetWidth');
        },
      },

      enablePermanentUnlockOnNPCIfYouAreGM: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.EnablePermanentUnlockOnNPCIfYouAreGM.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.EnablePermanentUnlockOnNPCIfYouAreGM.hint'
          ),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'enablePermanentUnlockOnNPCIfYouAreGM'
          );
        },
      },

      // Default width for vehicle sheet

      vehicleSheetWidth: {
        options: {
          name: FoundryAdapter.localize('T5EK.Settings.vehicleSheetWidth'),
          scope: 'client',
          config: false,
          type: Number,
          default: 740,
        },
        get() {
          return FoundryAdapter.getGameSetting<number>('vehicleSheetWidth');
        },
      },

      enablePermanentUnlockOnVehicleIfYouAreGM: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.EnablePermanentUnlockOnVehicleIfYouAreGM.name'
          )}`,
          hint: FoundryAdapter.localize(
            'T5EK.Settings.EnablePermanentUnlockOnVehicleIfYouAreGM.hint'
          ),
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'enablePermanentUnlockOnVehicleIfYouAreGM'
          );
        },
      },

      // Lazy Money

      lazyMoneyEnable: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.LazyMoneyEnable.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.LazyMoneyEnable.hint'
          )}`,
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lazyMoneyEnable');
        },
      },

      lazyMoneyAddConvert: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lazyMoneyAddConvert');
        },
      },

      lazyMoneyIgnoreElectrum: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'lazyMoneyIgnoreElectrum'
          );
        },
      },

      lazyMoneyChatLog: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.LazyMoneyChatLog.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.LazyMoneyChatLog.hint'
          )}`,
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lazyMoneyChatLog');
        },
      },

      // Favorites

      enableSortFavoritesItemsAlphabetically: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'enableSortFavoritesItemsAlphabetically'
          );
        },
      },

      // Locks

      lockMoneyChanges: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.LockMoneyChanges.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.LockMoneyChanges.hint'
          )}`,
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockMoneyChanges');
        },
      },

      lockExpChanges: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.LockExpChanges.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.LockExpChanges.hint'
          )}`,
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockExpChanges');
        },
      },

      lockHpMaxChanges: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.LockHpMaxChanges.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.LockHpMaxChanges.hint'
          )}`,
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockHpMaxChanges');
        },
      },

      lockLevelSelector: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.LockLevelSelector.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.LockLevelSelector.hint'
          )}`,
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockLevelSelector');
        },
      },

      lockConfigureSheet: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.LockConfigureSheet.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.LockConfigureSheet.hint'
          )}`,
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockConfigureSheet');
        },
      },

      lockItemQuantity: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.LockItemQuantity.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.LockItemQuantity.hint'
          )}`,
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('lockItemQuantity');
        },
      },

      // Other

      allowCantripToBePreparedOnContext: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'allowCantripToBePreparedOnContext'
          );
        },
      },

      spellClassFilterSelect: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'spellClassFilterSelect'
          );
        },
      },

      spellClassFilterIconReplace: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'spellClassFilterIconReplace'
          );
        },
      },

      spellClassFilterAdditionalClasses: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'spellClassFilterAdditionalClasses'
          );
        },
      },

      allowHpMaxOverride: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.AllowHpMaxOverride.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.AllowHpMaxOverride.hint'
          )}`,
          scope: 'world',
          config: false,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('allowHpMaxOverride');
        },
      },

      allowHpConfigOverride: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>(
            'allowHpConfigOverride'
          );
        },
      },

      betterAttackDialog: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.BetterAttackDialog.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.BetterAttackDialog.hint'
          )}`,
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
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('betterAttackDialog');
        },
      },

      // Color customization

      colorPickerEnabled: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ColorPickerEnabled.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.ColorPickerEnabled.hint'
          )}`,
          scope: 'client',
          type: Boolean,
          default: false,
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('colorPickerEnabled');
        },
      },

      // --t5e-equipped: 					rgba(50, 205, 50, 0.3);
      // --t5e-equipped-outline: 			rgba(50, 205, 50, 1);
      // --t5e-equipped-accent: 			rgba(173, 255, 47, 1);

      colorPickerEquipped: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerEquipped');
        },
      },
      colorPickerEquippedOutline: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerEquippedOutline'
          );
        },
      },
      colorPickerEquippedAccent: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerEquippedAccent'
          );
        },
      },

      // --t5e-prepared: 					rgba(50, 205, 50, 0.3);
      // --t5e-prepared-outline: 			rgba(50, 205, 50, 1);
      // --t5e-prepared-accent: 			rgba(173, 255, 47, 1);

      colorPickerPrepared: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerPrepared');
        },
      },
      colorPickerPreparedOutline: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerPreparedOutline'
          );
        },
      },
      colorPickerPreparedAccent: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerPreparedAccent'
          );
        },
      },

      // --t5e-pact:					    rgba(250, 0, 180, 0.3);
      // --t5e-pact-outline: 			    rgba(250, 50, 213, 1);
      // --t5e-pact-accent: 				rgba(198, 119, 193, 1);

      colorPickerPact: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ColorPickerPact.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.ColorPickerPact.hint'
          )}`,
          scope: 'client',
          type: String,
          default: RGBAToHexAFromColor(250, 0, 180, 0.3),
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerPact');
        },
      },
      colorPickerPactOutline: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerPactOutline'
          );
        },
      },
      colorPickerPactAccent: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerPactAccent');
        },
      },

      // --t5e-atwill: 					rgba(226, 246, 4, 0.3);
      // --t5e-atwill-outline: 			rgba(163, 165, 50, 1);
      // --t5e-atwill-accent: 		    rgba(255, 242, 0, 1);

      colorPickerAtWill: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ColorPickerAtWill.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.ColorPickerAtWill.hint'
          )}`,
          scope: 'client',
          type: String,
          default: RGBAToHexAFromColor(226, 246, 4, 0.3),
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerAtWill');
        },
      },
      colorPickerAtWillOutline: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerAtWillOutline'
          );
        },
      },
      colorPickerAtWillAccent: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerAtWillAccent'
          );
        },
      },

      // --t5e-innate: 					rgba(255, 0, 0, 0.3);
      // --t5e-innate-outline: 			rgba(231, 23, 23, 1);
      // --t5e-innate-accent: 			rgba(195, 69, 69, 1);

      colorPickerInnate: {
        options: {
          name: `${FoundryAdapter.localize(
            'T5EK.Settings.ColorPickerInnate.name'
          )}`,
          hint: `${FoundryAdapter.localize(
            'T5EK.Settings.ColorPickerInnate.hint'
          )}`,
          scope: 'client',
          type: String,
          default: RGBAToHexAFromColor(255, 0, 0, 0.3),
          config: false,
        },
        get() {
          return FoundryAdapter.getGameSetting<string>('colorPickerInnate');
        },
      },
      colorPickerInnateOutline: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerInnateOutline'
          );
        },
      },
      colorPickerInnateAccent: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerInnateAccent'
          );
        },
      },

      // --t5e-alwaysprepared: 			rgba(0, 0, 255, 0.15);
      // --t5e-alwaysprepared-outline: 	rgba(65, 105, 225, 1);
      // --t5e-alwaysprepared-accent: 	rgba(0, 191, 255, 1);

      colorPickerAlwaysPrepared: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerAlwaysPrepared'
          );
        },
      },
      colorPickerAlwaysPreparedOutline: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerAlwaysPreparedOutline'
          );
        },
      },
      colorPickerAlwaysPreparedAccent: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'colorPickerAlwaysPreparedAccent'
          );
        },
      },

      // ===============================
      // Homebrew Rules
      // ===============================

      hbEnableUpcastFreeSpell: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'hbEnableUpcastFreeSpell'
          );
        },
      },

      hbSetFeaturesForUpcastFreeSpell: {
        options: {
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
        },
        get() {
          return FoundryAdapter.getGameSetting<string>(
            'hbSetFeaturesForUpcastFreeSpell'
          );
        },
      },

      // ========================================================================
      debug: {
        options: {
          name: `T5EK.Settings.Debug.name`,
          hint: `T5EK.Settings.Debug.hint`,
          scope: 'client',
          config: true,
          default: false,
          type: Boolean,
        },
        get() {
          return FoundryAdapter.getGameSetting<boolean>('debug');
        },
      },
    },
  } as const;
}

export let SettingsProvider: ReturnType<typeof createSettings>;

export function initSettings() {
  SettingsProvider = createSettings();

  for (let menu of Object.entries(SettingsProvider.menus)) {
    // TODO: Need some way to notify when new setting menus are not configured correctly; doesn't have to be perfect
    game.settings.registerMenu(CONSTANTS.MODULE_ID, menu[0], menu[1].options);
  }

  for (let setting of Object.entries(SettingsProvider.settings)) {
    // TODO: Need some way to notify when new settings are not configured correctly; doesn't have to be perfect
    game.settings.register(CONSTANTS.MODULE_ID, setting[0], setting[1].options);
  }

  SettingsProvider.settings.colorScheme.options.onChange(
    SettingsProvider.settings.colorScheme.get()
  );
}

function setDnd5eCssVariable(
  ...params: Parameters<CSSStyleDeclaration['setProperty']>
) {
  document
    .querySelector<HTMLElement>('.system-dnd5e')
    ?.style.setProperty(params[0], params[1]);
}
