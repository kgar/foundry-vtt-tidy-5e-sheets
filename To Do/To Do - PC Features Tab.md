## To Do

### Features tab

- [x] Make a component
- [x] FeaturesTab - deal with "fred" class; do I need a component for this first cell in item rows? It's pretty common...
- [ ] HTML
  - [x] Retool so that it is dedicated to player characters only. Svelte and related functions should step in and make it
  - [x] Retool the logic so it is 4 different loops and get over it
  - [x] Background
    - [x] Item summary
    - [x] Card on label click
  - [x] Classes
    - [x] Item Summary
    - [x] Card on label click
  - [ ] Active
    - [ ] Item Summary
    - [ ] Card on label click
  - [ ] Passive
    - [ ] Item Summary
    - [ ] Card on label click
- [x] SCSS
- [x] Handle Create click
- [x] Handle classic controls
- [ ] Ensure context menu works
  - [x] allow-edit true
  - [x] allow-edit false
  - [ ] owner vs. not owner
  - [ ] limited?
- [ ] Functionality
  - [ ] Search
  - [ ] Action Economy Filters
  - [ ] Refinement: make search unique to the current sheet and able to be rehydrated between submissions
  - [ ] Refinement: make Action Economy filtering unique to the user and not the actor. Unfortunately, to keep track of this, we'll need to persist a large json object representing Actor -> Tab -> Filter Name, with a value of boolean at the leaf.
  - [ ] Refinement: implement sorting per section type ; it should not affect the actual order of the data, and it should be specific to the users
  - [ ] Refinement: maintain scroll top between refreshes
  - [ ] Refinement: maintain open/closed state of items between refreshes
  - [ ] Refinement: Expand All / Collapse All
- [ ] Settings
- [ ] Secure it.
  - [ ] Owner view
  - [ ] Observer view
  - [ ] Limited view
  - [ ] No permissions
- [ ] gmEdit? Is GM settings?

## Implementing the Add Buttons

Original Impl

```js
  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset.
   * @param {Event} event          The originating click event.
   * @returns {Promise<Item5e[]>}  The newly created item.
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;

    // Check to make sure the newly created class doesn't take player over level cap
    if ( type === "class" && (this.actor.system.details.level + 1 > CONFIG.DND5E.maxLevel) ) {
      const err = game.i18n.format("DND5E.MaxCharacterLevelExceededWarn", {max: CONFIG.DND5E.maxLevel});
      return ui.notifications.error(err);
    }

    const itemData = {
      name: game.i18n.format("DND5E.ItemNew", {type: game.i18n.localize(CONFIG.Item.typeLabels[type])}),
      type: type,
      system: foundry.utils.expandObject({ ...header.dataset })
    };
    delete itemData.system.type;
    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }
```

## Features questions

What is `gmEdit` class, and how does it affect features?

What is `unlocked` class, and how does it affect features?

## Making the item grids more dynamic without being ridiculous to maintain

Identify an object model:

```
table: {
    columns: column[]
    rows: row[]
}

column: {
    id: string; // any unique string ID
    content: string; // of HTML or plain text
    baseWidth: string; // any valid flex-basis width value
    cssClass: string; // optional class string to apply to the column "cell"
}

row: {
    [columnId]: {
        content: async () => Promise<HTMLElement | string>; // of HTML or plain text
        cssClass?: string; // optional class to apply to the "cell"
    }
}
```
