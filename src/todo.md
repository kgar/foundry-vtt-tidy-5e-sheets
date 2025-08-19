## kgar To Do

### The Short List

- [ ] Establish Group Quadrone scaffolding so the sheet can be opened.
  - [x] Registration
  - [x] Tabs, Runtime
  - [ ] Stub layout with tab strip
- [ ] Establish Encounter Quadrone scaffolding so the sheet can be opened. While doing this, extract the common classes for Group and Encounter that work best for them collectively.
  - [ ] Registration
  - [ ] Tabs
  - [ ] Stub layout with tab strip
- [ ] PC and NPC Sheets
  - [ ] Update class/subclass/background/species rows to View on double-click and Edit on middle-click

### (Almost) Everything after the short list

- [ ] Refactor idea: Gather row actions as derived values of the sheet's own context state on the sheet class itself. See if it will reactively update based on context changes.
- [ ] Effect table rows: when effect is disabled / suppressed, use the italicized / sad styles from unprepared spells and unidentified items.
- [ ] Create attachment for inlineWidth observer so that a callback can supply the inline width for the caller to react to. We can take the width and update a stateful value that is also included in context, so that all descendents have access to the inline width.
  - [ ] Identify all resize observers which can be removed.
  - [ ] Propagate it to all locations where relevant. Namely, each instance of TabContent should track its inline width. This pays dividends.
  - [ ] Consider optimizing nested container inline width management at this time; apply spacer calculations to the final total for each level of nesting. It doesn't have to be perfect.
- [ ] disable all roll buttons when in observer or locked compendium view. Leverage the `canUse` helper. https://discord.com/channels/@me/1243307347682529423/1397418208813650091
  - [ ] Fully remove the short/long rest buttons in the header
  - [ ] ...
- [ ] Need to refactor: Resize Observation and Column Loadout. There are so many places in a given tab where resize observers are needed for inline activities that it imposes a noticeable perforamnce hit. Also, with every adjustment, column loadout is redone and re-ordered, which is unnecessary. At much as possible needs to be moved to 
- [ ] Suggestion: Hide the Add to Sheet Tab button when the sheet tab is hidden.
  - [ ] Actor Sheet base - add abstract function `getSelectedTabIds()`; all callers must return the effective list of selected tab IDs. If the flag is nil, then return the default tab ID list. This will side-step any need for major refactors
    - [ ] Then add `isUsingActionsTab()`, which leverages `getSelectedTabIds()` and returns whether the actions tab ID is included.
  - [ ] Container sheet contents - check for the parent actor, resolve to a temp copy of a sheet, and use `isUsingActionsTab()`
- [ ] Prepared footer macro filter:
  - [ ] If all relevant filters are unified, decorate the button as Include or Exclude
  - [ ] If the relevant filters do not all match, decorate as Off; a single click should be able to bring them all into the right state
  - [ ] Configure so left click toggles Include / Off, and right click toggles Exclude / Off.
  - [ ] When engaging the Prepared footer multi-filter, clear all others. This is a productivity filter. They can pile on manually in Advanced.
- [ ] // TODO: Create a polymorph tab ID blacklist that implementing sheet classes can opt into
- [ ] Add sheet parts everywhere. Make this easy for the user who wants to mod this.
  - [ ] header parts
  - [ ] sidebar parts
  - [ ] tab contents
    - [ ] toolbar
  - [ ] ...
- [ ] Make constants for the sheet parts. Pull sheet part constants into their own file, possibly.
- [ ] Foundry package page: revamp
- [ ] Add World Setting to disable ruletips in Tidy
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
- [ ] Like with the getSheetContext() functions, make other common ones, like getMessageBus() and getTabId(). At this point, should they be housed in a containing static class or exported object constant?
- [ ] Wonky formulas like `0 + 2 + 1d4 + 0 / 2` are clearly able to be simplified when reading them with human eyes. Is there a way with standard Foundry/dnd5e APIs to resolve all deterministic parts and make the formula look like `2 + 1d4`, or even better, `1d4 + 2`?


## hightouch To Do

- [ ] NPC Header subtitle - Concentration of 2 digits wraps badly, needs flex-wrap no-wrap
- [ ] kgar idea: unify unprepared spell, unidentified inventory item, and suppressed effect table row styles into a class we can place on a table row to achieve the same look and feel across any of the table rows.
- [ ] kgar question: should we apply any alt header color for the suppressed effect section?
- [ ] Non-square portraits need some CSS help: <https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues/1218#issuecomment-3067321940>
- [ ] Test Korean language on Mac
- [ ] Item sheet context menu styles - hide initial grouping line if present.
- [ ] Request from Tyler: provide performance settings in Tidy that can disable animations and other similarly taxing CSS.
  - [ ] both - identify the things that can be disabled to appreciably improve perf
  - [ ] kgar - establish client (or user) setting(s) for disabling animations, shadows, etc.
  - [ ] hightouch - make the necessary updates needed to support classes which disable animations, drop shadows, and whatever other things we can disable to increase perf.
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

- [x] ~~Refactor: If biography tab stays the same between PC and NPC after NPC is completed, consider extracting and sharing a base component that the bio tabs pass data into, to receive biography content.~~ Nah. We're ok.
- [x] NPC - unlocked - minimized - source is visible
- [x] NPC - locked - minimized - with source - source is visible
- [x] NPC Statblock Tab - Custom section - Add button - needs to apply the target custom section when creating the item


#### Legendaries Tray

- [x] NPC: Implement Legendaries Tray functionality
  - [x] Add User preference "ShowLegendaryTray" / "Show Legendary Actions trackers in Statblock tab"
  - [x] Add NPC context variable "showLegendaryTrayInStatblock" and map to preference
  - [x] Add legendaries in a flexrow format to the Statblock tab
    - [x] Apply conditional visibility
      - [x] If "context.showLegendaryTrayInStatblock",
        - [x] If locked
          - [x] If has legendaries, show
          - [x] If no legendary, hide
        - [x] If unlocked
          - [x] Show
  - [x] Ensure it is laid out and styled according to hightouch's advice

```scss
// hightouch: for now on the cards, use this style instead of the filigree
[whatever-the-selector-is] {
  background: solid var(--t5e-component-card-darker);
  border: 0.125rem solid var(--t5e-color-gold);
  border-radius: 0.1875rem;
  box-shadow: var(--t5e-drop-shadow-field);
}
```

#### Abilities Simplification Initiative

- [x] Track application position on the svelte mixin, and lock it to `_updatePosition`; this will be maintained for all use cases by app v2 <3
- [x] Feed svelte context with reactive position ref
- [x] Retrofit character.scss ability container styles to be
  - [x] .ability.ability-smaller - the smaller abilities
  - [x] .ability.ability-collapsed - the alternate view of abilities
- [x] Update the abilities component to apply `.ability-smaller` at a specific sheet position width, then `.ability-collapsed` for the smallest configuration.
  - [x] Determine what that width should be, via trial and error
  - [x] Be sure to convert hard width to rems when making our calculations
  - [x] Use a constant, multiplied by the number of visible abilities.
