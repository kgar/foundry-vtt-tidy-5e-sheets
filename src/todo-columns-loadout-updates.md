
## To Do

- [ ] // This should not be `any`; do we need to subdivide and conquer?
- [ ] // TODO: Do we really need this field? Surely we can figure this out with `item.actor`
- [ ] Consider passing the sheet and document down to props callback for all row action types.
- [ ] Reevaluate the props for all row actions before finalizing the API
- [ ] Do any of the row actions need to be supressed when the sheet is not editable?
- [ ] Extract a TidyRowActionsCell? Determine if this is feasible, given other row action component updates.
- [ ] Write a script that takes an allowlist of svelte directories and generates `_module.ts` files for them. It includes named exports such as `export {default as AttuneButton} from "./AttuneButton.svelte";`
- [ ] Review main.svelte.ts `CONFIG.TIDY5E` init - should that content be passed in by a src/runtime/row-action/init.ts function? Or should it all be laid out in the open like that?
- [ ] One last look: with the API and registry implemented, is there anything about the design that should change?
- [ ] Once in main, document row action customization and recipes as part of the wiki. Tag it with the tentative Tidy version.

## Stretch

- [ ] Refactoring consideration: `CONFIG.TIDY5E` can replace the concept of the various runtimes. Each can be represented in config, among other useful things like first-class reusable Tidy components. Another bigger refactor opportunity worth pursuing when all other matters have been settled.
- [ ] Migrate in the Item section preparers and reduce looping to a single pass over the items.
- [ ] // TODO: Determine how to make managing row action styles less hardcoded and more configured.
- [ ] Try a CSS Grid / Sub-grid approach Tidy tables. This would eliminate the need to calculate row actions width and open lots of doors, if it were performant.