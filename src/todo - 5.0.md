## To Fix

- [ ] If possible, forward the parent sheet's theme to all dialogs/applications they open
- [ ] accountForExternalSections is not being used quite right. It needs to happen after any callers have updated context with their own data. How do we account for this?
- [ ] // TODO: Make the character sheet handle bastion tab check. This is violating separation of concerns.
- [ ] // TODO: In AppV2, consider a mixin for common data preparation between Actors, like in dnd5e.


## Refactors

- [ ] Inline the custom Tidy modifications for spellbook preparation; ensure modules can still add spells / sections and have Tidy perform a post-operation to backfill spell section keys / Tidy props.
- [ ] Make Warning header control its own additional component that is placed on the header. It should show/hide itself and manage everything it needs to manage.
  - Consider even wiring directly into header controls setup.
