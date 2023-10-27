# Tidy 5e Sheets

![GitHub issues](https://img.shields.io/github/issues/kgar/foundry-vtt-tidy-5e-sheets?style=for-the-badge)
![Latest Release Download Count](https://img.shields.io/github/downloads/kgar/foundry-vtt-tidy-5e-sheets/latest/module.zip?color=2b82fc&label=Latest+Release+Download+Count&style=for-the-badge) ![GitHub release (with filter)](https://img.shields.io/github/v/release/kgar/foundry-vtt-tidy-5e-sheets?style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ftidy5e-sheet&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=tidy5e-sheet) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fkgar%2Ffoundry-vtt-tidy-5e-sheets%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge) ![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fkgar%2Ffoundry-vtt-tidy-5e-sheets%2Fmaster%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge) [![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ftidy5e-sheet%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/tidy5e-sheet/) ![GitHub all releases](https://img.shields.io/github/downloads/kgar/foundry-vtt-tidy-5e-sheets/total?style=for-the-badge)

D&D 5e sheet layouts for Foundry VTT, focused on a clean UI, user ergonomics, and extensibility.

Completely rewritten from the ground up, based on the [Tidy5e Sheet](https://github.com/sdenec/tidy5e-sheet) module by [sdenec](https://github.com/sdenec) and [4535992](https://github.com/p4535992).

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/V7V4Q88Z7) | Support me on [Patreon](https://www.patreon.com/user?u=103973827) | [!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/kgar)


> **Warning**  
> This is an alpha testing module that is subject to numerous breaking changes and rapid updates.
>
> It is recommended that you do not alpha test these sheets on your actual game world.  
> **Use at your own risk.**

## Installation

During alpha testing, this module is installable manually by URL. It is not included in the Foundry modules list.

Manual installation instructions:

1. Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2. Click "Install Module"
3. In the "Manifest URL" field, paste the following url:
   `https://github.com/kgar/foundry-vtt-tidy-5e-sheets/releases/latest/download/module.json`
4. Click 'Install' and wait for installation to complete
5. Enable the module in your game using the "Manage Module" button.
6. Select the sheet layout from these options, depending on which sheet you are using:
   - Tidy 5e kgar Character Sheet
   - Tidy 5e kgar NPC Sheet
   - Tidy 5e kgar Vehicle Sheet
   - Tidy 5e kgar Item Sheet

> **Important**  
> During alpha testing, I am using a temporary module ID, `tidy5e-sheet-kgar`, and as a result, these sheets are intended to sit alongside the current Tidy5e sheet layouts. When alpha testing is over, these sheets will become the official Tidy5e sheets, meaning **all settings related to these test sheets during alpha testing will be forgotten after alpha testing.**
>
> Your character/NPC/vehicle/item core data will remain intact. This is the data that is included with the dnd5e system. However, certain module-specific data that you set up for these alpha sheets such as config settings, favorites, NPC/vehicular exhaustion, vehicle movement status, search filter text, spellbook class filter selection, theme settings, etc., will be forgotten. There will not be a migration because of the sheer amount of work remaining to get these sheets to version 1 status.

## Alpha Testing Goals

- Ensure the essential features of the sheets work as intended
- Add some of the requested features from the [Tidy5e rewrite commission discord thread](https://discord.com/channels/732325252788387980/1116078321067892796)

## Behold, D&D 5e Sheets for Foundry VTT!

Tidy 5e sheets provides alternate layouts with extra features for [D&D 5e](https://github.com/foundryvtt/dnd5e) in [Foundry Virtual Tabletop](https://foundryvtt.com/).

### Player Character Sheet

![Alt text](images/image-character-sheet.png)

### NPC Sheet

![Alt text](images/image-npc-sheet.png)

### Vehicle Sheet

![Alt text](images/image-vehicle-sheet.png)

### Dark Mode

![Alt text](images/image-light-mode-theme-setting.png) ![Alt text](images/image-dark-mode-theme-setting.png)

![Alt text](images/image-dark-mode-sheet.png)

### Theme Settings

**Customize your theme colors** to give sheets the perfect tone for your game:

![Alt text](images/image-theme-settings.png)

**Import/Export** themes and share with others:

![Alt text](images/image-theme-import-export.png)

### Enhanced Characters

Player character sheets come stocked with a variety of features above and beyond the standard 5e sheets.

#### Favorites

Tag your favorite items, spells, and features, and they will appear in the Attributes tab:

![Alt text](images/image-tag-favorites.png) ![Alt text](images/image-view-favorites.png)

#### Multiclass Spellbook Filtering

For those who multiclass, optional Spellbook filtering allows players to assign their spells to specific classes and filter their spellbook by class.

> **Note**  
> Custom classes are also supported!

![Alt text](images/image-spellbook-filter-cleric.png)

![Alt text](images/image-spellbook-filter-switching.png)

![Alt text](images/image-spellbook-filter-druid.png)

#### Spell Class Icons

For those who multiclass, Spell Class icons can delineate players' spells based on the spell's assigned class:

![Alt text](images/image-spell-class-icons.png)

#### Cantrip Preparation (for Cantrip Formulas)

From "Tasha's Cauldron of Everything," the "Cantrip Formulas" feature allows wizards to prepare cantrips for the day. Tidy 5e optionally allows the preparation of cantrips:

![Alt text](images/image-prepare-cantrips.png)

#### Spell Slots Tracker

Add/remove spell slot points quickly with spell slot tracking:

![Alt text](images/image-spell-slot-dots-before.png)

![Alt text](images/image-spell-slot-dots-changing.png)

![Alt text](images/image-spell-slot-dots-after.png)

#### More Character Detail Options

![Alt text](images/image-character-bio-details.png)

![Alt text](images/image-character-journal-extras.png)

![Alt text](images/image-character-journal-custom-header.png)

#### Animated Exhaustion Tracking

![Alt text](images/demo-akra-exhaustion.gif)

#### Animated Inspiration Tracking

![Alt text](images/demo-akra-inspiration.gif)

### Item Cards

When enabled, item cards can provide a quick look at any hovered item, spell, or feature:

![Alt text](images/demo-item-card-slide-and-hold-key.gif)

Also, there is an option to make item cards float near the mouse:

![Alt text](images/demo-item-card-floating.gif)

### Alternate Grid View

Inventory and spellbooks can be viewed in a convenient grid format:

![Alt text](images/demo-grid-view.gif)

### Attunement Tracker

The attunement tracker brings it to the player's attention that they are over-attuned:

![Alt text](images/demo-attunement-tracker.gif)

### Max Prepared Spells

Keep track of your maximum prepared spells:

![Alt text](images/image-max-prepared-spells.gif)

### Ammo Quick Switch

Swap ammo quickly using the ammo swap feature:

![Alt text](images/image-ammo-swap.png)

You can even swap ammo in the item card:

![Alt text](images/image-ammo-swap-item-card.png)

### Animated HP bars and Overlay

There is an optional, animated HP bar and HP overlay for each sheet type:

![Alt text](demo-animated-bars.gif)

> [!todo]
> Finish the readme!

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

## Reporting Issues and Requesting Features

## Want to Build with Me?
