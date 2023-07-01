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


## Hooks

it is advised to set `CONFIG.debug.hooks = true` when looking for hooks as this will print them to the console as they happen


## Settings

when registering settings, those marked as `config: true` will appear in the config menu; those marked as `config: false` can be put into a custom dialog

`game.settings.register` : registers a setting

`game.settings.registerMenu` : adds a button to the relevant config screen and allows you to put up a form application with your own settings / etc.


## Pro Tips

- globalThis `dnd5e` is chock full of valuable content such as `dnd5e.applications.actor.ActorHitDiceConfig` class among other actor classes for summoning dialogs. This is a crucial piece to have available so that the sheets do not have to rely on magic / invisible jquery targets.


## Links

- https://tobiasahlin.com/blog/move-from-jquery-to-vanilla-javascript/ 😈