## To Do

- [x] Relocate theme management to its own config menu
- [x] Add primary accent color to color picker settings
- [x] Implement the existing color picker settings, plus primary accent color, using minimal layout and focusing entirely on functionality
- [x] Make them live-update the page via setting props on the HTML node
- [x] Add ability to save changes
- [x] Apply theme overrides when applying the theme, if the box is checked. Put a TODO comment there about how this feature is temporary and will be replaced by full-fledged alternate themes.
- [x] When closing the dialog, remove all tidy css variables from the HTML node
- [x] Get a non-foundry-module color picker and leverage it
  - [x] Summon the color picker by clicking a button beside the input
  - [x] Try to populate the picker with the currently-selected color, else default
  - [x] When the picker is ready, trigger change on the appropriate field, and then forward any changes to the target store prop
- [x] Apply a pretty layout for color picker settings once it is fully functional
  - [x] Visualize the selected color to the right of the picker in the form of a rectangle
  - [x] the rest
- [ ] Update the form to use the default Light colors rather than their hardcoded values
- [ ] Add "Use Default Colors" button which will update the form to have the default colors for the relevant settings
- [ ] Add "Import Theme Colors" button
- [ ] Add "Export Theme Colors" button

## Refine

- [x] Pull css variable knowledge into the setting provider. For the type, use `keyof` or a similar thing to track actual theme reference variables
- [x] Don't change user input for them when they are in the middle of typing a color. This is happening indirectly because of trying to parse to the color picker, and the color picker is reciprocating the input event.
- [ ] Figure out how to keep the named color rather than converting it to hexa when the user provides it. Only put the named color to hexa for the color picker to use, allowing the user to riff on a named color
- [ ] ...?
- [ ] Convert Sheet Redrawing so that there is a global store specifically for housing current settings. Whenever settings are adjusted by conventional means, or when a sheet is opened, or any other scenario that makes sense, update the store.
  - [ ] Update all SettingProvider callers to instead use the store
  - [ ] Remove the sheet redrawing feature so that t5ek sheets only update the pieces that changed
- [ ] Upgrade the Cog button for Sheet Settings on the sheet to instead feature vertical dots and show a menu
  - [ ] Theme dropdown (apply theme on change)
  - [ ] Sheet Settings option
  - [ ] Theme Settings option
- [ ] Move setting (and theme types, if any are still lingering) out of script files and into dedicated type files to help prevent circular dependencies and allow FoundryAdapter to take some more responsibility over Foundry API stuff.

## Fixit

- [x] PC: The card header colors in Favorites are sometimes wrong, especially for pact spells
- [x] The item info card is not just hiding content when animating open or closed. Ensure that it's not squishing content and instead just hiding it.
- [x] Vehicle: the Description tab has 2 scrollbars
- [x] The item card has a weird white right border when flying out to the left in dark mode
- [x] Fix error related to needing to provide an _updateObject implementation in the theme settings form.
- [x] The color picker doesn't respond well to dark mode.

### update object error

```
foundry.js:5919 Error: A subclass of the FormApplication must implement the _updateObject method.
    at Tidy5eKgarThemeSettingsSheet._updateObject (foundry.js:6018:11)
    at Tidy5eKgarThemeSettingsSheet._onSubmit (foundry.js:5916:18)


// Offending code
  /**
   * This method is called upon form submission after form data is validated
   * @param {Event} event       The initial triggering submission event
   * @param {object} formData   The object of validated form data with which to update the object
   * @returns {Promise}         A Promise which resolves once the update operation has completed
   * @abstract
   */
  async _updateObject(event, formData) {
    throw new Error("A subclass of the FormApplication must implement the _updateObject method.");
  }
```

## Stretch

Upgrade so that we have world themes set by the GM, user themes set by individual users, import/export functionality, and access to all relevant CSS variables in our theme setup. Variables should be grouped and prioritized so that the most important / widest-reaching stuff is near the top. For colors, valid values should include all the usual color strings, as well as references to other variables. There should be the ability to reference either the color picker or a variable picker which knows all the existing color variables, excluding self, of course.

etc.

- [ ] Allow hex, hex-alpha, rgb, rgba, hsl, hsla
  - [ ] Validate fields?
- [ ] Add a config setting which represents the configurable theme(s)
  - make clientCustomThemes client-scoped, config false, default null
  - make worldCustomThemes client-scoped, config false, default null
  - coalesce null themes to empty set when getting setting
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

## Config Setting - customThemes

Add a config setting, client-scoped, config false, default null.
When the setting is null, it should migrate the current colorpicker settings in as the array-of-1 themes for the initial version.
This will be the initial mapping from

```ts
// theme.ts / the types file
type CustomThemes = {
  version: number;
  themes: Tidy5eTheme[];
};

// theme.ts / where we keep applyTheme function
export function getDefaultCustomThemesSetting(): CustomThemes {
  return { version: 1, themes: [] };
}

// settings.ts
// Theme Building
clientCustomThemes: {
  options: {
    name: 'T5EK.ThemeSettings.MyThemes.Name',
    hint: 'T5EK.ThemeSettings.MyThemes.Hint',
    scope: 'client',
    config: false,
    default: null,
    type: Object,
  },
  get() {
    return (
      FoundryAdapter.getGameSetting<CustomThemes | null>(
        'clientCustomThemes'
      ) ?? getDefaultCustomThemesSetting()
    );
  },
},

worldCustomThemes: {
  options: {
    name: 'T5EK.ThemeSettings.ThemesForEveryone.Name',
    hint: 'T5EK.ThemeSettings.ThemesForEveryone.Hint',
    scope: 'world',
    config: false,
    default: null,
    type: Object,
  },
  get() {
    return (
      FoundryAdapter.getGameSetting<CustomThemes | null>(
        'worldCustomThemes'
      ) ?? getDefaultCustomThemesSetting()
    );
  },
},

```
