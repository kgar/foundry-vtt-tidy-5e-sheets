## Notes

The settings dialog
- is too small
- does not adhere to Tidy 5e theming
- requires too many clicks to get to essential settings
- can give option fatigue to a casual user
- can give option fatigue to the DM
- has a random empty Info section
- uses handlebars
- is fairly manual to upkeep
- confusingly jams color picker settings into the Player tab
- strongly recommends dependency on the color settings module in order to select and view colors

## To Do

For the new setup, I would like the following to be true:
- [ ] Create svelte-based form application for viewing settings
  - [ ] Be able to populate this form with content that is tabbed and ordered in a data-driven way
- [ ] The settings dialog window defaults to a large surface area and provides ample room to look around
- [ ] The settings dialog uses Tidy 5e theming
  - [ ] Apply the currently-selected theme
  - [ ] Adjust theme if color picker is turned on and colors are being adjusted
- [ ] Provide a button or icon in each sheet type somewhere universal which will open a settings form dedicated to that sheet
  - [ ] Consider whether to provide trimmed down sheet or simply go to the appropriate tab upon initialization / something to float with the commission
- [ ] Relocate/slightly refine theme management
  - [ ] Ensure the theme application code takes color picker fields into account
  - [ ] Include the primary accent color in color picker settings
  - [ ] If color picker fields are different now, then allow the user to pull up the old color picker settings
  - [ ] Move themes to their own settings menu button and dedicated dialog - include cancel and save button, and live-update the CSS variable colors as the user makes changes
  - [ ] Use a non-foundry color picker that can bundle with this module and not require another foundry module dependency
  - [ ] Allow for referencing other variables (and support drag'n'drop if possible) when selecting colors
- [ ] Allow the user to view the full suite of options from Configure Settings / Sheet Options menu button
- [ ] Consider what to do about the info section
  - It could be an opportunity to put my author info, github repo links (submit an issue, suggest a feature, contribute), credits, ko-fi / patreon, etc.
- [ ] Ensure that non-client-level options are not available to regular users, GM-only