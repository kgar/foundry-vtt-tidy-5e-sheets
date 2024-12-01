## To Do

- [x] Update deps
- [x] Install latest Svelte-related deps (and TypeScript)
- [x] Resolve TS errors
- [x] Perform the initial migration across all files
- [x] Address all migration tasks
- [x] Resolve all HTML element binding errors (the migration puts `$state()` on them, triggering an error)
- [x] Resolve all component mount / unmount / mounted component return types
  - Mounted components are of type `Record<string, any>` now
  - Component construction is replaced by `mount()`
  - Component descruction is replaced by `unmount()`
- [ ] Replace all calls to svelte `run()` with `$derived` or `$effect`, whichever is most appropriate
- [ ] Replace stores with runes
- [ ] Ensure context API where reactivity is expected is using runes
- [ ] Peruse errors and task out more