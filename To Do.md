# To Do

## Step by step

- [x] Make proof of concept with svelte
- [x] Exercise some core functionality
  - [x] Rolling
  - [x] Editing data and having it persist
- [x] Global SCSS configured that is scoped to `.tidy5e-kgar`
- [ ] Figure out how flags work
- [ ] Set up project constants for handling T5EK flags
- [ ] Implement "Tidy5e KGar Sheet" Game Settings tracer bullet
  - [ ] Add section to Game Settings
  - [ ] Add setting for color theme
  - [ ] Add button for Sheet Settings
  - [ ] Add "Save Changes" button with icon
  - [ ] Changes should be instantaneously displayed on open sheets (might need to use a svelte store for this)
- [ ] Implement "Tidy5e KGar Sheet Settings" dialog tracer bullet
  - [ ] Create dialog
  - [ ] Add Default Player Sheet Width setting
  - [ ] Add "Save Changes" button with icon
  - [ ] Changes should be instantaneously displayed on open sheets (might need to use a svelte store for this)
- [ ] ... next steps

## Big Picture

- [ ] Reimplement Tidy5e Sheets with svelte and using foundry/dnd5e API *
  - [ ] Sheet
    - [ ] GM
    - [ ] Unlimited
    - [ ] Limited
  - [ ] NPC
    - [ ] GM
    - [ ] Unlimited
    - [ ] Limited
  - [ ] Vehicle
    - [ ] GM
    - [ ] Unlimited
    - [ ] Limited
  - [ ] Item
- [ ] Reimplement the misc templates
  - [ ] Favorites
    - [ ] Item
    - [ ] Template
  - [ ] Items
    - [ ] spell class filter form
- [ ] Reimplement game settings integration
- [ ] Reimplement sheet settings dialog

> \* Most recent breakages in Tidy5e sheets were related to magic HTML conventions that hook into invisible jquery wire-ups. You have to go read through the core HBS's for character sheets. Since you're already there, skip the limitations imposed by trying to recreate their sheet and instead use the public API. After all the public API provides deprecation notices, whereas the 5e sheet can just suddenly be structured differently on a new version. Not much they will do about that.

## Stretch

- [ ] Explore touch-friendly UX options
  - [ ] More surface area to tap
  - [ ] Larger icons
- [ ] Option macros
  - [ ] Desktop mode
  - [ ] Tablet mode
    - [ ] Turns on touch-friendly UI layout and rearranges relevant content on tabs like Attributes, biography, journal
- [ ] Explore drag-n-drop UI options for where to put things on relevant tabs like Attributes tab with the Proficiencies, skills, resources, etc
  - [ ] Be able to specify a default in sheet settings
  - [ ] Be able to do it live on the sheet in realtime and save as default or just for the current sheet
- [ ] Explore how to test compatibility via [FoundryVTT Container](https://hub.docker.com/r/felddy/foundryvtt)
- [ ] Explore how to perform Automated UI testing with something like [Cypress](https://www.cypress.io/app)