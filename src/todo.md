## kgar To Do

### Origin Sections Implementation

- [x] Extract any shareable table components that are needed
- [x] Prepare the data
- [x] Create new tab component that is meant to accommodate both section arrangements
- [x] Set up logic to choose between origin and action sections and hardcode to Origin for now
- [x] Fix: Sheet tab Feature sections don't have columns
- [x] Make the default order Inventory, Spellbook, Features
- [x] Ensure Action sections are handled in new character sheet tab component
- [x] Fix: Custom sections for Sheet tab should be pulling from the Action Section flag instead of the regular one
- [x] Combine items with equivalent section keys into "custom" sections with the fallback / action tab columns
- [x] Implement Search
- [x] Implement Sort button
- [x] Implement Manual Sort via drag/drop
- [x] Implement Section Config
- [x] Implement Filters
- [x] Fix: No Add buttons allowed on sheet tab sections
- [x] Fix: Nested container contents not showing when expanded in Sheet tab
- [x] Set up World setting for default Sheet tab section organization
- [x] Set up per-sheet toggle for Sheet tab section organization
- [x] Replace hardcoded Origin section setup with determined current setting, starting with sheet flag and falling back to world setting
- [ ] Fix: Sheet tab Prepared filter doesn't seem to work quite right
- [ ] Clean up: the 'custom' section type needs a constant
- [ ] Do some perf tests around how long it takes to prepare the origin sections
- [ ] Clean up the code and reduce redundancy
- [ ] Ensure manual sort is based on Sheet tab sort order (if possible)
- [ ] Refactor: can column loadouts be somehow pushed further back and simplified?
- [ ] It would be nice if we could have one ItemTable component that works for all item table use cases...
  - [ ] Differences between existing tables
    - [ ] actionSubtitle versus subtitle: expose snippets with args, where default is subtitle
    - [ ] ...
- [ ] Review with hightouch to determine next steps
- [ ] Decide how drop behaviors should work


### Short List

- [ ] Try to fold Vehicle Actions pips into the sheet pins UI.
  - [ ] Sortable with the others? Or fixed to the top?
- [ ] Possibly fix usability complaint for Loyalty Score setup: <https://discord.com/channels/@me/1243307347682529423/1451341294881341480>
- [ ] Favorite Facilities need "disabled" styles to indicate their state of disrepair
- [ ] Move attunement to the item row actions as a toggle
- [ ] Sheet Tab Configuration: "Use World Default" checkbox on the form. It basically just means `undefined` under the hood. If you do not check the box, we do not set your tabs config to `undefined`, even if it matches the world default.
  - [ ] When checked, the shuttle should be in the appropriate state that reflects the world default.
  - [ ] When making any changes to the shuttle, uncheck the box.
  - [ ] The box is calculated on load one time and is not derived.
  - [ ] Change "Use Default" button to "Use Default for All"
  - [ ] Give the same treatment ot Configure Header Controls
- [ ] For some reason, opening sheet tab configuration causes the actor's own flag data to be altered, so closing the sheet and triggering a suibmit will update the flag accordingly. Prevent document flags from being altered in memory when the dialog opens.
- [ ] Eliminate settings state rune and just use SettingsProvider. Prefer putting settings into sheet context.
- [ ] Need to refactor: Resize Observation and Column Loadout. There are so many places in a given tab where resize observers are needed for inline activities that it imposes a noticeable performance hit. Also, with every adjustment, column loadout is redone and re-ordered, which is unnecessary. Eliminate ColumnLoadout class and instead simply calculate column setup in section preparation, since that has to be done, anyway.
  - [ ] Identify all resize observers which can be removed.
  - [ ] Consider optimizing nested container inline width management at this time; apply spacer calculations to the final total for each level of nesting. It doesn't have to be perfect.
- [ ] Try revisiting the Expandable containers. Is there a more performant way that doesn't involve hooking into transition events?
- [ ] Character Sheet - Sheet tab upgrade
  - [ ] Add preference / flag: "Auto-populate Items"
  - [ ] Add preference / flag: "Organize Items by Action Economy" / "Organize Items by Origin Sections"
  - [ ] Ensure column loadout for each section is based on whether the items are of a contiguous type or of mixed company
- [ ] Implement "Auto-populate Items" unchecked
- [ ] Implement "Organize Items by Origin Sections" and alternating column loadout
- [ ] Create multi-select replacement
  - [ ] Plug into Weapon Details damage types
  - [ ] Determine where else could benefit, namely limited checkbox lists
