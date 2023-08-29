# To Do

## Progress

- [x] Limited Character Sheet
- [x] Limited Vehicle Sheet
- [x] Refactor: Make all limited sheets do like the dnd5e limited sheet
  - [x] Share a standard header based on the draft from VehicleSheetLimited
- [x] Item Card
- [ ] Dark Mode
- [ ] Settings Dialog Overhaul
- [ ] Implement All Settings
- [ ] Tackle Misc To Do's
  - [ ] Drag and drop
  - [ ] New context menu? Custom global context menu that leverages a global store
  - [ ] Revisit character sheet now that we've got all this experience
  - [ ] Typescriptify Tidy 5e flags
  - [ ] FoundryAdapter cleanup project and types purge
  - [ ] HTML enrichment
  - [ ] getData() / Context enrichment : pull back all calculations from the various components into the context when getting context data in the sheet. If necessary, pull further back into Foundry Adapter for each sheet type.
  - [ ] etc.
- [ ]

### Foundry Adapter Cleanup

We really don't need to be trying to create minimal types for Foundry or the 5e system. There should be an `any` cutoff within the FoundryAdapter for all the things we need.

- [ ] Purge Foundry types
- [ ] Purge dnd5e types

Foundry Adapter should be reorganized so that functions can be broken out for actors, characters, NPCs, vehicles, items, all entities, and maybe more than this.

- [ ] Review the current state of FoundryAdapter and task out work
- [ ] Find all instances of global foundry / 5e usages in svelte and pull back into the Adapter.
- [ ] Begin eliminating all TS errors
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
- [ ] Review `applyLazyMoney()` and determine how this affects the player sheet
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
- [ ] Implement these money settings (if able, fold Lazy Money into Tidy 5e; else, figure out what API hooks are needed and then let Lazy Money do the heavy lifting)
  - [ ] lazyMoneyIgnoreElectrum
  - [ ] lazyMoneyEnable
  - [ ] lazyMoneyChatLog
  - [ ] lockMoneyChanges
  - [ ] lazyMoneyAddConvert
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

### Zanderaf - More Bars, bars for resources and features, etc.

https://discord.com/channels/732325252788387980/1116078321067892796/1145296768200872036

Zanderaf — Today at 4:56 AM
Oh I love the hp bars for those items, makes me tempted to ask if something like that would be possible on character sheets for feature charges like Ki Points or Rage amounts

Love what you're doing with tidy! I havnt used it much since the base sheet kinda suits me, but Im tempted to use it more and more with all this stuff

kgar — Today at 12:35 PM
It is very easy to do. It comes at the cost of some screen real estate, but when column selection is a thing, we might as well make item/feature/resource usage consumption optionally use a bar. I would think that alternate color(s) would be appropriate to distinguish from health bars

### 's idea for dark mode as a libthemer function

https://discord.com/channels/732325252788387980/1116078321067892796/1146085509177819307

https://discord.com/channels/732325252788387980/1142084814623748157/1142090937812664450
