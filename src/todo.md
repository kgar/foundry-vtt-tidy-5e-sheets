## To Do

### Bootstrapping all item sheets

- [x] Propagate initial scaffolding for tabs to all new sheets
  - [x] Background details
  - [x] Class details
  - [x] Consumable details
  - [x] Equipment details
  - [x] Facility details
  - [x] Feat details
  - [x] Loot details
  - [x] Species details
  - [x] Spell details
  - [x] Subclass details
  - [x] Tool details
  - [x] Weapon details
- [x] Copy over details content for all new sheets
- [x] Implement single description tab
- [x] Convert inputs to the quadrone variety, 
- [x] Create quadrone edition of ItemProperties
- [ ] Update inputs to ensure that a lockedValue can be fed into each type, so that we can show the system value on disabled and the source value on not disabled ♥
- [ ] Ensure all standard form fields are locked on sheet lock
- [ ] Add currency and weight to relevant item sheets at the top
- [ ] Implement Activities tab
- [ ] Implement Effects tab
- [ ] Finish implementing container contents tab
- [ ] Implement Advancement tab
- [ ] Ensure Activities and Effects tabs include item counters in the title
- [ ] https://discord.com/channels/@me/1243307347682529423/1336210686392668220
- [ ] Add context-dependent Tab visible / enabled predicate option to Tidy tabs, so that concealed content can entirely hide a tab, if needed

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