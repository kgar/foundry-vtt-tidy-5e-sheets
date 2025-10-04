## kgar To Do

### Short List

- [x] PC Sidebar Tab Selection - implement POC
- [ ] PC Sidebar Tab Selection - use custom title "Tab Selection: Player Character Sidebar"
- [ ] PC Sidebar Tab Selection - create runtime
- [ ] PC Sidebar Tab Selection - prepare within PC context prep
- [ ] PC Sidebar Tab Selection - create API surface area
- [ ] PC Sidebar Tab Selection - update tab styles to accommodate tab overflow or ellipses or both.
- [ ] Resurrect Attribute Pins as Sheet Pins
  - [ ] Character sheet
  - [ ] NPC sheet

### Group Sheet

- [ ] Group Sheet - Members tab - Hover Styles and cursor pointer needed for Member name+subtitle, since it functions as a button and can open the member sheet.
- [ ] Group Sheet - Plan and task Bastions tab
- [ ] Group Sheet, Members tab, Sidebar, Weapon Mastery indicators where relevant?

### Character Sheet

- [ ] Character sheet, Character tab : Need weapon mastery indicators on weapon proficiencies

### The Short List

- [ ] NPC: (work with hightouch) Need to be able to conveniently toggle Saving Throw proficiencies rather than just using the config cog in Edit mode
- [ ] Group, Encounter: pull back all identical context prep, like inventory, to the MultiActorQuadroneContext
  - [ ] If it can be taken another step back, to Actor base prep, then we'll save a lot on code
- [ ] Prep Bastions context
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

- [ ] Stretch, post-release, Encounter sheet - when clicking "Create a Placeholder" button, show a dialog with name, subtitle, and img page with filepicker button, autofocus and select all text on load
- [ ] Stretch, post-release, Encounter sheet - Configuration to allow GMs to add more of these and specify their default images. Be able to drag onto combatants list from Encounter Sheet sidebar or click-to-add.
- [ ] Stretch/discuss, post-release, Encounter sheet, member combat tracker placeholders - I want to: sideload to sidebar, then add those sideloaded actors to the tracker at configured initiative, so they can be double-clicked to open their details and roll things
- [ ] Encounter XP bar with stops: add hook and API for passing in custom calculations. The hook should provide app and members with their quantities
- [ ] Consider adding options like opacity, blend mode, grayscaling, etc., as advanced header options to theme settings. Based on this conversation and the cool stuff people are doing with backgrounds when we untie their hands: https://discord.com/channels/1167985253072257115/1170021717524107274/1416750794765500437
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

## Notes on combat integration:

