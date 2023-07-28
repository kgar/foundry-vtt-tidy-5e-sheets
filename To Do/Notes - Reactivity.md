Dealing with the constant renders and their complete destruction of the DOM is a real pain and presents numerous technical challenges when making an interactive character sheet. Wouldn't it be nice if I could have the contextual data and any other niceties of the 5e sheet without the hassle of having to refresh handlebars over and over?

See `TestApplication.ts` and `Experiment.svelte`. I was able to come up with a sheet that holds onto an instance of the Actor 5e character sheet and use it for getting data, activating listeners for things like prose mirror, etc. Meanwhile, I was able to respond to actor changes by using the hook which notifies of actor changes 💪.

I don't know how performant it would be to have a store-based / hook-based approach like this when scaled out to the entire form, but it is something I could prototype with the Item sheet. Maybe I'll do that next and then see how it goes.

## Leveraging Hooks

Got to be responsible here. We should only hook in as needed and unhook as soon as possible.

When subscribing to a hook, we receive a hook ID:

```
Hooks.on('renderTidy5eKgarCharacterTabs', (...args) => console.log('We did it!'))
// returned 35 as the Hook ID in this example
```

To unhook predictably, just use that hook ID:

```
// using the returned Hook ID of 35...
Hooks.off('renderTidy5eKgarCharacterTabs', 35);
```

## Ruminations on Discord

https://discord.com/channels/732325252788387980/1116078321067892796/1133630270126432317

kgar — Yesterday at 12:21 AM
A quick note on the favorites feature. The implementation was very chill. Out of 770+ lines of favorites code, very little survived. This comes with the caveat that module integration, which favorites was chock full of, must be done differently in the rewrite. I should not be packing more data into actor / item context while trying to show you your favorite things from the character sheet.
Instead, if there is some aspect that needs to integrate with another module, like Magic Items, Actions, or something like that, there will be options in the API and hooks for augmenting Tidy 5e.
I have been experimenting in this regard.

kgar — Yesterday at 12:36 AM
I was able to make the player character tab strip and tab content viewing area data-driven, and I was able to pass in svelte components and their props to have them dynamically render out to the character sheet. I've already set up a custom hook for the future to allow module creators to take the current list of tabs and adjust it, such as, say, adding a new tab with totally different content. When I get a chance to dig more into that, I want to expand it beyond svelte components to allowing non-svelte callers to inject HTML. I'll have to ponder how to do this.
In thinking about module compatibility, hooks, and API calls, I'm currently looking to this approach: whereas a hook would allow someone to make changes in the moment while a sheet is being prepared, an API call would allow a module developer to take something like the default set of Character Sheet tabs and add their own to that list, as well as reorder them, etc., whenever they wish, such as at application startup, and only once, if they wish. If one were to call the API and add a tab at app startup, for example, all subsequent renderings of the character sheet would already have that new tab in the list to render, because the blueprints were changed. In both cases, I plan to put hooks into each process where I can and provide a companion API call.
This part will be a longer project, beyond the initial rewrite, because it will require that I make many parts of Tidy 5e sheet data-driven and dynamically rendered, and there is a balance to that, to avoid making it hard to maintain or support while also giving developers the appropriate hooks to augment Tidy 5e sheets.


https://discord.com/channels/732325252788387980/1116078321067892796/1134129677670285313

kgar — Today at 9:26 AM
I still have some back-of-mind concern about exactly how to implement these content addition APIs, and what it'll take to ensure reliable reactivity for svelte and non-svelte callers alike.

For non-svelte callers, I was thinking of giving them two steps:
get content : a function that expects a string or HTML
activate listeners : a function that intentionally mirrors the doc sheet activateListeners function and also includes a reference to the sheet itself, which should give the caller all they need in order to wire up logic.

The reactivity angle for non-svelte callers is what has got me. I'll need to figure out how to completely re-render non-svelte content each time, because I'm currently on a path for svelte stuff to only rerender fully when game settings change. Other than that, svelte content just remains around with more targeted reactivity. Maybe after a few experiments (weeks from now?), the answer will become clearer.

For svelte callers, I'm still puzzling a bit on the specifics, but in general, it should work. I will have context available via getContext<T>, so technically, I should be able to make a working demo even today. Part of the available context is a Readable Store of the actor sheet context, which is the handy data object that is formed when calling the dnd5e character sheet's getData function.