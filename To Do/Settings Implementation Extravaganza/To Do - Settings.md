## Implement ALL the Settings! 👏

Test and verify that each setting is correctly configured. It must work on load and adjust reactively on change when settings are adjusted.

> Important: Always verify that the setting adjusts from A->B AND from B->A in the same page lifetime.

Refine and improve any settings that compromise visual feedback and information for the same of functionality, e.g. the Locks remove proficiency buttons rather than disable them, when they should be simply preventing proficiency toggle cycling.

- [x] "defaultTheme"
- [x] "colorScheme"
- [x] "rightClickDisabled"
  - During NPC sheet setup, PC sheet setup, vehicle sheet setup
    - when classic controls enabled, find all item lists within grid layouts and add the class "alt-context"
    - when classic controls disabled, find all item lists and add class "alt-context"
  - When hooking into active effect context options via dnd5e.getActiveEffectContextOptions, it will clear the array of context options when enabled
  - When hooking into dnd5e.getItemContextOptions,
    - For spells in list layout, the context menu is emptied
    - For non-spells in list layout, the context menu is emptied
    - For all other cases, merge stock context menu options with Tidy 5e options
  - **Question**: Am I even managing context menu to this degree yet?
- [x] "classicControlsEnabled"
- [x] "hideIconsNextToTheItemName"
- [x] "itemCardsForAllItems"
- [x] "itemCardsForNpcs"
- [x] "itemCardsAreFloating"
- [x] "itemCardsDelay"
- [x] "itemCardsFixKey"
  - [x] Make it so the Tidy 5e version cannot change my Fix Key UI.
- [x] "traitLabelsEnabled"
- [x] "journalTabDisabled"
- [x] "journalTabNPCDisabled"
- [x] "classListDisabled"
- [x] "inspirationAnimationDisabled"
- [x] "hideIfZero"
  - [x] apply to inspo also
  - [x] ensure that showing on hover means "showing when hovering over the entire portrait area"
- [x] "inspirationOnHover"
- [x] "exhaustionOnHover"
- [x] "hpBarDisabled"
- [x] "hpOverlayDisabled"
- [x] "traitsTogglePc"
- [x] "traitsMovedBelowResource"
- [x] "ammoEquippedOnly"
- [ ] "traitsMovedBelowResourceNpc"
- [ ] "hpBarDisabledNpc"
- [ ] "hpOverlayDisabledNpc"
- [ ] "traitsAlwaysShownNpc"
- [ ] "skillsAlwaysShownNpc"
- [ ] "hideSpellbookTabNpc"
- [ ] "hpBarDisabledVehicle"
- [ ] "hpOverlayDisabledVehicle"
- [ ] "playerNameEnabled"
- [ ] "expandedSheetEnabled"
- [ ] "portraitStyle"
- [ ] "editTotalLockEnabled"
- [ ] "editGmAlwaysEnabled"
- [ ] "editEffectsGmOnlyEnabled"
- [ ] "hiddenDeathSavesEnabled"
- [ ] "hideSpellSlotMarker"
- [ ] "enableSpellLevelButtons"
- [ ] "hideStandardEncumbranceBar"
- [ ] "quantityAlwaysShownEnabled"
- [ ] "exhaustionEffectsEnabled"
- [ ] "exhaustionEffectIcon"
- [ ] "exhaustionEffectCustom"
- [ ] "exhaustionEffectCustomTiers"
- [ ] "exhaustionDisabled"
- [ ] "inspirationDisabled"
- [ ] "vehicleMotionDisabled"
- [ ] "restingForNpcsEnabled"
- [ ] "restingForNpcsChatDisabled"
- [ ] "linkMarkerNpc"
- [ ] "activeEffectsMarker"
- [ ] "playerSheetWidth"
- [ ] "npsSheetWidth"
- [ ] "enablePermanentUnlockOnNPCIfYouAreGM"
- [ ] "vehicleSheetWidth"
- [ ] "enablePermanentUnlockOnVehicleIfYouAreGM"
- [ ] "enableSortFavoritesItemsAlphabetically"
  - It works, but it's not reactive yet.
- [ ] "lockMoneyChanges"
- [ ] "lockExpChanges"
- [ ] "lockHpMaxChanges"
- [ ] "lockLevelSelector"
- [ ] "lockConfigureSheet"
- [ ] "lockItemQuantity"
- [ ] "allowCantripToBePreparedOnContext"
- [ ] "spellClassFilterSelect"
- [ ] "spellClassFilterIconReplace"
  - Works, but not reactive
- [ ] "spellClassFilterAdditionalClasses"
  - Works, but not reactive
- [ ] "allowHpMaxOverride"
- [ ] "allowHpConfigOverride"
- [ ] "betterAttackDialog"
- [ ] "colorPickerEnabled"
- [ ] "colorPickerPrimaryAccent"
- [ ] "colorPickerEquipped"
- [ ] "colorPickerEquippedOutline"
- [ ] "colorPickerEquippedAccent"
- [ ] "colorPickerPrepared"
- [ ] "colorPickerPreparedOutline"
- [ ] "colorPickerPreparedAccent"
- [ ] "colorPickerPact"
- [ ] "colorPickerPactOutline"
- [ ] "colorPickerPactAccent"
- [ ] "colorPickerAtWill"
- [ ] "colorPickerAtWillOutline"
- [ ] "colorPickerAtWillAccent"
- [ ] "colorPickerInnate"
- [ ] "colorPickerInnateOutline"
- [ ] "colorPickerInnateAccent"
- [ ] "colorPickerAlwaysPrepared"
- [ ] "colorPickerAlwaysPreparedOutline"
- [ ] "colorPickerAlwaysPreparedAccent"
- [x] "debug"


## Review and determine next steps

- [ ] "enableActionListOnFavoritePanel"
- [ ] "hbEnableUpcastFreeSpell"
- [ ] "hbSetFeaturesForUpcastFreeSpell"
- [ ] "defaultActionsTab"

## Settings to Purge

- [ ] "contextRollButtons"
  - Purpose unknown. Current maintainer doesn't know what it does.
