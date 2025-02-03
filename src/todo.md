## To Do

### Bootstrapping all item sheets

- [ ] Propagate initial scaffolding for tabs to all new sheets
  - [ ] Weapon details
  - [ ] Equipment details
  - [ ] Consumable details
  - [ ] Loot details
  - [ ] Class details
  - [ ] Subclass details
  - [ ] Background details
  - [ ] Species details
  - [ ] Facility details
  - [ ] Tool details
- [ ] Copy over details content for all new sheets
- [ ] Finish implementing container contents tab
- [ ] Implement single description tab
- [ ] Implement Activities tab
- [ ] Implement Effects tab
- [ ] Implement Advancement tab
- [ ] Ensure Activities and Effects tabs include item counters in the title

### Sidebar

- [x] ❗ Make the sidebar shared
  - [x] detect `hasRarity`
    - When true, use rarity coloation for the item image filigree, and show rarity label on locked and rarity dropdown on unlocked
  - [x] detect `hasSpellPreparation`, mutually exclusive with rarity, with rarity taking precedence
    - When true, use spell coloration for the item image filigree, and show spell prep label
- [x] Propagate sidebar to all new sheets
- [x] Switch sidebar to just specify `.dark` and not `.inverse`
- [ ] Pump sidebar with item-subtype-specific information
  - [ ] Spells: custom label-value pair content
  - [ ] Pills
- [ ] Ensure sidebar has all relevant sections configured
  - [ ] States - availability provided by sheet context
    - [x] Equipped
    - [x] Attuned
    - [x] Identified (editable on unlocked only unless GM?)
  - [ ] Label/Value pairs
    - [ ] Provided dynamically by sheet context
  - [ ] Pill groups
    - [ ] Provided dynamically by sheet context
  - [ ] Custom Sections
- [ ] Takeaway: Jeff to fill out remaining dark variables