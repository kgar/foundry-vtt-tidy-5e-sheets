# To Do

## Top of Mind

- [x] Make shared component for nav tabs and eliminate the separate stylesheet
- [x] Make a second pass at nav tabs and make sure it's ergonomic enough. Look at some other examples out there.
- [x] Consider adding a third prop to the Tabs type which allows for specifying a component and its props. Use this to make tabs fully data-driven 🤯
- [ ] Task out Custom Item sheet and try out a new approach to the sheet, using the `TestApplication.ts` and `Experiment.svelte` as examples. Find the appropriate hooks via `CONFIG.debug.hooks = true`.
  - [x] ~~Be sure that you subscribe to a hook when the application is to be initially rendered and then unsubscribe when it closes, to prevent excess processing and unforeseen issues.~~ Overriding the render() function did the trick. Preventing unforced renders and simply updating the window title and refreshing store made the magic happen.
  - [ ] One thing to think about: try subscribing at the top level to the context and then passing it down and around, rather than passing the store everywhere.
  - [ ] The end result should be relatively easily portable to the old method if the new method doesn't work out. Just some rewiring at the top ✅
- [x] Implement "+Temp +Max" HP and config button cog on the character profile 😱

## Character Tabs Pile of TODOs

- [x] Use existing or create new tab control | made a really rough tabs control with relative ease
- [ ] Implement the tabs
- [ ] Implement Favorites
  - [ ] Scope it out and make a plan
  - [ ] ...
- [x] Ensure item summary functionality can be shared

- [x] Implement default tab
- [ ] Visual bug (existing): when any character detail field is too long in Biography top-notes for a PC, it will blow out the layout. Consider CSS grid as a replacement. Test carefully on all the major browsers. Also just consider inputs instead of contenteditable fields?
- [ ] Consider consolidating sheet initial value / cacheable content into single objects to pass down to the target component. Values include things like scrollTop map, currentTab sheet parameter, and any other sheetparameters that need to be cached for maintaining visual integrity between submissions / sheet refreshes.
- [ ] Focus is lost when the sheet submits, so you cannot tab through fields and make changes quickly. It would be nice if focus is maintained between submits. How would we accomplish that?
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
- [ ] Figure out how flags and settings work
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
- [ ] Add game setting `showSheetOptionsOnWindowHeader` and limit `getActorSheetHeaderButtons` hook handler to when this setting is on.
  - [ ] This fits better in the main module settings and not the sheet settings.
- [ ] Refinement: User-specific sheet flags | set up individual flags for each desired primitive value, and generate a key based on `${userId}-feature-name-here`
- [ ] Refinement: make Action Economy filtering unique to the user and not the actor. Unfortunately, to keep track of this, we'll need to persist a large json object representing Actor -> Tab -> Filter Name, with a value of boolean at the leaf.
- [ ] Refinement: implement sorting per section type ; it should not affect the actual order of the data, and it should be specific to the users
- [ ] Refinement: maintain scroll top between refreshes
- [ ] Refinement: maintain open/closed state of items between refreshes
- [ ] Refinement: Expand All / Collapse All

## Cross-Cutting

- [ ] Implement Item Cards
  - [ ] src_scss\partials_item-info-card.scss
  - [ ] Game Settings
    - [ ] Show item info cards in all layouts
    - [ ] Show item info cards for NPCs/Vehicles
    - [ ] Item info cards float next to cursor
    - [ ] Delay showing info cards
    - [ ] Key to hold for Item Card interaction
- [ ] Reimplement Favorites visualization - [ ] Psst: src_scss\partials_favorites.scss

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
