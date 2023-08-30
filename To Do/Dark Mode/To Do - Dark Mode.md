# To Do - Dark Mode

- [x] Learn how the current dark mode implementation works
- [x] Task out the new version
- [x] Rename the css variables to distinguish them from Tidy 5e until the rewrite is done: `--t5e-...` to `--t5ek-...`
- [ ] Extract the light theme variables into a `light.tidy5e-theme` file; it'll just be json with the exact mappings
- [ ] Find the appropriate hook / timing to apply the initial CSS variables for the currently-selected theme
- [ ] Apply the currently-selected theme variables to the root element
  - [ ] at the earliest reasonable init time (the hook or timing thing mentioned above)
  - [ ] on change of theme
- [ ] Review the dark theme stylesheet and ensure that all of its mappings are accounted for in flat variable bindings; right now, there are some additional styles that are not accounted for
  - [ ] For cases where dark theme has a variable and light theme does not, allow the theme to be blank and unset
- [ ] Create a master list of variables in the form of a TS type and make the light and dark themes adhere to this type; all variables are optional
- [ ] Ensure that changing theme causes the entire master list of variables to be reviewed; when the selected theme has specified something for that variable, set it, else clear that variable from the root element. No one gets left behind. Full reset. This is why we'll have the master list of theme colors.
  - [ ] Also ensure that unset variables are not applied to the root element
- [ ] Add setting for Default Theme which determines what the "default" option maps to
  - [ ] first available options: Light, Dark
  - [ ] Float with commission whether it would be good to default to the OS choice when a default has not been selected yet
  - [ ] plan for the future to allow any of the custom themes that have been imported to be used
- [ ] Upgrade themes so that there is a special collection in player settings that represents the themes
  - [ ] name - the theme's pretty name which will appear in the dropdown and theme buidler
  - [ ] id - we can generate this, or the user can if they wish
  - [ ] description - some editor-enabled text to talk up this theme
- [ ] Ensure that this list has the default light and dark themes included
- [ ] Update the theme selector and default theme selector configs to point to this collection of themes when preparing to present their options
- [ ] Compare PCs
- [ ] Compare NPCs
- [ ] Compare Vehicles
- [ ] Compare Items
- [ ] Celebraaaaate! 🎉🎊


## Refine

- [ ] Reduce duplication of colors in the themes, if possible. Allow specialized colors to reference other variables; think of how Kendo will create variables for specific things but will point them to more generic variables
- [ ] ..


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

