## kgar To Do

### The Short List


- [ ] Uses - Dragon's Fire Breath, should show recharge roller when empty.
- [ ] (Stretch) **Theme Settings**: Live update while the dialog is open - depending on performance, this could use the theme-changed hook and pass in a temp themesettings object. When this theme setting is provided, use it to apply theming rather than looking up theming, selectively overriding world, parent, or current document's theme settings.
  - This is easy with the stylesheet / CSS Rules API, I would think.
  - [ ] Sheet
  - [ ] World
- [ ] (Stretch) **Theme Settings**: Import/Export theme settings (will have a version stamp for these so that migrations can occur when the model changes in breaking ways); can go in the header menu for this particular application 🚀🧑‍🚀
- [ ] Refactor: As feasible, where able, start pivoting from Objects to Maps. It's apparently more performant.
- [ ] Wiki: document tab registration and show off Mestre Mahakala's final product as an example of interacting with external data sources and making a very unique tab. https://discord.com/channels/@me/1243307347682529423/1388371150291210290
- [ ] Journal Migration - Allow for migrating classic Tidy journal entries into the Quadrone flag space. No replacement option. Just additive. Delete option should be there, and it's on the user if they decide to delete their old journal entries.
- [ ] // TODO: This is some duplication with the Character sheet context prep. Find a way to share responsibly.
- [ ] Special Traits - (still planning) tell the user whether there's an active effect modifying the value of a given special trait. 
- [ ] On first load after Tidy 5e is activated, provide instructions on how to change sheets to Tidy, with potentially a link to the Wiki. https://discord.com/channels/1167985253072257115/1383159779253555272/1383161370186485882
- [ ] Implement Responsive Tab Strip


### (Almost) Everything after the short list

- [ ] Refactor: consider combining the actor sheet runtimes into a single collective like Item Sheet Runtime. Then, consider extracting a common base class 🔥.
- [ ] Scaffold the NPC Sheet
- [ ] Set up NPC Sheet Tab Selection
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
- [ ] SortingListbox - add touch support for drag and drop, if possible; and if it works out, remove the arrow buttons.
- [ ] Resolve TODO -  // TODO: Make this a callback to send through to the component for preparing sections properly
- [ ] Effect Summary eagerly refreshes. Add suppression to HTML enrichment to only when the effect summary is shown.
- [ ] Additional Document header option: Context Menu Options (literally show the context menu options)
- [ ] Ensure all item sheets enforce this Unidentified UI feature:
    - [ ] (Non-container sheets only) Sidebar sections all hidden except Sections section and pill switches
- [x] Add background circle hover style to section row buttons
- [x] Always track and ensure that `currentTabId` is correct on the sheet. Use a getter/setter, and under the hood, use a stateful object. Make "change tab" function available and have it trigger rerenders.
- [x] Editor style needs CSS help: https://discord.com/channels/1167985253072257115/1169792539545587733/1362188451910258869
- [ ] Make inline activities draggable / droppable within the scope of an item table row / summary
- [ ] Create constants for all known filters. For those that are generated, provide a global filter name  provider function that takes a value (source class, for example) and churns out the appropriate name ('source-class-warlock'). Update the runtime and all those using hardcoded filter names (Spellbook Footer).
- [ ] (stretch) Implement generic width / priority observer feature that can be used to control pinned filter visibility generically and then be used for other purposes later.
  - [ ] Propagate this to all action bars
- [ ] Evolve ItemLists further
  - 💡 It is still for Items only, which should keep things simple with itemContext usage.
  - Extract the Tidy Table rendering components for churning out columns from column specs. This functionality will be reused for Effects and Activity tables.