- [ ] Facility Details - Harvest UI at bottom needs some flex layout applied to it.
- [ ] Attunement, Magical indicators: <https://discord.com/channels/@me/1243307347682529423/1422428816877420564>
- [ ] Group, Encounter: pull back all identical context prep, like inventory, to the MultiActorQuadroneContext
  - [ ] If it can be taken another step back, to Actor base prep, then we'll save a lot on code
- [ ] PC Sidebar Tab Selection - update tab styles to accommodate tab overflow or ellipses or both.
- [x] Tools card header - has cursor hover style without interactivity
- [ ] Effects tab - Conditions - Observer permissions - conditions have interactivity styles while being disabled. Pointer cursor, some highlighting (not sure if that one is supposed to be there or not when disabled)
- [ ] Character: HD bar has a cursor pointer, but there's no interactivity related to it
- [ ] PC - Bastion tab - progress meters have a cursor pointer but are not interactive
- [ ] Group Sheet - Members tab - Hover Styles and cursor pointer needed for Member name+subtitle, since it functions as a button and can open the member sheet.
- [ ] Group Sheet - Plan and task Bastions tab
  - [ ] Prep Bastions context
- [ ] Group Sheet, Members tab, Sidebar, Weapon Mastery indicators where relevant?
- [ ] Extract and share: TidyTableRowUseButton
- [x] Are we able to reunite AbilityScore and AbilityScoreNPC, or are they too divergent from each other?
- [ ] Image blurriness again: <https://discord.com/channels/1167985253072257115/1170003836556017755/1408567469697667082>
- [ ] PC and NPC Sheets
  - [x] Update class/subclass/background/species rows to View on double-click and Edit on middle-click
- [ ] NPC: Statblock tab - include remainder of inventory items with any action economy
- [ ] NPC: Click HD to trigger a short rest (aka the only way to spend NPC HD)
- [x] NPC: Add tools section to the sidebar if NPC sheets even supports it
- [ ] Refactor: `_preparePortraitContext` at the base actor level, providing everything that each sheet type might need.
- [ ] Show Currency "item table section" when the user has configured more than 5 currencies. <https://discord.com/channels/1167985253072257115/1170003836556017755/1410735599111114876> - include a three-dots (or some other) hyperlink indicator that will scroll the item table for currency into view.

### (Almost) Everything after the short list

- [ ] Stretch - Group Sheet: Enable Sorting. Curating a solution is an option. Redesigning the item filter and item sort codebases to be more generic and flexible would be a better longterm goal.
- [ ] Stretch - Group Sheet: Explore Section-wide rename for group members. The rename logic is easy. The UI decisions are a little murkier. Consider context menu on the section header, as well as a horiz 3-dots menu on sheet unlock where the add button would be.
- [ ] Stretch, post-release, Encounter sheet - when clicking "Create a Placeholder" button, show a dialog with name, subtitle, and img page with filepicker button, autofocus and select all text on load
- [ ] Stretch, post-release, Encounter sheet - Configuration to allow GMs to add more of these and specify their default images. Be able to drag onto combatants list from Encounter Sheet sidebar or click-to-add.
- [ ] Stretch/discuss, post-release, Encounter sheet, member combat tracker placeholders - I want to: sideload to sidebar, then add those sideloaded actors to the tracker at configured initiative, so they can be double-clicked to open their details and roll things
- [ ] Encounter XP bar with stops: add hook and API for passing in custom calculations. The hook should provide app and members with their quantities
- [ ] Consider adding options like opacity, blend mode, grayscaling, etc., as advanced header options to theme settings. Based on this conversation and the cool stuff people are doing with backgrounds when we untie their hands: <https://discord.com/channels/1167985253072257115/1170021717524107274/1416750794765500437>
- [ ] `isNil(somevalue, '')` - Let me facepalm 🤦‍♂️; empty string is already nullish. Simplify any expressions that match this logic so that they leverage type coercion of boolean type inference rather than calling a function. Test each one and be paranoid about making sure they work.
- [ ] Refactor idea: Gather row actions as derived values of the sheet's own context state on the sheet class itself. See if it will reactively update based on context changes.
- [ ] Effect table rows: when effect is disabled / suppressed, use the italicized / sad styles from unprepared spells and unidentified items.
- [ ] disable all roll buttons when in observer or locked compendium view. Leverage the `canUse` helper. <https://discord.com/channels/@me/1243307347682529423/1397418208813650091>
  - [ ] Fully remove the short/long rest buttons in the header
  - [ ] ...
