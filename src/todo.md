## kgar To Do

### The Short List

- [ ] Custom Section Selector - be able to rename existing section without retyping the whole section title. (see notes below)
- [ ] Formula column
  - [ ] Truncate to one line and show tooltip
  - [x] Inline Activities - add Formula column and don't truncate
    - What about Activity Tables in item sheets?
- [ ] Suggestion: Hide the Add to Sheet Tab button when the sheet tab is hidden.
  - [ ] Actor Sheet base - add abstract function `getSelectedTabIds()`; all callers must return the effective list of selected tab IDs. If the flag is nil, then return the default tab ID list. This will side-step any need for major refactors
    - [ ] Then add `isUsingActionsTab()`, which leverages `getSelectedTabIds()` and returns whether the actions tab ID is included.
  - [ ] Container sheet contents - check for the parent actor, resolve to a temp copy of a sheet, and use `isUsingActionsTab()`
- [ ] Prepared footer macro filter:
  - [ ] If all relevant filters are unified, decorate the button as Include or Exclude
  - [ ] If the relevant filters do not all match, decorate as Off; a single click should be able to bring them all into the right state
  - [ ] Configure so left click toggles Include / Off, and right click toggles Exclude / Off.
  - [ ] When engaging the Prepared footer multi-filter, clear all others. This is a productivity filter. They can pile on manually in Advanced.
- [ ] Add sheet parts everywhere. Make this easy for the user who wants to mod this.
  - [ ] header parts
  - [ ] sidebar parts
  - [ ] tab contents
    - [ ] toolbar
  - [ ] ...
- [ ] Make constants for the sheet parts. Pull sheet part constants into their own file, possibly.
- [ ] SortingListbox - add touch support for drag and drop, if possible; and if it works out, remove the arrow buttons.
- [ ] Update the readme
- [ ] Foundry package page: revamp


#### Current Section Name Issue Notes

I was contemplating the Sheet Sections hiccup we ran into with Jake: it is difficult to quickly change the name of a section for a given item when using the section selector.
I was thinking we could do just a little rearranging and repurposing to make it work.

1. We change "Create a New Section" to instead show the current, chosen section value in the input. Clicking on the input selects all text. "Save New Section" just changes to "Save Changes" or something.
2. Move this custom value input to the top and have it autofocus on load.

This would accomplish allowing someone to quickly edit the current value without having to retype it. The reframing of this would, I think, make it more immediately understandable, since your current value is always at the top, in the input box, and the input box being the focus allows for establishing settings quickly.


### NPC Sheet

- [ ] Header
  - [ ] Portrait
  - [ ] AC and Vitals
  - [ ] Name
  - [ ] Subtitle
  - [ ] Sheet header buttons
  - [ ] CR
  - [ ] Image switcher toggle (show on unlocked, left of subtitle contents)
  - [ ] abilities
- [x] Sidebar
  - [x] Traits
  - [x] (Collapsed by default) Skills
  - [x] Loyalty tracker
    - [x] Show when 
      - [x] `this.actor.system.traits.important` AND
      - [x] `game.settings.get('dnd5e', 'loyaltyScore')` AND
      - [x] `game.user.isGM`
  - [x] Legendary trackers
    - [x] Show each when unlocked or when each is eligible
      - [x] legact - `this.actor.system.resources.legact.max`
      - [x] legres - `this.actor.system.resources.legres.max`
      - [x] lair - `(context.modernRules && this.actor.system.resources.lair.value) || (!context.modernRules && this.actor.system.resources.lair.initiative)`
        - [x] 2014
        - [x] Modern
- [ ] Statblock
- [ ] Inventory
- [ ] Spellbook
- [ ] Effects
- [ ] Background
- [ ] Journal

### (Almost) Everything after the short list

- [ ] Only show Action tab control when the action tab is in use.
  - This is way more difficult than it has any business being. The ActorSheetRuntime refactor might be needed to make this viable.
- [ ] Scaffold the Group Sheet
- [ ] Set up Group Sheet Tab Selection
- [ ] Scaffold the Vehicle Sheet
- [ ] Set up Vehicle Sheet Tab Selection
- [ ] Propagate Table Row Actions to Activities tables
- [ ] Propagate Table Row Actions to Effects tables
- [ ] Propagate Data-Driven Columns to Activities tables
- [ ] Propagate Data-Driven Columns to Effects tables
- [ ] All section configs: pass in callback for preparing sections to view, so that we're not processing this during non-option-sheet renders. It should only render on option sheet prerender.
- [ ] Configure {TabId}: include a hook that allows people to pass in their own settings.
- [ ] Resolve TODO -  // TODO: Make this a callback to send through to the component for preparing sections properly
- [ ] Effect Summary eagerly refreshes. Add suppression to HTML enrichment to only when the effect summary is shown.
- [ ] Ensure all item sheets enforce this Unidentified UI feature:
  - [ ] (Non-container sheets only) Sidebar sections all hidden except Sections section and pill switches