- [ ] `_onDropItem` - observe how Foundry core does this in V13. _onDropItem is provided with the full item on the Foundry side. Why are we doing our own thing? Can it be avoided? If not, then do that Foundry is doing. Copy how dnd5e is handling `_onDrop`, and this will enable you to then rely on Foundry core's `_onDropDocument`, which will provide the document instance for you.
- [ ] Figure out where to put power tools like "Assign Spells to Source Classes"
- [ ] Add sheet parts everywhere. Make this easy for the user who wants to mod this.
- [ ] (lowest priority: the system should probably work this out first) Figure out: can get it so I can add Artisan's tools ("art") to Favorites? It represents all Artisan's Tools.
- [ ] (PC: Feature tab) Implement alternate section groupings - https://discord.com/channels/1167985253072257115/1170021717524107274/1382889612959158355 | include toggle option as sheet flag in tab settings
- [ ] Bastion tab idea: Include an actual Add button in addition to the Compendium button. People should be allowed to add a new Bastion directly to a sheet.
- [ ] Bastion tab: Disabled facilities are completely nonresponsive even to a GM. It seems like at least the GM should be able to fix an accidentally broken facility. The Foundry / dnd5e way has been "if you own the sheet, you can do whatever you want to the sheet," so this particular feature as it currently exists sort of contradicts that philosophy.
- [ ] Discuss: new Action List option: "Require Item to be Equipped for Cast Activity Spells" - would have an explanation detailing that this requirement is in addition to the standard Attunement requirements | https://discord.com/channels/1167985253072257115/1169792539545587733/1384379958801076255
- [ ] // TODO: Consider deferring enrichment to tab rendering, so tab selection can preclude it.
- [ ] Refactor: Simplify DEFAULT_OPTIONS management now that option inheritance works and `visible()` callback is officially supported.
- [ ] Research: Leveraging Foundry data models to validate, clean up, and control my flag data; and what about new user settings?
- [ ] (Stretch) Advanced Settings Section - do you know what specific CSS variable alterations you want to make to Tidy? Put 'em here. An array of 0 to many direct variable overrides. If someone goes real deep into Tidy and wants to submit some community theme JSON, they may do so.
- [ ] (Stretch) **Theming**: Community Theme submissions - they'll go in a dedicated folder in github and, with an active internet connection, can be pulled directly from within Foundry
- [ ] (Stretch) **Theme Settings**: Saved Themes in campaign world - be able to create multiple themes and save them to the game world for all to enjoy
- [ ] Refactor: Journal flag management is too complex. It needs to be extracted to a Tidy Journal controller class to keep the Tidy Flags layer as a simple data access layer.
- [ ] **Theme Settings**: Add support for Item Sidebar Width?
- [ ] Item cards
  - [ ] ~~Implement a shared portal for item cards. All attached item cards will use the one portal anchor. This is so the card can live outside the sheet's overflow hiding window content, so we don't have to worry about compromising design.~~ Can item cards leverage a shared dialog component so they can ignore overflow?
  - [ ] Have item cards be targeted via `.tidy5e-sheet.classic....` etc.
  - [ ] Test spell info on item summary and cards
  - [x] ~~For fun, test with PopOut!~~
- [ ] add a class to section headers when there are no search results `.search-no-results`
- [ ] Tab setting (or possibly User setting / preference?): initialize all sections as closed. Moto Moto request. https://discord.com/channels/915186263609454632/1107447125073199154/1379850522407735306
- [x] Swap left and right areas in tab selection (left = selected, right = hidden)
- [ ] **Theme Settings**: Verbally distinguish between "Actor Header Background" and "Item Sidebar Background". Add support for Item Sidebar Background.

### Module Compatibility

