## kgar To Do

### The Short List

- [ ] Add sheet parts everywhere. Make this easy for the user who wants to mod this.
  - [ ] header parts
  - [ ] sidebar parts
  - [ ] tab contents
    - [ ] toolbar
  - [ ] ...
- [ ] Make constants for the sheet parts. Pull sheet part constants into their own file, possibly.
- [ ] SortingListbox - add touch support for drag and drop, if possible; and if it works out, remove the arrow buttons.
- [ ] Update the readme

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

- [ ] Custom Section Selector - be able to rename existing section without retyping the whole section title
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

- [x] And character.scss line 1946 change the grid-template-columns to 17.5rem, it's a little too wide in the responsive view now that I'm playing with it moregrid-template-columns: minmax(0, 17.5rem) minmax(0, 1fr);
- [x] PC sheet - edit mode - header abilities - Setting buttons are too low at a very specific width
- [x] The sidebar button's hitbox should be a little wider.
- [x] Make the sidebar button a little wider
- [x] Special Traits - tell the user whether there's an active effect modifying the value of a given special trait. Use the classic sheet approach of disabling and tooltipping.
- [x] Extend Spell Slot drag-and-drop to entire section header.
- [x] // TODO: Change to linkedActivity
  - [x] If it works, then eliminate usages of cachedFor.
- [x] Clean up and streamline the new import/export handling. Consider extracting to its own theme-quadrone class, so it can be dedicated to the task.
- [x] Consider extracting import button to its own component to keep things clean.
- [x] // TODO: This is some duplication with the Character sheet context prep. Find a way to share responsibly.
- [x] **Theme Settings**: Verbally distinguish between "Actor Header Background" and "Item Sidebar Background". Add support for Item Sidebar Background.
- [x] Add background circle hover style to section row buttons
- [x] Always track and ensure that `currentTabId` is correct on the sheet. Use a getter/setter, and under the hood, use a stateful object. Make "change tab" function available and have it trigger rerenders.
- [x] Editor style needs CSS help: <https://discord.com/channels/1167985253072257115/1169792539545587733/1362188451910258869>
- [x] (Module Compatibility) So Inspired! - add API for globally overriding inspiration tracking.
- [x] (Module Compatibility) DDB Importer - create and submit PR to support DDBI button or header menu across all relevant sheets.
- [x] (Module Compatibility) So Inspired! - provide PR to module repo
- [x] (Module Compatibility) Drakkenheim Corruption tab: support it in Quadrone
- [x] (Module Compatibility) Test Hidden Death Saves module; tested, submitted github issue, hoping to hear back. Compat should be real easy on this one.
- [x] Tidy API for pseudo traits: support on new character sheet
- [x] (Module Compatibility) Search for module authors that integrate with Tidy Special Traits and make sure they're taken care of.
- [x] (Module Compatibility) Discuss custom bars with Nox and (hopefully) LuMaster.
- [x] Remember section expand/collapse state between sheet open/close.
  - [x] On toggle, debounced by 250ms, persist to a client setting which hold all expansion tracker state via a map from UUID to expansion trackers, essentially. This setting will not be visualized in the UI.
  - [x] On construction, look for ones own tracking data from the client setting and populate self.
  - Remember section expand/collapse state between sheet open/close. ~~Tab setting (or possibly User setting / preference?): initialize all sections as closed. Moto Moto request. <https://discord.com/channels/915186263609454632/1107447125073199154/1379850522407735306>~~
- [x] Make dedicated Quadrone Activities context menu. Remove inappropriate classic options like "Pin to Attributes"
- [x] Control which sheet header controls are available for non-owners and locked-in-compendia.
- [x] Suppress user preference persistence when minimized, minimizing, and maximizing. I think this is causing a Last Known Width/Height bug.
- [x] Phys bypasses: ok what I'd try instead is to use the tooltip for sure, but thin toss on `fa-shield-exclamation` and try changing the color to either orange-40 or orange-70, or if that feels weird then same green but change the icon to `rgba(255, 236, 149, 1)` or something <https://discord.com/channels/@me/1243307347682529423/1391632333337002082>
- [x] (testing) Fix issue with <https://github.com/KibblesTasty/kibbles-compendium-of-craft-and-creation>
- [x] (testing) Finish testing all documented CONFIG.DND5E customizations
- [x] Try to fix the inventory footer with Flex Parent ( Rest of Inventory, Footer )
- [x] Make Quadrone Effects context menu handler; determine if there are any others.
- [x] Implement a useful subtitle (if any) for the generic item. Remove the "todo". Determine whether we want to support a Magical Tattoo subtitle.
- [x] Figure out where to put power tools like "Assign Spells to Source Classes"
  - hightouch recommendation: in the tab config menu
- [x] Refactor: Journal flag management is too complex. It needs to be extracted to a Tidy Journal controller class to keep the Tidy Flags layer as a simple data access layer.
- [x] Create constants for all known filters. For those that are generated, provide a global filter name  provider function that takes a value (source class, for example) and churns out the appropriate name ('source-class-warlock'). Update the runtime and all those using hardcoded filter names (Spellbook Footer).
- [x] `_onDropItem` - observe how Foundry core does this in V13. _onDropItem is provided with the full item on the Foundry side. Why are we doing our own thing? Can it be avoided? If not, then do that Foundry is doing. Copy how dnd5e is handling `_onDrop`, and this will enable you to then rely on Foundry core's `_onDropDocument`, which will provide the document instance for you.
- [x] root out uses of 'src/api' where able
- [x] PC Sheet Sidebar - Default Open
- [x] PC Sheet Sidebar - Default selected Favorites, Favorites first tab
- [x] Spell Slot Context menu - Edit - open Spell Slot Config ;)
- [x] Skill/Tool Context menu - Edit - open Skill/Tool Config ;)
- [x] Middle-click to edit favorite entries
  - [x] Items, Activities, Effects
  - [x] Spell Slot middle-click - open spell slot config
  - [x] Skill/Tool middle-click - open skill/tool config
- [x] Favorites Context Menu Adjustments - remove Duplicate and Delete actions
  - [x] Item - Remove Spell Scroll, Dup, Delete
  - [x] Activity/Effect - Remove Dup and Delete
- [x] Upgrade all sheets to us the sheet actions for editImage, showArtwork, and editIcon (items and containers)
  - [x] Quadrone Actors and Items
  - [x] Classic Actors
  - [x] Classic Items
- [x] Add reference tooltips to skills and tools
  - tool: `data-reference={dnd5e.documents.Trait.getBaseItemUUID(CONFIG.DND5E.tools[id]?.id)}`
  - skill: `data-reference={CONFIG.DND5E.skills[id]?.reference}`
  - make sure to derive it per skill/tool.
- [x] Fix never-ending render issue with MLD, if able. The ideal may be to simply re-render manually when adjusting a setting, rather than hooking into the User changed event.
- [x] ~~Add level breakdown tooltip to the level badge, else instructions for getting started.~~ Nah. It's in the subtitle AND the Character tab. 
- [x] Dropping an item from a compendium window doesn't work every time. The drop behavior is resolving to "none" inexplicably.
- [x] Can we just do what module\applications\mixins\drag-drop-mixin.mjs is doing for `_dropBehavior()`. Basically, just do it there, only?
- [x] Sheet tab - drop in custom section is not working
- [x] Container - drag out of custom section is not working
