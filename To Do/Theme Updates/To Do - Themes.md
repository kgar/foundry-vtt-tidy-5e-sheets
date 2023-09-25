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
- [x] Update the form to use the default Light colors rather than their hardcoded values
- [x] Add "Use Default Colors" button which will update the form to have the default colors for the relevant settings
- [x] Spec out v1 ".tidy5e-theme" file
- [ ] Add "Import Theme Colors" button
  - [x] Can I just have a hidden File input and manage that? If not, then proceed with the other stuff
  - [x] On submit,
    - [x] Read the file
    - [x] Validate it
    - [x] Apply the values to the form store
  - [x] Add drop-zone support for the file, if not already enabled by the file input
- [x] Add "Export Theme Colors" button
  - [x] On click, create a v1 ".tidy5e-theme" file and issue download to user

## Refine

- [x] Pull css variable knowledge into the setting provider. For the type, use `keyof` or a similar thing to track actual theme reference variables
- [x] Don't change user input for them when they are in the middle of typing a color. This is happening indirectly because of trying to parse to the color picker, and the color picker is reciprocating the input event.
- [x] Upgrade the Cog button for Sheet Settings on the sheet to instead feature vertical dots and show a menu
  - [x] Theme dropdown (change theme setting on select / apply theme on change)
  - [x] Sheet Settings option
  - [x] Theme Settings option
- [x] Split "Use Default Colors" to "☀ Default Light" and "🌙 Default Dark" and map accordingly
- [x] Consider using the new menu and putting these options to the right of the checkbox in a menu button such as "🔽 Actions" or simple vertical dots. Poll the gang about it.
- [x] Button Menu - upgrade the button menu commands to allow for a dedicated section for icons that is a fixed flex-basis, whether or not there's an icon present. Update all callers to use the component rather than feeding in their own inner contents.
- [x] Figure out how to keep the named color rather than converting it to hexa when the user provides it. Only put the named color to hexa for the color picker to use, allowing the user to riff on a named color
- [x] Extract file processing code to util-oriented location
- [x] Extract theme validation / parsing to theme.ts
- [x] Convert Sheet Redrawing so that there is a global store specifically for housing current settings. Whenever settings are adjusted by conventional means, or when a sheet is opened, or any other scenario that makes sense, update the store.
  - [x] Remove the sheet redrawing feature so that t5ek sheets only update the pieces that changed
  - [x] Update all SettingProvider callers to instead use the store
- [x] Refactor / monkey patch onChange() for all settings. If a setting changes, debounce a call to update the settings store. 👏👏👏
  - [x] It almost works. Check on floating/flyout cards in settings.
  - [x] Tab changes like showing/hiding the Journal aren't working for player characters when changing settings. Fixit!
  - [x] Move Traits Below Resources is not working reactively on change. Fixit.
  - [x] Rename `currentSettings` to `settingsStore`
- [x] Add explanatory paragraph to Theme Settings which explains how to use the form, including the hint about being able to drag and drop a file to import settings.

## Svelte Button Menu

> [!todo] Goal
> Build a button-based menu which supports
>
> - button-based options
> - options which are containers for other HTML, such as select inputs, checkboxes, etc.
> - dividers
> - slot-based composition with
>   - `<ButtonMenuButton>` - the button which manages the menu; takes slot content for its inner HTML
>   - `<ButtonMenu>` - the container which houses the menu; takes slot content for its children
>   - `<ButtonMenuCommand>` - a button menu item which functions as a button and exposes a click event
>   - `<ButtonMenuItem>` - a generic menu item which can house anything
>   - `<ButtonMenuDivider>` - a presentational divider (has to be a compatible HTML element, like a `li`, `ol`, or `ul`; probably gonna be a presentational `li`)
> - props
>   - open
>   - ...?
>
> Ensure all of the appropriate accessibility features are built in

- [x] Create components
- [x] Implement bare bones version without styles on a standalone svelte instance for speed of development
- [x] Bring into foundry
- [x] Style the components based on CSS variables and theme
  - [x] colors
  - [x] spacing
  - [x] roundness
  - [x] open/closed state for target button
  - [x] font
- [x] Test in popout!
- [x] Test in window tabs
- [x] Handle automatic positioning if possible
- [x] ~~If able, make the menu fixed and outside of its parent window; this might need some creativity...~~ nah
- [x] Rename SettingsMenu - SheetMenu
- [x] Delete SettingsButton and replace with SettingsMenu

> Scratch pad repo : git@github.com:kgar/svelte-button-menu.git

> Notes: It mostly works in popout! The main problem is that I rely on "click outside functionality". Should I try an invisible overlay? Or should I just accept that popout! has that limitation? For now, I think the latter. It can be closed by clicking the menu button again.

## Fixit

- [x] PC: The card header colors in Favorites are sometimes wrong, especially for pact spells
- [x] The item info card is not just hiding content when animating open or closed. Ensure that it's not squishing content and instead just hiding it.
- [x] Vehicle: the Description tab has 2 scrollbars
- [x] The item card has a weird white right border when flying out to the left in dark mode
- [x] Fix error related to needing to provide an \_updateObject implementation in the theme settings form.
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
