## kgar To Do

### Critical Bugs and Bug-likes

- [ ] Character: show special senses in Character tab. Check NPCs as well.
- [ ] Character, NPC, Group, etc.: check units localization in languages, senses, and movement. The system units value is the key, and we have to fetch the localized abbreviation from CONFIG.DND5E.

### Group Sheet

- [ ] Group tab, Sidebar, functionality https://www.figma.com/design/seCsgsf8Uh82uxfPXIwFAg/Tidy5e-Sheet-Refresh?node-id=4425-31269&t=aVuDZVlzSI6i9QZA-4
  - [ ] Traits
    - [x] Language
      - [x] Stub the context
      - [x] Scaffold UI
      - [x] Prep the data
    - [x] Speed
      - [x] Stub the context
      - [x] Scaffold UI
      - [x] Prep the data
    - [x] Senses
      - [x] Stub the context
      - [x] Scaffold UI
      - [x] Prep the data
  - [ ] Skills
    - [x] expandable/collapsible
    - [ ] skill abbr, skill name (roll button / whatever), High, Low
      - [x] Stub the context
      - [x] Scaffold UI
      - [ ] Prep the data
  - [x] Special
    - [x] Stub the context
    - [x] Scaffold UI
    - [x] Prep the data
  - [x] Tools
    - [x] Stub the context
    - [x] Scaffold UI
    - [x] Prep the data
- [ ] Refactor: extract the standard group trait pill and share all the way down the members tab sidebar.
- [ ] Refactor: For group traits that don't have the possibility for values or units, switch from a Map to a Set and skip the redundancy.
  - [ ] Tools
  - [ ] ...?
- [ ] Group tab, Members list https://www.figma.com/design/seCsgsf8Uh82uxfPXIwFAg/Tidy5e-Sheet-Refresh?node-id=4425-31269&t=aVuDZVlzSI6i9QZA-4
  - [ ] Tidy tables
  - [ ] Column spec
  - [ ] Column components
    - [ ] GroupMemberInspiration
    - [ ] GroupActorHp
    - [ ] GroupActorHd
    - [ ] GroupActorAc
    - [ ] GroupActorDt
    - [ ] GroupActorCargo
    - [ ] GroupActorCrew
- [ ] Group Member context menu
  - [ ] View Member
  - [ ] Remove Member
  - [ ] ???
- [ ] Members tab security
  - [ ] Hide individual member stats prep and UI elements behind `canObserve` logic
- [ ] Plan the next tab 🚀

### The Short List

- [ ] NPC: (work with hightouch) Need to be able to conveniently toggle Saving Throw proficiencies rather than just using the config cog in Edit mode
- [ ] Stub group members context
- [ ] Group, Encounter: pull back all identical context prep, like inventory, to the MultiActorQuadroneContext
  - [ ] If it can be taken another step back, to Actor base prep, then we'll save a lot on code
- [ ] Prep Group description context
- [ ] Prep Bastions context
- [ ] Prep Exploration context
- [x] Character - show all sections with slots even when locked and empty. Otherwise, the player can't know their spell slots without favoriting them.
- [x] PC, NPC: Temp HP is behaving weirdly. When clicking on it, it does not capture focus. When clicking away, it does not dismiss, unless you click again and apply input focus and then blur away.
- [ ] Tools card header - has cursor hover style without interactivity
- [ ] Effects tab - Conditions - Observer permissions - conditions have interactivity styles while being disabled. Pointer cursor, some highlighting (not sure if that one is supposed to be there or not when disabled)
- [ ] Character: HD bar has a cursor pointer, but there's no interactivity related to it
- [ ] PC - Bastion tab - progress meters have a cursor pointer but are not interactive
- [ ] Extract and share: TidyTableRowUseButton
- [x] NPC test Observer user
- [ ] NPC test Limited user
- [ ] Are we able to reunite AbilityScore and AbilityScoreNPC, or are they too divergent from each other?
- [ ] Image blurriness again: https://discord.com/channels/1167985253072257115/1170003836556017755/1408567469697667082
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
- [ ] NPC: Statblock tab - include remainder of inventory items with any action economy
- [ ] NPC: Click HD to trigger a short rest (aka the only way to spend NPC HD)
- [ ] NPC: Add tools section to the sidebar if NPC sheets even supports it
- [ ] Refactor: `_preparePortraitContext` at the base actor level, providing everything that each sheet type might need.
- [ ] Show Currency "item table section" when the user has configured more than 5 currencies. https://discord.com/channels/1167985253072257115/1170003836556017755/1410735599111114876 - include a three-dots (or some other) hyperlink indicator that will scroll the item table for currency into view.

