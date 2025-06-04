## Inventory To Do

Refactor:

- [x] Switch from hideUnder to priority show/hide scheme
- [x] Have each use of a column provide a priority
- [x] Propagate to Containers as well
- [X] Test inventory and container contents
- [x] Rename ContainerContentsSections to ItemLists
- [x] Parameterize row actions
- [ ] Solve Problem: Column Visibility algorithm has no awareness of action column width, so it minimize visibility of the item name without hiding columns
  - [ ] Pull row actions back into TidySectionBase
  - [ ] Add an actions column at highest priority and set its width to the calculated width in pixels instead of rems
  - [ ] Increase the column props to include the TidyBaseSection from whence this column comes
- [ ] Implement action bar
- [ ] Implement container panel
- [ ] Evolve ItemLists further
  - 💡 It is still for Items only, which should keep things simple with itemContext usage.
  - Make the `sections` prop a TidySectionBase
  - Move the section configuration / prep outside of the ItemLists component, so the component always receives content that is ready to use
  - Move columns to TidySectionBase and include in prep
  - Generalize the controls column so that different callers can have different controls (spellbook versus inventory, for example); 
    - the most caveman way is simply to provide a controls component for each scenario
    - perhaps the appropriate way is to make these controls data-driven and all based on one component which can broker all the different behaviors and states based on props.
  - Extract the Tidy Table rendering components for churning out columns from column specs. This functionality will be reused for Effects and Activity tables.
- [ ] Review and task further

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