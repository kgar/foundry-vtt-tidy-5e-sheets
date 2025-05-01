## To Fix

- [ ] Implement Play/Edit mode for actor base
- [ ] Implement Play/Edit mode for group
- [ ] Test all actor editors / ensure mode toggles trigger submissions
- [ ] Refine Character App V2 conversion
  - [ ] Condition text is missing on Effects tab
  - [ ] Theme V2 needs to be applied, and the CSS selectors need to be updated to target theme-light and theme-dark
  - [ ] Convert all sheet editors to V2 / ensure secrets management/etc. is being handled
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


## Etc.
- (hightouch) the radio buttons on Foundry 13 are wonky / see container sort longpress menu