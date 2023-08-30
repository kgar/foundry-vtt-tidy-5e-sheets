# To Do - Dark Mode

- [x] Learn how the current dark mode implementation works
- [x] Task out the new version
- [x] Rename the css variables to distinguish them from Tidy 5e until the rewrite is done: `--t5e-...` to `--t5ek-...`
- [x] Extract the light theme variables into a `light.tidy5e-theme` file; it'll just be json with the exact mappings
- [x] Find the appropriate hook / timing to apply the initial CSS variables for the currently-selected theme
- [x] Apply the currently-selected theme variables to the root element
  - [x] at the earliest reasonable init time (the hook or timing thing mentioned above)
  - [x] on change of theme
- [x] Ensure that changing theme causes the entire master list of variables to be reviewed; when the selected theme has specified something for that variable, set it, else clear that variable from the root element. No one gets left behind. Full reset. This is why we'll have the master list of theme colors.
  - [x] Key - the variable name
  - [x] Value
    - [x] type - maybe consider putting some kind of MDN-friendly type text here that would guide in what kind UI to present
    - [x] group - a logical grouping to put the variable in when rendering the UI
- [ ] Review the dark theme stylesheet and ensure that all of its mappings are accounted for in flat variable bindings; right now, there are some additional styles that are not accounted for
  - [ ] For cases where dark theme has a variable and light theme does not, allow the theme to be blank and unset
- [ ] Create a master list of variables in the form of a TS type and make the light and dark themes adhere to this type; all variables are optional
- [ ] Trim all unused variables
  - [ ] Also ensure that unset variables are not applied to the root element
- [ ] Add setting for Default Theme which determines what the "default" option maps to
  - [ ] first available options: Light, Dark
  - [ ] Float with commission whether it would be good to default to the OS choice when a default has not been selected yet
  - [ ] plan for the future to allow any of the custom themes that have been imported to be used
- [ ] Upgrade themes so that there is a special collection in player settings that represents the themes
  - [x] name - the theme's pretty name which will appear in the dropdown and theme buidler
  - [x] id - we can generate this, or the user can if they wish
  - [x] description - some editor-enabled text to talk up this theme
  - [x] version - a number to represent the evolving theme file format, incremented by 1, provided by Tidy 5e on export; should be used when migrating to more current versions of the theme
  - [x] variables - the JSON object containing the variable names and their values
  - [ ] ...?
- [ ] Ensure that this list has the default light and dark themes included
- [ ] Update the theme selector and default theme selector configs to point to this collection of themes when preparing to present their options
- [ ] Update English localization for the light/dark options to exclude the notion that Light is the default theme.
- [ ] Compare PCs
- [ ] Compare NPCs
- [ ] Compare Vehicles
- [ ] Compare Items
- [ ] Celebraaaaate! 🎉🎊

## Oops

- [x] PC tool proficiencies are missing? Put them back - I think it was from a recent dnd5e update; thankfully, this will be covered in my automated tests later, so catching this stuff will be a breeze

## Refine

- [ ] Finally fix the multiply tinting / darkening issue with profile pictures and HP overlays
  - inspo: https://www.youtube.com/watch?v=TAA89nkEuhw&ab_channel=KevinPowell
  - inspo: https://codepen.io/kevinpowell/pen/OJpYKNR/3cf5d075a29e2d702c02ee7387d516c2
- [ ] Reduce duplication of colors in the themes, if possible. Allow specialized colors to reference other variables; think of how Kendo will create variables for specific things but will point them to more generic variables
- [ ] Refine: rename the font-family-specific variables to something more geared to their purpose and not to the font family itself.
- [ ] Refine: setting properties directly on root is not very Tidy of me. Consider using a template stylesheet in which I can replace all the contents each time with the new theme ruleset. See https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/replace
- [ ] Document it: add a readme to the theme folder that explains how to add new variables, remove variables, etc.
- [ ] Import in Tidy 5e-ified TinyMCE styles
  - [ ] Compare PCs in light mode
  - [ ] Compare PCs in dark mode
- [ ] inline the Class Advancement SVGs
  - [ ] create a component called InlineSvg that takes a url
  - [ ] fetch the content via the url in the component
  - [ ] render the return value on the screen
  - [ ] if error, then attempt to put it to an `img[src]`
- [ ] set the class advancement SVG fills to our `--t5ek-primary-font` value 💪
- [ ] set the width/height of the SVG images appropriately
- [ ] leave the image filter variable intact as a fallback, and have the styles support it


### Tiny MCE Styles

```css
```

### Tiny MCE Dark Mode Styles

```css
/* This is TinyMCE */
.tox .tox-toolbar-overlord button {
  color: #222;
}

.tox-sidebar-wrap {
  padding: 8px;
  background: var(--t5e-secondary-color);
}
```

## Current Setup

Setting: colorScheme

When colorScheme is "dark", then `tidy5eDark` is added to the html element (😱).
After declaring the setting and its onchange handler, it then checks the setting immediately and applies the dark-mode class to the html element.


## Color Picker Customization

Color Picker Customization is not directly related to the initial dark mode implementation. It is layered on optionally (if colorPickerEnabled is true) during

- `Hooks.on("renderTidy5eNPC", ...)`
- `Hooks.on("renderTidy5eSheet", ...)`
- `Hooks.on("renderTidy5eVehicle", ...)`

It would be best to avoid using this code, if possible.

