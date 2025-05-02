## To Fix

- [ ] Test all actor editors / ensure mode toggles trigger submissions
- [ ] Refine Character App V2 conversion
  - [ ] Need to steal just the layout parts of `.standard-form`
- [ ] verify: (all 3 sheets) Pull sheet preferences during initialize application options
- [ ] Inline the custom Tidy modifications for spellbook preparation; ensure modules can still add spells / sections and have Tidy perform a post-operation to backfill spell section keys / Tidy props.
- [ ] Make Warning header control its own additional component that is placed on the header. It should show/hide itself and manage everything it needs to manage.
  - Consider even wiring directly into header controls setup.
- [ ] accountForExternalSections is not being used quite right. It needs to happen after any callers have updated context with their own data. How do we account for this?
- [ ] // TODO: Make the character sheet handle bastion tab check. This is violating separation of concerns.
- [ ] Eliminate permanentlyUnlockCharacterSheetForGm, etc.
- [ ] Make Journal panels scroll at the editor level and not the panel+title level.

## Etc.
- (hightouch) the radio buttons on Foundry 13 are wonky / see container sort longpress menu