- [ ] (stretch) Implement generic width / priority observer feature that can be used to control pinned filter visibility generically and then be used for other purposes later.
  - [ ] Propagate this to all action bars
- [ ] Extract the Tidy Table rendering components for churning out columns from column specs. This functionality will be reused for Effects and Activity tables.
- [ ] (lowest priority: the system should probably work this out first) Figure out: can get it so I can add Artisan's tools ("art") to Favorites? It represents all Artisan's Tools.
- [ ] Bastion tab idea: Include an actual Add button in addition to the Compendium button. People should be allowed to add a new Bastion directly to a sheet.
- [ ] Bastion tab: Disabled facilities are completely nonresponsive even to a GM. It seems like at least the GM should be able to fix an accidentally broken facility. The Foundry / dnd5e way has been "if you own the sheet, you can do whatever you want to the sheet," so this particular feature as it currently exists sort of contradicts that philosophy.
- [ ] Discuss: new Action List option: "Require Item to be Equipped for Cast Activity Spells" - would have an explanation detailing that this requirement is in addition to the standard Attunement requirements | <https://discord.com/channels/1167985253072257115/1169792539545587733/1384379958801076255>
- [ ] // TODO: Consider deferring enrichment to tab rendering, so tab selection can preclude it.
- [ ] Refactor: Simplify DEFAULT_OPTIONS management now that option inheritance works and `visible()` callback is officially supported.
- [ ] Research: Leveraging Foundry data models to validate, clean up, and control my flag data; and what about new user settings?
- [ ] (Stretch) Advanced Settings Section - do you know what specific CSS variable alterations you want to make to Tidy? Put 'em here. An array of 0 to many direct variable overrides. If someone goes real deep into Tidy and wants to submit some community theme JSON, they may do so.
- [ ] (Stretch) **Theming**: Community Theme submissions - they'll go in a dedicated folder in github and, with an active internet connection, can be pulled directly from within Foundry
- [ ] (Stretch) **Theme Settings**: Saved Themes in campaign world - be able to create multiple themes and save them to the game world for all to enjoy
- [ ] **Theme Settings**: Add support for Item Sidebar Width?
- [ ] Item cards
  - [ ] ~~Implement a shared portal for item cards. All attached item cards will use the one portal anchor. This is so the card can live outside the sheet's overflow hiding window content, so we don't have to worry about compromising design.~~ Can item cards leverage a shared dialog component so they can ignore overflow?
  - [ ] Have item cards be targeted via `.tidy5e-sheet.classic....` etc.
  - [ ] Test spell info on item summary and cards
  - [x] ~~For fun, test with PopOut!~~
  - [ ] Use popovers 💖
  - [ ] Have or reuse options for show/hide timing
- [x] Swap left and right areas in tab selection (left = selected, right = hidden)
- [ ] Refactor: As feasible, where able, start pivoting from Objects to Maps. It's apparently more performant.
- [ ] Wiki: document tab registration and show off Mestre Mahakala's final product as an example of interacting with external data sources and making a very unique tab. <https://discord.com/channels/@me/1243307347682529423/1388371150291210290>
- [ ] Bug? Secret button doesn't work on Item Description in Actor sheet
  - Does not work on default sheets or Tidy classic.
