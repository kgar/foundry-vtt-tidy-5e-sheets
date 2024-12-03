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
- [x] Replace all calls to svelte `run()` with `$derived` or `$effect`, whichever is most appropriate
- [x] Eliminate `preventDefault`, `stopPropagation`, and similar legacy stopgap functions
- [x] Resolve all check errors
- [x] Address custom HTML events
  - [x] longpress
  - [x] onclickoutside
  - [x] ...
- [x] Eliminate `createBubbler` calls by specifying event handler props
- [x] look for `svelte/legacy` imports and resolve
- [x] Eliminate `createEventDispatcher` uses
- [x] Fix item card effect depth error by making new info card framework with revamped setup
- [ ] Finish item card revamp
  - [x] Finish Spell Info Cards
  - [ ] Plant all item attributes for 
    - [ ] actors, 
    - [ ] containers, 
    - [ ] actor container panels
    - [ ] actor facilities
    - [ ] actor facility craft items
    - [x] prepare necessary scaffolding for T Inspect
    - [x] ~~allow hover on card to keep the card shown, as long as there's still a component to view~~ / not worth it. Press T to Inspect
  - [ ] Plant all activity attributes for actors, containers, items
  - [ ] Anything else?
- [ ] Fixit: Hide card on drag
- [x] Fixit: choppy floating card; 
  - Idea for fixing it: simply have the card follow the mouse while on the sheet ✅
    - This can simply be an effect on the component, related to the floating setting.
- [ ] T Inspect!
- [ ] Fixit: Accordion Item error
- [ ] Replace stores with runes
- [ ] Ensure context API where reactivity is expected is using runes
- [ ] Resolve `kgar-migration-task` content


## Testing To Dos

- [ ] Smoke test every sheet
- [ ] Test Checkboxes and other inputs that formerly had a `draftValue` and see if they now just work as expected
- [ ] Especially test Select elements with empty options, null options, and with default blank string options
- [ ] Especially test item cards
- [ ] Action filter override control (had some odd run/derived behavior)
- [ ] SpellbookList component, controls (had some elaborate run/derived behavior)
- [ ] Test Sheet Editor V2 fairly closely
- [ ] Test: Floating card with PopOut!
- [ ] 

## Notes and Examples

### How to handle custom events, Clickoutside event handler example

https://svelte.dev/playground/8031c800d7e34fd692dd18174b514e4e?version=5.3.0

```svelte
<script>
	function clickOutside(element, callbackFunction) {
		function onClick(event) {
			if (!element.contains(event.target)) {
				callbackFunction();
			}
		}

		document.body.addEventListener('click', onClick);

		return {
			update(newCallbackFunction) {
				callbackFunction = newCallbackFunction;
			},
			destroy() {
				document.body.removeEventListener('click', onClick);
			}
		}
	}
	let showModal = false;
</script>

{#if showModal}
	<div class="modal"
			 use:clickOutside={() => {
		     console.log('clicked outside');
		     showModal = false;
		   }}>
		Some Modal
	</div>
{:else}
	<button on:click={(event) => {
		showModal = true;
		event.stopPropagation();
	}}>Open Modal</button>
{/if}

<style>
	.modal {
		padding: 16px;
		border: 1px solid black;
	}
</style>
```

### async work in `$effect()` runes

https://dev.to/jdgamble555/async-fetching-in-svelte-5-826

https://github.com/sveltejs/svelte/issues/9520

### Event Handler types in Svelte 5

Svelte 5 has convenience types for event handler functions!

- `MouseEventHandler<HTMLElement>`
- `FocusEventHandler<HTMLElement>`
- etc.

### Accordion Item error

```
AccordionItem.svelte:33 [svelte] state_proxy_equality_mismatchReactive `$state(...)` proxies and the values they proxy have different identities. Because of this, comparisons with `===` will produce unexpected results
```

### Floating Card Notes

- ~~Trial 1:~~

If floating, simply reposition the card on mousemove within sheet element, whether visible or not.

- [x] Trial 2: 🔥

When showing, turn on an effect which triggers tracking and positioning the card, directly correlated with the shown element.

Debrief: 

- [x] Trial 3:

Cry.