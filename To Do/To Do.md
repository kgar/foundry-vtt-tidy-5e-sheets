# To Do

- [ ] Ensure item summary functionality can be shared
- [ ]

## Character Tabs

### Effects

- [x] Effects
  - [x] Make a component
  - [x] Functionality
  - [x] Styles
  - [x] Implement context menu
    - [x] Ensure right-click handling is limited to the target actor / sheet and doesn't intercept everyone. You'll need also to use the Hook technique, but you should only call it once outside of any sheet, and then correlate / verify that the target sheet is using KGar Tidy 5e sheets: `actor.flags.core.sheetClass==="dnd5e.Tidy5eSheetKgar"`
    - [x] ? Answer these: where is default sheet setting stored? How can I tell if my sheet is the default? How can I tell if an actor is using my sheet, whether by default or by specific selection?
  - [x] Adjust class names to bypass existing context menus
    - [x] Do context menu yourself. See Notes.md for details on how it is targeting and how it is summoning context menu
  - [x] Implement middle click to edit
  - [x] Ensure the context menu code is shared so it can be used by NPCs and Items.
  - [x] Settings
    - [x] Right Click Disabled (reimplement after removing magic context selectors)

#### Context menu

Note: the tidy impl seems to override ALL context menus and not just the one for the target sheet 🤔. In the rewrite, ensure context menu override only applies to the target actor.

Tidy impl

```js
// Override COntext Menu
// Item Context Menu
// new ContextMenu(html, ".item-list .item #context-menu", [], {onOpen: sheet._onItemContext.bind(sheet)});

if (!sheet.getActiveEffectContextOptionsId) {
  sheet.getActiveEffectContextOptionsId = Hooks.on(
    'dnd5e.getActiveEffectContextOptions',
    (effect, contextOptions) => {
      const actor = effect.actor ? effect.actor : effect.parent;
      if (actor?.isOwner) {
        contextOptions = contextOptions.filter((obj) => {
          //check for default options and remove them.
          return ![
            'DND5E.ContextMenuActionEdit',
            'DND5E.ContextMenuActionDuplicate',
            'DND5E.ContextMenuActionDelete',
            'DND5E.ContextMenuActionEnable',
            'DND5E.ContextMenuActionDisable',
            'DND5E.ContextMenuActionUnattune',
            'DND5E.ContextMenuActionAttune',
            'DND5E.ContextMenuActionUnequip',
            'DND5E.ContextMenuActionEquip',
            'DND5E.ContextMenuActionUnprepare',
            'DND5E.ContextMenuActionPrepare',
          ].includes(obj?.name);
        });
        if (game.settings.get(CONSTANTS.MODULE_ID, 'rightClickDisabled')) {
          contextOptions = [];
        } else {
          let tidy5eContextOptions = _getActiveEffectContextOptions(effect);
          contextOptions = tidy5eContextOptions.concat(contextOptions);
        }
        ui.context.menuItems = contextOptions;
      }
    }
  );
}

if (!sheet.getItemContextOptionsId) {
  sheet.getItemContextOptionsId = Hooks.on(
    'dnd5e.getItemContextOptions',
    (item, contextOptions) => {
      const actor = item.actor ? item.actor : item.parent;
      if (actor?.isOwner) {
        contextOptions = contextOptions.filter((obj) => {
          //check for default options and remove them.
          return ![
            'DND5E.ContextMenuActionEdit',
            'DND5E.ContextMenuActionDuplicate',
            'DND5E.ContextMenuActionDelete',
            'DND5E.ContextMenuActionEnable',
            'DND5E.ContextMenuActionDisable',
            'DND5E.ContextMenuActionUnattune',
            'DND5E.ContextMenuActionAttune',
            'DND5E.ContextMenuActionUnequip',
            'DND5E.ContextMenuActionEquip',
            'DND5E.ContextMenuActionUnprepare',
            'DND5E.ContextMenuActionPrepare',
          ].includes(obj?.name);
        });
        if (game.settings.get(CONSTANTS.MODULE_ID, 'rightClickDisabled')) {
          if (
            item.type === 'spell' &&
            !item.actor.getFlag(
              CONSTANTS.MODULE_ID,
              'tidy5e-sheet.spellbook-grid'
            )
          ) {
            contextOptions = [];
          } else if (
            item.type !== 'spell' &&
            !item.actor.getFlag(CONSTANTS.MODULE_ID, 'inventory-grid')
          ) {
            contextOptions = [];
          } else {
            //merge new options with tidy5e options
            let tidy5eContextOptions = _getItemContextOptions(item);
            contextOptions = tidy5eContextOptions.concat(contextOptions);
          }
        } else {
          //merge new options with tidy5e options
          let tidy5eContextOptions = _getItemContextOptions(item);
          contextOptions = tidy5eContextOptions.concat(contextOptions);
        }
        ui.context.menuItems = contextOptions;
      }
    }
  );
}

if (!sheet.getItemAdvancementContextId) {
  sheet.getItemAdvancementContextId = Hooks.on(
    'dnd5e.getItemAdvancementContext',
    (html, contextOptions) => {
      // TODO cannot recover the 'this' reference
      /*
  if ( actor?.isOwner ) {

  if(game.settings.get(CONSTANTS.MODULE_ID, "rightClickDisabled")){
    contextOptions = [];
  } else {
    contextOptions = _getAdvancementContextMenuOptions(html);
  }
  ui.context.menuItems = contextOptions;
  }
  */
    }
  );
}
```

