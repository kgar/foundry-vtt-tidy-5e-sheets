
## To Do

- [x] Resolve check errors for character sheet
- [ ] Ensure each character sheet tab tables invocation is properly looking for columnsV2
  - [ ] Sheet - Action Econ
  - [x] Sheet - Item Origin
  - [x] Inventory
  - [x] Spellbook
  - [x] Features
  - [x] Effects
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
  - [ ] Refactoring consideration: Actions column could simply not be a column in the specs, much like the primary column.
  - [x] Have the SectionActionColumnHeader component make this comparison against 
- [ ] DocumentActionsColumn -> RowActionsColumn
- [ ] Handle special case: Additional Spells row actions. Might be using the "ChooseAButton"
- [ ] Apply custom column setup to activities
  - [ ] (across all tabs) Activities
- [ ] test and fix
- [ ] Resolve remaining check errors
- [ ] Ensure each tab tables invocation is properly looking for columnsV2
  - [ ] ... (enumerate)
- [ ] Task out the rest

## WIP changes

- [ ] search "getDefaultInventorySections" and fix ; first arg should be the document
- [ ] search "createInventorySection" and fix ; first arg should be the document
- [ ] search "createFeatureSection" and fix ; first arg should be the document
- [ ] search "applyCharacterFeatureToSection" and fix ; first arg should be the document, second tabId