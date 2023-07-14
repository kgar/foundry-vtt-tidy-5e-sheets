
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
