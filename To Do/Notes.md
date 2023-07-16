## Handlebars vs. Svelte

The handlebars templates have some ingrained features:

- **editor**: TineMCE/Prosemirror editor render / save / save handling
- [Tabs handling](https://foundryvtt.wiki/en/development/guides/Tabs-and-Templates/Tabs-FormApplication)
- **colorPicker**: Color Picker (meh, it doesn't meet Tidy's needs anyway; it doesn't provide Alpha/opacity setting)
- **filePicker**
- **rangePicker**

Relevant link for handlebars helpers: https://foundryvtt.com/api/classes/client.HandlebarsHelpers.html

### Why Handlebars?

This is the intended path. Foundry was designed and is providing features through this route, and if I want to leverage things out of the box with greater simplicity and with official support, I should go this route.

The main mitigating factor needed when going this route is to avoid trying to match the structure of the original 5e sheet, and instead, use the actual API when conducting actions.

### Why Svelte?

Reactivity works a hell of a lot better in svelte than in the handlebars / jQuery world.

~~The main unknown here is whether I can use existing prose mirror in a svelte component, and hook into all operations, like saving and enriching HTML.~~

I can interop with handlebars helpers ✅

This is the way.

## Handlebars Helper

- What is `iid`?
  > It's an index on an each loop.

## Hooks

it is advised to set `CONFIG.debug.hooks = true` when looking for hooks as this will print them to the console as they happen

> **Note**
> There are specific hooks for your sheets rendering. Such as "renderTidy5eSheet", "renderActorSheet5eCharacter ", "renderActorSheet5e", etc.

## Settings

when registering settings, those marked as `config: true` will appear in the config menu; those marked as `config: false` can be put into a custom dialog

`game.settings.register` : registers a setting

`game.settings.registerMenu` : adds a button to the relevant config screen and allows you to put up a form application with your own settings / etc.

## Pro Tips

- globalThis `dnd5e` is chock full of valuable content such as `dnd5e.applications.actor.ActorHitDiceConfig` class among other actor classes for summoning dialogs. This is a crucial piece to have available so that the sheets do not have to rely on magic / invisible jquery targets.

## Links

- https://tobiasahlin.com/blog/move-from-jquery-to-vanilla-javascript/ 😈
- [Foundry v10 API Documentation](https://foundryvtt.com/api/v10/)
- Stuff for semantic HTML and Aria
  - https://stackoverflow.com/questions/19203501/semantic-mark-up-and-wai-aria-for-tabbed-section
- [STYLING CHILD COMPONENTS](https://svelte.dev/repl/765f182ddd75486a8f6cf0b3ba75f276?version=3.59.2)
  - [Passing styles to children](https://svelte.dev/repl/c6b1e24a6f0844de8b032b0c23e928ee?version=3.17.3)
- [Handlebars Helper Reference](https://docs.celigo.com/hc/en-us/articles/360039326071-Handlebars-helper-reference)

## Is This My Sheet?

`actor.flags.core.sheetClass` can tell you which sheet is being used by an actor.
For dnd5e, it is prefixed with the system name, so `dnd5e` and a `.`. The sheet class is the class name which was registered.

Examples:

- dnd5e.Tidy5eSheetKgar
- dnd5e.ActorSheet5eCharacter
- dnd5e.Tidy5eSheet
- `<empty string>` - this is the default. When you see this, then query `Object.values(CONFIG.Actor.sheetClasses.character).find(x => x.default).id`

when looking for NPCs:

`Object.values(CONFIG.Actor.sheetClasses.npc).find(x => x.default).id`

Vehicles:

`Object.values(CONFIG.Actor.sheetClasses.vehicle).find(x => x.default).id`

Groups?

`Object.values(CONFIG.Actor.sheetClasses.group).find(x => x.default).id`

## Handling Context Menu Myself

Important: Make sure to call the same exact `Hooks.call` invocations so that other modules can hook in to our options.

Share the context menu code so that Characters, NPCs, and Items can use it.

```js
// During activateListeners for the target sheet
new ContextMenu(html, ".item-list .item", [], {onOpen: this._onItemContext.bind(this)});

/**
 * Handle activation of a context menu for an embedded Item or ActiveEffect document.
 * Dynamically populate the array of context menu options.
 * @param {HTMLElement} element       The HTML element for which the context menu is activated
 * @protected
 */
_onItemContext(element) {

  // Active Effects
  if ( element.classList.contains("effect") ) {
    const effect = this.actor.effects.get(element.dataset.effectId);
    if ( !effect ) return;
    ui.context.menuItems = this._getActiveEffectContextOptions(effect);
    Hooks.call("dnd5e.getActiveEffectContextOptions", effect, ui.context.menuItems);
  }

  // Items
  else {
    const item = this.actor.items.get(element.dataset.itemId);
    if ( !item ) return;
    ui.context.menuItems = this._getItemContextOptions(item);
    Hooks.call("dnd5e.getItemContextOptions", item, ui.context.menuItems);
  }
}

/* -------------------------------------------- */

/**
 * Prepare an array of context menu options which are available for owned ActiveEffect documents.
 * @param {ActiveEffect5e} effect         The ActiveEffect for which the context menu is activated
 * @returns {ContextMenuEntry[]}          An array of context menu options offered for the ActiveEffect
 * @protected
 */
_getActiveEffectContextOptions(effect) {
  return [
    {
      name: "DND5E.ContextMenuActionEdit",
      icon: "<i class='fas fa-edit fa-fw'></i>",
      callback: () => effect.sheet.render(true)
    },
    {
      name: "DND5E.ContextMenuActionDuplicate",
      icon: "<i class='fas fa-copy fa-fw'></i>",
      callback: () => effect.clone({label: game.i18n.format("DOCUMENT.CopyOf", {name: effect.label})}, {save: true})
    },
    {
      name: "DND5E.ContextMenuActionDelete",
      icon: "<i class='fas fa-trash fa-fw'></i>",
      callback: () => effect.deleteDialog()
    },
    {
      name: effect.disabled ? "DND5E.ContextMenuActionEnable" : "DND5E.ContextMenuActionDisable",
      icon: effect.disabled ? "<i class='fas fa-check fa-fw'></i>" : "<i class='fas fa-times fa-fw'></i>",
      callback: () => effect.update({disabled: !effect.disabled})
    }
  ];
}

```
