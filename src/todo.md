## Theme Settings To Do

- [x] Set up ThemeSetting types
- [x] Add Tidy Flag
- [x] Add World Setting
- [x] Set up sheets to apply theme colors when applying overall dark/light classes
- [x] Set up ThemeSettings application, designed to save either to a sheet flag or to World settings (probably the presence of a document will decide it)
  - [x] Colors
    - [X] Accent Color
    - [x] Rarity Colors
    - [x] DDBeyond Rarity Color Saturation (for SagaTympana)
    - [x] Spell Preparation Mode Colors
  - [x] Other things
    - [x] Header Background
  - [x] Refine
    - [x] Use Coloris setup and recreate the ThemeSettingColorArticle as ThemeSettingColorFormGroup, with a configured clear button. ~~Possibly stack the form group as well~~, since hsla and similar values are lengthy.
- [x] Implement Rarity Color saturation`
- [x] Update all Tidy sheets when theme changes. Use a custom hook. Pass in document UUID; when present, subscribers will only deal with their own document or an updated parent.
- [x] Add style for form group label swatch.
- [x] Change the approach from setting CSS variable properties on the form tag to instead managing sheet styles in a dedicated style tag.
  - [x] Implement function that turns settings into CSS rules
    - Create delcarations with rule sets; bucket as many rules as possible by theme setting key.
    - Uniquely tag declarations via their requisite setting in an empty CSS variable, a la
      - `.tidy5e-sheet.application.quadrone { --tidy5e-world-theme-setting-accentColor: ; /* other styles here */ }`
        - This tells me I'm dealing with a world theme setting, accentColor. As many styles as I need can be included in this declaration. If additional selectors are needed for other purposes (saturation, table headers, for example), then additional declarations are added, tagged the same, so they all can be refreshed together.
  - [x] Setup - on settings init, establish style tag and set up with world styles
  - [x] World
    - [x] init: when establishing the style tag, generate these settings and add them to the style tag
    - [x] refresh: on change, purge-restore styles; this should use the on change handler in settings
  - [x] Sheet
    - [x] init: on first render, during pre-render, establish own styles
    - [x] refresh: on theme settings change hook, determine if relevant to self, and if so, purge-restore styles
- [x] // TODO: Convert Rarity Colors and Spell Prep Mode Colors to objects so they save smaller and merge easier.
  - [x] Change types
  - [x] Change save/load functions in Theme Quad
  - [x] Change up theme settings form
  - [x] Change up functions for preparing styles
  - [x] Change up parent style inheritance feature now that it's easy; just merge.
- [x] Set up parent style inheritance for child sheets (Item sheets).
- [x] Support theming for related document dialogs and config applications that may have a document property.
- [x] Test and fix errors related to missing theme setting data.
- [x] (Refactor) Have the world theming placed in a style tag in the head, rather than reapplied over and over to every sheet before sheet-specific upgrades
- [x] (Research) TGCE Restyler has a ton of customization potential. What things can be reuse responsibly? Being able to customize every single thing would be a second module unto itself. I don't have the bandwidth for that. https://github.com/Carpathias/tgce-restyler-5e3?tab=readme-ov-file
- [x] ~~(Stretch) Make coloris input select on focus~~ Side-stepping this by separating the main color input from the hidden Coloris input was a better alternative.
- [x] // TODO: Pop a confirmation before committing to this.
- [x] Establish dynamic styles for custom rarity colors and spell prep modes.
- [x] Refactor: upgrade the params for `ThemeQuadrone.applyCurrentThemeSettingsToStylesheet` to be an options object that is universal to all operations in the tree of functions used for applying themes. 
- [ ] Refactor: Break up `theme-quadrone.svelte.ts` - the style generation code could live in its file, etc.
- [ ] Refactor: The hook subscription to respond to document-related theme changes is duplicated across multiple locations. Extract and share from the theme-quadrone file or related files.


### Restyler Module Notes

The TGCE Restyler module takes this approach:

- Manage CSS Rules directly in dnd5e.css
  - Insert any rules on sheet render when missing
  - Insert/Update any rules for a target sheet while making changes to the customizer app
- Data model: 
  - `actor.flags['tgce-restyler-5e3'].cssText`
  - `actor.flags['tgce-restyler-5e3'].elements`
  - It can loop over cssText entries and simply insert-when-not-present on the dnd5e.css file
    - This seems like an optimization to reduce processing when rendering the actor sheet. This can be trivially mitigated by using First Render and then responding to themeSettingChanged hooks on the Tidy side. Storing this seems like a mistake, at least for Tidy.
  - It then uses the `elements` object to present the relevant form data in the customizer.
    - For dynamically expandable fields like Rarity Colors and Spell Prep Modes, I can't enjoy this directness.
    - For all other colors, sure.
    - Maybe a good update for Tidy would be to use regular values like `accentColor` on the theme settings flag, instead of dumping it into the colors array. Likewise, perhaps Rarity and Spell Prep modes should store as separate color arrays instead of going into the same bucket. We can simply combine all the colors and styles in the most appropriate way for theme color style management at the time they are needed, which will reduce some complexity of the code. With that said, we should continue to keep a bucket of advanced variable assignments / direct selector and rule assignments so that users can make extremely customized approaches.

Note the approaches to inserting styles when they don't exist yet, creating or updating CSS Rules, and **removing properties or rules**.

```js
Hooks.on("renderActorSheet5eCharacter2", function(object) {   
    debugLog('green', `Inside Hook:renderActorSheet5eCharacter2 >> Actor: ${object.actor._id}`);    
    const myStyleSheet = Array.from(document.styleSheets).find((e) => e?.href?.includes(CSS_HREF));
    if (game.actors.get(object.actor._id).flags['tgce-restyler-5e3']?.cssText !== undefined){
        debugLog('cyan', `- CSS Rules found in flags for actor ${object.actor._id}`);    
        debugLog('cyan', `- Checking ${myStyleSheet.href} for rules needing added... `);    
        Object.entries(game.actors.get(object.actor._id).flags['tgce-restyler-5e3'].cssText).forEach((e) => {
            if(!Array.from(myStyleSheet.cssRules).find((s) => s.selectorText == e[0].replaceAll('&','.'))){
                myStyleSheet.insertRule(e[0].replaceAll('&','.')+" "+e[1]);
                debugLog('cyan', `- CSS rule created: ${e[0].replaceAll('&','.')+" "+e[1]}`);
            }             
        });
    } else {
        debugLog('yellow', `- CSS Rules NOT found in flags for actor ${object.actor._id}`);    
    }
});