- We can create an encounter if one doesn't exist, upon loading combatants
- To add placeholders, we can either enter unlinked placeholders directly, including initiative, name, and img (maybe more), or we can do same thing that "Place Members" does. "Place Members" puts copies of the compendium actors into the top-level of the sidebar before allowing placing them on the screen. It apparently has logic to detect whether there are suitable actors on the sidebar, so it doesn't happen every time.
- We will have to track those row action states directly on the Encounter via flag because locked compendium actors are not editable, meaning it's not viable to track flags on some but not all. That's not bad. But, what are the default states when a member has not been configured by the user? 
- I'll want to figure out all the edge cases for these buttons and row states, since this will be dealing with the Current Encounter, and the user can change scenes and/or Encounters. There's also the wrinkle of trying to ensure all open Encounter sheets are watching combat tracker activity via hooks. What hooks to track will be an implementation detail, but we essentially want to update our row states when a placeholder leaves the tracker, for example.
- Love the Lair row (https://discord.com/channels/@me/1243307347682529423/1416763464403255336). Again, we can either load a totally anonymous placeholder with whatever img, name, and initiative we want, or we can load the relevant Lair actor into that spot. In fact, it might be beneficial to show multiple Lair entries so that all lair NPCs are accounted for.

From `actor.mjs`:

```js
// Obtain (or create) a combat encounter
let combat = game.combat;
if ( !combat ) {
    if ( game.user.isGM && canvas.scene ) {
    const cls = getDocumentClass("Combat");
    combat = await cls.create({scene: canvas.scene.id, active: true});
    }
    else {
    ui.notifications.warn("COMBAT.NoneActive", {localize: true});
    return null;
    }
}

// Create new combatants
if ( createCombatants ) {
    const tokens = this.getActiveTokens();
    const toCreate = [];
    if ( tokens.length ) {
    for ( const t of tokens ) {
        if ( t.inCombat ) continue;
        toCreate.push({tokenId: t.id, sceneId: t.scene.id, actorId: this.id, hidden: t.document.hidden});
    }
    } else toCreate.push({actorId: this.id, hidden: false});
    await combat.createEmbeddedDocuments("Combatant", toCreate);
}
```

Experimentation:
```js
// Completely actorless / tokenless combatant, with prerolled initiative, name, and img:
game.combat.createEmbeddedDocuments("Combatant", [{ name: "Fred", img: 'systems/dnd5e/tokens/heroes/ClericDragonborn.webp', initiative: 20}]);
```

Hooks:
TODO


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

- [x] Stub group members context
- [x] Prep Group description context
- [x] ~~Prep Exploration context~~ Shelved.
- [x] Character - show all sections with slots even when locked and empty. Otherwise, the player can't know their spell slots without favoriting them.
- [x] PC, NPC: Temp HP is behaving weirdly. When clicking on it, it does not capture focus. When clicking away, it does not dismiss, unless you click again and apply input focus and then blur away.
- [x] Group sheet - Members tab - Set up column hiding 
- [x] ~~Group Sheet - Inventory tab - Should we have hover styles on the member names?~~ Nah, there's feedback there already.
- [x] Confirm the big picture requirements
- [x] Scaffold encounter sheet tabs
- [x] Get the encounter inventory fully functional
- [x] Get the encounter description tab fully functional
- [x] Scaffold the encounter member context
- [x] Encounter subtitle
  - [x] Row 1
    - [x] Creature Type Count row
  - [x] Row 2
    - [x] Members count (assuming member quantities sum)
    - [x] XP
    - [x] GP summary
- [x] Encounter header layout change
  - [x] Left: name, subtitles, button bar
  - [x] Right: difficulty badge
  - [x] Encounter Sidebar
    - [x] Languages
    - [x] Speeds
    - [x] Senses
    - [x] skills 
    - [x] Specials
- [x] Encounter Members tab
  - [x] Member list 
    - [x] locked
      - [x] Member primary column
      - [x] CR
      - [x] Quantity
      - [x] HP
        - [x] Include "Roll HP" button on hover
      - [x] XP
      - [x] Member row actions
        - [x] In header: add button opens compendium browser for NPCs only
    - [x] unlocked
      - [x] Swap HP with editable Formula column
- [x] Members context menu for Encounter sheet
- [X] Make Formula column a lower-priority, always-shown column
- [x] Encounter Members tab: Wire up XP bar with stops
- [x] Combat tab
  - [x] Implement Placeholder Members
    - [x] Flag, `placeholders`, which is `Record<string, { initiative: number, note: string, img: string }>`
    - [x] All columns except Initiative should take up space but not present anything for placeholder rows
    - [X] Implement Initiative handling for placeholders
      - [x] Input
    - [x] Portrait
    - [x] PlaceholderName component
      - [x] Unlocked - Editable title and editable subtitle
  - [x] Order combatants by initiative, then by name
  - [x] Section title - change name to "Combatants" with a count that equals the non-placeholder members
  - [x] "Add a Placeholder" button
    - [x] Relocalize to "Create a Placeholder Member"
    - [x] Add a Placeholder Member to the placeholders flag with a default mystery man face and the name "New Placeholder"
  - [x] "Add All as Placeholders" button
    - [x] Take all members and placeholders and add them to the encounter tracker
      - [x] Members: 
        - [x] I can sooner: add directly as placeholders with img, name, and tracked resource at configured initiative
      - [x] Placeholders: add directly to tracker at configured initiative
  - [X] ~~"Add to Active Encounter" ~~ Abandoned. Well-supported by Foundry. Don't bother. Doesn't add enough value.
    - [x] ~~Relocalize to "Add All Tokens to Encounter" button and move up to just after "Add All as Placeholders"~~
    - [x] ~~Disable when there is no active encounter~~ A notification warning is more instructive.
    - [x] ~~Find all tokens on the current scene who are represented by the encounter sheet, ensure they are added to initiative. There's existing dnd5e / Foundry code that does this. Steal or somehow hook into that 🔥~~
  - [x] "Preroll Initiative" button
- [x] Encounter sheet: Set up tab selection
- [x] Refactor: Consolidate all combat options to a single model and make that the flag. Likewise, put all combat settings into a combat prop on the Member and Placeholder contexts.
- [x] Refactor: ensure all encounter combat data flag updates also trim away nonexistent members/placeholders every time there's an update.
- [x] (hightouch got it) Stretch, post-release, Encounter sheet - quick access placeholders that are commonly known in D&D, such as Lair. 
- [x] Encounter Sheet, Combat tab, unlocked - on placeholder portrait click, open FilePicker with the intent of updating img on the relevant placeholder
- [x] Stretch/discuss, post-release, Encounter sheet - Dropdown or other selector to allow choosing Difficulty target. That is, Primary Party Name Here is chosen by default, but you can calculate difficulty against other groups.
- [x] Group Members should not inherit Token view setting from Group/Encounter sheets.
- [x] Character Inventory Add button reported broken
- [x] Include Encounter Sheet in the "Set Default Sheets" tidy page.
- [x] Fixed: Special Traits dialog has no padding.
- [x] Important NPCs: features and weapons in statblock tab
- [x] Non-important NPCs: all items in statblock tab
- [x] When an inventory item is deemed passive, put it in the "items" section.
- [x] NPC User Preference - "Show Legendary/Lair trackers in the Statblock tab" - default true
- [x] NPC User Preference - "Include Spellbook sections in the Statblock tab" - default true
- [x] Ensure that these settings can be disabled from the individual sheet level.
- [x] Ensure the unset individual sheet level loads properly based default settings.
- [x] Find a place to put these settings.