- [ ] Suggestion: Hide the Add to Sheet Tab button when the sheet tab is hidden.
  - [ ] Actor Sheet base - add abstract function `getSelectedTabIds()`; all callers must return the effective list of selected tab IDs. If the flag is nil, then return the default tab ID list. This will side-step any need for major refactors
    - [ ] Then add `isUsingActionsTab()`, which leverages `getSelectedTabIds()` and returns whether the actions tab ID is included.
  - [ ] Container sheet contents - check for the parent actor, resolve to a temp copy of a sheet, and use `isUsingActionsTab()`
- [ ] Prepared footer macro filter:
  - [ ] If all relevant filters are unified, decorate the button as Include or Exclude
  - [ ] If the relevant filters do not all match, decorate as Off; a single click should be able to bring them all into the right state
  - [ ] Configure so left click toggles Include / Off, and right click toggles Exclude / Off.
  - [ ] When engaging the Prepared footer multi-filter, clear all others. This is a productivity filter. They can pile on manually in Advanced.
- [ ] // TODO: Create a polymorph tab ID denylist that implementing sheet classes can opt into
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
- [ ] Wonky formulas like `0 + 2 + 1d4 + 0 / 2` are clearly able to be simplified when reading them with human eyes. Is there a way with standard Foundry/dnd5e APIs to resolve all deterministic parts and make the formula look like `2 + 1d4`, or even better, `1d4 + 2`? Update, Zhell has some input on how to simplify: <https://github.com/foundryvtt/dnd5e/issues/5466#issuecomment-3211554904>
- [ ] Stretch: Sheet config Visibility tab - For each tab entry, trim away options whose value is less than the established world value. If no world visibility is set, then do not trim. (Punting for later, because this is enough complexity that I don't want to bother with it at the moment.)
- [ ] DocumentTag upgrade - show rich preview of found document
- [ ] Create DocumentTags - Support multiple tags, show rich previews of found documents
- [ ] Stretch: Update Content Registration API to allow an array of Elements during the HTML Content callback
- [ ] Add ActorEffects, ActorConditions section commands APIs
  - [ ] ConditionsAndEffects.ts - API conditions and effects commands API
- [ ] If possible, forward the parent sheet's theme to all dialogs/applications they open
- [ ] accountForExternalSections is not being used quite right. It needs to happen after any callers have updated context with their own data. How do we account for this?
- [ ] // TODO: Make the character sheet handle bastion tab check. This is violating separation of concerns.
- [ ] Inline the custom Tidy modifications for spellbook preparation; ensure modules can still add spells / sections and have Tidy perform a post-operation to backfill spell section keys / Tidy props.
- [ ] There are some layout changes to Rider effects: <https://discord.com/channels/170995199584108546/670336046164213761/1453597835550396529> ; what is Tidy doing currently, and can we do something differently?
- [ ] Vehicle Sheet 💡: Show assignments and excess crew max empty slots in item sheet sidebar, entitled "Assigned Crew {assignedCount}"

## hightouch To Do

- [ ] Request from Tyler: provide performance settings in Tidy that can disable animations and other similarly taxing CSS.
  - [ ] both - identify the things that can be disabled to appreciably improve perf
  - [ ] kgar - establish client (or user) setting(s) for disabling animations, shadows, etc.
  - [ ] hightouch - make the necessary updates needed to support classes which disable animations, drop shadows, and whatever other things we can disable to increase perf.
- [ ] Item sheet sidebar background image (low)
- [ ] Sidebar.svelte - comment: hightouch, please make this nice, lol | item HP UI
- [ ] (Lower priority) Currency footer scalability - given a world script (paste it at the bottom of `main.svelte.ts` for quick testing), Tidy has trouble actually showing currency amounts when the user uses a large number of currencies. To combat this, we could potentially switch to a grid auto-fill (or auto-fit, depending on preference) column template with a min width specified. This would also require some additional attention on the inventory-footer container query for the same content. See below for sample script. Reference: <https://discord.com/channels/@me/1243307347682529423/1409228016176992378>

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

## To Do Graveyard

- [x] Review and refine empty states on the Statblock tab
  - [x] Weapons do not have an empty state.
  - [x] Equipment empty state says it pulls from the compendium browser but instead creates an item. It would be more familiar if it just claimed to create an item.
    - [x] Additionally, it presents the full Add Item dialog instead of just fast-forwarding creation to a correctly-configured Equipment vehicle item.
  - [x] Features do no have an empty state.
- [x] Draft Animals need their own columns. The default sheets fixate on creature size and carrying capacity.
