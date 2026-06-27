**Goal**:

## Settings Cleanup To Do

- [ ] Replace `_getRuntime` with a universal `RuntimeProvider` that returns the appropriate runtime based on document. It should live with the other runtimes.
- [ ] Review and revise `settingsTabBuilder`. 
  - [x] Move the builders to the settings domain
  - [x] Rename the files so that they're a match for their purposes: 
    - [x] e.g., ActorInventorySettingsTab.ts -> ActorInventoryTabOptionsProvider.ts 
    - [x] settingsTabBuilder -> getTabOptions
  - [ ] 

### tabOptionsBuilder

- [x] Solve problem: tabOptionsBuilder uses the raw context data to derive default sections.  
  - somehow clone/map the necessary data and don't hold the full context reference