### (Almost) Everything after the short list

- [ ] `isNil(somevalue, '')` - Let me facepalm 🤦‍♂️; empty string is already nullish. Simplify any expressions that match this logic so that they leverage type coercion of boolean type inference rather than calling a function. Test each one and be paranoid about making sure they work.
- [ ] Refactor idea: Gather row actions as derived values of the sheet's own context state on the sheet class itself. See if it will reactively update based on context changes.
- [ ] Effect table rows: when effect is disabled / suppressed, use the italicized / sad styles from unprepared spells and unidentified items.
- [ ] Create attachment for inlineWidth observer so that a callback can supply the inline width for the caller to react to. We can take the width and update a stateful value that is also included in context, so that all descendents have access to the inline width.
  - [ ] Identify all resize observers which can be removed.
  - [ ] Propagate it to all locations where relevant. Namely, each instance of TabContent should track its inline width. This pays dividends.
  - [ ] Consider optimizing nested container inline width management at this time; apply spacer calculations to the final total for each level of nesting. It doesn't have to be perfect.
- [ ] disable all roll buttons when in observer or locked compendium view. Leverage the `canUse` helper. <https://discord.com/channels/@me/1243307347682529423/1397418208813650091>
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
- [ ] Wonky formulas like `0 + 2 + 1d4 + 0 / 2` are clearly able to be simplified when reading them with human eyes. Is there a way with standard Foundry/dnd5e APIs to resolve all deterministic parts and make the formula look like `2 + 1d4`, or even better, `1d4 + 2`? Update, Zhell has some input on how to simplify: https://github.com/foundryvtt/dnd5e/issues/5466#issuecomment-3211554904


## hightouch To Do


- [ ] Request from Tyler: provide performance settings in Tidy that can disable animations and other similarly taxing CSS.
  - [ ] both - identify the things that can be disabled to appreciably improve perf
  - [ ] kgar - establish client (or user) setting(s) for disabling animations, shadows, etc.
  - [ ] hightouch - make the necessary updates needed to support classes which disable animations, drop shadows, and whatever other things we can disable to increase perf.
- [ ] Item sheet sidebar background image (low)
- [ ] Make a generic roll button component
  - [ ] Fix Slot favorite roll icon not appearing
  - [x] Add Bastion facility roll icon on hover
  - [ ] Add Character tab roll icon on hover
- [ ] Sidebar.svelte - comment: hightouch, please make this nice, lol | item HP UI
- [ ] (Lower priority) Currency footer scalability - given a world script (paste it at the bottom of `main.svelte.ts` for quick testing), Tidy has trouble actually showing currency amounts when the user uses a large number of currencies. To combat this, we could potentially switch to a grid auto-fill (or auto-fit, depending on preference) column template with a min width specified. This would also require some additional attention on the inventory-footer container query for the same content. See below for sample script. Reference: https://discord.com/channels/@me/1243307347682529423/1409228016176992378


### Sample Currency Script

Paste this at the bottom of main.svelte.ts for quick testing. Ignore the TS errors, as it will still run and work:

