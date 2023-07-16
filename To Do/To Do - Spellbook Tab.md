# Spellbook To Do's

- [x] Make a component
- [ ] Implement in list mode
  - [x] HTML
  - [ ] Spell slot markers
    - [x] HTML
    - [ ] Styles
    - [x] Functionality
    - [ ] Refactor: extract to component?
  - [ ] Styles
    - [ ] etc.
    - [ ] spell headers
  - [ ] Functionality
- [ ] Implement ItemGrid family of components and support grid mode.
- [ ] Implement search.
- [ ] Implement action economy filters
- [ ] Settings
  - [ ] hideSpellSlotMarker
  - [ ] ...?
- [ ] Styles
- [ ] ...?

## Side quests

- [x] Make a component for the item controls container (the buttons on the far right) that can be generically used. It could even take `allowEdit` and toggle its own width accordingly.
- [x] Make component for search so we can share
- [x] Make the scrollable item table container a shared, generic component
- [ ] Make shared components for filter container and individual filters; individual filters can be made generic by filter name ("action", "bonus action", etc.) and set ("feature", "effect", etc.)
- [ ] Make shared component for nav tabs and eliminate the separate stylesheet
- [ ]

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
