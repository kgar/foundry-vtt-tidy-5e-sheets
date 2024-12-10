## To Do

- [ ] Fix: World Settings has warning: [svelte] binding_property_non_reactive`bind:value={config.type}` (src/applications/settings/parts/ExhaustionSetting.svelte:33:48) is binding to a non-reactive property
- [ ] Fix: Settings tabs are blank
- [ ] Fix: Message Bus is not reactive
- [ ] Fix: Item Filters are bugged. They don't fully cycle and don't visualize current state after a change.
- Review warnings and tag all the Svelte 5 / reactivity-related ones for resolution
- [ ] Finish more migration tasks that came from recent work
- [x] Ensure context API where reactivity is expected is using runes / proper closures; it might be time to come up with a common type for stateful primitives sent through context API

## Stretch, or defer to post V7.3.0

- [ ] Optimize: Section Config prep / setup
  - Section config is a little cumbersome to deal with right now. It is requiring a `sections` param on the utility toolbar command params and a duplicate set of section data for container.
  - Can we isolate the actual section preparation, indpependent of the item preparation for those sections? Can that be shared?
  - Can the section config application somehow do the isolated section ordering / showing / hiding / etc. by itself?
- [ ] Refactor: `Tabs` wants a sheet prop so it can check if a tab navigation is allowed and to trigger some tab selection events when permitted. Now that context sans stores has been upended in Svelte 5, consider instead sending exactly what `Tabs` needs for its specific use case as context from the sheet, directly, in the form of a callback or function binding.
- [ ] Fix: Use the broken identify toggle for containers to vet error handling and getting latest from the source data. Or, if it's not feasible, just catch and handle error.
- [ ] Actually implement the activity card content. There's nothing there!
- [ ] Provide separate option for showing activity cards
- [ ] Implement Effect card and content.
- [ ] Provide separate option for showing effect cards.
- [ ] Eliminate ContentEditable elements and use Locked Readonly / Unlocked Text Input

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

### Dealing with Sheet getData Context Reactivity

Switching from a store to a state rune with the `context` property on the sheet classes has almost completely broken reactivity. This is because the context itself has to be provided via a getter or some other closure. With that mind, _there is no other choice than to introduce an extra property in the prop path throughout the sheets code surface area._ Add to this Svelte 5 does not provide reactivity for classes, only POJOs (see https://github.com/sveltejs/svelte/issues/10560#issuecomment-2057092046). If I am keeping with the current context property scheme, then I need to wrap the entire context in the aforementioned `External` class:

```ts
export class External<T> {
  #data;
  #version = $state(0);

  constructor(data: T) {
    this.#data = data;
  }
  get data() {
    this.#version;
    return this.#data;
  }
  set data(_data) {
    this.#version++;
    this.#data = _data;
  }
  invalidate() {
    this.#version++;
  }
}
```

Then, all references to `context.something` must reference as `context.data.something`. This will ensure that all fields are reactive again.

**Update**: We can achieve this in terser fashion and still remain svelte-idiomatic:

```ts
function getCharacterSheetContext() {
  return getContext<{ data: CharacterSheetContext }>('context').data;
}

// In the component:
let context = $derived(getCharacterSheetContext());
```

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
- [x] Fixit: Accordion Item error
- [x] Fix: Item Identified / Equipped toggles are not processing switch change events properly
- It's the underlying Tidy Switch
- [x] Fix inventory grid styles
- [x] Search and address all instances of `on:` in svelte templates
- [x] Fix: Tab Selection is behaving inconsistently. Consider revamping.
- [x] Resolve `kgar-migration-task` content
- [x] Fix? Activities Tab context menu not showing anything
- [x] Fix: Spell Pip animations are buck wild, now. Either get them back to normal, or eliminate.
- [x] Fix: Item sheets are not showing selected tabs
- [x] Fix: Theme Settings, lots and lots of warnings
- [x] Fix: Make Coloris' theme mode match Tidy's
- [x] Replace stores with runes
- [x] Convert sheet subscriptions to sheet effects and test sheet effects
- [x] Resolve runtime errors related to section/item deferred prep.
- [x] Convert all sheet contexts to `External<T>` (renamed to `CoarseReactivityProvider`)
- [x] Update all sheet context functions to return `result.data` instead of `result`
- [x] Update all callers of context functions to use `$derived(contextFn())`
- [x] Review auxiliary applications to determine their need for coarse reactivity. As a general rule, it's just the ones with live reactivity.
  - [x] src\applications\actor-origin-summary\ActorOriginSummaryConfig.svelte:
  - [x] src\applications\max-prepared-spells-config\MaxPreparedSpellsConfig.svelte:
  - [x] src\applications\settings\user-settings\tabs\ActionsListSettingsTab.svelte:
  - [x] src\applications\settings\user-settings\tabs\NpcSettingsTab.svelte:
  - [x] src\applications\settings\user-settings\tabs\PlayerSettingsTab.svelte:
  - [x] src\applications\settings\user-settings\tabs\VehicleSettingsTab.svelte:
  - [x] src\applications\settings\user-settings\UserSettings.svelte:
  - [x] src\applications\settings\world-settings\tabs\CharacterWorldSettingsTab.svelte:
  - [x] src\applications\settings\world-settings\tabs\ExhaustionWorldSettingsTab.svelte:
  - [x] src\applications\settings\world-settings\tabs\IconsWorldSettingsTab.svelte:
  - [x] src\applications\settings\world-settings\tabs\ItemWorldSettingsTab.svelte:
  - [x] src\applications\settings\world-settings\tabs\MiscWorldSettingsTab.svelte:
  - [x] src\applications\settings\world-settings\tabs\NpcWorldSettingsTab.svelte:
  - [x] src\applications\settings\world-settings\tabs\SheetLockWorldSettingsTab.svelte:
  - [x] src\applications\settings\world-settings\tabs\VehicleWorldSettingsTab.svelte:
  - [x] src\applications\settings\world-settings\WorldSettings.svelte:
  - [x] src\applications\spell-source-class-assignments\SpellSourceClassAssignments.svelte:
  - [x] src\applications\tab-selection\TabSelection.svelte:
  - [x] src\applications\theme\ThemeSettingColorArticle.svelte:
  - [x] src\applications\theme\ThemeSettingSheetMenu.svelte:
  - [x] src\applications\theme\ThemeSettingsSheet.svelte:
- [x] Check/fix Section Config
- [x] Check all Tidy Migration applications
  - [x] Migration Selection is not closing after Confirm clicked
  - [x] Fix: MigrationSelection.svelte:90 [svelte] binding_property_non_reactive `bind:checked={selectable.selected}` (src/migrations/migration-selection/MigrationSelection.svelte:93:37) is binding to a non-reactive property
