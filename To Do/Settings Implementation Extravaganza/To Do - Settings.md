## Refine

- [x] HP Overlay - set pointer-events to none on `.death-saves`; set pointer-events to auto on `.death-saves > *`
- [ ] Carve out a shared base type for all sheet contexts which contains universal settings
  - [x] ~~allowEdit~~ now rolled into editable
  - [x] lockSensitiveFields
  - [x] editable - this should combine the composite allowEdit and the "editable" field provided by dnd5e context
    - ... or should it replace allowEdit altogether?
  - [ ] ...?
- [ ] Replace unioned sheet context types which reference all three sheet types with the base context, where able.
- [ ] Add the NPM watch script for enforcing resolving type errors
  - [ ] Begin the process of pulling all data for sheets into their context types
    - [ ] PC
    - [ ] NPC
    - [ ] Vehicle
- [ ] Begin the arduous process of actually creating a flattened type for each sheet context which contains the needed data
- [ ] Figure out how to centralize and make testable the property strings that appear on all the various sheet inputs. It might be as simple as adding more constants...
- [ ] Observers / Limited users should not be allowed to click configure buttons or make rolls.

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
- [x] "traitsMovedBelowResourceNpc"
- [x] "hpBarDisabledNpc"
- [x] "hpOverlayDisabledNpc"
- [x] "traitsAlwaysShownNpc"
- [x] "skillsAlwaysShownNpc"
- [x] "hideSpellbookTabNpc"
- [x] "hpBarDisabledVehicle"
- [x] "hpOverlayDisabledVehicle"
- [x] "playerNameEnabled"
- [x] "portraitStyle"
- [x] "editTotalLockEnabled"
- [x] "hiddenDeathSavesEnabled"
- [x] "hideSpellSlotMarker"
- [x] "enableSpellLevelButtons"
- [x] "hideStandardEncumbranceBar"
- [x] "quantityAlwaysShownEnabled"
  - Need to implement for NPCs
  - Need to implement for vehicles
- [x] Move "quantityAlwaysShownEnabled" down into the ItemTableRow itself
- [x] "exhaustionEffectsEnabled" - removed
- [x] "exhaustionEffectIcon" - removed
- [x] "exhaustionEffectCustom" - removed
- [x] "exhaustionEffectCustomTiers" - removed
- [x] "exhaustionDisabled"
- [x] "editGmAlwaysEnabled"
  - If a GM and setting turned on, always show classic controls
    - To accomplish this in an elegant way, use a specific boolean setting on the ActorSheetContext (to be renamed CharacterSheetContext) for `showAllEditOptions`, to be combined with `classicControlsEnabled` to determine if classic controls are shown at all and whether the full set of options is shown.
  - Missed a spot: right click menu doesn't provide all the options. That would also need to be handled.
    - Check for whether the user is a GM and, if so, override allow-edit if the option is enabled
- [x] "editEffectsGmOnlyEnabled"
  - Removes classic controls altogether for the player on the effects tab
  - When unlocked, shows red banner "Only your GM can edit this section." 
    - T5EK.GmOnlyEdit
  - Missed a spot: right click menu still provides options. That would also need to be handled. 
  - [x] Consolidate the boolean function logic to FoundryAdapter as `allowEffectsEditing`
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
- [ ] "expandedSheetEnabled"
  - Will require some more attention / effort.
- [x] "debug"


## Review and determine next steps

- [ ] "enableActionListOnFavoritePanel"
- [ ] "hbEnableUpcastFreeSpell"
- [ ] "hbSetFeaturesForUpcastFreeSpell"
- [ ] "defaultActionsTab"

## Settings to Purge

- [ ] "contextRollButtons"
  - Purpose unknown. Current maintainer doesn't know what it does.