//* CSS Rule Creator/Updater(add/modify property)
function createOrUpdateCssRule(selector, property, value) {
    debugLog('green', `Inside Function: createOrUpdateCssRule()`)
    const myStyleSheet = Array.from(document.styleSheets).find((e) => e?.href?.includes(CSS_HREF));    
    const currentCssRule = Array.from(myStyleSheet.cssRules).find((e) => e?.selectorText === selector);
    if (currentCssRule){
        debugLog('cyan', `- CSS Rule Found! Updating CSS Rule...`);
        if (property.includes('--')) {
            currentCssRule.style.setProperty(property, value);
        } else {
            currentCssRule.style[property] = value;
        }
    } else {
        debugLog('cyan', `- CSS Rule Not found! Creating CSS Rule...`);
        myStyleSheet.insertRule(`${selector} { ${property}: ${value}}`);
    }
}

function removePropertyOrRule(selector, property, value) {
    debugLog('green', `Inside Function: removePropertyOrRule()`)
    const myStyleSheet = Array.from(document.styleSheets).find((e) => e?.href?.includes(CSS_HREF));    
    let currentCssRule = Array.from(myStyleSheet.cssRules).find((e) => e?.selectorText === selector);
    if (currentCssRule) {
        if (currentCssRule.style.length <= 1) {
            debugLog('cyan', `- Last rule property, removing rule>> ${selector}`);
            myStyleSheet.deleteRule(Array.from(myStyleSheet.cssRules).findIndex((e) => e?.selectorText == selector));
        } else {
            debugLog('cyan', `- Removing Property>> ${property}: ${value}`);
            currentCssRule.style.removeProperty(property);
        }
    }
}
```

Sample JSON of flag data:
```json
{
    "cssText": {
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &sheet-body &sidebar &card &stats &top &ac": "{ background: url(\"../../../modules/tgce-restyler-5e3/assets/alt-badge2.png\") center center / contain no-repeat transparent; width: 60.5px; height: 60.5px; }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &sheet-header > &right &level": "{ background: url(\"../../../modules/tgce-restyler-5e3/assets/alt-badge2.png\") center center / contain no-repeat transparent; }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2 &window-content": "{ background: rgb(13, 13, 13); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &sheet-header": "{ background-image: url(\"../../../modules/tgce-restyler-5e3/assets/sheet-banner-onegod.png\"); filter: hue-rotate(130deg); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &sheet-body": "{ background-image: url(\"../../../modules/tgce-restyler-5e3/assets/transparent.png\"); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &sheet-body &sidebar &card &meter&hit-dice&progress::before": "{ background: linear-gradient(to right, rgb(64, 31, 37), rgb(255, 0, 47)); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &sheet-body &sidebar &card &meter&hit-points &progress::before": "{ background: linear-gradient(to right, rgb(27, 75, 41), rgb(15, 41, 23)); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &sheet-body &sidebar &card &stats &lozenges &lozenge": "{ background: url(\"../../../modules/tgce-restyler-5e3/assets/alt-lozenge.png\") center top / contain no-repeat transparent; transform: scale(1.05); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character": "{ transform: scale(0.97); filter: hue-rotate(77deg); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &tab&biography&active &bottom &icon > dnd5e-icon": "{ --icon-fill: #e1c019; }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &content-link > i": "{ color: rgb(225, 192, 25); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &tab&biography &characteristics label &value": "{ border-bottom: 1px solid rgb(225, 192, 25); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &tab&biography&active": "{ color: rgb(225, 192, 25); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &content-link": "{ background: rgb(153, 56, 56); border: 1px solid rgb(225, 192, 25); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2 &card &header": "{ background: linear-gradient(to right, rgb(0, 0, 0), rgb(37, 27, 116)); color: rgb(255, 234, 0); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &ability-scores &ability-score &sign": "{ color: rgb(255, 0, 0); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &ability-scores &ability-score &score": "{ height: 23px; font-size: 0.8125rem; background: rgb(93, 14, 14); color: rgb(251, 174, 9); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &ability-scores &ability-score &label": "{ font-size: 0.6875rem; }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &ability-scores &ability-score &mod": "{ font-size: 0.8125rem; color: rgb(255, 0, 0); }",
        "#ActorSheet5eCharacter2-Actor-wCUDNMVTWWqk8jJy&dnd5e2&sheet&actor&character &sheet-header > &right &inspiration": "{ background: url(\"../../../modules/tgce-restyler-5e3/assets/alt-badge1.png\") center center / contain no-repeat transparent; }"
    },
    "elements": {
        "char-ac-badge": "modules/tgce-restyler-5e3/assets/alt-badge2.png",
        "sheet-bgimage": "modules/tgce-restyler-5e3/assets/transparent.png",
        "text-sheet-bgcolor": "#0d0d0d",
        "sheet-bgcolor": "#0d0d0d",
        "header-bgimage": "modules/tgce-restyler-5e3/assets/sheet-banner-onegod.png",
        "sheet-header-hue-rotate": "130",
        "char-lvl-image": "modules/tgce-restyler-5e3/assets/alt-badge2.png",
        "char-ac-badge-scale": "60.5",
        "char-trait-badge": "modules/tgce-restyler-5e3/assets/alt-lozenge.png",
        "text-hp-bar-right": "#0f2917",
        "hp-bar-right": "#0f2917",
        "text-hd-bar-right": "#ff002f",
        "hd-bar-right": "#ff002f",
        "sheet-scale": "0.97",
        "sheet-hue-rotate": "77",
        "char-insp-image": "modules/tgce-restyler-5e3/assets/alt-badge1.png",
        "text-abi-mod-txt-color": "#ff0000",
        "abi-mod-txt-color": "#ff0000",
        "text-abi-mod-sign-color": "#ff0000",
        "abi-mod-sign-color": "#ff0000",
        "text-abiscorecolor": "#fbae09",
        "abiscorecolor": "#fbae09",
        "text-abiboxcolor": "#5d0e0e",
        "abiboxcolor": "#5d0e0e",
        "char-trait-badge-scale": "1.05",
        "banner-left": "#000000",
        "text-banner-left": "#000000",
        "text-banner-right": "#251b74",
        "banner-right": "#251b74",
        "text-banner-text": "#ffea00",
        "banner-text": "#ffea00",
        "text-bio-txt-color": "#e1c019",
        "bio-txt-color": "#e1c019",
        "text-content-link-bg-color": "#993838",
        "content-link-bg-color": "#993838"
    }
}
```


## To Do

- [ ] Memoize current tab ID for duration of object instance lifetime
- [ ] Memoize sidebar state as user preference for each tab for each sheet type
- [ ] Memoize sidebar tab selection for duration of object instance lifetime
- [ ] Character Sheet 
  - [x] Implement tabs
    - [x] Sheet (Actions)
    - [x] Attributes (Character tab)
    - [x] Inventory
    - [x] Features
    - [x] Spellbook
    - [x] Effects
    - [x] Bastions
    - [x] ~~Background~~ Biography
    - [x] Journal
  - [x] Implement Expandable/collapsible sidebar
  - [x] Implement Favorites
  - [ ] Implement Theme Settings
    - [ ] World Default discuss with community
    - [ ] Actor Sheet
    - [ ] Item Sheet
  - [ ] Implement Limited View, which branches just within the top-level sheet component.
  - [ ] Misc Features
    - [ ] Set as Inspiration Source (see below)
    - [ ] <!-- TODO: Determine if we keep context menu here; some modules rely on it, like Tokenizer. -->
    - [ ] // TODO: Use the same hooks and sheet parts that supports the Hidden Death Saves module.
- [ ] Explore what it takes to implement item sheet tab settings per item type.
- [ ] Implement Responsive Tab Strip
- [ ] Implement quadrone default tab settings (no UI)
  - [ ] Character
  - [ ] NPC
  - [ ] Vehicle
  - [ ] Group
  - [ ] Container
- [ ] Set up new tab selection for quadrone sheets
- [ ] Scaffold the NPC Sheet in Foundry V12
- [ ] Scaffold the Group Sheet in Foundry V12
- [ ] Scaffold the Vehicle Sheet in Foundry V12
- [ ] add a class to section headers when there are no search results `.search-no-results`
- [ ] All section configs: pass in callback for preparing sections to view, so that we're not processing this during non-option-sheet renders. It should only render on option sheet prerender.
- [ ] Configure {TabId}: include a hook that allows people to pass in their own settings.
- [ ] SortingListbox - add touch support for drag and drop, if possible; and if it works out, remove the arrow buttons.
- [ ] Resolve TODO -  // TODO: Make this a callback to send through to the component for preparing sections properly
- [ ] Item cards
  - [ ] Implement a shared portal for item cards. All attached item cards will use the one portal anchor. This is so the card can live outside the sheet's overflow hiding window content, so we don't have to worry about compromising design.
  - [ ] Have item cards be targeted via `.tidy5e-sheet.classic....` etc.
  - [ ] Test spell info on item summary and cards
  - [x] ~~For fun, test with PopOut!~~
- [ ] Effect Summary eagerly refreshes. Add suppression to HTML enrichment to only when the effect summary is shown.
- [ ] Additional Document header option: Context Menu Options (literally show the context menu options)
- [ ] Ensure all item sheets enforce this Unidentified UI feature:
    - [ ] (Non-container sheets only) Sidebar sections all hidden except Sections section and pill switches
- [ ] Context Menu items rework
- [ ] Fix weird minimize/maximize header text behavior. reference: https://discord.com/channels/@me/1243307347682529423/1357922036454002890
- [x] Add background circle hover style to section row buttons
- [ ] Always track and ensure that `currentTabId` is correct on the sheet. Use a getter/setter, and under the hood, use a stateful object. Make "change tab" function available and have it trigger rerenders.
- [ ] Implement quadrone default tab settings (no UI)
  - [ ] Item
    - [ ] This has to explode out into unique tabs per item type.
- [ ] Editor style needs CSS help: https://discord.com/channels/1167985253072257115/1169792539545587733/1362188451910258869
- [ ] Make inline activities draggable / droppable within the scope of an item table row / summary
- [ ] When minimized, windows have a forced min-width. The min-width should only be applied when the window is fully open (they call it maximized)
- [ ] Propagate Table Row Actions to Activities tables
- [ ] Propagate Table Row Actions to Effects tables
- [ ] Propagate Data-Driven Columns to Activities tables
- [ ] Propagate Data-Driven Columns to Effects tables
- [ ] (Low priority) ButtonWithOptionPanel - use a Portal or something similar so that there's a singleton menu shell that can be shown/hidden by any sheet and can be given a component and/or snippet to render. This should allow for someone to have a compact sheet and view the full options panel without the sheet's overflow hiding the options.
- [ ]  simplify sorting so that longpress/right-click opens a list of sort options, and simply clicking on the button cycles forward through the various sorts; 
- [ ] Create constants for all known filters. For those that are generated, provide a global filter name  provider function that takes a value (source class, for example) and churns out the appropriate name ('source-class-warlock'). Update the runtime and all those using hardcoded filter names (Spellbook Footer).
- [ ] (stretch) Implement generic width / priority observer feature that can be used to control pinned filter visibility generically and then be used for other purposes later.
  - [ ] Propagate this to all action bars
- [ ] Evolve ItemLists further
  - 💡 It is still for Items only, which should keep things simple with itemContext usage.
  - Extract the Tidy Table rendering components for churning out columns from column specs. This functionality will be reused for Effects and Activity tables.
- [ ] `_onDropItem` - observe how Foundry core does this in V13. _onDropItem is provided with the full item on the Foundry side. Why are we doing our own thing? Can it be avoided? If not, then do that Foundry is doing. Copy how dnd5e is handling `_onDrop`, and this will enable you to then rely on Foundry core's `_onDropDocument`, which will provide the document instance for you.
- [ ] Figure out where to put power tools like "Assign Spells to Source Classes"
- [ ] (TBD) User Setting: Item Spells Organization ( ) Additional Spells Section ( ) Section Per Item
- [ ] Add sheet parts everywhere. Make this easy for the user who wants to mod this.
- [ ] Figure out: can get it so I can add Artisan's tools ("art") to Favorites? It represents all Artisan's Tools.
- [ ] (hightouch) Character tab; responsively move the right side below the left side after a certain threshold so that character traits aren't squashed.
- [ ] On first load after Tidy 5e is activated, provide instructions on how to change sheets to Tidy, with potentially a link to the Wiki. https://discord.com/channels/1167985253072257115/1383159779253555272/1383161370186485882
- [ ] PC Sheet, Character tab, Species and Background do not refresh when their items change.
- [ ] (PC: Feature tab) Implement alternate section groupings - https://discord.com/channels/1167985253072257115/1170021717524107274/1382889612959158355 | include toggle option as sheet flag in tab settings
- [ ] Bastion tab idea: Include an actual Add button in addition to the Compendium button. People should be allowed to add a new Bastion directly to a sheet.
- [ ] Bastion tab: Disabled facilities are completely nonresponsive even to a GM. It seems like at least the GM should be able to fix an accidentally broken facility. The Foundry / dnd5e way has been "if you own the sheet, you can do whatever you want to the sheet," so this particular feature as it currently exists sort of contradicts that philosophy.
- [ ] Discuss: new Action List option: "Require Item to be Equipped for Cast Activity Spells" - would have an explanation detailing that this requirement is in addition to the standard Attunement requirements | https://discord.com/channels/1167985253072257115/1169792539545587733/1384379958801076255
- [ ] // TODO: Consider deferring enrichment to tab rendering, so tab selection can preclude it.
- [ ] (hightouch) TidyItemSummary - can use `.titleCase()` for strings.
- [ ] `window-title` shows the character name while the sheet is closing. It's noticeable enough to look like a mistake.
- [ ] Sheet tab: need Inventory filters in advanced filter section
- [ ] Refactor: Simplify DEFAULT_OPTIONS management now that option inheritance works and `visible()` callback is officially supported.
- [ ] Research: Leveraging Foundry data models to validate, clean up, and control my flag data; and what about new user settings?
- [ ] (Stretch) **Theme Settings**: Live update while the dialog is open - depending on performance, this could use the theme-changed hook and pass in a temp themesettings object. When this theme setting is provided, use it to apply theming rather than looking up theming, selectively overriding world, parent, or current document's theme settings.
  - This is easy with the stylesheet / CSS Rules API, I would think.
  - [ ] Sheet
  - [ ] World
- [ ] (Stretch) **Theme Settings**: Import/Export theme settings (will have a version stamp for these so that migrations can occur when the model changes in breaking ways); can go in the header menu for this particular application 🚀🧑‍🚀
- [ ] (Stretch) Advanced Settings Section - do you know what specific CSS variable alterations you want to make to Tidy? Put 'em here. An array of 0 to many direct variable overrides. If someone goes real deep into Tidy and wants to submit some community theme JSON, they may do so.
- [ ] (Stretch) **Theming**: Community Theme submissions - they'll go in a dedicated folder in github and, with an active internet connection, can be pulled directly from within Foundry
- [ ] (Stretch) **Theme Settings**: Saved Themes in campaign world - be able to create multiple themes and save them to the game world for all to enjoy
- [ ] Refactor: Journal flag management is too complex. It needs to be extracted to a Tidy Journal controller class to keep the Tidy Flags layer as a simple data access layer.
- [ ] 

### Feature - Set as Inspiration Source

**Inspired by items**. New Context Menu option "Set as Inspiration Source" available on character sheet for any item with limited uses. When selected, the actor is flagged with the item uuid. When preparing the inspo tracker, if there's a valid, owned item in the flag setting which has limited uses, then switch from the boolean inspiration tracker to the banked inspiration tracker. This is a glorified pin.

**Tidy API Ready**. Provide API support for someone to specify their own banked inspiration. They must provide callbacks for value, max, and onChange. When an API inspiration bank is registered, it overrides all other options. onChange should make it easy to understand whether the value increased or decreased.

**Hooked up**. Whenever we increment or decrement banked inspiration, fire off a hook "tidy5e-sheet.inspirationChanged" with sheet, actor, and new value. If we're working with a registered inspiration item, then decrementing triggers item use.


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

### Electron Client Issues

- [ ] The button panel menu is appearing behind tables in the Container Sheet.

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

- [ ] ButtonWithOptionsPanel - can the menu be outside the hidden window content and still anchor to the position of the menu? Very possible with a Portal. See https://svelte.dev/playground/8364bc976f0c4ff9b83adf6e7a3c19fd?version=5.22.5#H4sIAAAAAAAACp1V34-jNhD-V7zu6gJSBOqu1AcCOV3vpS-V-l6qrgNDcOPYlj1kN0L875VtCOQ2e7vaFwQzH9_8numpZEegGf1LGWSCrmnDBVia_d1TPGuncQK6nnDftE7sCQQ62Y5ZuCWvlESQaGlGc1sZrnFbyhL5USuDpCeVAYYQTJKBNEYdSUmTlFXIlbQl3Szg39VRKwkSZ9xFNJocfxCA5Kg6iVCTgjRMWNiUMk9nF2Ru8SzAe5MwrUnv3krcseqwN6qTdUYsAoid6GATdJrVNZf7jPz6m37xssE92ofp5yMzey5_1Cc6hDeCKiWUychzy_Ft4mtHdGe0gJlx1yEq-TOreXoJT-Y1P5FKMGuLkjKtS-qjztuH7Tet87R9CN8O1lnIljUp-lWj1Gq4_B9iGSkcyeM2IPO0fQw8ac1P3vDbnDtmPseJ_S-8mUo7jPi5L9KASXnjdfmYKCWzSvDqUPRRTIotiebeuBtf42FL-kn8law66T9WJCMr_zZ332ogeRqYty7TwTW6pggvSDM0HQzrN4Zm7OvkP3s9NFfyxdBcBgV5dZgHZNnsslLSIglJ_PfINCmIhGfyJ9NRvCklvHiKppPextXIRVLVsCbcZaKkNTSsE1jSOLRWID7AmRTk6f4-WEjue14PT2EuGxLNdpOW2egA5zgm2Br1TJ7qTgteMYTRO89VUs9Q0sABwsLC-cQCOpI1ca7FHmIAOyNJT2qwaNQ5W-JrEICQ7LisF76snamYDJtSDqW8xO4rOQbtAf0Uxt3P4ujkQapnOUVx3x_gPKYg5KhVFkmxdGsfwggBOHXCpQWDv0OjDIwuyE6IqxCjuNh6sGsBxqX1wJh8-eJNJAaO6gTfWy7qaMrP8LrE-gPFdStyzOfmw8W-maUwha5BozjBFmQUpmxcTyWOZkjxKv_jrhviuRXeAb_uhWBs_PyaRJeqf2wif7wg13N5Q_veSdPvHDOX-BMTHfiy_AFCqAC92Lr71BVzq7b_2D0RfN9ipQwTb92L8UI8bi9Ozbt4Ut9cxoudr68uyLb3QQ_zKl8s6hJzLnWHxI1xFrKTTufg80s8jIvf4cGZ1bDY3PNZub3D_xn-BxsHJbcUCQAA or obsidian dev vault
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

- [x] (hightouch) Style Effects tab header buttons
- [x] (hightouch) Rarity colors review
- [x] (hightouch) Review Effects tab and apply any polish
- [x] Get Tidy tables working properly and looking nice with the latest styles
  - [x] New quantity control is wider than its 80px parent
  - [x] The table styles do not account for varying column widths and do not constrain child contents
  - [x] Item Name should truncate when too small
  - [x] Section header name should truncate when too small
  - [x] Tighten up actions column scaling for icons
  - [x] Add breakpoints for showing/hiding content, and add columns
    - [x] Charges : order to hide - 4
    - [x] Price : order to hide - 1
    ~~- [ ] Time : order to hide - 2~~
    - [x] Quantity : order to hide - 5
    - [x] Weight : order to hide - 3
  - [x] Finish creating quadrone-specific table components so that inline activities and item (document) summary can be owned by quadrone and classed accordingly.
- [x] Iterate on container tables
  - [x] Container expander to left, always visible. Item Desc / Activity expander on right, hidden until hovered, merely a visual indicator and not a separate clickable area, but always visible when expanded.
    - [x] Inline container contents
    - [x] Item Desc / Activities
  - [x] Add rarity colors to images
- [x] Add user preference sheet width memoization
~~- [ ] Expand/collapse All Sections is not working; fix it so container toggles work with it~~
- [x] Bug: On drop to container sheet, new item is counted but cannot appear until full refresh. Fix: Svelte update.
- [x] Implement filter menu / active button support
- [x] Implement sort button functionality and menu
  - [x] component
  - [x] context data for container
  - [x] sort logic for inventory items
  - [x] consolidate: put all sort-related content in a centralized location for sorting, similar to item filters (the runtime, the default filters, etc.)
  - [x] priority subtitle (include on model as `subtitle` and generically include, instead of using special treatment)
- [x] Implement section config / https://www.figma.com/design/seCsgsf8Uh82uxfPXIwFAg/Tidy5e-Sheet-Refresh?node-id=2182-75324&m=dev
  - [x] Migrate universal quadrone styles from items.scss to apps.scss so that items and options dialogs just work, given the right classes.
  - [x] Code up the section selection form and provide a means for passing in custom options.Depeneding on complexity of available options, consider making it data-driven.
    - [x] Display Options: Show container row (or equivalent preexisting loc key)
  - [x] Apply styles
  - [x] Clean up styles and organize
    - [x] Isolate listbox to its own component
    - [x] Make the options dialog styles specific to tab configuration with a TODO to share styles with other dialogs
- [x] Do DocumentSheet / prepareContext revisions to the core Svelte mixin so that it's more plug and play for all Tidy applications
- [x] Fix: Weightless container (Bag of Devouring) shows undefined in the Holds text
- [x] Sorting: Resolve todo - // TODO: This needs to be part of the sort group model, relating sort methods to specific groups.
- [x] (hightouch) Complete dark mode for the container
- [x] Implement three dots onclick for container contents item rows
- [x] Inventory: Container inline capacity UI
  - Capacity column
  - For custom sections, let the columns be what they are, but let the container still do its same thing
  - [x] It's time to roll out per-section column specification
    - [x] Draft the proof of concept with Container Contents.
    - [x] Decide: Column spec in runtime, or in context prep? 
      - Leaning toward runtime, with the columns being pulled for use in the component where they are needed, to defer their processing to when their tab is pulled in. Propagating the columns through context is burdensome and far too distributed. Consolidating to a runtime file also makes it easier to manage settings, API callers, import/export, etc.
    - [x] ~~Explore: Can we toggle between Container columns and non-container columns, using a `condition` callback?~~ Using an override system with a fallback to the default column setup. API / World / Client / Sheet-flag settings will progressively override this.
  - [x] Properly pull column specs for each section in container contents
  - [x] Separate capacity bar and values into their own columns, favoring showing the bar when in small view.
    - [x] Both columns have no header content.
  - [x] Polish and finish capacity bar
- [x] Container: Image click behaviors
  - [x] Locked - Show preview
  - [x] Unlocked - File Picker
- [x] (hightouch made first pass) Inventory: subtables have a different set of styles for their header
- [x] (hightouch made first pass) Inventory: Inline container Empty styles
- [x] Implement spell sheet spell block in sidebar
- [x] Implement spell sheet header contents
  - [x] subtitle
    - [x] Level (1st Level)
    - [x] School
  - [x] summary
    - [x] (when available) Charges
    - [x] (when relevant) Cooldown
    - [x] linked item (Necklace of Fireballs)
  - [x] School Image across from title / subtitle
- [x] Implement Item Effects tab
  - [x] Populate with content and functionality
  - [x] Header create button
  - [x] Ctx menu
  - [x] Middle click to edit
  - [x] Make source label a hoverable item link
  - [x] Action buttons
    - [x] enable/disable - editable and not an enchantment
    - [x] edit, delete - unlocked
    - [x] three dots menu
  - [x] Purge all svelte-located SCSS in favor of global
- [x] Implement drag and drop activities
- [x] Implement drag and drop effects
- [x] Unidentified: add `unidentified` class to item table rows that are unidentified.
- [x] Experiment: ondblclick to edit a table row, instead of middle click
- [x] Port spell block to classic sheets and info cards
- [x] Implement Item Activities tab
  - [x] Populate with content and functionality
    - [x] Columns: (image) name, actions?
  - [x] Action buttons
  - [x] Ctx menu
  - [x] dbl click to edit
  - [x] Determine if there's any activity summary that can be shared. If so, shared it. Else, disable until dnd5e 5 / Foundry 13.
- [x] Refactor: make tag component reusable
- [x] Container contained item description changes are not reactive on the container
  - Of note: the container is re-rendering. It's probably the item summary itself.
- [x] Effect description changes are not reactive on the target item container
- [x] Determine how unidentified should work
  - [x] Item row
    - [x] (kgar says: "we should match system behavior for this one: the button is enabled and usable on the default sheets") Use button greyed out, cannot be used
    - [x] Item row text italicized, light grey, no background color
    - [x] Item row image greyscale, opacity 75%
    - [x] Item description uses unidentified description only
    - [x] Charges hidden (emdash)
    - [x] Price hidden (emdash)
  - [x] All sheets
    - [x] Image greyscale
    - [x] Rarity color set to grey 40, rarity label readonly and set to "Unidentified" (all modes)
    - [x] Cost label set to "?" unless in GM Edit Mode
    - [x] Charges hidden (emdash) unless in GM Edit Mode
    - [x] Details tab hidden until identified (all modes) or in GM Edit Mode
    - [x] Activities tab hidden until identified (all modes) or in GM Edit Mode
    - [x] Effects tab hidden until identified (all modes) or in GM Edit Mode
    - [x] Name readonly "Unidentified <type>" (all modes) (enforced by system)
    - [x] Unidentified description expanded and editable
    - [x] Description section hidden, Chat description section hidden
    - [x] Header source label set to "?" if filled out, edit button hidden (all modes) unless in GM Edit Mode
- [x] Feedback
  - [x] Price and Charge columns - always follow Identified instead of GM Edit Mode
  - [x] Price column and summary: one question mark
- [x] (hightouch) Time to do variable cleanup
- [x] Implement Container Limited View
- [x] Test Container Observer View
- [x] (hightouch) Quadronify src\applications\section-selector\SectionSelector.svelte?
- [x] Section Selector - swap in the Search component, if possible.
- [x] Localize Container sheet name
- [x] Update section selector to adopt its parent sheet's theme. Solution: make it a DocumentSheet. (Solved: only works for Quadrone sheets, though.)
- [x] Activity Edit ctx menu doesn't work from Classic or Q item sheet :/ | the context menu is unable to find the appropriate list item in order to run its handler.
- [x] Implement Activities tab
- [x] Implement Effects tab
- [x] Finish implementing container contents tab
- [x] Spell TODOs
  - [x] Pact magic upcast in header subtitle after; e.g., "3rd Level (Cast at 4th), Evocation"
  - [x] Include DC in Attack/Damage section
  - [x] For spells from items, include in properties section 
    - [x] a pill for "Item", which lists the name of the item
    - [x] ~~a pill for "Ability", which lists ???~~
- [x] Review Container sheet to ensure it has everything; add TODOs as needed
- [x] Move Container Quadrone out of the Truesight filter Go beta!
  - [x] Readme / screenshots
  - [x] Release Notes
- [x] apps.scss: `.window-resize-handle` set filter to unset, set right/bottom to 0
- [x] Effects tab
  - [x] Hide Source column when under 450px
  - [x] Hide Duration column when under 350px
  - [x] Change out the icons for effect enable/disable to 
    - enabled: fa-toggle-large-on
    - disabled: fa-toggle-on
- [x] `align-content` doesn't work with some machines. Replace with basic flex styles where able.
  - It was the damned Electron client. This problem may resolve itself in Foundry 13, but it has implications for dnd5e 3.3.1 port.
- [x] Populate weapon sidebar pills.
  - [x] Action - Object.values(labels.activations[0]).filter(x => x) 
    - [ ] ~~"Ranged Weapon Attack"~~
    - [x] 10' / 20' Range
    - [x] 1 Creature
    - [x] etc.?
  - [x] Attack / Damage
    - [x] Hit
    - [x] Save
    - [x] Damages
  - [x] Properties - proficiency pill, then all item properties
    - [x] Proficient - `("proficient" in this) ? CONFIG.DND5E.proficiencyLevels[this.prof?.multiplier || 0] : null`
    - [x] The item props (ask hightouch about the badge on Proficient)
- [x] Effects Tables: Adjust the suppressed effect's toggle icon, since it can't be adjusted anyhow
- [x] Equipment sidebar pills
  - [x] Action section
    - [x] (check what's already there)
  - [x] Properties section
    - [x] (check what's already there)
- [x] Equipment header content
  - [x] Subtitle
    - [x] Equipment subtype (Heavy Armor)
    - [x] , {AC} AC / the final AC?
  - [x] Summary
    - [x] Charges
    - [x] Recharge
    - [x] price
    - [x] weight
    - [x] quantity
- [x] Rarity "None" is currently using default light text color
- [x] Consumable
  - [x] subtitle
  - [x] sidebar
- [x] Effect / Activity tab titles: use callback to feed in custom HTML, given a document
- [x] fix: Viewing multiple spells in the compendium keeps appending Import buttons
- [x] update: Hide prepared/unprepared pill unless spell has actor
- [x] Restructure item-name HTML https://discord.com/channels/@me/1243307347682529423/1355382160915169533
- [x] Implement Advancement tab
  - [x] Implement embedded functionality (configMode = false)
    - [x] When locked, (double-check this in the template and code)
      - [x] Only menu button visible
      - [x] When fully configured, then circle check on action column, "Fully Configured"
      - [x] When partially configured, then triangle exclamation on action column, "Not Configured"
      - [x] When not configured at all, no icon
    - [x] When unlocked, 
      - [x] When of the appropriate level, show cog icon with "Modify Choices"
      - [x] else, no icon
  - [x] Implement sidebar/compendium functionality (configMode = true)
    - [x] When locked, compare to v2 sheet
    - [x] When unlocked, compare to v2 sheet
  - [x] Note: Don't show Tag indicators when embedded and locked.
  - [x] Include useful Value column for scale values
  - [x] Include UI for Original / Multiclass Only indicator
- [x] CONSTANTify any advancement magic strings
- [x] Finalize Background base version
- [x] Notify hightouch that spell sheet is ready for final review
- [x] Notify hightouch that weapon sheet is ready for final review
- [x] Work on Class Header
  - [x] Add badge; fix stolen CSS
  - [x] Swap in badge image from figma
  - [x] Subtitle
    - [x] Level Ordinal string
    - [x] Original Class stamp
- [x] Class sidebar
  - [x] Unique stuff
    - [x] Class Identifier pill button; click to copy identifier
    - [x] primary class attribute(s)
    - [x] spell progression (if present)
    - [x] spellcasting ability (if present)
    - [x] hit die
  - [x] Sidebar standard stuff for items with advancements
    - [x] Scale Values section
      - [x] Click to copy formula
      - [x] When embedded, show actual scale value for level 
- [x] Implement sheet header contents
  - [x] Background
  - [x] Class
    - [x] header
      - [x] Current level badge
    - [x] subtitle
      - [x] Actor class level
      - [x] Original Class
  - [x] Consumable
    - [x] subtitle
      - [x] Item Type
      - [x] Item Subtype
    - [x] summary
      - [x] (when available) Charges
      - [x] (when relevant) Cooldown
      - [x] Price
      - [x] Weight
      - [x] Quantity
  - [x] Container
  - [x] Equipment
    - [x] subtitle
      - [x] Type (Light Armor)
      - [x] ## AC
    - [x] summary
      - [x] (when available) Charges
      - [x] (when relevant) Cooldown
      - [x] Price
      - [x] Weight
      - [x] Quantity
  - [x] Tool
    - [x] subtitle
    - [x] summary
      - [x] (when available) Charges
      - [x] (when relevant) Cooldown
      - [x] Charges
      - [x] Price
      - [x] Weight
      - [x] Quantity
  - [x] Weapon
    - [x] subtitle
    - [x] Summary
      - [x] (when available) Charges
      - [x] (when relevant) Cooldown
      - [x] Price
      - [x] Weight
      - [x] Quantity
  - [x] Loot
    - [x] Subtitle
      - [x] Loot type
      - [x] (if available) Loot subtype
    - [x] summary
      - [x] Price
      - [x] Weight
      - [x] Quantity
  - [x] Subclass
    - [x] ~~subtitle~~
- [x] Facility
    - [x] subtitle
      - [x] Type
      - [x] Order
    - [x] summary
      - [x] Progress (x / y)
      - [x] Size
      - [x] Cost (if not assigned)
  - [x] Feat
    - [x] subtitle
      - [x] Feat Type
      - [x] Feat Subtype
      - [x] ~~(When active) Activation Type (Action)~~ (already in sidebar)
      - [x] (When Active) Requirements (Paladin 2)
      - [x] (When Passive)
    - [x] summary 
      - [x] (when available) Charges
      - [x] (when relevant) Cooldown
  - [x] Species
- [x] Work on Subclass Header
- [x] Work on Species Header
  - [x] No subtitle, no summary, add standard identity info scaffolding
- [x] Work on Species Sidebar
  - [x] Creature type section, pills
    - [x] Include cog icon button on header, far right, when unlocked
    - [x] If subtype, then type is `text-normal`
    - [x] If no subtype, then type is prominent
  - [x] Movement section, pills
    - [x] Include cog icon button on header, far right, when unlocked
  - [x] Senses section, pills
    - [x] Include cog icon button on header, far right, when unlocked
  - [x] Advancements / Scale Values
- [x] Work on Feat header
- [x] Work on Feat sidebar
- [x] Advancement sidebar stuff; Scale Values (and any like them), Copy Formula, what else? Research and task out
- [x] Work on Facility Header
- [x] Notify hightouch that equipment sheet is ready for final review
- [x] Notify hightouch that consumable sheet is ready for final review
- [x] Notify hightouch that loot sheet is ready for final review
- [x] Notify hightouch that tool sheet is ready for final review
- [x] Item with HP / HP Bar
- [x] Work on Facility Sidebar
  - [x] Progress
  - [x] Harvesting
  - [x] Crafting (a sword, for example)
  - [x] Hide Facility section on sidebar when there are no pills to show; this implies also extracting those pills into snippets. No problem!
  - [x] Limit craft content to harvest and craft orders
  - [x] Apply disabled class to all facility progress / crafting pills when the facility is disabled
  - [x] ~~When the facility is embedded~~ Just do it.
    - [x] Add tooltip for hireling / defender list to sidebar pills
    - [x] Add `{Value} /` to the hireling / defender pill.
- [x] Tangential: Foundry 13 doesn't like how we do HTML-rich tooltips. See Attunement summary tooltip as an example.
- [x] (hightouch) Review / refine Advancement table styles. Need handling for tags, enrichers, etc.
- [x] (hightouch) Editor / longform style requests
  - [x] in our editor styles, can we do something more with the blockquote element? For example, check how the default sheets do blockquotes: italicize, with a left gray border (2-4px, or so), to make it really stand out as a quote.
  - [x] A user requested we don't use a gap in our `<hr>` elements in the Editor / rendered styles. https://discord.com/channels/1167985253072257115/1170003836556017755/1357755740391215357
- [x] Not sure how feasible it would be but I'm noticing when we open a sheet that Tab still swaps between tokens on the canvas. Is it possible to steal tab focus when a sheet opens and give it to the first open tab? Then you could hit Tab to switch between sheet tabs on open https://discord.com/channels/@me/1243307347682529423/1355184980623491172
- [x] Notify hightouch that background sheet is ready for final review
- [x] Notify hightouch that class sheet is ready for final review
- [x] Notify hightouch that subclass sheet is ready for final review
- [x] Notify hightouch that species sheet is ready for final review
- [x] Foundry 13 theming: Ensure a set of theme classes are always being applied to Tidy sheets; see scratch notes for how to progressively check higher and higher. Have this wrapped up in the effect which applies mutable fields to the window.
- [x] Ensure Activities and Effects tabs include item counters in the title
  - [x] This will need context-dependent tab titles, if they don't already exist
- [x] https://discord.com/channels/@me/1243307347682529423/1336210686392668220
- [x] Add context-dependent Tab visible / enabled predicate option to Tidy tabs, so that concealed content can entirely hide a tab, if needed
- [x] Handle unidentified feature set
  - [x] Portrait becomes washed over
  - [x] Non-description tabs become disabled (preferably, hide them?)
- [x] Wire up item-sheet-specific user sheet preferences for width and height. Look for other opportunities, also, like container toolbar.
- [x] Replace rote individual span styles with util styles where able
- [x] Propagate `sheet-header` class setup to all item sheets
- [x] Implement sheet header contents
  - [x] Tattoo
    - [x] Subtitle
      - [x] ...?
    - [x] Summary
- [x] Spell Sheet: Try a few different configurations for Class List.
- [x] Implement Tattoo sheet details
- [x] Review and finalize Tattoo sheet sidebar
- [x] Implement sidebar contents - prefer context data for pill groups with pill arrays of string and object (label / value)
  - [x] Background
  - [x] Class
  - [x] Consumable
  - [x] Container
  - [x] Equipment
  - [X] Facility
    - [x] Category
    - [x] Prerequisite
    - [x] Y Hirelings
    - [x] Y Defenders
    - [x] Order
  - [x] Feat
  - [x] Loot
  - [x] Species
  - [x] Spell
    - Use the children snippet for spell-specific label-value pair info
  - [x] Subclass
  - [x] Tattoo
  - [x] Tool
  - [x] Weapon
  - [x] Make sure Section section visible for all sheets
- [x] Implement Play/Edit mode
  - [x] Update sheet lock to work like the default sheets, including the additional render options and intuitive default state
  - [x] Add View context menu option where needed
  - [x] Ensure context options that render item sheets are feeding in their appropriate modes.
  - [x] Resolve difference: Sidebar Tidy items open in Play Mode; Default (2) open in Edit Mode. We need to be like them.
  - [x] Review dnd5e system one more time
- [x] Finalize Description tab behavior for "text-based" sheets
  - [x] ~~~~Class / Subclass / Background / Species / Facility~~ any "Descriptions" tab with a single item description in the array 💪
    - [x] Description tab
      - [x] Description section header hidden, contents displayed
      - [x] Edit mode always shows prosemirror visible in edit mode (like default sheets)
- [x] (someone reported this to the Foundry devs; it ain't just me; awaiting possible fix) The "Import" menu option is being shown on a Sidebar item. 🪓
- [x] Class, Subclass, Background, Species, Facility sheets
  - [x] Description tab
    - [x] Description section header hidden, contents displayed, editable when unlocked, saves when locked again, saves when save button clicked and is refreshed.
- [x] Sheet Mode Toggle - streamline tooltip to read "Play" when locked and "Edit" when unlocked.
- [x] Fix: Copying an advancement from item to another when it's Tidy to Tidy doesn't seem to work. Determine what the defaults are doing and try to do likewise.
- [x] Implement classic group sheet default tabs setting
- [x] Rework meters to emulate dnd5e2 structure
- [x] Character Sheet
  - [x] Structure the sheet - 
    - [x] Header
      - [x] Image and vitals
      - [x] Name / Summary row / buttons / Badge
      - [x] AC / Abilities / Init
      - [x] Sidebar Toggle / Tab strip
- [x] ~~Refactor: can Svelte Attachments handle tooltip concerns like weight distribution?~~ No. A better component API that requires less of the caller was the answer.
- [x] Start dev in Foundry V12
  - [x] Establish components for the tabs
  - [x] Set up Quadrone runtime content, including the default tabs
  - [x] Implement SkillsCard
  - [x] Implement ToolsCard
  - [x] Character Traits: Add icons to damage modification, damage resistances, and damage vulnerabilities
  - [x] Structure the sheet - 
    - [x] Tab Content area
      - [x] Sidebar
        - [x] Button tabs
        - [x] Skills area (when Skills tab selected)
        - [x] Traits area (when Traits tab selected)
        - [x] Pinned area (when Pinned tab selected)
      - [x] Main Tab Strip Active Content Area
        - [x] Sheet tab contents
        - [x] Character tab contents
        - [x] Inventory tab contents
        - [x] Features tab contents
        - [x] Spellbook tab contents
        - [x] Effects tab contents
        - [x] Action tab contents
        - [x] Bastion tab contents
        - [x] Biography tab contents
        - [x] Journal tab contents
  - [x] Wire up XP bar
  - [x] Add drag-and-drop to sort for Favorites
  - [x] Add drag-and-drop to add favorite
  - [x] Update favorite drop handling to also sort, if able
  - [x] Implement slots, skills, and tools drag
    - [x] slots
    - [x] skills
    - [x] tools
    - [x] When dragging slots, skills, and tools, be sure to load up this transfer data: `"{"dnd5e":{"action":"favorite","type":"tool","id":"dice"}}"`
    - [x] Verify they work with favorites
  - [x] Add Context Menu for favorite slots, skills, and tools. Currently, they cannot be removed.
- [x] Bastion: Retrofit the classic sheet structure
- [x] Bastion: Make it functional
- [x] Bastion: Provide a first draft of styles
- [x] Bastion: Get bars working with the chosen accent color
- [x] Bastion: Test and verify broken facilities
- [x] Decide: will we continue to support "Allow Effects Management" option in the new sheets. Not right now. We will assume we're leaving it behind for now.
- [x] Decide: should we allow for section config on Effects tabs. Not currently.
- [x] Remove empty sections in Sheet tab.
- [x] Add `mode-${sheetMode}` to sheet element