```js
Hooks.once("init", () => {
  //Apontamento do Compendium de Itens
  delete CONFIG.DND5E.currencies.ep;
  delete CONFIG.DND5E.currencies.pp;

  //Alterando Padrão para Nox
  CONFIG.DND5E.currencies.cp.abbreviation = "NdB";
  CONFIG.DND5E.currencies.cp.icon = "modules/compendium-randc/imagens/moedas/nox-de-bronze.png";
  CONFIG.DND5E.currencies.cp.label = "Nox de Bronze";
  CONFIG.DND5E.currencies.sp.abbreviation = "NdP";
  CONFIG.DND5E.currencies.sp.icon = "modules/compendium-randc/imagens/moedas/nox-de-prata.png";
  CONFIG.DND5E.currencies.sp.label = "Nox de Prata";
  CONFIG.DND5E.currencies.gp.abbreviation = "NdO";
  CONFIG.DND5E.currencies.gp.icon = "modules/compendium-randc/imagens/moedas/nox-de-ouro.png";
  CONFIG.DND5E.currencies.gp.label = "Nox de Ouro";

  //Novas Moedas de Demacia
  CONFIG.DND5E.currencies.edo = {
    abbreviation: "EdO",
    conversion: "1",
    icon: "systems/dnd5e/icons/currency/gold.webp",
    label: "Espada de Ouro",
  };
  CONFIG.DND5E.currencies.cdp = {
    abbreviation: "CdP",
    conversion: "10",
    icon: "systems/dnd5e/icons/currency/silver.webp",
    label: "Coroa de Prata",
  };
  CONFIG.DND5E.currencies.mdb = {
    abbreviation: "MdB",
    conversion: "100",
    icon: "systems/dnd5e/icons/currency/copper.webp",
    label: "Martelo de Bronze",
  };

  //Novas Moedas de Sentina
  CONFIG.DND5E.currencies.kdo = {
    abbreviation: "KdO",
    conversion: "2",
    icon: "systems/dnd5e/icons/currency/gold.webp",
    label: "Kraken de Ouro",
  };
  CONFIG.DND5E.currencies.sdp = {
    abbreviation: "SdP",
    conversion: "20",
    icon: "systems/dnd5e/icons/currency/silver.webp",
    label: "Serpente de Prata",
  };
  CONFIG.DND5E.currencies.sdb = {
    abbreviation: "SdB",
    conversion: "200",
    icon: "systems/dnd5e/icons/currency/copper.webp",
    label: "Sardinha de Bronze",
  };

  //Novas Moedas de Piltover
  CONFIG.DND5E.currencies.hdo = {
    abbreviation: "HdO",
    conversion: "0.5",
    icon: "systems/dnd5e/icons/currency/gold.webp",
    label: "Hex de Ouro",
  };
  CONFIG.DND5E.currencies.adp = {
    abbreviation: "AdP",
    conversion: "5",
    icon: "systems/dnd5e/icons/currency/silver.webp",
    label: "Anilha de Prata",
  };
  CONFIG.DND5E.currencies.pdb = {
    abbreviation: "PdB",
    conversion: "50",
    icon: "systems/dnd5e/icons/currency/copper.webp",
    label: "Porca de Bronze",
  };

  //Novas Moedas de Shurima
  CONFIG.DND5E.currencies.sc = {
    abbreviation: "SC",
    conversion: "1.5",
    icon: "systems/dnd5e/icons/currency/gold.webp",
    label: "Securi",
  };
});
```

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

#### hightouch's to-dones

- [x] NPC Header subtitle - Concentration of 2 digits wraps badly, needs flex-wrap no-wrap
- [x] kgar idea: unify unprepared spell, unidentified inventory item, and suppressed effect table row styles into a class we can place on a table row to achieve the same look and feel across any of the table rows.
- [x] kgar question: should we apply any alt header color for the suppressed effect section?
- [x] Non-square portraits need some CSS help: <https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues/1218#issuecomment-3067321940>
- [x] Test Korean language on Mac
- [x] Item sheet context menu styles - hide initial grouping line if present.
- [x] Figure out what's up with multiclassed spellbook footer padding missing
- [x] NPC Header
  - [x] Rest buttons - when mouse down, the button borders change size and cause the buttons to shift
- [x] Light mode, collapsed view (enable Honor and Sanity)
  - [x] Init is very dark
  - [x] Ability proficiency decoration is a bit hard to notice
- [x] NPC Subtitle
  - [x] ~~Do we need to mention Classes / Subclasses?~~ **Note: Recommending no for now**
  - [x] ~~Do we need to mention Background?~~ **Note: Recommending no for now**
  - [x] Concentration button is vertically offset from the rest of the subtitle slightly
  - [x] XP width broken when wrapping in Edit Mode
- [x] NPC Sidebar
  - [x] Species section doesn't have an icon (I couldn't decide on one)
  - [x] Creature Type doesn't have an icon (I couldn't decide on one)
  - [x] Loyalty tracker doesn't have an icon (I couldn't decide on one)
  - [x] Finish styling hit die
- [x] Edit Mode
  - [x] Value input is wider than legendary trackers' value inputs. **Note: on purpose**
- [x] ~~Statblock tab~~
  - [x] ~~Section add buttons: they can only ever add a Feature to the Features section, unless we also opt to add a default Activity with action economy, which is not really a good option. I don't know if there's a solution for this, but I wanted to point the behavior out.~~
- [x] Pinned Filters
  - [x] At smallest width with sidebar open, all buttons are hidden, but the button group border itself is still visible. Wasn't sure if intentional.
  - [x] Given an NPC with a class and background and all sections collapsed, the character traits UI kinda floats a little awkwardly above the bottom of the sheet
- [x] Inventory tab
  - [x] The encumbrance bar has a cursor pointer on its label. This is the same for all meters. Is there a specific use case it should be limited to?