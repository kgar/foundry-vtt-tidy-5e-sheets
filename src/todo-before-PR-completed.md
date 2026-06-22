- [x] Fix the tab config world setting itself to be the new format
  - [x] ~~Apply a version prop to the setting ;)~~ deferred
  - [x] Shim from old format when found
  - [x] In SettingsProvider, do the mapping
    - Is there a way to do it as part of the settings setup itself...?
  - [x] Ditto the setup from Sheet Flags for sheet-specific tab config
- [x] Simplify hasChanges for tab configs. No more canonical ordering during snapshot.
- [x] Ensure sheet tab settings will render the world setting (when present) when the sheet has no tab config for a section.
- [x] Ensure sheet tab settings will render the world default when the sheet has no tab config for a section and there is not a world setting in place for the tab.
- [x] Ensure sheet tab settings will render tab config for a section when available
- [ ] Make generalized sortable listbox the features and promote separation of concerns.
- [ ] Migrate all callers to new listbox, then remove the old one.
- [ ] Convert Sheet Tabs Config to use the V2 tab config model
- [ ] Convert Sheet Tab Options to use the V2 tab config model
- [ ] Plan and resolve errors from the change in the components
- [ ] Apply this update to world tab config

## Research on TabConfigContextEntry

It's used in
- BasicTabSettingsPane.svelte
- SpecialTraitsPane.svelte
- TabVisibilityControls.svelte
- SheetpTabOptions.svelte
- SortableListbox.svelte
- sheet-tabs-configuration-settings-editor.svelte.ts
- world-sheet-configuration-settings-editor.svelte.ts
- world-tab-configuration-settings-editor.svelte.ts
- tab-configuration-functions.ts
- tab-configuration.types.ts

Props usage:
- documentName
- documentType
- title
- allTabs
- defaultTabs
- tabs
- defaultSelected
- defaultUnselected
- selected
- unselected
- visibilityLevels
- docTypeKeyOverride
- sidebarExpandedByTabId

Props explanations:
- documentName
- documentType
- title
- allTabs
- defaultTabs
- tabs
- defaultSelected
- defaultUnselected
- selected
- unselected
- visibilityLevels
- docTypeKeyOverride
- sidebarExpandedByTabId