#### Middle click

Tidy Impl

```js
// Manage Middle Click behavior
html.find('.item-list .item .item-name').mousedown(async (event) => {
  if (event.which === 2) {
    debug(`tidy5eContextMenu | middle click`);
    // let target = event.target.class;
    // let item = event.currentTarget;
    // Middle mouse opens item editor
    event.preventDefault();
    let li = $(event.target).parents('.item');
    if (li && li[0]) {
      /*
      if ($(li).find(".item-edit")) {
        $(li).find(".item-edit").trigger("click");
      }
      if ($(li).find(".effect-edit")) {
        $(li).find(".effect-edit").trigger("click");
      }
      */
      const itemId = li[0].dataset.itemId;
      const effectId = li[0].dataset.effectId;
      if ((!itemId && !effectId) || !actor) {
        return;
      }
      if (itemId) {
        let item = actor.items.get(itemId);
        if (!item) {
          return;
        }
        item.sheet.render(true);
      }
      if (effectId) {
        let effect = actor.effects.get(effectId);
        if (!effect) {
          return;
        }
        effect.sheet.render(true);
      }
    }
    // let itemId = $(event.target).parents(".item")[0].dataset.itemId;
    // if(!itemId || !actor) {
    // 	return;
    // }
    // let item = actor.items.get(itemId);
    // if(!item) {
    // 	return;
    // }
    //item._onAdvancementAction(li[0], "edit")
    // item.render(true);
  }
});
```

### Biography

- [x] Biography
  - [x] Make a component
  - [x] Functionality
  - [x] Settings
  - [x] Styles

### Journal Tab

- [x] Journal
  - [x] Make a component
  - [x] Functionality
  - [x] Settings
  - [x] Styles
  - [x] Implement game settings
    - [x] journalTabDisabled

### Pile of TODOs

- [x] Use existing or create new tab control | made a really rough tabs control with relative ease
- [ ] Implement the tabs
  - [ ] Attributes
    - [x] Make a component
    - [ ] Functionality
    - [ ] Settings
    - [ ] Styles
      - [ ] `_mainTab.scss`
    - [ ] Favorites...
  - [ ] Inventory
    - [x] Make a component
    - [ ] Functionality
    - [ ] Settings
    - [ ] Styles
      - [ ] src_scss\partials_inventory-grid.scss
      - [ ] src_scss\partials_inventory.scss
  - [ ] Spellbook
    - [x] Make a component
    - [ ] Functionality
    - [ ] Settings
    - [ ] Styles
