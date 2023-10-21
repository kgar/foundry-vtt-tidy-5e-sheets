# Tidy 5e Sheets

TODO: Add shields
- GitHub issues
- Latest Release Download Count
- Forge Installs?
- Foundry Core Compatible Version
- Latest Version
- Foundry Hub Endorsements
- GitHub all releases
- Translation status

D&D 5e sheet layouts for Foundry VTT, focused on a clean UI, user ergonomics, and extensibility. 

This is a complete rewrite of the [Tidy5e Sheet](https://github.com/sdenec/tidy5e-sheet) module by `sdenec`.

> **Warning**
> This is an alpha testing module that is subject to numerous breaking changes and rapid updates.

## Installation

During alpha testing, this module is installable manually by URL. It is not included in the Foundry modules list.

Manual installation instructions:
1. Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2. Click "Install Module"
3. In the "Manifest URL" field, paste the following url:
`https://github.com/kgar/foundry-vtt-tidy-5e-sheets/releases/latest/download/module.json`
4. Click 'Install' and wait for installation to complete
5. Enable the module in game using the "Manage Module" button.
6. Select the sheet layout from these options:
    - Tidy 5e kgar Character Sheet
    - Tidy 5e kgar NPC Sheet
    - Tidy 5e kgar Vechicle Sheet
    - Tidy 5e kgar Item Sheet

> **Important**  
> During alpha testing, I am using a temporary module ID, `tidy5e-sheet-kgar`, and as a result, these sheets are intended to sit alongside the current Tidy5e sheet layouts. When alpha testing is over, these sheets will become the official Tidy5e sheets, meaning **all settings related to these test sheets during alpha testing will be forgotten after alpha testing.**  
> 
> Your character/NPC/vehicle/item core data will remain intact. This is the data that is included with the dnd5e system. However, certain module-specific data that you set up for these alpha sheets such as config settings, NPC/vehicular exhaustion, vehicle movement status, search filter text, spellbook class filter selection, theme settings, etc., will be forgotten. There will not be a migration because of the sheer amount of work remaining to get these sheets to version 1 status.

## Alpha Testing Goals

- Ensure the essential features of the sheets work as intended
- Ensure a small list of critical modules are still compatible before going to beta status. Among those are
  - TODO: List the most essential modules
- Add some of the requested features from the Tidy5e rewrite commission discord thread (link here)

## Behold, Sheets!

Tidy 5e sheets provides alternate layouts with extra features for 
- Character Sheets
- NPC Sheets
- Vehicle Sheets

### Dark Mode

### Enhanced Characters

#### Favorites

#### Multiclass Spellbook Filtering

#### Spell Class Icons

#### Cantrip Preparation (for Cantrip Formulas)

#### Spell Slots Tracker

#### More Character Detail Options

TODO: Show the age, hair, eyes, etc., content

### Item Cards

### Grid and List Views

### Attunement Tracker

### Max Prepared Spells

### Ammo Quick Switch

### Animated HP bars

### HP Overlay

### Enhanced NPCs

#### NPC Rest

#### NPC Exhaustion Tacker

### Enhanced Vehicles

#### Vehicle Exhaustion Tracker

#### Vehicle Motion Tracker 

#### Crew Action Economy Calculator

### Mod/Save Roll Buttons - Roll the Dice Even Faster!

### Sheet Lock

### Even More Sheet Lock - Optionally Lock Sensitive Fields

### Themable Colors with Live Updating

### Expand/Collapse Skills and Traits

### For Module Developers

### Module Compatibility

#### Built with Svelte for Smooth Reactivity

#### API-Extensible Sheets

#### Need API Functions for Something? Let's Talk

## And Much More!

TODO: Point to a user manual
TODO: Point to API documentation and examples
