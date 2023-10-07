# To Do

## Progress

- [x] Limited Character Sheet
- [x] Limited Vehicle Sheet
- [x] Refactor: Make all limited sheets do like the dnd5e limited sheet
  - [x] Share a standard header based on the draft from VehicleSheetLimited
- [x] Item Card
- [x] Dark Mode
- [x] account for dnd5e 2.3.0-2.3.1 differences
- [ ] Settings Dialog Overhaul
- [ ] Implement All Settings
- [ ] Exhaustion management? Can it be configured for a custom number of levels with custom descriptions? Are any hooks needed, or does 5e handle that already?
- [ ] Drag and drop
- [ ] Revisit character sheet now that we've got all this experience
- [ ] Typescriptify Tidy 5e flags (use the settings approach with a const object that satisfies a type definition)
- [ ] FoundryAdapter cleanup project and types purge
- [ ] HTML enrichment
- [ ] getData() / Context curation : pull back all calculations from the various components into the context when getting context data in the sheet. If necessary, pull further back into Foundry Adapter for each sheet type. If using Zod, validate the final Character context, NPC context, Vehicle context, Item Sheet context
- [ ] etc.
- [ ] Tab selection and ordering 
  - validation: at least one is required
  - when determining selected tab ID when the indicated one in settings is not available, pick first from ordered list
- [ ] New context menu? Custom global context menu that leverages a global store
  - Current context menu uses inline styles and gets picked up unintentionally by original Tidy 5e's context menu handling.
  - Should work with popout!
  - ... etc.
- [ ] Re-integrate Actions Tab or make native

### Foundry Adapter Cleanup

We really don't need to be trying to create minimal types for Foundry or the 5e system. There should be an `any` cutoff within the FoundryAdapter for all the things we need.

- [ ] Purge Foundry types
- [ ] Purge dnd5e types

Foundry Adapter should be reorganized so that functions can be broken out for actors, characters, NPCs, vehicles, items, all entities, and maybe more than this.

- [ ] Review the current state of FoundryAdapter and task out work
- [ ] Find all instances of global foundry / 5e usages in svelte and pull back into the Adapter.
- [ ] Begin eliminating all TS errors
- [ ] Build own curated context object for each sheet type which validates the shape before sending to svelte
  - [ ] Consider using Zod to validate context object so that validation errors are clear for testing / debugging / upgrade purposes
- [ ] 
- [ ] ...etc.

### Side Quest

