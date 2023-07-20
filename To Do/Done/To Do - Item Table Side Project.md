## Item Table side project:

- [x] Identify a generic inventory / item component tree that will eliminate any guesswork and hopefully eliminate `_inventory.scss`.
- [x] Recreate the inventory table setup with this tree
- [x] Make it functional
- [x] Refactor: Create table column component with primary:boolean field for the header row to use; trim unneeded stuff from the table cell component
- [ ] Refactor: include column hint field in the table cell which can be put onto the resulting cell container for future testing but also for readability while scrolling through svelte code.
- [x] Make it styled to match the original, but now it should bestow most of its core layout styles from the layout components rather than some file.
- [ ] Resolve `TODO: Account for this, but do it in a svelte-ier way...`
- [x] Replace Effects table
- [x] Replace Background table
- [x] Replace Classes table
- [x] Resume the features tab effort

Prototype here:
https://github.com/kgar/svelte-code-sandbox

The structure works as intended, thanks to slot props, which can surface smarter features of the item table layout components.