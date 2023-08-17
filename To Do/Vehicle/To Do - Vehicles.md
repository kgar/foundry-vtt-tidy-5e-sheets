- [ ] Create form application class
- [ ] Hook in template
- [ ] Create svelte sheet component and hook into activate listeners
- [ ] Curate sheet for Svelte mode
  - [ ] store store
  - [ ] stats store
  - [ ] etc. the works
- [ ] Scaffold the tabs and their requisite components
  - [ ] "attributes" : "Attributes"
  - [ ] "cargo" : "Cargo & Crew"
  - [ ] "biography" : "Description"
- [ ] Add "allow-edit" lock
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

