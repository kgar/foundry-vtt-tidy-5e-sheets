## To Do

- [ ] Fixit: Accordion Item error
- [ ] Replace stores with runes
- [ ] Ensure context API where reactivity is expected is using runes
- [ ] Resolve `kgar-migration-task` content
- [ ] Fix inventory grid styles
- [ ] Fix? Activities Tab context menu not showing anything
- [ ] Fix: Spell Pip animations are buck wild, now. Either get them back to normal, or eliminate.
- [ ] Fix: Item sheets are not showing selected tabs
- [ ] Actually implement the activity card content. There's nothing there!
- [ ] Provide separate option for showing activity cards
- [ ] Implement Effect card and content.
- [ ] Provide separate option for showing effect cards.

## Testing To Dos

- [ ] Smoke test every sheet
- [ ] Test Checkboxes and other inputs that formerly had a `draftValue` and see if they now just work as expected
- [ ] Especially test Select elements with empty options, null options, and with default blank string options
- [ ] Especially test item cards
- [ ] Action filter override control (had some odd run/derived behavior)
- [ ] SpellbookList component, controls (had some elaborate run/derived behavior)
- [ ] Test Sheet Editor V2 fairly closely
- [ ] Test: Floating card with PopOut!
- [ ] Test: Detached card with PopOut!
- [ ] Test: Detached card reactivity with changes to

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


## TODO List Item Graveyard

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
- [x] Finish item card revamp
  - [x] Finish Spell Info Cards
  - [x] Plant all item attributes for
    - [x] actors,
    - [x] containers,
    - [x] actor container panels
    - [x] actor facilities
    - [x] actor facility craft items
  - [x] container panel items
    - [x] inventory grid
    - [x] spell grid
    - [x] prepare necessary scaffolding for T Inspect
    - [x] ~~allow hover on card to keep the card shown, as long as there's still a component to view~~ / not worth it. Press T to Inspect
  - [x] Plant all activity attributes for actors, containers, items
- [x] Fixit: Hide card on drag
- [x] Fixit: choppy floating card;
  - Idea for fixing it: simply have the card follow the mouse while on the sheet ✅
    - This can simply be an effect on the component, related to the floating setting.
- [x] T Inspect!
  - [x] Implement Detached Card component
  - [x] Figure out how to get a title on there for the affected entity; this may just be a requirement when setting up Card State
  - [x] Header Height should always be card title height (sort of... it should be the height of one line of the header.)
  - [x] The stock header should be absolutely positioned with transparent background, with close button
  - [x] Should be able to minimize and see the item card title~~/color~~; getting the color is too damned complicated. Forget it.
  - [x] When opening the card, set its width/height to the prescribed card dimensions, accounting for root font size adjustments from Foundry
  - [x] The card content should span the entirety of the application surface area
  - [x] Ensure the show/hide/transition/transform styles do not apply to the popped out / inspected card; they should only apply to the attached card; ==attached== should perhaps be a class on the attached card
  - [x] Should "inspected" instead be "detached"? Yes.
- [x] Item Card Refinement: Shift from mouseover to mouseleave with hiding cards. This is going to be tricky. Make sure it works in a variety of scenarios. One idea: when showing the card for an event target, then wire the mouseleave on that target to ensure show turns off when that target is left.