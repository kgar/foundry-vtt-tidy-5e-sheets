## Side Quest to Complete Before Returning to Inventory

- [x] (Spellbook) Make the Source Class filters work. This will possibly amount to evolving the ItemFilterService into something more self-sufficient. It might also do to eliminate the reliance of `compose` on the flat registered filters object, because document-specific filters can't be registered there in good conscience. Instead, the service should maintain its own cache of filters and have a derived composition for each filter group (Tab) which updates itself whenever the filter data changes. Svelte 5 was made for this.
- [x] (Spellbook) // TODO: Make $derived for this
- [x] ~~(Spellbook) // TODO: Better yet, have composed store ready to use, and have it update whenever the filters update~~ just skipped this. There's no real benefit.
- [x] (Spellbook) Update footer to use pills like the latest design: https://discord.com/channels/@me/1243307347682529423/1381728068925653033
- [x] (Spellbook) Make the Prepared pill into a button down in the footer. When clicked, it turns on "Prepared" and "Source Class" (if available) filters, with Source Class relating to the particular spellcaster card.
- [ ] (Spellbook) Implement spellbook subtitle
  - [ ] Source Class (always show when available)
  - [ ] Source Item (for Cast activities)
  - [ ] Components (if able: show when components column not visible)

## Inventory To Do

- [x] Switch from hideUnder to priority show/hide scheme
- [x] Have each use of a column provide a priority
- [x] Propagate to Containers as well
- [X] Test inventory and container contents
- [x] Rename ContainerContentsSections to ItemLists
- [x] Parameterize row actions
- [x] Solve Problem: Column Visibility algorithm has no awareness of action column width, so it minimize visibility of the item name without hiding columns
  - [x] Pull row actions back into TidySectionBase
  - [x] Add an actions column at highest priority and set its width to the calculated width in pixels instead of rems
  - [x] Increase the column props to include the TidyBaseSection from whence this column comes
- [x] Supply Table Row Actions to inline and standlone container contents
- [x] Ensure all empty inventory sections are shown on unlock
- [x] Add an Add Button to all sections. Have it open the item creation dialog with the item type pre-selected, if dealing with a default section.
- [x] Remove trashcan and behavior from favorites tab. Some people live in Edit mode.
- [x] Change attune button to Display-Only and put to the right of the item name button as an indicator
- [x] Implement Actor Inventory Footer
  - [x] Attunement Tracker
  - [x] Currency
  - [x] Currency Exchange button
  - [x] Universal Add Button
- [x] Implement action bar
  - [x] Action Bar Row
    - [x] Section Expand/Collapse toggle
    - [x] Search
    - [x] Pinned Filters
    - [x] Filters
    - [x] Sort
    - [x] Tab Config
  - [ ] Encumbrance Row
    - [ ] Strength Pill
    - [ ] Size Pill
  - [ ] Multiplier Pill
    - [ ] Encumbrance bar with threshold ticks
  - [ ] While there, implement generic width / priority observer feature that can control pinned filter visibility generically
  - [ ] Propagate this to the container action bar
- [ ] Implement container panel
- [ ] `ItemColumnRuntime.determineHiddenColumns` - use this to pre-calculate column widths and to return a column scheme type that excludes width functions.
- [ ] Expand column width calculations to include support for other measurements like REMs. Calculate the root rem on Foundry ready `parseFloat(getComputedStyle(document.body).fontSize)` and anytime settings change.
  - Bonus: promote the UI Scale watcher and its hook to a centralized location where Tidy pulls its core setting info as a reactive store.
- [ ] Evolve ItemLists further
  - 💡 It is still for Items only, which should keep things simple with itemContext usage.
  - Move columns to TidySectionBase and include in prep
  - Extract the Tidy Table rendering components for churning out columns from column specs. This functionality will be reused for Effects and Activity tables.
- [ ] Put weight unit in weight column
- [ ] Add encumbrance / capacity summary tooltip, to account for weight by item type, leaving any remaining weight to currency
- [ ] Review and task further

## Unrelated to this feature, unsorted, work or add to main list when done here

