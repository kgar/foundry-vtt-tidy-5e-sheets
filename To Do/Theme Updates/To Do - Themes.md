## To Do

- [x] Relocate theme management to its own config menu
- [ ] Add a config setting which represents the configurable theme(s)
  - client-scoped, config false, default null
  - when null on init, migrate theme settings v1
- [ ] Bump the legacy (null version) color picker settings to a legacy settings file to be invoked during settings registration
- [ ] Lay out the color picker settings
  - This includes only the currently supported variables, plus the primary accent color
  - Use text inputs
- [ ] Add a Save button
  - When saving, unset and reset the customThemes config
- [ ] Update the theme application code to overwrite any configured colors when colorPickerEnabled
- [ ] On save, call Apply Theme
- [ ] Upgrade the color picker so that while viewing the dialog, colors are live-updated on the HTML element
  - on mount, check whether enabled; if enabled, apply all variables to HTML element
  - on change with any of the variables, apply just the changed variably to HTML element
- [ ] Add cancel button
- [ ] Include button "Import Legacy Settings" which takes the legacy color picker settings and sets them over the new variables; it will map from the old names to the new names, also
- [ ] On dialog close, remove all tidy 5e CSS variables from the HTML element
- [ ] Upgrade color picker inputs to allow for using a color picker
- [ ] Upgrade color picker inputs to allow for selecting another CSS variable from the collection
  - options include only the currently-changeable CSS variables

## Config Setting - customThemes

Add a config setting, client-scoped, config false, default null.
When the setting is null, it should migrate the current colorpicker settings in as the array-of-1 themes for the initial version.
This will be the initial mapping from

```ts
type CustomThemes = {
  version: number;
  themes: Tidy5eTheme[];
};
```

## Stretch

- [ ] Add import/export buttons
  - Export a Tidy5eTheme with `version: number` based on the current version number
  - Import a Tidy5eTheme with `version: number` included to hint at what migrations, if any, are needed
- [ ] Create a separate To Do folder for evolving the theme to use CRUD
- [ ] Evolve theming so that the theme config is a CRUD admin interface that saves themes as Client scoped
  - [ ] Include all client-scoped themes in the Color Scheme dropdown on the main config settings interface
  - [ ] Add a checkbox "Make this my current theme" which will switch themes for the user upon save
  - [ ] Add a control to the table of themes that allows for quickly selecting the user's current theme
  - [ ] Add import command / functionality for the dialog at large
  - [ ] Ensure row commands: Edit, Export, Set as Current Theme (alt: Is Current Theme, with disabled command), Duplicate, Delete
  - [ ] On creating a new theme, prompt whether to base it on Light, Dark, or Empty theme. If light or dark are selected, simply clone the variables object from the appropriate default style.
- [ ] Expand theming so that a theme can be "Available to (Me / Everyone)"; which will put the theme in either the customUserThemes or customWorldThemes
  - [ ] GM only, include radio buttons or exclusive button group to indicate scope
  - [ ] GM only, include column on the theme table indicating scope (world icon with "Everyone" | person icon with "Me")
- [ ] Task out this project as a separate effort: expand theming out to all variables; apply grouping and sectioning