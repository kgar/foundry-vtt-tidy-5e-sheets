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