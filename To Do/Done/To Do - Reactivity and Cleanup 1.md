## Side Quests

- [x] Update character sheet to ambiently memoize selected tab ID
- [x] ~~Redo prosemirror content in svelte~~ That's a larger ask, and it shields me from the challenges of integrating these sheets with non-svelte content. I instead used `{#key content}` to ensure each sheet editor was destroyed and rebuilt when their content changed. This, combined with "when do I want to refresh content?", works out really well. So, I added a SheetStats store that provides into like lastSubmissionTime, and soon, selectedTabId, expanded items, and scroll tops.
- [x] Test out the RefreshAfterSubmission component, and then propagate it to all articles/containers that use `SheetEditor`.
  - [x] Biography Tab
  - [x] Journal Tab
- [x] Update character sheet to Svelte Mode
    - Progress: things wire up and render initially. Subsequent changes do not get visualized. Context is a nested object. This might be the reason. What is the svelte-y way to do this?
    - [x] Eliminate sheetFunctions and use the actor sheet class directly.
- [x] Make shared component for nav tabs and eliminate the separate stylesheet
- [x] Make a second pass at nav tabs and make sure it's ergonomic enough. Look at some other examples out there.
- [x] Consider adding a third prop to the Tabs type which allows for specifying a component and its props. Use this to make tabs fully data-driven 🤯
- [ ] Task out Custom Item sheet and try out a new approach to the sheet, using the `TestApplication.ts` and `Experiment.svelte` as examples. Find the appropriate hooks via `CONFIG.debug.hooks = true`.
  - [x] ~~Be sure that you subscribe to a hook when the application is to be initially rendered and then unsubscribe when it closes, to prevent excess processing and unforeseen issues.~~ Overriding the render() function did the trick. Preventing unforced renders and simply updating the window title and refreshing store made the magic happen.
  - [x] ~~One thing to think about: try subscribing at the top level to the context and then passing it down and around, rather than passing the store everywhere.~~ Store is in context API ✅
  - [x] ~~The end result should be relatively easily portable to the old method if the new method doesn't work out. Just some rewiring at the top ✅~~ Nah, we're good.
- [x] Implement "+Temp +Max" HP and config button cog on the character profile 😱