## Side Quests

- [x] Update character sheet to ambiently memoize selected tab ID
- [x] ~~Redo prosemirror content in svelte~~ That's a larger ask, and it shields me from the challenges of integrating these sheets with non-svelte content. I instead used `{#key content}` to ensure each sheet editor was destroyed and rebuilt when their content changed. This, combined with "when do I want to refresh content?", works out really well. So, I added a SheetStats store that provides into like lastSubmissionTime, and soon, selectedTabId, expanded items, and scroll tops.
- [x] Test out the RefreshAfterSubmission component, and then propagate it to all articles/containers that use `SheetEditor`.
  - [x] Biography Tab
  - [x] Journal Tab
- [x] Update character sheet to Svelte Mode
    - Progress: things wire up and render initially. Subsequent changes do not get visualized. Context is a nested object. This might be the reason. What is the svelte-y way to do this?
    - [x] Eliminate sheetFunctions and use the actor sheet class directly.