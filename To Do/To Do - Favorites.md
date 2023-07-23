- [x] Put the favorites toggle on
  - [x] Features
  - [x] Spellbook List
  - [x] Inventory List
- [x] Ensure correct visuals
  - [x] Features
  - [x] Spellbook List
  - [x] Spellbook Grid
  - [x] Inventory List
  - [x] Inventory Grid
- [ ] Implement Favorites View on Attributes Tab - See [dedicated to-do list](#implement-favorites-view-on-attributes-tab)
- [ ] Confirm context menu works as expected
- [ ] Settings
  - [ ] enableActionListOnFavoritePanel
  - [ ] enableSortFavoritesItemsAlphabetically


## Implement Favorites View on Attributes tab

- [x] Bring all row colorization styles like innate, at-will, equipped, etc., into the ItemTableRow component. Allow it to decide based on item data.
- [ ] collect and group all items
- [ ] create a whitelist of known favorite groupings
- [ ] group by the known groupings and put the ungrouped favorites into a special unsorted group
  - [ ] inventory
  - [ ] features
  - [ ] spells by preparation mode
    - [ ] map known prep modes to friendly names
  - [ ] spells by level (excluding any spells in prep mode)
    - [ ] Ensure these spell levels are not hardcoded; dynamically determine this
  - [ ] 
- [ ] Apply game setting sort option if relevant and use locale comparison
- [ ] visualize
  - [ ] inventory favorites
  - [ ] feature favorites
  - [ ] spell favorites by preparation mode
  - [ ] spell favorites by level
  - [ ] unsorted


## Stretch

- [ ] create an API hook for adding new favorite groupings
- [ ] Use the API / hooks to add the actions favorites, based on the legacy setting
- [ ] Install the actions module and favorite some of the actions as an exercise to show that they feed into favorites accordingly