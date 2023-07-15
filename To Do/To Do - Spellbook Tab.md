# Spellbook To Do's

- [x] Make a component
- [ ] Implement in list mode
  - [ ] HTML
  - [ ] Styles
  - [ ] Functionality
- [ ] Implement ItemGrid family of components and support grid mode.
- [ ] Implement search.
- [ ] Implement action economy filters
- [ ] Settings
- [ ] Styles
- [ ] ...?


## Side quests

- [x] Make a component for the item controls container (the buttons on the far right) that can be generically used. It could even take `allowEdit` and toggle its own width accordingly.
- [x] Make component for search so we can share
- [x] Make the scrollable item table container a shared, generic component
- [ ] Make shared components for filter container and individual filters; individual filters can be made generic by filter name ("action", "bonus action", etc.) and set ("feature", "effect", etc.)


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