
## To Do

- [ ] Consider - types/index.ts to export all into a pure barrel file, and import from `@/types` wherever types are needed
  - [ ] If yes, then also bring all the API types into the core types folder. We don't want types spread out all over the codebase.
  - [ ] And partition types in whatever way makes the most sense.

## After Next Release

- [ ] Document row action customization and recipes as part of the wiki. Tag it with the tentative Tidy version.


## Stretch

- [ ] Refactoring consideration: `CONFIG.TIDY5E` can replace the concept of the various runtimes. Each can be represented in config, among other useful things like first-class reusable Tidy components. Another bigger refactor opportunity worth pursuing when all other matters have been settled.
  - This should go into a github issue for tracking
- [ ] Migrate in the Item section preparers and reduce looping to a single pass over the items.
- [ ] // TODO: Determine how to make managing row action styles less hardcoded and more configured.
- [ ] Try a CSS Grid / Sub-grid approach Tidy tables. This would eliminate the need to calculate row actions width and open lots of doors, if it were performant.
- [ ] Write a script that takes an allowlist of svelte directories and generates `_module.ts` files for them. It includes named exports such as `export {default as AttuneButton} from "./AttuneButton.svelte";`