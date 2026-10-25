## Theme 3.0

Provide a UI for specifying 0 or more themes for each (optional) Document type + (optional) subtype, in priority order, with the option to further filter by actor data and some included convenience data.

Priority is strictly the sort order of the entries. For this to work, we must permute all of the configs across document names and types, according to their selections (or lack of selections denoting ALL).

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


- [ ] Implement new settings editor to manage world themes and to load/save all the data as a whole and be able to undo / reset to default
  - No Reset World Default option
  - Undo Changes works on the currently selected theme
  - Save saves the whole thing
- [ ] Wire into World Settings
- [ ] /* TODO: Do we need to pass down a temp copy, or have the settings properly updated globally by now? */
- [ ] // TODO: Extract to TidyHooks
- [ ] applyCurrentThemeSettingsToStylesheet - retrofit to hard require a document
- [ ] Sheet settings should pull the world theme settings appropriate to that document and show those as the defaults for that form.
- [ ] Goal: Theme settings should be passed down through context and is never pulled out of the air in a svelte component.
- [ ] Goal: Theme Settings should refresh on a sheet when the sheet meets the criteria to change ; maybe we can hold a snapshot or some kind of JSON string copy to compare on each render and selectively update on actual change? Or pursue a more svelte-reactive approach that will yield the proper side effect in the style sheets when an actual change occurs in a theme setting.
- [ ] Enforce data model validation on save and when initializing CONFIG.TIDY5E.worldThemes?
- [ ] // TODO: to theme.ts | and on that note, registry utils.ts should really just pull in other scripts and aggregate them in, say, main.svelte.ts.
- [ ] // TODO: Absorb all the theme things into here. Strongly consider absorbing ThemeQuadrone, too.
- [ ] Reimplement import and export
  - This will need some planning. It would be nice to be able to bulk import world themes, as well as import individual theme settings. Import/export may mean something different for a sheet theme setting and a world theme setting. Or both types may be present for world theme settings.
- [ ] // TODO: need a util for getting full folder path


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

### Sample Code


Sample theme 1:

```json
{
    "accentColor": "rgb(31, 76, 145)",
    "actorHeaderBackground": "assets/map-faerun.webp",
    "useBasicTheme": false,
    "useHeaderBackground": true
}
```

Sample theme 2:

```json
{
    "accentColor": "rgb(55, 109, 71)",
    "useBasicTheme": true,
    "useHeaderBackground": false
}
```

Settings:


```js

game.settings.set('tidy5e-sheet', 'worldThemes', {
    '1234567': {
        id: '1234567',
        name: 'Lich Gang Theme',
        documentName: ['Actor'],
        sort: 1,
        settings: {
            "accentColor": "rgb(55, 109, 71)",
            "useBasicTheme": true,
            "useHeaderBackground": false
        },
        filter: '{\n  "k": "folder",\n  "v": "/A Folder/Faction - Buttercream Gang"\n}',
        filterMode: 'basic'
    },
    '7654321': {
        id: '7654321',
        name: 'Vorpal Weapons',
        documentName: ['Item'],
        type: ['weapon'],
        sort: 2,
        settings: {
            "accentColor": "rgb(31, 76, 145)",
            "actorHeaderBackground": "assets/map-faerun.webp",
            "useBasicTheme": false,
            "useHeaderBackground": true
        },
        filter: '{\n  "k": "document.name",\n  "o": "icontains",\n  "v": "vorpal"\n}',
        filterMode: 'advanced'
    }
});

```

### Links

- dnd5e wiki filter examples - https://github.com/foundryvtt/dnd5e/wiki/Active-Effect-Rules
