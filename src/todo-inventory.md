## Inventory To Do

Refactor:

- [ ] Switch from hideUnder to priority show/hide scheme
- [ ] Have each use of a column provide a priority
- [ ] Propagate to Containers as well
- [ ] Test inventory and container contents
- [ ] Rename ContainerContentsSections to InventoryLists
- [ ] Implement action bar
- [ ] Implement container panel
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