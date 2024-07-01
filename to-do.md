## To Do:

- [x] Eliminate need for ContainerSheet inheritance. Inherit ItemSheet5e instead
- [ ] Create static method for developing container itemContext in Container.ts
  - [ ] Include optional containerItemContents prop with all the inventory sectioning / etc.
- [ ] Update ContainerContentsList to take container item context object map; expectation - this is all of the container item context relevant to the containing item, all contents at the current level, and all contents recursively within
- [ ] Update Character Sheet context to load up containerItemContext prop with recursive container item contents into a flattened map of contexts, including any top-level containers.
- [ ] Update Inventory list to pass down containerItemContext instead of Character itemContext
- [ ] Propagate across PC, NPC, Vehicle, and Container sheets
- [ ] Review and clean up
- [ ] Determine if there are other opportunities to consolidate and reuse code
- [ ] ...?