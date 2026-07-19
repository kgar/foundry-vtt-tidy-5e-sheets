
## To Do

- [ ] Finish dismantling TableRowActionRuntime
  - [ ] getEncounterMemberRowActions
  - [ ] getDraftAnimalRowActions
  - [ ] getUnassignedCrewPassengerRowActions
  - [ ] getAssignedCrewRowActions
  - [ ] getEncounterCombatRowActions
  - [ ] getItemAdvancementRowActions
  - [ ] calculateRowActionWidthRems
    - perhaps a static on the base abstract class?
  - [ ] getRowActionWidthInfo
    - perhaps a static on the base abstract class?
- [ ] Do any of the row actions need to be supressed when the sheet is not editable?
- [ ] Refactoring consideration: Row Actions don't need both presence/absence as well as an optional condition callback. We also don't need to pull row actions until we have an item to be evaluated. Consider eliminating presence/absence and just evaluating conditions each time an item needs row actions. `TableRowActionsRuntime.getEncounterMemberRowActions(context: ActorSheetQuadroneContext)` and others like it do not need the full context object in order to return row actions, just some intel like editable and unlocked, plus the document entry.
  - [x] Move and separate the columns runtime and row actions runtime into their own folders
  - [ ] Design a runtime for row actions that covers each variety of row action available, covered by a base class that can perform condition filtering, etc.
    - [x] As part of this effort, revamp the condition types for each of the known row action types. Include the canonical `app` and `document` fields, as well as any custom options related to the given row action.
    - [x] Evaluate and eliminate any custom options (e.g., 'canEquip') if possible, based on patterns of their usage and the doc/app in question.
      - Something to consider: sheet mode is sometimes locked down in context but not in the app itself. For this reason, all condition callbacks should have an options/flags object that specifies a few important things, like `unlocked`, `editable`, etc.
      - Type notes 
        - Tentative params: `document, app, data`
        - Ideally, we should take either the Generic Row Action args or a function that returns said args. That way, the feature remains contained.
        - Row actions will need stable keys, even when called from the API, so that there are options like being able to enhance or even completely override existing row action conditions. E.g., the West Marches DM wants to hide all row actions for users, sometimes, only allowing the GM to edit.
        - API method: `overrideCondition(key, wrapped: (originalFn, args: { app, document, data}) => boolean)`
      - Some row action concerns are a matter of partitioning
      - Consider 
        - A central registry for each Row Action type, e.g. `Map<string, ItemRowAction>`, `Map<string, EffectRowAction>`, where the Map key string is a stable row action key for the given row action type
          - Reason: 
            - Instant access for partitioning
        - Runtime partitions by Document Name, Document Type, Tab ID, and only store stable row action keys in sort order, rather than whole object copies
          - Reasons:
            - Shorter lists to process per render, resulting in relative performance improvements
        - `CONFIG.TIDY5E.rowActions.inventory`, `CONFIG.TIDY5E.rowActions.actor`, `CONFIG.TIDY5E.rowActions.encounterCombatantMember`, etc.
        - Initialize these in a central config file that inits on ready before the rest of the runtime. This is where all the default configs go, and all runtime usages / beyond will always reference `CONFIG.TIDY5E`.
  - [ ] Set up an API surface area 
- [ ] Extract a TidyRowActionsCell? Determine if this is feasible, given other row action component updates.
- [ ] // TODO: Figured out how to eliminate this niche parameter
- [ ] // This should not be `any`; do we need to subdivide and conquer?
- [ ] Can Container Row Actions and Inventory Row Actions be the same list?
- [ ] // TODO: Do we really need this field? Surely we can figure this out with `item.actor`
- [ ] Clean up: ItemRowActionV2 -> ItemRowAction, and remove the original and its Condition type.

## Stretch

- [ ] Refactoring consideration: We don't need to ship whole copies of row actions. We can store them in `CONFIG.TIDY5E.rowActions` or the like, with sort orders built in, and ship just the keys in the appropriate order. This is a bigger and more involved refactoring, but it could be very valuable to do, allowing the API (or the brave user) to swap out implementations directly on `CONFIG.TIDY5E` (a thing which doesn't exist yet.)
- [ ] Refactoring consideration: `CONFIG.TIDY5E` can replace the concept of the various runtimes. Each can be represented in config, among other useful things like first-class reusable Tidy components. Another bigger refactor opportunity worth pursuing when all other matters have been settled.
- [ ] Actor sheets - Currently, activity row actions and columns are created in the moment when a TidyInlineActivitiesList is rendered upon expanding an item summary. It would be good to make some decisions on how the activity tables should be treated and whether we want to provide API integration for their row actions and/or columns. It may still be beneficial to lazily load their row actions and columns, but it feels like it goes against the rest of this effort. Then again, they were just hardcoded before now.
- [ ] Migrate in the Item section preparers and reduce looping to a single pass over the items.
- [ ] // TODO: Determine how to make managing row action styles less hardcoded and more configured.
- [ ] Try a CSS Grid / Sub-grid approach Tidy tables. This would eliminate the need to calculate row actions width and open lots of doors, if it were performant.