- [ ] Add drag-and-drop to sort for Favorites
- [ ] Propagate Table Row Actions to Activities tables
- [ ] Propagate Table Row Actions to Effects tables
- [ ] Propagate Data-Driven Columns to Activities tables
- [ ] Propagate Data-Driven Columns to Effects tables
- [ ] (Low priority) ButtonWithOptionPanel - use a Portal or something similar so that there's a singleton menu shell that can be shown/hidden by any sheet and can be given a component and/or snippet to render. This should allow for someone to have a compact sheet and view the full options panel without the sheet's overflow hiding the options.
- [ ]  simplify sorting so that longpress/right-click opens a list of sort options, and simply clicking on the button cycles forward through the various sorts; 
- [ ] Create constants for all known filters. For those that are generated, provide a global filter name  provider function that takes a value (source class, for example) and churns out the appropriate name ('source-class-warlock'). Update the runtime and all those using hardcoded filter names (Spellbook Footer).

## Questions

- How does UI Scale actually factor into the styles of things? Is it independent of Font Size, or does it scale everything, including font size?

## Add Button Notes

**Option C** - Proposed designs but me, a dummy, apparently never wrote down the behavior 😅
* Hide empty sections in Play Mode
* Add Item buttons appear in table headers. Creating an item this way prefills a custom section if from custom section header. Uses system create item dialog with type preselected (if non-custom).
* Global Add Item button appears in the footer. Creating an item this way does not prefill the section. Uses system create item dialog with no type preselected.

## Write-up about rem column / row action widths

Right now, I'm doing column widths and row action widths as pixels, because I need to be able to do width calculations.
After a little tinkering, I see I can do rems instead, which I greatly prefer. You can tell me otherwise.

The way I would do REMs: 
I have a cache of the Foundry UI settings of interest - UI Scale, Font Size,
On Foundry Ready event, and whenever settings are changed, I refresh my cached settings,
When doing column widths, I can include the measurement as a string prop to the side of my width number prop--I'll support px and rem. Some/most users may prefer px when doing their custom columns in the future.,
When calculating column hiding, I'll convert rem widths to pixels for precision measuring,

This will allow for us to support font-size and UI scaling options. I'll also feel much better about hardcoded widths if we're using rems.

## Formula Column notes

```hbs
<div class="item-detail item-formula {{#unless entry.labels.damages.length}}empty{{/unless}}" data-column-id="formula">
    {{#each entry.labels.damages}}
    <div class="row">
        <span class="formula">{{ formula }}</span>
        {{#with (lookup @root.labels.damageAndHealing damageType)}}
        <span data-tooltip aria-label="{{ label }}">
            <dnd5e-icon src="{{ icon }}"></dnd5e-icon>
        </span>
        {{/with}}
    </div>
    {{/each}}
</div>
```

```js
  /**
   * Manage columns when the inventory element's inline size changes.
   * @param {ResizeObserverEntry[]} entries
   * @protected
   */
  _onResize([entry]) {
    // TODO: Should accommodate uiScale here, but probably don't want to call game.settings.get every frame.
    for ( const { columns, elements, minWidth=200 } of this.#sections ) {
      let available = entry.borderBoxSize[0].inlineSize;
      for ( const { id, width } of columns ) {
        available -= width;
        if ( !(id in elements) ) continue;
        for ( const el of elements[id] ) el.classList.toggle("hidden-width", available < minWidth);
      }
    }
  }

    /**
   * Cache section data to avoid expensive lookups during resize events.
   * @internal
   */
  _cacheSections() {
    this.#sections = Array.from(this.querySelectorAll(".items-section")).map(section => {
      const minWidth = Number(section.dataset.columnMinWidth);
      const descriptor = { element: section };
      if ( Number.isFinite(minWidth) ) descriptor.minWidth = minWidth;
      const columns = Array.from(section.querySelectorAll(".items-header [data-column-id]")).reduce((obj, el) => {
        const { columnId: id, columnWidth: width, columnPriority: priority } = el.dataset;
        obj[id] = { id, width: Number(width), priority: Number(priority) };
        return obj;
      }, {});
      // Descending order of priority.
      descriptor.columns = Object.values(columns).sort((a, b) => b.priority - a.priority);
      const elements = section.querySelectorAll(":is(.item-row, .items-header) [data-column-id]");
      descriptor.elements = Array.from(elements).reduce((obj, el) => {
        const { columnId: id } = el.dataset;
        const els = obj[id] ??= [];
        els.push(el);
        return obj;
      }, {});
      return descriptor;
    });
  }

  connectedCallback() {
    // ...
    this._cacheSections();
    const observer = new ResizeObserver(this._onResize.bind(this));
    observer.observe(this);
    // ...
  }
```