## Copy/Move notes

### To Do

- DragDrop mixin
  - [x] Aggregate known drag selectors and consolidate to DragDrop.ts as statics for Actors and Items.
  - [x] Implement dragover to apply desired effect to the transfer
- Tidy Extensible Document Mixin
  - [x] Establish _allowedDropBehaviors for document sheets
  - [x] ~~Establish call to `bind` during render process; ensure it always happens on each render cycle~~ already happening ♥
  - [ ] Implement the DragDrop static drag selectors so they're available to sheets to use when setting up drag/drop settings
- [x] Dismantle all manual `draggable` instances in the code base
- [ ] Ensure Tidy doc sheets are respecting dropEffect
  - [x] Container Q
  - [ ] Item Q
  - [ ] Item T
  - [x] Container T
  - [ ] PC
  - [ ] NPC
  - [ ] Group
  - [ ] Vehicle

### Salient points

- There is a global payload kept in DragDrop5e (overrides DragDrop from foundry)
- To integrate with the default sheets properly, Tidy must utilize the dragdrop functionality built into applications
  - App V2 is handled by us until only Foundry 13+
  - App V1 is handled by Foundry/dnd5e
- A dropEffect is determined on drag and on drag over
- Allowed and default behaviors are specified by an application or its descendent
- Item drop handlers respect item drop logic

### Drag Selectors
```
(Actor)
[data-tidy-attribute-pin][data-item-id]
[data-tidy-attribute-pin][data-activity-id]

(Actor, Item) 
[data-tidy-table-row][data-effect-id]
[data-tidy-table-row][data-activity-id]

(Actor, Container)
[data-tidy-table-row][data-item-id]
[data-tidy-grid-item][data-item-id]

(Item)
[data-tidy-table-row][data-advancement]
```



### Actor Sheets

#### Character Sheet Drag scenarios

- Drag item
  - actor/sheet-v2-mixin.mjs - to drag data
- Drag effect
  - Foundry core / actor-sheet.js - to drag data
- Drag activity
  - actor/sheet-v2-mixin.mjs - to drag data

#### Character Sheet Drop scenarios

- Drop
  - defer
- Drop item
  - actor/base-sheet.mjs - determine is an item drop, then 🔼 
  - character-sheet-2.mjs 🔽 
  - actor/base-sheet.mjs - 
    - **determine drop behavior**,
      - drag-drop-mixin.mjs - 
        - check allowed drop behaviors (default empty set), then 🔼
        - actor/sheet-v2-mixin.mjs - 
          - _allowedDropBehaviors (might want to copycat this)
        -  find a drop effect, either in DragDrop5e or data transfer
        -  when dragging over, determine behavior based on keypresses / allowed behaviors / fallback drop behavior
        -  handle whether the behavior is allowed an then return the final value
     -  
    - handle container transfer / sort / item creation, if behavior is move and item was created from outside drop, then delete from source.
- Drop effect
  - foundry core / actor-sheet.mjs - determines that it's an effect drop, then 🔼 character-sheet-2.mjs - _onDropActiveEffect called
- Drop activity
  - foundry core / actor-sheet.mjs - determines there's nothing to be done; ignore

#### Handling Drop Effects

> Drop Effect is the planned action; Drop Behavior is the allowed action when attempting to drop. Often the same thing.

➕ (the primary choice) In drag-drop-mixin.mjs:
```js
    _onDragOver(event) {
      const data = DragDrop5e.getPayload(event);
      DragDrop5e.dropEffect = event.dataTransfer.dropEffect = (foundry.utils.getType(data) === "Object")
        ? this._dropBehavior(event, data) : "copy";
    }
```

#### _dropBehavior

> Determine if need to delete source draggable. Or prevent a disallowed drag effect from occurring.

> [!IMPORTANT]
> This lives ONLY on drag-drop-mixin.mjs and is mixed to all sheets.

Each sheet checks it when handling drops, whether directly or further up the inheritance chain.

actor/base-sheet.mjs - _onDropItem
actor/group-sheet.mjs - _onDropItem
item/container-sheet.mjs - _onDropItem

To parameterize this, you would optionally submit these additional args:
- `allowedDropBehaviors: (event: DragEvent, data: any) => Set<string>`
  - Fallback: empty set
- `defaultDropBehavior: (event: DragEvent, data: any) => string`
  - Fallback: "copy"


#### Allowed Drop Behaviors

🚫 **Effectively for Character Sheet 2 favorites only**  
**mixins/sheet-v2-mixin.mjs** (DocumentSheetV2Mixin)
```js
    /** @override */
    _allowedDropBehaviors(event, data) {
      if ( !data.uuid ) return new Set(["copy", "link"]);
      const allowed = new Set(["copy", "move", "link"]);
      const s = foundry.utils.parseUuid(data.uuid);
      const t = foundry.utils.parseUuid(this.document.uuid);
      const sCompendium = s.collection instanceof CompendiumCollection;
      const tCompendium = t.collection instanceof CompendiumCollection;

      // If either source or target are within a compendium, but not inside the same compendium, move not allowed
      if ( (sCompendium || tCompendium) && (s.collection !== t.collection) ) allowed.delete("move");

      return allowed;
    }
```

