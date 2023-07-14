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
  - [x] Active
    - [x] Item Summary
    - [x] Card on label click
  - [x] Passive
    - [x] Item Summary
    - [x] Card on label click
- [x] SCSS
- [x] Handle Create click
- [x] Handle classic controls
- [ ] Ensure context menu works
  - [x] allow-edit true
  - [x] allow-edit false
- [x] Functionality
  - [x] Search
  - [x] Action Economy Filters
  - [x] Refinement: make search unique to the current sheet and able to be rehydrated between submissions
- [ ] Settings
- [ ] Secure it.
  - [ ] Owner view
  - [ ] Observer view
  - [ ] Limited view
  - [ ] No permissions
- [ ] gmEdit? Is GM settings?

#### Active Abilities

- [x] Make the uses column functional
  - [x] Implement uses per day
  - [x] Implement roll to recharge
    - [x] View charged state
    - [x] View rollable state
  - [x] Implement Add Charges 
- [x] Style it
  - [x] Recharge
  - [x] Charged
  - [x] Uses
  - [x] Else
- [x] Ensure item summary
- [x] Add / Edit / Delete / Duplicate
- [x] Middle click to edit
- [x] Right click context menu
- [x] Fix issue where feature names are not truncating properly. This is something that really needs to be fixed as part of the item table cell component in-built styles.

## Usage Column impl

```hbs
<div class='item-detail item-charges'>
  {{#if ctx.isOnCooldown}}
    <a class='item-recharge rollable' title='{{item.labels.recharge}}'><i
        class='fas fa-dice-six'
      ></i>
      {{item.system.recharge.value}}{{#if
        (ne item.system.recharge.value 6)
      }}+{{/if}}</a>
  {{else if item.system.recharge.value}}
    <i class='fas fa-bolt' title='{{localize "DND5E.Charged"}}'></i>

  {{else if ctx.hasUses}}
    <input
      class='uses-value'
      name='system.uses.value'
      type='text'
      value='{{item.system.uses.value}}'
    />
    /
    <input
      class='uses-max'
      name='system.uses.max'
      type='text'
      value='{{item.system.uses.max}}'
    />
  {{else}}{{#unless @root.isNPC}}
      <a class='addCharges' value='Add'>Add</a>
    {{/unless}}
  {{/if}}
</div>
```

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
