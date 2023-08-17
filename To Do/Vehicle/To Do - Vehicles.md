- [x] Create form application class
- [x] Hook in template
- [x] Create svelte sheet component and hook into activate listeners
- [x] Curate sheet for Svelte mode
  - [x] store store
  - [x] stats store
  - [x] etc. the works
- [x] Scaffold the tabs and their requisite components
  - [x] "attributes" : "Attributes"
  - [x] "cargo" : "Cargo & Crew"
  - [x] "biography" : "Description"
- [x] Add "allow-edit" lock
- [ ] Implement the Header
  - [x] Profile
  - [ ] Name
  - [ ] Origin Summary section
  - [ ] Movement
  - [ ] AC Shield and Abilities
    - [ ] AC Shield is a little different; it has AC while motionless and AC while in motion.
    - [ ] Allow for ability check/save single click like with PCs and NPCs
    - [ ] the rest
- [ ] Implement sheet body sections
  - [ ] Attributes
  - [ ] Cargo & Crew
  - [ ] Description
- [ ] Identify problems with the current sheet that make it difficult to understand/use and fix them.
  - [ ] Problem: There aren't dedicated buttons for Ability Check and Saving Throw; I don't care if the vehicle cannot be proficient, we want buttons!
- [ ] Research the following and note them here:
  - [ ] Actions : Ghosts of Saltmarsh
  - [ ] Action Stations : Descent into Avernus
  - [ ] Action Thresholds : Ghosts of Saltmarsh
  - [ ] Mishap
- [ ] Add vehicular exhaustion in the style of NPC exhaustion. It will need certain adjustments to the exhaustion level text that will require some localization.
- [ ] Add vehicular movement in the style of DMspiration, a simple checkbox charm at the top right of the vehicle sheet.

### Action Thresholds

From "Galley" in GoS:

> On its turn, the galley can take **3 actions**, choosing from the options below. It can take only **2 actions if it has fewer than forty crew** and only **1 action if it has fewer than twenty**. It can't take these actions if it has **fewer than three crew**.

So that is

`< 3 < 20 < 40`

It translates to

0 actions when < 3
1 action when < 20
2 actions when < 40
3 actions when >= 40

There has to be a better way to visualize this. Maybe there are some clever paper vehicle sheets out there in the wild?

A ship can have 1-3 actions, and certain sample vehicles will always put the highest number on the far right field, even when there are only 1 or 2 actions.

## SaltyJ's Issue List for Vehicles

Issue #1: Effects tab is missing in Tidy Sheet where it exists in default sheet.

Issue #2: Adding Crew and passengers is varied levels of broken, as of the version i am using, add button does nothing, in previous versions, it let me add them, but did not save changes. (Would love to be able to drop Actors here, but just filling out the lines sould be pretty nice)

Issue #3: Headers are not inline with columns...everywhere.
(KGar Note: it looks like the classic controls spacing in the header row is not being included with classic controls. Should resolve itself with the standard implementation.)

Issue #4: Spacing can be inconsistant and sad.
(KGar Note: This is in reference to the Creature Capacity, Cargo Capacity, etc. section on the Attributes tab on the left side)

Feature Request: AC has a value for when moving, and when stationary. A toggle here so you can swap between the two would be great, not in system, but figured while i have you, see if its an easy implementation. Feel free to ignore this for a future enhancement post release
(KGar Note: dnd5e system should have a vehicle checkbox / data field for 'moving', because in some systems, knowing whether the vehicle is in motion or not is important; in any case, we can have an option to do screwy stuff like swap ACs when a flag-based version of "movement" is turned on, and that can be an opt-in feature.)

Side Rant: There is one thing i have been struggling with, and this is not sheet specific, sort of a side rant.
In my naval system, The crew can do actions on the ships turn, with trained skills etc using ship stats.
But on the players turn, they can get on stations like Decent into Avernus style.
Unfortunately there is no way that i know of to automate using their bonuses with vehicle sheet weapons in an automated fasion. 
Again, not for you to even really think about, but its my current roadblock. ATM we switch to full zero automation for player turns during naval combat..
And considering the ships have sheets, the crew on deck have sheets, even the mines have sheets.....
(KGar Note: This will take some thought about where Tidy 5e fits into the mix with this particular issue. Of course, there's a great deal that could be done to provide functionality like this, but veering too far from the core data into homebrew territory may multiply complexity of maintaining the sheet. Perhaps a separate module that leverages the API?)


## Bonus To Dos

- [ ] Incapacitated calculation for NPCs and PCs: is it taking temp HP into account?
- [ ] Inventory-Grid: Equipped Background is not showing for KGar edition. Fixit.
- [ ] Submit dnd5e system request (and quite possibly, a PR) for vehicular exhaustion to be added to vehicle data and to the vehicle sheet.
  - https://github.com/foundryvtt/dnd5e/blob/7ab8cc38e0a7a21969dcb4bb19a1816d99d5e19a/CONTRIBUTING.md
- [ ] Ditto dnd5e system vehicle data field for "isMoving", "moving", "movement", "inMotion", or some other more appropriate name