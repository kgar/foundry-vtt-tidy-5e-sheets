
## To Do

- [x] Resolve check errors for character sheet
- [x] Ensure each character sheet tab tables invocation is properly looking for columnsV2
  - [x] Sheet - Action Econ
  - [x] Sheet - Item Origin
  - [x] Inventory
  - [x] Spellbook
  - [x] Features
  - [x] Effects
- [ ] // TODO: Inline to activity table(s)
- [ ] Ensure each sheet tab tables invocation is properly looking for columnsv2: Item
  - [ ] Effects
  - [ ] Activities
  - [ ] Container Contents
- [ ] Ensure each sheet tab tables invocation is properly looking for columnsv2: NPC
  - [ ] Statblock
  - [ ] Inventory
  - [ ] Spellbook
  - [ ] Effects
- [ ] Ensure each sheet tab tables invocation is properly looking for columnsv2: Vehicle
  - [ ] ...
- [ ] Ensure each sheet tab tables invocation is properly looking for columnsv2: Group
  - [ ] ...
- [ ] Ensure each sheet tab tables invocation is properly looking for columnsv2: Encounter
  - [ ] ...
- [ ] Ensure each sheet tab tables invocation is properly looking for columnsv2: Container
  - [ ] ...
- [x] Ensure column show/hide works properly
- [x] Ensure Row Actions render properly
- [x] Ensure SectionActionsColumnHeader / Section Base is aware of row actions count so it can mirror.
- [ ] Dismantle the `widthRems()` function. We will do special handling for row actions / table actions, utilizing a constant for the column key.
  - [ ] Section base should have `maxRowActionsCount` to compare against its section actions. For now, this should be a loop after the section has been prepared and items/activities/effects partitioned into it. Later, this will be moved to a section preparer.
    - [x] PC Inventory / Sheet tab origin version
    - [x] PC Spellbook / Sheet tab origin version
    - [x] PC Features / Sheet tab origin version
    - [ ] PC Effects
    - [ ] ... enumerate the rest
  - [ ] Clean up: remove dynamicWidths from the spec types and usages
  - [ ] Clean up: remove the widthRemsFn / widthRems() references from all column specs. The actions column will be width 0 by default and will be calculated later as a special feature
  - [x] Have the SectionActionColumnHeader component make this comparison against 
- [x] Refactoring consideration: Actions column could simply not be a column in the specs, much like the primary column.
- [ ] Propagate row actions column fixture to
  - [ ] Effect table
  - [ ] Container Contents table
  - [ ] Activity table
- [ ] Refactoring consideration: Row Actions don't need both presence/absence as well as an optional condition callback. We also don't need to pull row actions until we have an item to be evaluated. Consider eliminating presence/absence and just evaluating conditions each time an item needs row actions.
- [ ] DocumentActionsColumn -> RowActionsColumn
- [ ] Handle special case: Additional Spells row actions. Might be using the "ChooseAButton"
- [ ] Apply custom column setup to activities
  - [ ] (across all tabs) Activities
- [ ] test and fix
- [ ] Remove rowActions from base section definition
- [ ] Resolve remaining check errors
- [ ] Ensure each tab tables invocation is properly looking for columnsV2
  - [ ] ... (enumerate)
- [ ] Task out the rest
- [ ] Refactoring consideration: We don't need to ship whole copies of row actions. We can store them in `CONFIG.TIDY5E.rowActions` or the like, with sort orders built in, and ship just the keys in the appropriate order. This is a bigger and more involved refactoring, but it could be very valuable to do, allowing the API (or the brave user) to swap out implementations directly on `CONFIG.TIDY5E` (a thing which doesn't exist yet.)
- [ ] Refactoring consideration: `CONFIG.TIDY5E` can replace the concept of the various runtimes. Each can be represented in config, among other useful things like first-class reusable Tidy components. Another bigger refactor opportunity worth pursuing when all other matters have been settled.

## Cleanup

- [ ] Evaluate params for Inventory.applyInventoryItemToSection and tidy it up.
- [ ] // TODO: Eliminate

## WIP changes

- [x] search "getDefaultInventorySections" and fix ; first arg should be the document
- [x] search "createInventorySection" and fix ; first arg should be the document
- [x] search "createFeatureSection" and fix ; first arg should be the document
- [x] search "applyCharacterFeatureToSection" and fix ; first arg should be the document, second tabId