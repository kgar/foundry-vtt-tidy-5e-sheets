## Refine

- [x] HP Overlay - set pointer-events to none on `.death-saves`; set pointer-events to auto on `.death-saves > *`
- [x] Carve out a shared base type for all sheet contexts which contains universal settings
  - [x] ~~allowEdit~~ now rolled into editable
  - [x] lockSensitiveFields
  - [x] editable - this should combine the composite allowEdit and the "editable" field provided by dnd5e context
    - ... or should it replace allowEdit altogether?
- [x] 🐞 Click Str > Click Ability Check > Click Normal - notice that the chat message doesn't tell what kind of ability it is.
- [x] 🐞 Update Search Filters
  - [x] The placeholder text should match the tab name
  - [x] The placeholder text should user the faded / secondary color, while the text should use the primary font color.
  - [x] Test it
- [x] Make SHEET_TYPE_CHARACTER, SHEET_TYPE_NPC, and SHEET_TYPE_VEHICLE constants and update all usages.
- [x] Extract "useRoundedPortraitStyle" to ActorSheetContext
- [x] Make SPELL_PREPARATION_MODE_XYZ constants and update all usages.
- [x] Honor game setting "Disable Experience Tracking" on our sheets
- [x] Observers / Limited users should not be allowed to click configure buttons or make rolls.
- [ ] 🐞 When changing sheet permissions from observer/owner to limited, half the sheet changes while the other half with the header and tab strip remain intact. It should refresh the entire sheet.
- [ ] Find anchor-tag-based icon buttons; replace with actual buttons
  - `.icon-button` is for icon buttons
  - `.transparent-button` is for buttons that just want the button content and not the button background, border, etc.
  - `.item-list-button` for buttons that appear in the classic controls item list.
  - [ ] Replace each one and test
  - [ ] Ensure disable logic is honored
- [x] Convert all `<BlockTitle />` elements to contain buttons. Should the h4 be a button, or should it be an h4? Can an h4 contain a button and it be meaningful to a screen reader?

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
- [x] "enableSpellLevelButtons" - removed
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
- [x] "editGmAlwaysEnabled" => "enablePermanentUnlockOnCharacterIfYouAreGM"
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
- [x] "inspirationDisabled"
- [x] "vehicleMotionDisabled"
- [x] "restingForNpcsEnabled"
- [x] "restingForNpcsChatDisabled"
- [x] "linkMarkerNpc"
- [x] "activeEffectsMarker"
  - [x] Review how this looks in Tidy 5e original
    - https://cdn.discordapp.com/attachments/1116078321067892796/1159218983254380645/image.png?ex=653039ce&is=651dc4ce&hm=f9188fc6784539cf8ca765c09dab8902a981af5f1cb821b3350cf5e2ae9d7e4e&
    - https://discord.com/channels/732325252788387980/1116078321067892796/1159218984168718336
  - [x] Implement this with the trigger condition defaulted to True for evaluation purposes
  - [x] Somehow make this generic and extend it to all sheet types
    - [x] It should happen in the universal item row table rendering, if possible
    - [x] Place the marker after the item name h4 element (or rewritten equivalent)
- [x] "playerSheetWidth"
- [x] "npsSheetWidth" => "npcSheetWidth"
- [x] "vehicleSheetWidth"
- [x] "enablePermanentUnlockOnNPCIfYouAreGM"
- [x] "enablePermanentUnlockOnVehicleIfYouAreGM"
- [x] "enableSortFavoritesItemsAlphabetically"
  - [x] It works, but it's not reactive yet.
- [x] "lockMoneyChanges"
- [x] "lockExpChanges"
- [x] "lockHpMaxChanges"
- [x] "lockLevelSelector"
- [x] "lockConfigureSheet"
- [x] "lockItemQuantity"
- [x] "allowCantripToBePreparedOnContext"
  - [x] Make `canPrepareSpell()` available for all actors
  - [x] Reuse `canPrepareSpell()` for context menu
  - [x] Reuse `canPrepareSpell()` for PC classic controls
  - [x] Reuse `canPrepareSpell()` for NPC classic controls
  - [x] Reuse the Prepare Spell button on classic controls for cantrips when setting is enabled