- [ ] (Take our time on this one; it's never been solved by any sheet, except for vertical tabs) Implement Responsive Tab Strip
- [ ] Magical Tattoos: provide first-class favorite card. Expand system to accommodate custom favorite card renderers so that it can be registered thus.
- [ ] (Take your time on this one, maybe after the overhaul is complete) Refactor: consider combining the actor sheet runtimes into a single collective like Item Sheet Runtime. Then, consider extracting a common base class 🔥.
- [ ] (PC: Feature tab) Implement alternate section groupings - <https://discord.com/channels/1167985253072257115/1170021717524107274/1382889612959158355> | include toggle option as sheet flag in tab settings.
- [ ] add a class to section headers when there are no search results `.search-no-results`
  - Note: Section headers disappear when there are no results. I'm guessing I noted this wrong. Are we instead wanting to put a `search-no-results` class on the container for all the sections on that tab? Is it a means of showing a No Results UI?
- [ ] // TODO: Item and Container Sheets duplicate this functionality; consolidate somewhere


### Module Compatibility

## hightouch To Do

- [x] Fix Bastion Item Sheet, Crafting UI
- [ ] Weapon Favorite stats cell is missing formatting classes
- [ ] Revisit 2nd line formatting for Favorites stats cells (lower 2nd line size + spacing)
- [ ] Non-square portraits need some CSS help: https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues/1218#issuecomment-3067321940
- [ ] Test Korean language on Mac
- [ ] Item sheet context menu styles - hide initial grouping line if present.
- [ ] Request from Tyler: provide performance settings in Tidy that can disable animations and other similarly taxing CSS.
  - [ ] both - identify the things that can be disabled to appreciably improve perf
  - [ ] kgar - establish client (or user) setting(s) for disabling animations, shadows, etc.
  - [ ] hightouch - make the necessary updates needed to support classes which disable animations, drop shadows, and whatever other things we can disable to increase perf.
- [ ] Skill abilities - dark mode - the dropdown background is not dark
- [ ] Item sheet sidebar background image (low)
- [ ] Make a generic roll button component
  - [ ] Fix Slot favorite roll icon not appearing
  - [ ] Add Bastion facility roll icon on hover
  - [ ] Add Character tab roll icon on hover
- [ ] Figure out what's up with multiclassed spellbook footer padding missing

### Huh?

- [ ] Check that the theming is using --t5e-theme-color-default: oklch(from #ff74c5 40% 35% h);

### Post-Beta Stretch Goals

- [ ] Compact Sheet - take the current sheet and apply compacting styles to it and offer as a User setting.
- [ ] High Contrast support - add theming changes to support Foundry's high contrast settings.
- [ ] Increased Mobile/Tablet support.

### Deferred tasks from last item batch review

OK I think I found one thing on features. Recharge recovery only shows if it's the first recovery option
<https://discord.com/channels/@me/1243307347682529423/1362996587584028683>
> This one is hard to reason about. The standard UI doesn't provide recharge info for non-first recharge recoveries. I'd like to think this over some more.

OK then tattoos the one thing I see is that some of the tattoos like the Absorbing tattoos have Reaction-based abilities. But the sidebar is looking for a defined value
<https://discord.com/channels/@me/1243307347682529423/1363003038482038836>
> The issue was that there's a Damages label that is empty with the absorbing tattoo. It is possibly just a weird setup. The fix I did for now was to filter out damage labels that are null/undefined/empty.

### Scratch - Finding the effective theme for a sheet

```js
// Get document sheet config theme
const theme = foundry.applications.apps.DocumentSheetConfig.getSheetThemeForDocument(options.document);
theme // 'light' | 'dark' | '' | ???

// Getting top-level application default theme
const { colorScheme } = game.settings.get("core", "uiConfig");
colorScheme.applications // 'light' | 'dark' | '' | ????

// Getting browser default
    let browserDefault;
    if ( matchMedia("(prefers-color-scheme: dark)").matches ) browserDefault = "theme-dark";
    else if ( matchMedia("(prefers-color-scheme: light)").matches ) browserDefault = "theme-light";
```

### Bonus

- [ ] Activity card / summary: Activities can be summarized via activity.activationLabels
  - all: activation, duration, range, reach, target
  - item is weapon with no overrides: attack: range, reach

### Context Menu items rework

<https://discord.com/channels/@me/1243307347682529423/1353196795378929754>

Here's my recommendation for action order following menu order best practices:

- Most commonly used on the top
- Destructive actions sunk to the bottom
- Related content grouped

```
Edit
Equip
Add favorite
Identify
Display in chat
Duplicate
---
Pin to attributes
Choose a section
---
Give to character
Delete
```

### To Include on Actor Phase

- [ ] Effects tab
  - [ ] Info / Suppression UI <https://discord.com/channels/@me/1243307347682529423/1351751313515479131>
  - Repro: Put on a ring of protection but don't equip/attune to it.

### Stretch

- [ ] hightouch: If it's super simple (and only if it's super simple) it could be nice to hard link some of the currency/weight/item type directly to the fields (e.g. click it, opens the tab, focuses the input). But if it's not out-of-the-box it's not worth it. Just wasn't sure if it was actually possible

### Observer and Limited permissions for container sheets

Observer:

- Cannot
  - Change item quantities
  - Use item
  - Add item / see add button at all
  - edit currencies
  - edit anything in details
  - see or toggle mode; stays in Play Mode
  - Change sheet type
  - Identify
  - Equip
- Context menu
  - View Item
  - Display in Chat
- Can only see main description

Limited:

- Identical to Observer

### To Do Graveyard

- [x] Release notes: add section on the header
- [x] Release notes: finish the non-character-sheet notes, like fixes, localization, etc.
- [x] Include player color in the available coloris swatches
- [x] Tools cog always visible. Limit to Edit mode.
- [x] Issue: URL - http/https - backgrounds do not load in the header for theme settings.
- [x] ~~Fix Harry's issue with an actor and their messed up favorites behavior: https://discord.com/channels/1167985253072257115/1393987856921526353~~ unable to repo.
- [x] Item / Container Sheet - Action section button - change label based on parent sheet type. Fallback to Actions labelling.
- [x] Suggestion: Add drag/drop functionality (between columns, and reordering within a column) to selection listboxes.
  - [x] Selection listbox
- [x] Add alignment to biography `system.details.alignment`, first field!
- [x] Add Activity uses to inline activities
- [x] Add damage formula to inline activities
- [x] ~~Add alignment to header subtitle? Discuss with hightouch~~ was already done
- [x] Fix: Using context menu's 'Choose an Action Section' updates 'Section' field instead 'Action Section' https://discord.com/channels/1167985253072257115/1394345274402406523
