## Theme 3.0

Provide a UI for specifying 0 or more themes for each (optional) Document type + (optional) subtype, in priority order, with the option to further filter by actor data and some included convenience data.

When no document type is specified for a theme, it will be put into an "all" array at the top level.
When no doc subtype is specified for a theme, it will be put into an "all" array at the approprite document type level.
When prioritizing themes,
1. Specificity of Doc type and subtype wins
2. Order of themes within array, with first match being the winner

Array ordering should be dictated by a sort property so that it can be replenished from data each time.

The UI should also allow for Adding, Editing, Duplicating, and Deleting any given theme.

The UI should display the list of themes in arbitrary sort order. At the UI level, we look at a flat list of themes and don't care. The sort numbers are based on the flat list of themes, and all themes can be sorted in whatever priority order makes sense to the user.

Themes can have a name (e.g., "Character Default", "NPC Default", "Faction: the Gauntlet").

The UI should explain the current filter logic and provide a formula editor for it. There should be a link to the wiki to further explain how it works, in the style of the dnd5e wiki article https://github.com/foundryvtt/dnd5e/wiki/Active-Effect-Rules.

Whether in World Theme or individual Sheet Theme management, a user should be able to select a "Theme Template" from the existing named themes at the world level. When selecting a named theme, this simply stamps the theme values to that current theme form, excluding the filter data. You're just soft copying the theme values, basically.

The World theme data is stored in a flat, unoptimized manner, whatever is easiest for persistence and reading back. Whenever it is loaded or changed mid-session, we refresh `CONFIG.TIDY5E.worldThemes`, applying the data in a highly optimized, permuted format that allows for fast lookup in priority order, based on document type and subtype, so that the only thing we're evaluating is an array of filters, trying to find the first match.

As for API integration, callers can hook into `tidy5e-sheet.getSheetThemeSettings` and change it however they see fit. There is no guarantee when manually editing `CONFIG.TIDY5E.worldThemes`, as it is generated from setting data, so a single escape hatch is available for providing a programmatic override.

Any theme options that are specific to a particular document type/subtype will show and hide based on whether a specific document type is selected. If the theme applies to all doc types, all options will be visible.

### TODO

- [x] Model the new world theme setting
  - record of id to - `{ id: string, name: string, documentName: string | undefined, type: string | undefined, sort: number, settings: ThemeSettings, filter: FilterDescription|FilterDescription[], filterMode: 'basic'|'advanced' }`
- [x] Model `CONFIG.TIDY5E.worldThemes`
  - Record of documentName to
    - Record of type to
      - Array of `WorldThemeSetting`
- [x] Implement `CONFIG.TIDY5E.utils.getWorldTheme(doc)` and `CONFIG.TIDY5E.utils.initWorldThemes()`
- [x] Implement setting wire-up that permutes the world theme data onReady and thereafter onChange into `CONFIG.TIDY5E.worldThemes` via `CONFIG.TIDY5E.utils.initWorldThemes()`
- [x] Provide hook `tidy5e-sheet.getSheetThemeSettings` to allow mutating/replacing sheet themes
- [ ] Set up `ThemeQuadrone.getSheetThemeSettings` to pull the most appropriate setting from `CONFIG.TIDY5E.worldThemes`
- [ ] Create temporary setting menu to house the settings until it gains enough traction
- [ ] Implement the theme list / management UI
- [ ] Lay out the content
  - Management column
    - List of current themes (drag/drop to sort | click up/down arrows to move in sort)
    - Add Button at bottom, like in journals
  - Edit column
    - Name
      - default: New World Theme
    - Target
      - Document - Actor, Item
      - Type - enumerate the subtypes of the chosen document
    - Theme Settings
    - Filters
      - Basic view
      - Advanced view
- [ ] Implement the theme filter UI which appears only in World Theme mode
- [ ] Implement theme show/hide logic based on document type
- [ ] Implement "Basic" filter options, which is a UI that builds up the advanced filter
  - Folder (enter multiple with semi-colons)
  - Document Location - Anywhere (Default), Sidebar, or Compendium
- [ ] Implement "Advanced" filter options, which is a formula editor that allows full control
- [ ] Implement new config scaffolding to manage world themes and to load/save all the data as a whole
- [ ] Wire into World Settings
- [ ] // TODO: Figure out how worldThemes onChange should work. Perhaps a hook callAll so any Tidy document can refresh itself?
- [ ] /* TODO: Determine if we need to supply alternateDefaults */
- [ ] /* TODO: Do we need to pass down a temp copy, or have the settings properly updated globally by now? */
- [ ] Set up hook subscriber for `tidy5e-sheet.worldThemesConfigChanged` on all sheets to refresh their individual themes accordingly.
- [ ] Somehow delineate in an obvious way that there are configs that are generated rather than updated directly. They should possibly be located in a specific place in CONFIG.TIDY5E that is roped off.
- [ ] // TODO: Extract to TidyHooks


### Filter Notes

system script: filter.mjs

Example of using the filter
```js
const actor = fromUuidSync('Actor.bfh29vIEoGzI240e');
const folderPath = actor.folder ? [actor.folder, ...actor.folder.ancestors].reverse().map(f => f.name).join("/") : "Root";
folderPath
const data = { actor, folder: folderPath };

// An array translates to "AND" on all entries
const filter = [
    {
        k: 'folder',
        v: 'A Folder/Faction - Buttercream Gang'
    },
    {
        k: 'actor.inCompendium',
        v: false
    }
];
dnd5e.Filter.performCheck(data, filter)
```