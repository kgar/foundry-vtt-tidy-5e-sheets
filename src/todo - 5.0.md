## To Fix

- [ ] Theme V2 upgrade, phase 1
  - [ ] Apply all themes' color sets globally in the current fashion.
  - [ ] Whenever theme colors change, refresh all theme styles.
  - [ ] Global theme selector should update global theme variables.
  - [ ] Sheet theme selector should update that sheet's variables.
  - [ ] Figure out how to do live preview of sheet/global changes.
  - [ ] Ensure all sheets can toggle light/dark mode without issue.
- [ ] Test all actor editors / ensure mode toggles trigger submissions
- [ ] Refine Character App V2 conversion
  - [ ] Need to steal just the layout parts of `.standard-form`
- [ ] (all 3 sheets) Pull sheet preferences during initialize application options
- [ ] biographyHTML is redundant
- [ ] Inline the custom Tidy modifications for spellbook preparation; ensure modules can still add spells / sections and have Tidy perform a post-operation to backfill spell section keys / Tidy props.
- [ ] Share whatever drag and drop stuff we can with Group Sheet
- [ ] Make Warning header control its own additional component that is placed on the header. It should show/hide itself and manage everything it needs to manage.
  - Consider even wiring directly into header controls setup.
- [ ] accountForExternalSections is not being used quite right. It needs to happen after any callers have updated context with their own data. How do we account for this?
- [ ] Purge App V1 SCSS
- [ ] // TODO: Make the character sheet handle bastion tab check. This is violating separation of concerns.
- [ ] Eliminate permanentlyUnlockCharacterSheetForGm, etc.
- [ ] Make Journal panels scroll at the editor level and not the panel+title level.

## Etc.
- (hightouch) the radio buttons on Foundry 13 are wonky / see container sort longpress menu

## Stretch

- [ ] Provide light/dark tabs on theme config dialog
- [ ] Create the Quadrone version and delineate the two