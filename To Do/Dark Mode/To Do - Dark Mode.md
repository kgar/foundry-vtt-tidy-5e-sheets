# To Do - Dark Mode

- [ ] Learn how the current dark mode implementation works
- [ ] Task out the new version


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