- [ ] DDB Importer - create and submit PR to support DDBI button or header menu across all relevant sheets.
- [ ] So Inspired! - add API for globally overriding inspiration tracking. Require 
- [ ] Drakkenheim Corruption tab: support it in Quadrone
- [ ] Figure out how to fix portrait drop shadows due to the header overflow being hidden.
- [ ] Check that the theming is using --t5e-theme-color-default: oklch(from #ff74c5 40% 35% h);
- [ ] Search for module authors that integrate with Tidy Special Traits and make sure they're taken care of.


## hightouch To Do

- [x] Character tab; responsively move the right side below the left side after a certain threshold so that character traits aren't squashed.
- [x] (hightouch) TidyItemSummary - can use `.titleCase()` for strings.
- [x] Review Character Sheet Limited View
- [ ] (not ready yet) Review Item Sheet Limited View. Only needs hide activity icon, everything else seems to match default sheets.
- [x] Review Container Sheet Limited View. I think this is good and already 1:1 with default sheets.
- [x] Quadrone Item Images are somehow more pixellated than others: https://discord.com/channels/1167985253072257115/1170003836556017755/1387894528576454806
- [x] Fix Action Bar actions button group collapse behavior so that search isn't out of space.
- [ ] Reorganize responsive view of Character tab when sidebar is open (Skills top left, Tools/abilities top right, Features below)
- [ ] Review context menu and see if there's anything else needed: missing options, weird configurations, style adjustments, whatever you notice.
- [ ] Request from Tyler: provide performance settings in Tidy that can disable animations and other similarly taxing CSS.
- [ ] Check the Configure Homebrew dialog. I'm using the standard foundry form classes, and our checkboxes are squashed up on the labels. I know Foundry's default is for `.form-field` to have `align-items: flex-end` or the like. Would that work for us? Or perhaps some other option.
- [ ] Favorites - there are scrollbars on title and subtitle
- [ ] Character Sheet - Light Mode - Bastion tab - progress text is very dark against a dark bar.
- [ ] Character Sheet - Spellbook tab - Spellbook Settings cog on action bar - the configuration options need some help.


### Post-Beta Stretch Goals

- [ ] Compact Sheet - take the current sheet and apply compacting styles to it and offer as a User setting.
- [ ] High Contrast support - add theming changes to support Foundry's high contrast settings.
- [ ] Increased Mobile/Tablet support.

### Feature Origin dropdown notes

From `BrutalityScript.js`

```js
  Hooks.on("renderItemSheet5e", (app, [html]) => {
    const actor = app.object.parent;
    if (!actor) return;
    if (app.object.type !== "feat") return;
    const current = app.object?.getFlag("dnd5e", "advancementOrigin");
    const choices = actor.items.reduce((acc, i) => {
      if (!i.system.advancement) return acc;
      acc.push({ value: i.id,
        label: app.object.parent.items.get(i.id).name,
        group: game.i18n.localize(`TYPES.Item.${i.type}`)
      });
      return acc;
    }, []);
    const origins = HandlebarsHelpers.selectOptions(choices, {hash: {selected: current, sort: true}});
    const origin = `
      <div class="form-group">
        <label>Feature Origin</label>
        <select name="flags.dnd5e.advancementOrigin">
          <option></option>
          ${origins}
        </select>
      </div>
    `
    const type = html.querySelector('.form-group:has(select[name="system.type.subtype"])') ??
                 html.querySelector('.form-group:has(select[name="system.type.value"])');
    type.insertAdjacentHTML("afterend", origin);
  });
```

From Alakshana's Feature Origin module:

```js
class FeatureOrigin {

  static init() {
    Hooks.on("renderItemSheet5e", FeatureOrigin._advancementOrigin);
  }

  static _advancementOrigin(app, [html]) {
    const actor = app.actor;
    if (!actor) return;
    if (app.object.type !== "feat" || app.object?.getFlag("dnd5e", "advancementOrigin")?.includes(".")) return;
    const current = app.object?.getFlag("dnd5e", "advancementOrigin");
    const choices = actor.items.reduce((acc, i) => {
      if (!i.system.advancement) return acc;
      acc.push({
        value: i.id,
        label: app.object.parent.items.get(i.id).name,
        group: game.i18n.localize(`TYPES.Item.${i.type}`)
      });
      return acc;
    }, []).sort((a, b) => a.group.localeCompare(b.group));
    const origins = HandlebarsHelpers.selectOptions(choices, { hash: { selected: current, sort: true } });
    const origin = `
      <div class="form-group">
        <label>${game.i18n.localize("FEATUREORIGIN.Label")}</label>
        <div class="form-fields">
          <select name="flags.dnd5e.advancementOrigin">
            <option></option>
            ${origins}
          </select>
        </div>
      </div>
    `;
    const type = html.querySelector('.form-group:has(select[name="system.type.subtype"])') ??
      html.querySelector('.form-group:has(select[name="system.type.value"])');
    type.insertAdjacentHTML("afterend", origin);
  }
}

Hooks.once("init", FeatureOrigin.init);
```

### Feature - Set as Inspiration Source

**Inspired by items**. New Context Menu option "Set as Inspiration Source" available on character sheet for any item with limited uses. When selected, the actor is flagged with the item uuid. When preparing the inspo tracker, if there's a valid, owned item in the flag setting which has limited uses, then switch from the boolean inspiration tracker to the banked inspiration tracker. This is a glorified pin.

**Tidy API Ready**. Provide API support for someone to specify their own banked inspiration. They must provide callbacks for value, max, and onChange. When an API inspiration bank is registered, it overrides all other options. onChange should make it easy to understand whether the value increased or decreased.

**Hooked up**. Whenever we increment or decrement banked inspiration, fire off a hook "tidy5e-sheet.inspirationChanged" with sheet, actor, and object with old and new values. If we're working with a registered inspiration item, then decrementing triggers item use.
Likewise, fire a hook to see if we're permitted to change inspo, like "tidy5e-sheet.inspirationChanging" with same args, which will cancel the inspiration change event if so deemed by return value on Hook call.


### Deferred tasks from last item batch review

OK I think I found one thing on features. Recharge recovery only shows if it's the first recovery option
https://discord.com/channels/@me/1243307347682529423/1362996587584028683
> This one is hard to reason about. The standard UI doesn't provide recharge info for non-first recharge recoveries. I'd like to think this over some more.

OK then tattoos the one thing I see is that some of the tattoos like the Absorbing tattoos have Reaction-based abilities. But the sidebar is looking for a defined value
https://discord.com/channels/@me/1243307347682529423/1363003038482038836
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

https://discord.com/channels/@me/1243307347682529423/1353196795378929754

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
  - [ ] Info / Suppression UI https://discord.com/channels/@me/1243307347682529423/1351751313515479131
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

- [x] Fix weird minimize/maximize header text behavior. reference: https://discord.com/channels/@me/1243307347682529423/1357922036454002890
- [X] **Character**: Set as Inspiration Source (see below)
  - [x] Add context prop for information source
  - [x] Update inspiration badge with functionality
  - [x] Set up flag-based owned-item inspiration source in character sheet context prep
  - [x] Add context menu options, Feats with max uses only, "Set as Inspiration Source", "Remove as Inspiration Source"
  - [x] Add Tidy API space for setting external inspiration source
  - [x] Update context prep to favor an API-provided source over an owned item source.
  - [x] If API override in place, don't show context menu options for inspiration source.
- [x] Add homebrew settings menu with localization keys.
- [x] Add World settings for banked inspiration and show in homebrew dialog.
- [x] Context Menu items rework
- [x] Additional Spells - make Prepare button instead be Activity cog.
- [x] bug: on sheet reopen, your last tab successfully is shown, but the currentTabId is reset to the first tab, "actions". So if you make a change or toggle the play mode, it'll throw you to the first tab.
- [x] Make Special Traits app
- [x] Add more theme settings - Actor Portrait Shape
  - [x] Include in World Settings and Sheet-specific Settings
  - [x] Only show for "Actor" documents, "character" and "npc"
  - [x] Wire up portrait switcher button to the sheet-specific version of the setting
- [x]  simplify sorting so that longpress/right-click opens a list of sort options, and simply clicking on the button cycles forward through the various sorts; 
- [x] User Preference: Item Spells Organization - ( ) Additional Spells Section ( ) Section Per Item
- [x] Slice up character.scss into smaller stylesheets
- [x] PC Sheet, Character tab, Species and Background do not refresh when their items change.
- [x] Sheet tab: need Inventory filters in advanced filter section
- [x] `window-title` shows the character name while the sheet is closing. It's noticeable enough to look like a mistake.