- [x] "spellClassFilterSelect"
- [x] "spellClassFilterIconReplace"
  - ~~Works, but not reactive~~
- [x] "spellClassFilterAdditionalClasses"
  - ~~Works, but not reactive~~
- [x] "allowHpMaxOverride"
- [x] "allowHpConfigOverride" - removed it
- [x] "betterAttackDialog" - removed it
  - [x] Pending removal unless someone has a strong case for it.
- [x] "colorPickerEnabled"
- [x] "colorPickerPrimaryAccent"
- [x] "colorPickerEquipped"
- [x] "colorPickerEquippedOutline"
- [x] "colorPickerEquippedAccent"
- [x] "colorPickerPrepared"
- [x] "colorPickerPreparedOutline"
- [x] "colorPickerPreparedAccent"
- [x] "colorPickerPact"
- [x] "colorPickerPactOutline"
- [x] "colorPickerPactAccent"
- [x] "colorPickerAtWill"
- [x] "colorPickerAtWillOutline"
- [x] "colorPickerAtWillAccent"
- [x] "colorPickerInnate"
- [x] "colorPickerInnateOutline"
- [x] "colorPickerInnateAccent"
- [x] "colorPickerAlwaysPrepared"
- [x] "colorPickerAlwaysPreparedOutline"
- [x] "colorPickerAlwaysPreparedAccent"
- [x] "debug"
- [x] "contextRollButtons" - removed
  - Purpose unknown. Current maintainer doesn't know what it does.
- [x] "expandedSheetEnabled"
  - [x] Choose the regular sheet for non-GM / non-Owner when this is enabled
  - [x] Figure out how to refresh the sheet fully when this changes. As of now, thinking of moving the sheet switch logic into a base character sheet component.
  - [x] Ensure all inputs and editable fields require ownership or GM status to edit
    - [x] input
    - [x] select
    - [x] textarea - ain't got none
    - [x] Checkbox.svelte
    - [x] NumberInput.svelte
    - [x] Select.svelte
    - [x] SelectOptions.svelte - no need
    - [x] TextInput.svelte
  - [x] Test it

## Review and determine next steps

- [x] "enableActionListOnFavoritePanel" - removed
  - Renders Action List from API and plunks it into Favorites area above favorites
  - Looking rough right now in the original module
  - Probably going to remove and then return to it when implementing Actions tab natively
- [x] "hbEnableUpcastFreeSpell" - removed
  - Based on discussion with the commission, remove this.
- [x] "hbSetFeaturesForUpcastFreeSpell" - removed
  - Based on discussion with the commission, remove this.
- [ ] "defaultActionsTab"
  - [ ] Restyle as simply the Default Character Sheet Tab and put in Character settings
  - [ ] Add similar settings to NPC and Vehicles
  - [ ] Upgrade tabs to be fully data-driven for this

## Specific setting notes

### `activeEffectsMarker`:

- For PCs only, look at all items for the PC (inventory, spells, ...?)
  - If the item has 1 or more effects a la `actor.items[...].effects.length`, then append this marker: `<span class="ae-marker" title="Item has active effects">Æ</span>`
    - Note: need to localize the title, bud

Original impl:

```js
function markActiveEffects(app, html, data) {
  if (game.settings.get(CONSTANTS.MODULE_ID, 'activeEffectsMarker')) {
    let actor = app.actor;
    let items = data.actor.items;
    let marker = `<span class="ae-marker" title="Item has active effects">Æ</span>`;
    for (let item of items) {
      debug(`tidy5e-sheet | markActiveEffects | item: ${item}`);
      if (item.effects.length > 0) {
        let id = item._id;
        debug(`tidy5e-sheet | markActiveEffects | itemId: ${id}`);
        html.find(`.item[data-item-id="${id}"] .item-name h4`).append(marker);
      }
    }
  }
}
```

```scss
.ae-marker {
  display: inline-block;
  padding: 1px 3px 0 3px;
  font-size: 12px;
  line-height: 15px;
  font-weight: 600;
  background: var(--t5e-warning-accent);
  color: var(--t5e-secondary-color);
  border-radius: 3px;
}
```
