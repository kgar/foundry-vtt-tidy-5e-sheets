**Goal**:

## Settings Cleanup To Do

- [ ] Replace `_getRuntime` with a universal `RuntimeProvider` that returns the appropriate runtime based on document. It should live with the other runtimes.
- [ ] Review and revise `settingsTabBuilder`. 
  - [ ] Move the builders to the settings domain or the runtime domain?
  - [ ] Rename the files so that they're a match for their purposes: 
    - [ ] e.g., ActorInventorySettingsTab.ts -> ActorInventoryTabOptionsProvider.ts 
    - [ ] settingsTabBuilder -> tabOptionsFn
  - [ ] 

### settingTabBuilder

**Problem**: it uses the raw context data to derive default sections.  

**Solution**: somehow clone/map the necessary data and don't hold the full context reference

