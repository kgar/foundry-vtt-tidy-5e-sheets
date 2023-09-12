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

- [x] Create svelte-based form application for viewing settings
  - [x] Be able to populate this form with content that is tabbed ~~and ordered in a data-driven way~~
- [x] The settings dialog window defaults to a large surface area and provides ample room to look around
- [x] The settings dialog uses Tidy 5e theming
  - [x] Apply the currently-selected theme
- [x] Provide a button or icon in each sheet type somewhere universal which will open a settings form dedicated to that sheet
- [x] ~~Consider whether to provide trimmed down sheet or~~ simply go to the appropriate tab upon initialization ~~/ something to float with the commission~~
  - Simplest approach: select the current tab based on which sheet was clicked
- [x] While implementing settings sections, think about componentizing and maybe data-driving
- [ ] Implement settings sections
  - [x] Player
  - [x] NPCs
    - [x] Settings
    - [x] Add localization variable
  - [x] Vehicles
    - [x] Settings
    - [x] Add localization variable
  - [x] GM
  - [x] Modules
  - [x] Homebrew
  - [x] Locks
  - [x] Info
- [x] Make the input IDs unique, because users can open multiple instances of the settings window; use context to provide the app ID
- [x] Per the current maintainer of Tidy 5e, remove the Lazy Money integration settings: https://discord.com/channels/732325252788387980/1116078321067892796/1150857702252232714
- [x] Componentize group inputs
- [x] Componentize select input
- [x] Locks Tab opening notes are a bit jarring to look at now in dark mode. Adjust that.
- [x] Allow the user to view the full suite of options from Configure Settings / Sheet Options menu button
- [x] Ensure that non-client-level options are not available to regular users, GM-only


## Fix stuff

- [x] Actor Profile show portrait / show token options are not working anymore; instead, it just opens the image selection menu.
- [x] Fix startup failure. The settings dialog must be a FormApplication or subclass in order to be opened from the main config dialog.
- [x] When opening the settings form, clone the current settings at that point in time. Use that as the point of comparison in order to track changes to the data set. This will prevent the form from undoing changes to settings which may have happened outside of the form, such as to the main Configuration dialog for color scheme. Oh, also re-updated those unchanged settings after saving changes, because if the user clicks "Apply Changes," we'll still have the form open and will need to reset the change detection.
