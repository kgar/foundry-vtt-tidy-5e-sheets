
## To Do

- [ ] Create Row Action API
      - API method: `overrideCondition(key, wrapped: (originalFn, args: { app, document, data}) => boolean)`
      - Note: I am intentionally deferring partitioning to some other time.
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
- [ ] Write a script that takes an allowlist of svelte directories and generates `_module.ts` files for them. It includes named exports such as `export {default as AttuneButton} from "./AttuneButton.svelte";`
- [ ] Review main.svelte.ts `CONFIG.TIDY5E` init - should that content be passed in by a src/runtime/row-action/init.ts function? Or should it all be laid out in the open like that?
- [ ] One last look: with the API and registry implemented, is there anything about the design that should change?

## Questions

- What part should own partitioning?
  - Should I put partitions of row actions into CONFIG.TIDY5E?
    - Idea: `CONFIG.TIDY5E.rowActions.inventory.registry`, `CONFIG.TIDY5E.rowActions.inventory.setup`
      - `registry` - where the inventory row actions go
      - `setup` - partitions of inventory row actions by  
- How should partitioning be implemented in relation to the API and the runtime?
- ~~Is the runtime still relevant if the API can simply manipulate the registry directly?~~
  - The runtime should read from and write to the registry. No other Tidy code. This will keep things maintainable.

## Stretch

- [ ] Refactoring consideration: We don't need to ship whole copies of row actions. We can store them in `CONFIG.TIDY5E.rowActions` or the like, with sort orders built in, and ship just the keys in the appropriate order. This is a bigger and more involved refactoring, but it could be very valuable to do, allowing the API (or the brave user) to swap out implementations directly on `CONFIG.TIDY5E` (a thing which doesn't exist yet.)
- [ ] Refactoring consideration: `CONFIG.TIDY5E` can replace the concept of the various runtimes. Each can be represented in config, among other useful things like first-class reusable Tidy components. Another bigger refactor opportunity worth pursuing when all other matters have been settled.
- [ ] Actor sheets - Currently, activity row actions and columns are created in the moment when a TidyInlineActivitiesList is rendered upon expanding an item summary. It would be good to make some decisions on how the activity tables should be treated and whether we want to provide API integration for their row actions and/or columns. It may still be beneficial to lazily load their row actions and columns, but it feels like it goes against the rest of this effort. Then again, they were just hardcoded before now.
- [ ] Migrate in the Item section preparers and reduce looping to a single pass over the items.
- [ ] // TODO: Determine how to make managing row action styles less hardcoded and more configured.
- [ ] Try a CSS Grid / Sub-grid approach Tidy tables. This would eliminate the need to calculate row actions width and open lots of doors, if it were performant.