✅ **For everything else**  
**actor/sheet-mixin.mjs**

```js
    /** @override */
    _allowedDropBehaviors(event, data) {
      if ( !data.uuid ) return new Set(["copy"]);
      const allowed = new Set(["copy", "move"]);
      const s = foundry.utils.parseUuid(data.uuid);
      const t = foundry.utils.parseUuid(this.document.uuid);
      const sCompendium = s.collection instanceof CompendiumCollection;
      const tCompendium = t.collection instanceof CompendiumCollection;

      // If either source or target are within a compendium, but not inside the same compendium, move not allowed
      if ( (sCompendium || tCompendium) && (s.collection !== t.collection) ) allowed.delete("move");

      return allowed;
    }
```

#### File: module/applications/actor/base-sheet.mjs - has the deletion step when performing a Move

- _onDropItem: Handles behavior on drop item. Specifically, if "move", then either remove from container or sort. Else, create (even if "move" behavior)
- _onDropItemCreate: when behavior is "move", then delete from the source. **This only happens when the dropped item is not already owned**.

```js
  /** @override */
  async _onDropItem(event, data) {
    const behavior = this._dropBehavior(event, data);
    if ( !this.actor.isOwner || (behavior === "none") ) return false;
    const item = await Item.implementation.fromDropData(data);

    // Handle moving out of container & item sorting
    if ( (behavior === "move") && (this.actor.uuid === item.parent?.uuid) ) {
      if ( item.system.container !== null ) await item.update({ "system.container": null });
      return this._onSortItem(event, item.toObject());
    }

    return this._onDropItemCreate(item, event, behavior);
  }

  //...

   /**
   * Handle the final creation of dropped Item data on the Actor.
   * @param {Item5e[]|Item5e} itemData     The item or items requested for creation.
   * @param {DragEvent} event              The concluding DragEvent which provided the drop data.
   * @param {DropEffectValue} behavior     The specific drop behavior.
   * @returns {Promise<Item5e[]>}
   * @protected
   */
  async _onDropItemCreate(itemData, event, behavior) {
    let items = itemData instanceof Array ? itemData : [itemData];
    const itemsWithoutAdvancement = items.filter(i => !i.system.advancement?.length);
    const multipleAdvancements = (items.length - itemsWithoutAdvancement.length) > 1;
    if ( multipleAdvancements && !game.settings.get("dnd5e", "disableAdvancements") ) {
      ui.notifications.warn(game.i18n.format("DND5E.WarnCantAddMultipleAdvancements"));
      items = itemsWithoutAdvancement;
    }
    // Filter out items already in containers to avoid creating duplicates
    const containers = new Set(items.filter(i => i.type === "container").map(i => i._id));
    items = items.filter(i => !containers.has(i.system.container));

    // Create the owned items & contents as normal
    const toCreate = await Item5e.createWithContents(items, {
      transformFirst: item => {
        if ( item instanceof foundry.abstract.Document ) item = item.toObject();
        return this._onDropSingleItem(item, event);
      }
    });
    const created = await Item5e.createDocuments(toCreate, { pack: this.actor.pack, parent: this.actor, keepId: true });
    if ( behavior === "move" ) items.forEach(i => fromUuid(i.uuid).then(d => d?.delete({ deleteContents: true })));
    return created;
  }


```

#### File: module/applications/actor/character-sheet-2.mjs - default drop behaviors shown here

- Removed drag activity and drag item.
- Reworks how it handles dragstart; now defers more to super dragstart
- Handles dragging random stuff like spell slots, tool pills, and skill pills; these are the only ones that don't get deferred to super dragstart
- Drag Start chain of deferment
  - character-sheet-2.mjs - handles wonky favorite drags, defers rest to
  - actor/sheet-v2-mixin.mjs 
    - handle _onDragItem for drag targets that match `[data-item-id] > .item-row`
    - handle _onDragActivity for drag targets that match `[data-item-id] [data-activity-id], [data-item-id][data-activity-id]`
    - defers rest to
  - mixins/sheet-v2-mixin.mjs - when user is not owner or the dragged document is in a locked compendium, sets allowed effect to "copyLink"; before doing this, defers to
  - actor/base-sheet.mjs - ignores items with class "content-link", attempts to handle drag start for an effect that is owned by the resident document actor. If not an effect or content-link, defers to
  - Foundry core, actor-sheet.js - handles owned items and active effects, setting the data transfer for those.



#### File: module/applications/actor/group-sheet.mjs - another example of the sheet-specific wire-up needs
#### File: module/applications/actor/sheet-mixin.mjs - allowed drop behaviors, default drop behaviors
#### File: module/applications/actor/sheet-v2-mixin.mjs - more new custom drag handling


### Item Sheet



### Container Sheet

File: module/applications/item/container-sheet.mjs


### All Sheets

File: module/applications/mixins/drag-drop-mixin.mjs - the main drag and drop mixin with the core stuff like drop behavior
File: module/applications/mixins/sheet-v2-mixin.mjs - dnd5e's DocumentSheetV2Mixin, applied to all Actors and Items