- [ ] Text Editors not all enriching HTML
  - [ ] See [examples](#enriching-html) from original dnd5e system.
  - [ ] Also see Tidy 5e approach in `tidy5e-npc.js` `getData()` function (around line 211) for adding the enriched HTML version of a field to context. There is no reason not to enrich all HTML.
  - [ ] ⚠ If the HTML is not enriched, then secrets will be visible to limited / non-GM viewers.
  - [ ] Recreate this but have it supported on all text editors via optional enrichment prop (think of decent name)
- [ ] Effects tab - create prototype of grid components with collapsibility that can be remembered for the player for the given sheet
  - [ ] Lay out the effects tab using the grid components approach
  - [ ] Make it data-driven
  - [ ] Publish a hook before mount and on mount
  - [ ] Add TODO for API call to register effect column
- [ ] Price - input + select: make a composite component that unifies these two input into a single, cohesive piece of UI ♥
- [ ] Explore the idea of using a library like socketlib for allowing a GM to emphasize parts of the character sheet for a player: https://foundryvtt.wiki/en/development/api/sockets

#### Enriching HTML

```js
// For item descriptions
context.descriptionHTML = await TextEditor.enrichHTML(
  item.system.description.value,
  {
    secrets: item.isOwner,
    async: true,
    relativeTo: this.item,
    rollData: context.rollData,
  }
);

// For base sheet biography
context.biographyHTML = await TextEditor.enrichHTML(
  context.system.details.biography.value,
  {
    secrets: this.actor.isOwner,
    rollData: context.rollData,
    async: true,
    relativeTo: this.actor,
  }
);
```

### Module Compat Trials

- [ ] Create a Module Compatibility Test Module for foundry. Store in a repo for reuse on multiple machines.
- [ ] Feel out how to add custom HTML / CSS / vanilla JS with cave man reactivity (rerender / rewire on soft render)
- [ ] Feel out how to add custom HTML / CSS / vanilla JS with targeted reactivity (manual diff checking on soft render)
- [ ] Feel out how to add svelte-based content ; add a tab with a svelte component which builds a table with our item table components.
  - [ ] Not sure if this actually works, but I am hopeful because svelte classes are actually real.
- [ ] Feel out how to add vue-based content ; add a tab with an HTML mount point and allow vue to render from it and respond to changes
  - [ ] Show this particular one to Mouse0270 if it works out in order to get some feedback.
- [ ] Work with Mouse0270 on how to deal with the window tabs incompatibility; there is a matrix3d transform being placed on the sheet div which is resetting the container block to the sheet itself, and this is causing the fixed position of the item card to position left and top based on the sheet's location and not the viewport.

## Character Tabs Pile of TODOs

- [x] Use existing or create new tab control | made a really rough tabs control with relative ease
- [x] Implement the tabs
- [x] Implement Favorites
  - [x] Scope it out and make a plan
  - [x] ...
- [x] Ensure item summary functionality can be shared
- [x] Implement default tab
- [ ] Visual bug (existing): when any character detail field is too long in Biography top-notes for a PC, it will blow out the layout. Consider CSS grid as a replacement. Test carefully on all the major browsers. Also just consider inputs instead of contenteditable fields?
- [ ] Consider consolidating sheet initial value / cacheable content into single objects to pass down to the target component. Values include things like scrollTop map, currentTab sheet parameter, and any other sheetparameters that need to be cached for maintaining visual integrity between submissions / sheet refreshes.
- [x] Focus is lost when the sheet submits, so you cannot tab through fields and make changes quickly. It would be nice if focus is maintained between submits. How would we accomplish that? Svelte.
- [ ] When done with initial prototype: Replace ALL `cursor:pointer` instances with `role="button"` on the target element: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role
  - [ ] All things ".rollable"
  - [ ] Task them out
- [ ] `<a>`, `<div>`, etc. tags with `[role="button"]` should be buttons
- [ ] `<i>` tags with role=button should be changed so that a button surrounds the icon
- [ ] Leverage TypeScript to lock down and document all known flags for each type of flagged entity (actor, NPC, vehicle, Item)
- [ ] Implement click-and-drag
  - [ ] for manual sorting of items
    - [ ] Consider disabling this for favorites when alphabetical sort is turned on, or issuing a warning.
  - [ ] for dropping things onto the sheet
  - [ ] for draging things from the sheet to drop somewhere else
  - [ ] ... what else is missing from this list?

## Vehicle Sheet

- [ ] Port the existing sheet
- [ ] Get with SaltyJ to resolve issues
- [ ] Resolve existing github issues with vehicles
- [ ] Query the group for possible improvements

## Security

- [ ] Port the functionality of `applyLocksCharacterSheet()`
- [ ] Port the functionality of `applyLocksNpcSheet()`
- [ ] Port the functionality of `applyLocksVehicleSheet()`
- [ ] Port the functionality of `applyLocksItemSheet()`

## Modules

Evaluate module integration and think about better (API-centric) ways to support other modules. Require the module developers to interface with Tidy if they wish to add things to the sheet. I will NOT match the structure of the D&D 5e default sheets.

- [ ] src_scss_modules.scss
- [ ] src_scss\dark_dark-modules.scss

> **Note**
> The system won't let the user actually make any changes to the character sheet when it's not editable to that user. This is only to help prevent frustration.

## Misc for the main character sheet

- [ ] Review `setSheetClasses()` and determine how this affects the player sheet
- [ ] Review `editProtection()` and determine how this affects the player sheet
- [ ] Review `addClassList()` and determine how this affects the player sheet
- [ ] Review `toggleTraitsList()` and determine how this affects the player sheet
- [ ] Review `checkDeathSaveStatus()` and determine how this affects the player sheet
- [ ] Review `abbreviateCurrency()` and determine how this affects the player sheet
- [ ] Review `spellAttackMod()` and determine how this affects the player sheet
- [ ] Review `addFavorites(, position)` and determine how this affects the player sheet
- [ ] Review `countAttunedItems()` and determine how this affects the player sheet
- [ ] Review `countInventoryItems()` and determine how this affects the player sheet
- [ ] Review `markActiveEffects()` and determine how this affects the player sheet
- [ ] Review `spellSlotMarker()` and determine how this affects the player sheet
- [ ] Review `hideStandardEncumbranceBar()` and determine how this affects the player sheet
- [x] ~~Review `applyLazyMoney()` and determine how this affects the player sheet~~ No longer directly maintaining this integration
- [ ] Review `applySpellClassFilterActorSheet()` and determine how this affects the player sheet
- [ ] Figure out what game.modules.get("character-actions-list-5e") module is, and how do we leverage it here with graceful fallback?
  - [ ] Moreover, how do we create a clear pipeline for supporting various modules?

## Reorganization

- [ ] Move the positioning styles to the portrait component or general styles, and apply them via cssClass to impose positioning that is relevant to the parent component (the portrait component)
- [ ] Identify class trees that can be converted to components leveraging `:global()` selector for child components.
  - [ ] Do this for `_inventory.scss` as an example, and then task out others

## Pile of To Do's

- [x] Make proof of concept with svelte
- [x] Exercise some core functionality
  - [x] Rolling
  - [x] Editing data and having it persist
- [x] Global SCSS configured that is scoped to `.tidy5e-kgar`
- [x] Figure out how flags and settings work
  - [x] Reread this https://foundryvtt.wiki/en/development/guides/handling-data and compare it to Tidy5e's approach
  - [x] https://foundryvtt.wiki/en/development/api/flags
  - [x] https://foundryvtt.wiki/en/development/api/settings
- [x] Can the svelte view leverage prosemirror? YES.
- [x] Use context API to provide sheet functions: skipped this. Not enough pain yet to introduce context API.
- [x] Set up project constants for handling T5EK flags
- [x] Create a settings object that contains the data for registering the settings and a typed getter
- [x] Implement "Tidy5e KGar Sheet" Game Settings tracer bullet
  - [x] Add section to Game Settings
  - [x] Add setting for color theme
  - [x] Add button for Sheet Settings
  - [x] Add "Save Changes" button with icon
  - [x] Changes should be instantaneously displayed on open sheets (might need to use a svelte store for this)
  - [ ] Stub out the main sheet header
    - [x] Make a component for the Ability Score Block and reuse
    - [x] Make it fully functional
    - [x] Stub TS types and resolve TS errors
    - [x] Encapsulate and organize
    - [ ] Account for TODOs about implementing things
  - [x] Apply styles to make the header look verbatim like the original
  - [x] Add existing CSS variables
  - [ ] Make dark mode a simple update to the variables, rather than a totally different class.
- [x] Register all settings
- [x] Fill out the main settings dialog
- [x] Implement "Tidy5e KGar Sheet Settings" dialog tracer bullet
  - [x] Create dialog
  - [x] Add Default Player Sheet Width setting
  - [x] Add "Save Changes" button with icon
  - [x] Changes should be instantaneously displayed on open sheets (trigger a render of all open sheets) - 💪 it required awaiting the settings updates when saving changes
- [x] Fill out remainder of settings
- [ ] Create custom tab component
  - [ ] Use show/hide scheme so that scroll and state are remembered
  - [ ] Rethink how to emit scroll position to the sheet so that rerenders and submissions can feed the position back through
- [ ] Update scroll position
  - [ ] Track locally to the current sheet instance; continue to pass through in the same manner as before
  - [ ] Remember the last selected tab and that tab's scroll position so that rerenders and submissions do not cause scroll jumping
  - [ ] Use a custom tab component that leverages hidden content so that scroll is remembered while actively using the sheet
  - [ ] Do not use flags
  - [ ] Support remembering scroll between rerenders, submissions, etc.
- [ ] Convert sheet settings to use svelte view, and then make it a lot nicer and more convenient.
- [ ] Properly lock down all gm-only settings
- [ ] Use semantic HTML for the sheets (how do I utilize header, section, article, nav, etc.?)
- [ ] ... next steps
- [ ] Implement `editGmAlwaysEnabled`
- [ ] Implement `editEffectsGmOnlyEnabled`
- [ ] Refinement: User-specific sheet flags | set up individual flags for each desired primitive value, and generate a key based on `${userId}-feature-name-here`
- [ ] Refinement: make Action Economy filtering unique to the user and not the actor. Unfortunately, to keep track of this, we'll need to persist a large json object representing Actor -> Tab -> Filter Name, with a value of boolean at the leaf.
- [ ] Refinement: implement sorting per section type ; it should not affect the actual order of the data, and it should be specific to the users
- [ ] Refinement: maintain scroll top between refreshes
- [ ] Refinement: maintain open/closed state of items between refreshes
- [ ] Refinement: Expand All / Collapse All


## Big Picture

- [ ] Reimplement Tidy5e Sheets with svelte and using foundry/dnd5e API
  - [ ] Player Character
    - [ ] GM
    - [ ] Unlimited
    - [ ] Limited
  - [ ] NPC
    - [ ] GM
    - [ ] Unlimited
    - [ ] Limited
    - [ ] Favorites system
    - [ ] src_scss_npc.scss
  - [ ] Vehicle
    - [ ] GM
    - [ ] Unlimited
    - [ ] Limited
    - [ ] Favorites system
    - [ ] src_scss_vehicle.scss
  - [ ] Item
    - [ ] Favorites system
    - [ ] src_scss_items.scss (they import at top-level, and there's apparently a dedicated item sheet)
- [ ] Reimplement the misc templates
  - [ ] Favorites
    - [ ] Item
    - [ ] Template
  - [ ] Items
    - [ ] spell class filter form
- [ ] Reimplement game settings integration
- [ ] Reimplement sheet settings dialog
- [ ] Remember last selected tab when reopening a tabbed sheet
- [ ] Remember scroll position for every tab in an open sheet, and return to that position when navigating to a tab; default 0
  - [ ] Stretch: can we remember scroll top for a given sheet when closing the sheet and reopening?
    - [ ] What about when reloading Foundry client?
- [ ] All open Tidy sheets should be re-rendered when options are updated
- [ ] Exhaustion is a whole feature unto itself with hooks to integrate with midi QoL. Factor this integration back in.
- [ ] Do I need `data-dtype`?
- [ ] Evaluate and determine if there is still useful info in these files
  - [ ] src_scss\tidy5e.scss
  - [ ] src\css\tidy5e-dark.scss
  - [ ] src_scss_sheet.scss

> Most recent breakages in Tidy5e sheets were related to magic HTML conventions that hook into invisible jquery wire-ups. You have to go read through the core HBS's for character sheets. Since you're already there, skip the limitations imposed by trying to recreate their sheet and instead use the public API. After all the public API provides deprecation notices, whereas the 5e sheet can just suddenly be structured differently on a new version. Not much they will do about that.

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
- [x] Explain levels of exhaustion effects for each individual exhaustion button
- [ ] Study a11y and apply it to the forms
- [ ] Identify all remaining static color styles and extract them meaningfully into CSS variables
- [ ] Import/Export custom color themes 💪
- [ ] Sheet settings: Use non-Foundry-module color picker (Svelte has a nice one) for setting CSS colors
- [ ] UI test idea - create automated walkthrough of the application which provides screenshots of relevant areas with relevant features toggled on and off. This should go into a markdown report with the screenshots. It should report any console errors as well.
- [ ] Spell item sheet: when Spellbook filtering is active, add a dropdown option which will pop a dialog form that allows the user to type their custom class name in, if it doesn't already exist
- [ ] Create a special dialog for assigning spells to a particular class for spellbook filtering purposes
  - [ ] Make it work for actors / npcs
  - [ ] Make it work for global spell items
  - [ ] Consider using a drag'n'drop visualizer with class columns

## Unsorted

- [x] Review and make TODOs from these files
  - [x] src_scss\partials_character-details.scss | completely replaced need
  - [x] src_scss\partials_general.scss | imported directly
  - [x] src_scss\partials_navigation.scss | imported and adjusted
  - [x] src_scss\partials_portrait.scss | replaced by reimplementation
  - [x] src_scss\partials_settings.scss | imported directly
  - [x] src_scss\partials_tabs.scss | skipped; this will be implemented in the component(s) ✅
  - [x] src_scss\partials_variables.scss | imported directly
  - [x] src\css\tidy-icons.css | not in use / ignored
  - [x] images folder | added to public
- [x] ~~Implement these money settings (if able, fold Lazy Money into Tidy 5e; else, figure out what API hooks are needed and then let Lazy Money do the heavy lifting)~~ No longer maintaining integration with lazy money. The maintainer plans to do it from their module.
  - [x] lazyMoneyIgnoreElectrum
  - [x] lazyMoneyEnable
  - [x] lazyMoneyChatLog
  - [x] lockMoneyChanges
  - [x] lazyMoneyAddConvert
- [ ] Retest and find issues now that it's in svelte mode
- [ ] Put tab IDs in CONSTANTS and propagate across the system.
- [ ] Spellbook Grid - add charges to the bottom left of the grid panel
- [ ] The XP bar's percentages seem way off. Try to get that fixed.
- [ ] PopOut! Compatibility - ensure that events are not being stopped from popagation and than defaults are prevented only when necessary.
  - [ ] ...
- [x] Look at "Blessed Healer" description. In Tidy 5e, there is a "Reveal" / "Hide" button for secret content. Can we somehow bake this into our prose mirror integration?
- [ ] Find a way to allow module devs to define their own item sheet types and even override the ones that are there.
  - [ ] It should allow for
    - [ ] Vue,
    - [ ] Svelte,
    - [ ] handlebars,
    - [ ] raw HTML,
    - [ ] a jquery set,
    - [ ] or void (updating the HTML directly)
  - **important**: This will open the door to custom Tidy 5e item sheets from module developers.
  - [ ] Add an API call for registering a new item type;
    - [ ] specifying an existing one will put an override in place that will prevent the original from rendering and will instead render the override
  - [ ] Add an API call for updating an existing item type's various tabs / parts
- [ ] When an update operation fails, revert to the original value (even easier, use getProperty to do it with document/field)
  - [x] Contenteditable
  - [ ] Textinput
  - [ ] Numberinput
  - [ ] Select
  - [ ] Checkbox
- [ ] `dtype` fields: formalize these as features of the input components, rather than just receiving them. Give the props names.
  - [ ] One way to go about this would be to have a universal function for preparing data for saving. It could take things like dtype, which would be set to known values.
- [ ] Update all HP bars to use color severity like the group sheet in a branch and float it to the commission. This will require taking an HSL diff between max HP color calculation on the default bar and the configured Tidy 5e HP bar color. Then, each time we adjust the HP bar, we calc the color, convert to HSL, apply the HSL diffs, and apply the changed HSL(+ A) to the HP bar. This is pretty fancy, and I don't know if it will actually translate to a pleasing color palette.
  - Alternatively, we can take the max health color and the min health color, convert them to HSL, and then spread the Hue difference over the 100% spectrum. This will result in prettier colors and side-step muddied brown sections.
  - Consider focusing on how to tween two colors in HSLA
- [ ] Incapacitated calculation for NPCs and PCs: is it taking temp HP into account?
- [x] Submit dnd5e system request (and quite possibly, a PR) for vehicular exhaustion to be added to vehicle data and to the vehicle sheet.
  - https://github.com/foundryvtt/dnd5e/blob/7ab8cc38e0a7a21969dcb4bb19a1816d99d5e19a/CONTRIBUTING.md
- [ ] Do a PR for vehicular exhaustion
- [x] Ditto dnd5e system vehicle data field for "isMoving", "moving", "movement", "inMotion", or some other more appropriate name
- [ ] Do a PR for the `moving` field.
- [ ] Allow arrow and mouse scroll stepping on a Number-dtype text input. Rules: stepping is ignored if the current value is not numeric, and the event passes through.
- [ ] Extract common grid layout button and wire in the item card functionality so that it's shared
  - [ ] Shared content
    - [ ] Image / src / useitem on click / middle click to edit
    - [ ] Classlist on the grid tile for custom decoration
    - [ ] optional toolbar at the bottom for charges, quantity, etc.
- [ ] T5EK.Settings.SheetTheme.default : for all localizations except English, it needs to be remapped to T5EK.Settings.SheetTheme.light
- [ ] Import in Tidy 5e-ified TinyMCE styles - should probably be done in v11
  - [ ] Compare PCs in light mode
  - [ ] Compare PCs in dark mode
- [ ] Tidy 5e Design Legos - come up with a library of Tidy 5e components that can be exposed in the module API and consumed by any caller. 
  - [ ] Provide convenience functions for generating such content and ensure that while the API remains stable, any major design changes to Tidy 5e carry content forward without breakage.
  - [ ] Review the Tidy 5e sheets and fathom the kinds of building blocks that would make the sheets
  - [ ] Revamp the entire module with these lego components
  - [ ] Create/upgrade alt sheets with these lego components, also
- [ ] Finally start using Foundry in docker to hotswap between supported version: https://hub.docker.com/r/felddy/foundryvtt
- [ ] Fix Bug: Spellbook, filter by Action / Bonus Action / etc., the Prepared spells calculation changes with the visible spells. It should always show the actual total of prepared spells.
- [ ] Look into Zod for data validation in the Foundry Adapter, so that errors can be more quickly found at their source
  - [ ] As part of this research, explore the prospect of building my own context type by taking the existing one from 5e's sheet and funneling it through zod validation so that the fields I expect to have are indeed there
  - [ ] https://www.totaltypescript.com/tutorials/zod
  - [ ] https://www.youtube.com/watch?v=rY_XqfSHock&ab_channel=JackHerrington
- [ ] Szefo09 — Just adding my 2 cents about QoL Improvements - Currently, actors that have 0 HP have the death overlay on their artwork, which disables previewing/changing their token/actor image. Also, exhaustion counter is not displayed in that state. https://discord.com/channels/732325252788387980/1116078321067892796/1148997425428705310
- [ ] Gambet - https://discord.com/channels/732325252788387980/1116078321067892796/1149939031937925150 - Is it is EXTREMELY EASY for players to accidentally give themselves Proficiency/Expertise in skills by clicking on the checkmark/circle instead of the word, and they don't realize they do it. I have a player who just clicks his mouse as a nervous habit and almost every session he winds up giving himself expertise in one or more skills unintentionally. Right now Tidy5e lets you lock a character sheet down which does prevent that, but it also gets rid of the check marks so there's no super clear way of knowing if you have Proficiency or Expertise or nothing in a skill unless you're gonna do math.
  - I would expect the icon to always be present, with a helpful tooltip, even when locked
  - What if there were three options: Unlocked, Locked, Confirm with Dialog
- [ ] Gambet - https://discord.com/channels/732325252788387980/1116078321067892796/1149940337570217994 - Only other thing and this might be personal preference, but I can't tell you how many times I ask for an Intelligence check and my players accidentally roll Initiative instead. I don't know if there's any way to make it clearer. Maybe making the line between Ini and Str a bit thicker or something.
- [ ] Task out some settings projects
  - [ ] Review and streamline; consider data-driving settings much like Foundry does
  - [ ] Add settings-wide, case-insensitive, includes-based filter text input above the tabs
- [ ] Standardize/componentize inputs to be used between Items and Settings UI. Ensure they look the same.
- [ ] Move setting (and theme types, if any are still lingering) out of script files and into dedicated type files to help prevent circular dependencies and allow FoundryAdapter to take some more responsibility over Foundry API stuff.

## (Deferred for later; might solve itself) SCSS Revolution

- [ ] Identify all components which are using styles
- [ ] Transplant those styles to partial stylesheets that are scoped to the appropriate sheet or context
- [ ] Put more specific stuff (item-quantity inputs) below the generic stuff (all character sheet inputs in general)
- [ ] Eliminate all local styles and keep specificity as low as possible so that module devs can override more easily
- [ ] While in there, poke around for `!important` tags and try to kill 'em.

## Not Just Tidy 5e settings... DND5e settings as well 😱

- [ ] Ensure all stock DND5E hooks and features are accounted for.
  - [ ] Review activateListeners() functions and ensure all cases are being accounted for.

In `activateListeners()` of the actor sheet, this function is called which relies on certain `data-` attributes to be present, and I do not aim to provide them, because I refuse to be subject to their magic jquery as much as possible:

```js
  /**
   * Disable any fields that are overridden by active effects and display an informative tooltip.
   * @param {jQuery} html  The sheet's rendered HTML.
   * @protected
   */
  _disableOverriddenFields(html) {
    const proficiencyToggles = {
      ability: /system\.abilities\.([^.]+)\.proficient/,
      skill: /system\.skills\.([^.]+)\.value/,
      tool: /system\.tools\.([^.]+)\.value/
    };

    for ( const override of Object.keys(foundry.utils.flattenObject(this.actor.overrides)) ) {
      html.find(`input[name="${override}"],select[name="${override}"]`).each((i, el) => {
        el.disabled = true;
        el.dataset.tooltip = "DND5E.ActiveEffectOverrideWarning";
      });

      for ( const [key, regex] of Object.entries(proficiencyToggles) ) {
        const [, match] = override.match(regex) || [];
        if ( match ) {
          const toggle = html.find(`li[data-${key}="${match}"] .proficiency-toggle`);
          toggle.addClass("disabled");
          toggle.attr("data-tooltip", "DND5E.ActiveEffectOverrideWarning");
        }
      }

      const [, spell] = override.match(/system\.spells\.(spell\d)\.override/) || [];
      if ( spell ) {
        html.find(`.spell-max[data-level="${spell}"]`).attr("data-tooltip", "DND5E.ActiveEffectOverrideWarning");
      }
    }
  }
```

## Reported Issues to Resolve

- [ ] Initiative Bonus keeps clearing out non-numeric bonuses; ruins "Dread Ambusher" ini bonus

https://discord.com/channels/170995199584108546/670336046164213761/1154309373011697747
https://discord.com/channels/170995199584108546/670336046164213761/1154307012482568213
https://discord.com/channels/170995199584108546/670336046164213761/1154305345808764978

"Dread Ambusher" feature, setting initiative bonus to `@abilities.wis.mod`, the field keeps getting reset back to 0.

Ideas so far:
- [ ] Default Ini Bonus box to a client setting that is turned off
- [ ] Look at Ini Bonus box to see why it might be clearing stuff out and resolve that also
- [ ] ... (diagnose and task)


## Special Requests

### Character Actions 5e absorption

https://discord.com/channels/732325252788387980/1116078321067892796/1131598564477370408

gambit — Today at 9:48 AM
I've got a request I'm hoping you can take a look at as well. I use Tidy in conjunction with Character Actions List 5e in order to have an Actions menu with Weapons, Spells, Features, etc in one place. Seems the original mod author is no longer maintaining that and 4535992 made a fork to get some css elements lining up correctly back in March, but it's pretty out of date at this point and the css is lacking. Any chance the actions list could be integrated into Tidy instead of relying on an outside authored module?

kgar — Today at 10:41 AM
I will definitely add it to the list to look into after I finish the base rewrite. I imagine we would want it to be Opt In via player settings, by default?

### Grid Favorites / Collapsible sections

https://discord.com/channels/732325252788387980/1116078321067892796/1132697983100657714

Dreaming — Today at 10:35 AM
I'm also quite interested in putting money in for the update and for a new feature requested by one of my players which would be the following:
Option to have a grid layout for the favorites section, ability to create collapsible folders/sections within the favorites menu by the player for sorting purposes.

kgar — Today at 10:56 AM
If such a thing gets implemented, would players want the sheet's expanded/collapsed sections to be remembered between full page reloads? That is, if they log in for game night, the sections they'd previously collapsed last session would still be in that same collapsed state.
Also, if it gets implemented (very likely), we should include expand all / collapse all buttons (or icons) on each tab where relevant.
Dreaming — Today at 11:11 AM
I do think that would be ideal

### Default theme as world scope

https://discord.com/channels/732325252788387980/1116078321067892796/1130574237833363486

SaltyJ — 07/17/2023 1:57 PM
haha
One thing i would like, as a settings option, is to set the default mode for everyone (Light vs Dark) or even custom when/if implemented
i actually tried doing that myself at one point, broke everything 🙂

kgar — 07/17/2023 1:58 PM
Ah, like a full-on game setting for "Default Dark" for a particular game world?

SaltyJ — 07/17/2023 1:59 PM
yeah. They can still change it to what they want, but it would be nice if i could set the default for new players
Running 3 campaigns with a total of 18 players. gets tedious, especially when they clear cookies.

kgar — 07/17/2023 1:59 PM
Gotcha. I'll copy this idea down and add it to the list for when I get nearer to the finish line. I think it's doable.

SaltyJ — 07/17/2023 1:59 PM
insert "Why does the sheet blind me now" questions.
Danke!

### Compatibility with popOut!

https://discord.com/channels/732325252788387980/1116078321067892796/1136092315337887836

Fallayn — Today at 7:25 PM
Hey! Reading this all it's fantastic to see this being worked on. I also want to chip in some $ if that helps in any way, just let me know where. This is the single most critical 5E module for me.

One concern I want to mention re: Svelte - one pain point I have seen with other (system) sheets that use more custom JS tech is that it often ends up incompatible with Popout for one reason or another. Would be great if the new Tidy5E would still work with the Popout module.

kgar — Today at 8:30 PM
I will add this to the list.

To help me with knowing what to look for, what kind of breakages occur with popOut! Is it functionality, styles, and/or other?

Fallayn — Today at 8:33 PM

Failure modes I've seen:

1. Popout does not work at all, i.e., when pressing the PopOut! button in a actor sheet's title bar, either nothing happens or the opened popout window is obviously broken (styling etc)
2. Sheet modifications either do not work, or only work in the UI, but are not persisted (so changing HP, adding an item or something either does not work, or "works" but if you close the popout window and check the actor in Foundry, the changes were not saved)
3. Rolls do not work (either not at all, dice simply aren't rolled, or the roll popup windows does not show in the first place)
4. When closing the popout or "popping it back in", data goes awry or rolls made while popped out are repeated (this is a weird one I've only seen in one system)

So basically either popping out is broken, popping in is broken, or saving data is broken. Besides that, if/once those actually work, it seems to behave like the normal sheet window, I haven't seen much PopOut specific styling issues or such.

> I have done some tests so far. It appears that some functionality works, but not all. Things like ability checks pop a dialog in the main window and are not moved to the popped out window. I will need to determine what things are missing in order to make this work properly.

### Aura's Info Idea

https://discord.com/channels/732325252788387980/1116078321067892796/1138959970705100960

Aura — Today at 5:20 PM
odd question considering you are re-building the tidey 5e sheets, i wonder if you can add [Crl+I] (information)to certain eliments and allow us to link in setting a journal and page so that we can have relivant rules pop up for the players. for example Insperation, long rest, shot rest?

kgar — Today at 5:24 PM
Are there examples I can look at?

Aura — Today at 5:25 PM
not to my knowledge, sorry, i thought it up when i was playing with players earlier today. just thought it would be a usefull improvment

### Fallayn feature requests and brainstorming

https://discord.com/channels/732325252788387980/1116078321067892796/1145493173234323556

Fallayn — Today at 6:00 PM
Feature wishlist: display ability score derived stats somewhere for NPCs and PCs, like jump length/height, max drawing/pushing weight etc (I have a manual note about the latter on all monsters that are used as mounts, but ugh) - not sure where, maybe a tooltip when hovering strength? 

Fallayn — Today at 6:09 PM
Also, and this is more brainstorm-y: I have been adding all general actions to PC sheets ("Disengage", "Sprint", "Dodge" etc)

This serves multiple purposes:
It serves as a reminder to players that these exist and they can use them
It serves as a rules helper, because each action has the exact description of how it works
It can integrate with modules, i.e when you use Dodge, you get an active effect for a round reminding you and every attacker that you are dodging


But it also adds a lot of noise to the sheet, and I do not want to add them to all the NPCs too manually.

But maybe we could have a optional collapsed by default category for   "general actions/features" that just shows whatever is in a compendium you set?

Open to other ideas how to implement this 

---

https://discord.com/channels/732325252788387980/1116078321067892796/1149058125886926959

Fallayn — Today at 2:06 PM
Having a way to manipulate the exhaustion counter easily (and extend it to 10) would be nice for modules/world scripts modifying exhaustion
Like an API to set/get the current level of exhaustion
(I haven't checked whether current Tidy5E has that exposed)

### Zanderaf - More Bars, bars for resources and features, etc.

https://discord.com/channels/732325252788387980/1116078321067892796/1145296768200872036

Zanderaf — Today at 4:56 AM
Oh I love the hp bars for those items, makes me tempted to ask if something like that would be possible on character sheets for feature charges like Ki Points or Rage amounts

Love what you're doing with tidy! I havnt used it much since the base sheet kinda suits me, but Im tempted to use it more and more with all this stuff

kgar — Today at 12:35 PM
It is very easy to do. It comes at the cost of some screen real estate, but when column selection is a thing, we might as well make item/feature/resource usage consumption optionally use a bar. I would think that alternate color(s) would be appropriate to distinguish from health bars

### 4535992's idea for dark mode as a libthemer function

https://discord.com/channels/732325252788387980/1116078321067892796/1146085509177819307

https://discord.com/channels/732325252788387980/1142084814623748157/1142090937812664450

### Zanderaf - consolidate race / class / subclass grids

https://discord.com/channels/732325252788387980/1116078321067892796/1150877443826122822

it might be a bit out of scope for this, but are there any plans to do something like this https://github.com/foundryvtt/dnd5e/issues/2342 ? I know that The default sheet is going to be a bit cramped with background, race, and then class/subclass all in the features tab taking up real estate- are there any plans for anything similar on tidysheet?

### Zanderaf - Sheet Lock Feature Toggle

https://discord.com/channels/732325252788387980/1116078321067892796/1159269001298448516

Zanderaf — 10/04/2023 6:21 PM
could there maybe be an option to have the lock / unlock disabled?

kgar — 10/04/2023 6:21 PM
There are options at present for Always Unlocked for the GM, one for each type of sheet.
I don’t think there’s an option for non-GMs yet
It is possible to have an option where we don’t lock anything. It’d need some details worked out

Zanderaf — 10/04/2023 6:45 PM
like an option where unlock lock is absent?
that would honestly be a good feature, no sure how others think

kgar — 10/04/2023 6:48 PM
Yes, that definitely can be done. I’ll put it on the list of features to discuss after go-live.


### kgar - Redo tab filters

Tab filters have a hard dependency on the sheet class itself, but because of how the sheet is set up with svelte, the sheet could do far less work in this regard.
Additionally, because we offer Cantrip preparation, the "Prepared (#)" filter
- does not account for prepared cantrips
- does not filter unprepared cantrips

- [ ] Upgrade filter sets so that the actual filter choices are remembered by the sheet, but no more than that; we should simply capture whether a filter is set to Include
- [ ] Upgrade filter sets to support Include / Exclude / Off, where exclude uses a warning / error color for the indicator
  - [ ] Allow for cycling through Include / Exclude / Off, but also provide a quick way to turn off that doesn't require cycling (like an X icon on the filter, or a hover-aside X icon button or something)
  - [ ] Allow for reverse cycling with right click
- [ ] Upgrade the relevant sheet tabs so that they filter data reactively based on these filter settings
- [ ] On filter setting changes, have the relevant sheet update its filter properties accordingly


### kgar - Dyanmic User-based Flags

Sometimes, the DM needs to interact with a sheet while the user is also interacting with it.
When there are flat flags for things like Search and Spellbook Class Filter, then a DM and a player could trip over each other during a game.
Alternatively, this flat flag approach allows for a DM to locate something for a player, but this benefit is not really clear or direct. A future feature for pinging something on the sheet would honestly be a better bet, which would free the sheet to be more collaboration-friendly in nature.



One way to make sheets accessible to multiple concurrent people while also remembering user preferences on sheet 


### kgar - Search Feature Adjustments

Upgrade tab search so that it does not involve a flat flag.
Options for alternate storage:
- transient sheet instance state, similar to how the sheet remembers the current tab, scroll top, and filters
- a dynamic user sheet flag

Making the search transient or user dynamic user sheet flags means a DM and a player can both search a tab without messing each other up.

Transient state: on page refresh, the search is gone.
Dynamic user sheet flag: on page refresh, the search is still there from last time.

### kgar - 👁 Show to Players

Copy the "Show to Players" header menu button feature from "The Module Which Shall Not Be Named."
Include things like the permissions dialog that it uses.
Ensure the relevant tab is presented upon showing.


### kgar - Sheet Ping

As a DM, I would like to be able to ping basically any identifiable element on a character sheet.
When I ping, for all users who have the sheet open, it should
- Select the appropriate tab
- Find the appropriate element
- Scroll the element into view
- Animate the element with some attention-grabbing indicator for a few seconds for all

Options for how to ping:
- An activate-able ping mode
  - use a hotkey or press a conveniently-located button to put the sheet in Ping mode
  - allows me to hover over any identifiable element and click it to ping
  - once pinged, ping mode disabled
- ⭐ Long-press / long-click
  - any time the user long-presses or mouses down for a long enough time anywhere on the sheet, we look for the nearest containing element marked as pingable
  - trigger a ping for that element


Long-press / long-click is nice, because it jives with the canvas ping settings.
We might even consider using the user-specified ping settings from foundry at large to drive tidy's pinging.

#### What I sent to the commission

**🎯 Sheet Ping**
- Allow a permitted user to draw attention to a section of a Tidy 5e sheet using a Ping
- Sheets will designate pingable content (items, spells, tabs, buttons, text, etc.)
- When doing the non-shift-ping (a regular ping), we use Tidy 5e theme coloring to perform a brief outline-based animation for the benefit of anyone currently using the sheet
- On a Shift-Ping (whatever that is officially called), we also tab and scroll where relevant so that other people using the sheet are taken to the thing which was pinged; then, it just plays the same ping animation as it would for the other case

For how to actually ping, my thought is that it should mirror how pinging works and is configured in Foundry VTT at large.

I'm not entirely sure on the specifics of making this work quite yet, but I would definitely want it for my table.
There would be more details to work out, like permissions (and those pesky implementation details), so I would want to put this on that growing list of features to discuss after the initial release, and we can vote on which ones to prioritize.

#### Some thoughts from others in the commission

https://discord.com/channels/732325252788387980/1116078321067892796/1159905819358404618

ArlosMolten — Today at 12:31 PM
A feature where you open your sheet on another user, on a specific tab isn't enough?
When one of my players want to show/ask something about his sheet, just saying and pointing is enough. Having the sheet open on that tab would be a good qol, but this is just my experience. 

kgar — Today at 12:39 PM
Does that already exist? Or are you saying opening the sheet for another user on a specific tab would be enough if we were going to make some kind of feature like this?

ArlosMolten — Today at 12:45 PM
I've always though this was a tidy5e feature 😄


https://discord.com/channels/732325252788387980/1116078321067892796/1159919498397225000

No Name — Today at 1:25 PM
I like the concept, especially considering how... messily Foundry stores abilities. Tbh, I'd rather features be split into class racial and other, but that may be too much, so pinging is a great thing imo
In terms of items and spells, I think the active tab does a good enough job

https://discord.com/channels/732325252788387980/1116078321067892796/1160078804480426155

Gambet — Today at 11:59 PM
If it's possible to ping a sheet that would genuinely be useful as I tend to play with a lot of players who are new to D&D and Foundry. Although I would wonder how it would work. Would both the GM and the player have to have the same character sheet open at the same time? What if one has the Prototype Sheet open and the other has the Token Sheet open? What if I have a different sheet open entirely?

On the Shift-Ping front where it like, lets players ping a sheet in a way that would cause the DM or other players to have their tabs swapped.... I would caution against this. I think it might be a bit too much power that could cause confusion and maybe some mistakes. Like maybe I'm about to click a spell but someone pings and I get swapped to the Inventory tab and now I've swung a sword instead.

Personally I think this is a feature that should be as unobtrusive as possible, and used sparingly. In the rare cases where it would be used, I'm sure I could trust my player to let me know which tab to switch to.


### kgar - Revised Layout for Spell Slots

Currently, spell slot dots and `#/# ✏` UI is applied to the primary column header for spells.
This doesn't make a lot of sense because of the limited space for primary column content. It is further exacerbated by longer primary column names like "Pact Magic - Nth Level Spells".
Consider a UI / layout adjustment as follows:

```
[(x) ( )   1/2 ✏]
Pact Magic - 1st Level | 🥣 | 🎩 | ...
```

Imagine it like a tab that sits above the column header and assumes the same color. It is not limited to the primary column. It can span the entire length of the spell list.

This would free up a great deal of space and make 20th-level wizard spell slots wreak less havoc on the sheets.

The main downside is imposing a bit more vertical spacing to accomodate the spell slot tab.