- [x] Implement default tab
- [ ] Visual bug (existing): when any character detail field is too long in Biography top-notes for a PC, it will blow out the layout. Consider CSS grid as a replacement. Test carefully on all the major browsers. Also just consider inputs instead of contenteditable fields?
- [ ] Consider consolidating sheet initial value / cacheable content into single objects to pass down to the target component. Values include things like scrollTop map, currentTab sheet parameter, and any other sheetparameters that need to be cached for maintaining visual integrity between submissions / sheet refreshes.
- [ ] Focus is lost when the sheet submits, so you cannot tab through fields and make changes quickly. It would be nice if focus is maintained between submits. How would we accomplish that?
- [ ] Like Gmail, make a "`You Deleted A thing [UNDO]`" notification. So, if someone deletes an effect on accident, they can hit UNDO and get it back. It cannot be intrusive, and it may need to be toggle-able.
- [ ] When done with initial prototype: Replace ALL `cursor:pointer` instances with `role="button"` on the target element: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role
  - [ ] All things ".rollable"
  - [ ] Task them out
- [ ] Leverage TypeScript to lock down and document all known flags for each type of flagged entity (actor, NPC, vehicle, Item)

## Exhaustion

- [x] HTML
- [x] SCSS
- [x] exhaustion on hover option
- [x] exhaustion hidden on 0 option
- [x] exhaustion note styles? no longer a feature; remove vestiges
- [ ] Add the custom exhaustion code; see [exhaustion script](./src/exhaustion.ts)
- [ ] Ferret out / expand these todos

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
  - [ ] https://foundryvtt.wiki/en/development/api/flags
  - [ ] https://foundryvtt.wiki/en/development/api/settings
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
    - [ ] Stub TS types and resolve TS errors
    - [ ] Encapsulate and organize
    - [ ] Account for TODOs about implementing things
  - [ ] Apply styles to make the header look verbatim like the original
  - [ ] Add existing CSS variables
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

- [ ] Implement info card
  - [ ] src_scss\partials_item-info-card.scss
  - [ ] Game Settings
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

## Item Table side project:

- [x] Identify a generic inventory / item component tree that will eliminate any guesswork and hopefully eliminate `_inventory.scss`.
- [x] Recreate the inventory table setup with this tree
- [x] Make it functional
- [x] Refactor: Create table column component with primary:boolean field for the header row to use; trim unneeded stuff from the table cell component
- [ ] Refactor: include column hint field in the table cell which can be put onto the resulting cell container for future testing but also for readability while scrolling through svelte code.
- [x] Make it styled to match the original, but now it should bestow most of its core layout styles from the layout components rather than some file.
- [ ] Resolve `TODO: Account for this, but do it in a svelte-ier way...`
- [x] Replace Effects table
- [x] Replace Background table
- [x] Replace Classes table
- [x] Resume the features tab effort

Prototype here:
https://github.com/kgar/svelte-code-sandbox

The structure works as intended, thanks to slot props, which can surface smarter features of the item table layout components.

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

## Inspiration

- [x] HTML
- [x] SCSS
- [x] Implement the inspirationOnHover option
- [x] Implement the Disable Inspiration option
- [x] Implement the disable animation option

## Dying / Death Saves

- [x] HTML
- [x] SCSS
- [x] Hide all charms when dying
- [x] Reimplement the functionality of checkDeathSaveStatus
- [x] Expand todos based on additional options here

## HP Overlay

- [x] HTML
- [x] SCSS
- [x] Implement Disable hp overlay game setting
- [x] Purge hpOverlayBorder game setting

## HP

- [x] HTML
- [x] SCSS
- [x] Enable Max HP Override
- [x] Lock Max HP Override to GM

## Rest

- [x] HTML
- [x] SCSS
- [x] Special Settings?

## Hit Dice

- [x] HTML
- [x] SCSS

## Unsorted

- [ ] Review and make TODOs from these files
  - [x] src_scss\partials_character-details.scss | completely replaced need
  - [x] src_scss\partials_general.scss | imported directly
  - [x] src_scss\partials_navigation.scss | imported and adjusted
  - [x] src_scss\partials_portrait.scss | replaced by reimplementation
  - [x] src_scss\partials_settings.scss | imported directly
  - [x] src_scss\partials_tabs.scss | skipped; this will be implemented in the component(s) ✅
  - [x] src_scss\partials_variables.scss | imported directly
  - [x] src\css\tidy-icons.css | not in use / ignored
  - [x] images folder | added to public
