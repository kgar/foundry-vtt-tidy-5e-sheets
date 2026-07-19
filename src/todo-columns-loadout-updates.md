
## To Do

- [ ] Implement a central registry for each Row Action type, e.g. `Record<string, ItemRowAction>`, `Record<string, EffectRowAction>`, where the key string is a stable row action key for the given row action type.
    - Reason: 
      - Instant access for partitioning
      - Row actions will need stable keys, at least unique within their own specific row action type, even when called from the API, so that there are options like being able to enhance or even completely override existing row action conditions. E.g., the West Marches DM wants to hide all row actions for users, sometimes, only allowing the GM to edit.
  - `CONFIG.TIDY5E.rowActions.inventory`, `CONFIG.TIDY5E.rowActions.actor`, `CONFIG.TIDY5E.rowActions.encounterCombatantMember`, etc.
  - In the future, when storing world settings for custom rowActions, the same rowAction key (actor, inventory, etc.) will be included in the saved data.
- [ ] Initialize row actions in a central config file that inits on ready before the rest of the runtime. This is where all the default configs go, and all runtime usages / beyond will always reference `CONFIG.TIDY5E`. Ensure type safety of registry keys for known default entries.
- [ ] Create Row Action API
      - API method: `overrideCondition(key, wrapped: (originalFn, args: { app, document, data}) => boolean)`
- [ ] // TODO: Figured out how to eliminate this niche parameter
- [ ] // This should not be `any`; do we need to subdivide and conquer?
- [ ] Can Container Row Actions and Inventory Row Actions be the same list?
- [ ] // TODO: Do we really need this field? Surely we can figure this out with `item.actor`
- [ ] Clean up: ItemRowActionV2 -> ItemRowAction, and remove the original and its Condition type.
- [ ] Consider passing the sheet and document down to props callback for all row action types.
- [ ] Reevaluate the props for all row actions before finalizing the API
- [ ] Do any of the row actions need to be supressed when the sheet is not editable?
- [ ] Partition row actions by Document Name, Document Type, and Tab ID. Upgrade the API to allow for registering row actions into specific partitions, to bypass additional condition logic that would normally be needed.
  - Runtime partitions by Document Name, Document Type, Tab ID, and only store stable row action keys in sort order, rather than whole object copies
    - Reasons:
      - Shorter lists to process per render, resulting in relative performance improvements
- [ ] Extract a TidyRowActionsCell? Determine if this is feasible, given other row action component updates.


## Stretch

- [ ] Refactoring consideration: We don't need to ship whole copies of row actions. We can store them in `CONFIG.TIDY5E.rowActions` or the like, with sort orders built in, and ship just the keys in the appropriate order. This is a bigger and more involved refactoring, but it could be very valuable to do, allowing the API (or the brave user) to swap out implementations directly on `CONFIG.TIDY5E` (a thing which doesn't exist yet.)
- [ ] Refactoring consideration: `CONFIG.TIDY5E` can replace the concept of the various runtimes. Each can be represented in config, among other useful things like first-class reusable Tidy components. Another bigger refactor opportunity worth pursuing when all other matters have been settled.
- [ ] Actor sheets - Currently, activity row actions and columns are created in the moment when a TidyInlineActivitiesList is rendered upon expanding an item summary. It would be good to make some decisions on how the activity tables should be treated and whether we want to provide API integration for their row actions and/or columns. It may still be beneficial to lazily load their row actions and columns, but it feels like it goes against the rest of this effort. Then again, they were just hardcoded before now.
- [ ] Migrate in the Item section preparers and reduce looping to a single pass over the items.
- [ ] // TODO: Determine how to make managing row action styles less hardcoded and more configured.
- [ ] Try a CSS Grid / Sub-grid approach Tidy tables. This would eliminate the need to calculate row actions width and open lots of doors, if it were performant.