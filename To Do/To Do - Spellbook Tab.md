# Spellbook To Do's

## Tab impl

- [x] Make a component
- [x] Implement in list mode
  - [x] HTML
  - [x] Spell slot markers
    - [x] HTML
    - [x] Styles
    - [x] Functionality
    - [x] Refactor: extract to component
    - [x] Achieve the hover effect which visualizes the delta change to occur.
  - [x] Styles
    - [x] etc.
    - [x] spell headers
  - [x] Functionality
- [x] Implement search.
- [x] Implement action economy filters
- [ ] Grid Toggle with stub view (wasp wants to make this)
  - ~~Hold off on this one: Implement ItemGrid family of components and support grid mode.~~
- [ ] Spellbook Footer
- [ ] Settings
  - [ ] hideSpellSlotMarker
  - [ ] ...?
- [ ] Styles
- [ ] Put spell-related item components into their own spell-related directory
- [ ] ...?

## Side quests

- [ ] Make shared component for nav tabs and eliminate the separate stylesheet
- [x] Make shared components for filter container and individual filters; individual filters can be made generic by filter name ("action", "bonus action", etc.) and set ("feature", "effect", etc.)
- [x] Make a component for the item controls container (the buttons on the far right) that can be generically used. It could even take `allowEdit` and toggle its own width accordingly.
- [x] Make component for search so we can share
- [x] Make the scrollable item table container a shared, generic component


## How Filter Toggling Works

```js
_onToggleFilter(event) {
  event.preventDefault();
  const li = event.currentTarget;
  const set = this._filters[li.parentElement.dataset.filter];
  const filter = li.dataset.filter;
  if ( set.has(filter) ) set.delete(filter);
  else set.add(filter);
  return this.render();
}
```

```js
  /**
   * Track the set of item filters which are applied
   * @type {Object<string, Set>}
   * @protected
   */
  _filters = {
    inventory: new Set(),
    spellbook: new Set(),
    features: new Set(),
    effects: new Set()
  };
```



## Spell Preparation

```js
  /**
   * Handle toggling the state of an Owned Item within the Actor.
   * @param {Event} event        The triggering click event.
   * @returns {Promise<Item5e>}  Item with the updates applied.
   * @private
   */
  _onToggleItem(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    const attr = item.type === "spell" ? "system.preparation.prepared" : "system.equipped";
    return item.update({[attr]: !foundry.utils.getProperty(item, attr)});
  }
```

## Spell slot override

```js
  async _onSpellSlotOverride(event) {
    const span = event.currentTarget.parentElement;
    const level = span.dataset.level;
    const override = this.actor.system.spells[level].override || span.dataset.slots;
    const input = document.createElement("INPUT");
    input.type = "text";
    input.name = `system.spells.${level}.override`;
    input.value = override;
    input.placeholder = span.dataset.slots;
    input.dataset.dtype = "Number";

    // Replace the HTML
    const parent = span.parentElement;
    parent.removeChild(span);
    parent.appendChild(input);
  }
```

## Spell slot markers

### Original Styles

```scss
.spellSlotMarker {
  display: flex;
  // flex-direction: row-reverse;
  gap: 2px;
  align-items: center;
  margin-top: -2px;
  .dot {
    position: relative;
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
    background-color: var(--t5e-primary-accent);
    border: 1px solid var(--t5e-primary-font);
    &:hover,
    &.change {
      background-color: var(--t5e-warning-accent);
    }

    &.empty {
      background-color: transparent;

      &:hover,
      &.change {
        background-color: var(--t5e-prepared);
      }
    }
  }
}
```
