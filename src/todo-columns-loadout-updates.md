
## To Do

- [ ] <!-- TODO: Advancements, derive from TidySectionBase -->
- [ ] <!-- TODO: Advancements, use column specs and custom column components -->
- [ ] <!-- TODO: Advancements, use header action and row action render components -->
- [ ] `generics="TEntry extends { id: string, uuid: string, name: string, img: string}"` - find out why TidyItemTable is using this generic interface and try to eliminate it. We should always have items when using the TidyItemTable.
- [ ] <!-- TODO: Convert to an ordered section array for regular processing. -->
- [ ] Refactor - consider making TableRowActions a base component (TData = never) that is derived by ItemTableRowActions, ActorTableRowActions, etc., if that's even possible, with the intent to require the caller to call upon the appropriate row actions component, given their row action typing.
- [ ] Evaluate params for Inventory.applyInventoryItemToSection and tidy it up.
- [ ] rowAction.condition is called when assigning to an itemContext entry, but in order to run the `condition()` function call, it asks for an itemContext entry. Figure out how to eliminate the need for the itemContext entry and instead just use the document data.
- [ ] This happens a lot with row actions: `!action.condition || action.condition(...)` ; can we either create a helper or somehow have the condition function defaulted to a universal return true copy when not specified?
- [ ] // TODO: This happens twice. Where should this data prep go?
- [ ] Refactoring consideration: Row Actions don't need both presence/absence as well as an optional condition callback. We also don't need to pull row actions until we have an item to be evaluated. Consider eliminating presence/absence and just evaluating conditions each time an item needs row actions. `TableRowActionsRuntime.getEncounterMemberRowActions(context: ActorSheetQuadroneContext)` and others like it do not need the full context object in order to return row actions, just some intel like editable and unlocked, plus the document entry.
- [ ] Extract a TidyRowActionsCell? Determine if this is feasible, given other row action component updates.
- [ ] table.types.ts and the types in TableRowActionsRuntime need to be consolidated to the main types file.
- [ ] // TODO: Move advancement sections / columns / row actions to context prep
- [ ] // TODO: this should only return SectionCommand[]

## Stretch

- [ ] Migrate in the Item section preparers and reduce looping to a single pass over the items.
- [ ] Refactoring consideration: We don't need to ship whole copies of row actions. We can store them in `CONFIG.TIDY5E.rowActions` or the like, with sort orders built in, and ship just the keys in the appropriate order. This is a bigger and more involved refactoring, but it could be very valuable to do, allowing the API (or the brave user) to swap out implementations directly on `CONFIG.TIDY5E` (a thing which doesn't exist yet.)
- [ ] Refactoring consideration: `CONFIG.TIDY5E` can replace the concept of the various runtimes. Each can be represented in config, among other useful things like first-class reusable Tidy components. Another bigger refactor opportunity worth pursuing when all other matters have been settled.
- [ ] Actor sheets - Currently, activity row actions and columns are created in the moment when a TidyInlineActivitiesList is rendered upon expanding an item summary. It would be good to make some decisions on how the activity tables should be treated and whether we want to provide API integration for their row actions and/or columns. It may still be beneficial to lazily load their row actions and columns, but it feels like it goes against the rest of this effort. Then again, they were just hardcoded before now.
- [ ] <!-- TODO: Upgrade to use full section actions feature -->
- [ ] // TODO: Determine how to make managing row action styles less hardcoded and more configured.
- [ ] Try a CSS Grid / Sub-grid approach Tidy tables. This would eliminate the need to calculate row actions width and open lots of doors, if it were performant.