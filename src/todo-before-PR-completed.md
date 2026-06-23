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
- [x] Make generalized sortable listbox the features and promote separation of concerns.
- [x] generalized sortable listbox - fix ondrop
- [x] generalized sortable listbox - fix drag over
- [x] generalized sortable listbox - fix moveUp / moveDown
- [x] Migrate all callers to new listbox, then remove the old one.
- [x] Convert Sheet Tabs Config to use the V2 tab config model
- [x] ~~Plan and resolve errors from the change in the components~~
- [x] Make Undo/Reset work for sheet tab options editor's Tab Visibility fields
  - [x] ~~// TODO: flatten sidebarExpanded into the TabConfig model and have an easier time managing it.~~ 
  - [x] ~~// TODO: Determine if Derived will cause changes to bubble up here from the tabs config editor's value.~~ It doesn't! Found a better way.
- [x] Apply this update to world tab config
- [x] Tab config - Hide visibility column when show is false
- [x] Localize 😱
  - [x] SheetTabConfigurationQuadrone.svelte listbox titles
  - [x] SheetTabOptions.svelte
- [x] Determine if pane version can be removed now that the new sortable listbox is born. It was accounting for undo/reset and rerendering the list.
- [ ] Eliminate getSelectedTabIds()
- [ ] Eliminate getTabVisibilityLevels()
- [ ] Simplify callers receiving settings.
- [ ] `<!-- TODO: Share the item name snippet? -->` / `<-- [ ] <!-- TODO: Share the item show snippet? -->`
  - There is some common HTML between some of the cell snippets which we could share.

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