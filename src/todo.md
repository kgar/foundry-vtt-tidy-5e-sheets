## Goals
- [x] Pull attribute pins from flag, and sort by sort
- [x] Add context menu options for pin/unpin
- [x] Add option menu for selecting resource when unlocked. It is 3-dots
- [x] Detect missing items and cull them from pins whenever pinning / unpinning occurs.
- [x] Account for Primary Activity uses for items.
- [ ] Swap Item Name with Item Alias, and store that as a string on the pin
- [x] Style the pins
  - [x] spacing and grid work
  - [ ] unidentified support
  - [x] roll indicator
  - [x] items
    - [x] limited use
    - [x] charges / charge recovery roll
    - [x] quantity
  - [ ] activities
- [x] Ensure null/undefined/empty string on the counters default to emdash
- [ ] All input fields: focus on select true
- [ ] Implement drag-and-drop pin sort
- [ ] Implement Activity pinning

## Stretch
- [ ] Consider the difficulty of handling auto-pin on item drop create
  - [ ] If yes, then 
    - [ ] synchronize the item flag to pinning/unpinning
    - [ ] update item sheet so owned items toggle pin/unpin and not the flag. The flag will be toggled automatically by the sheet logic.
  - [ ] If no, then remove the item flag and rely solely on the sheet

```js
/* -------------------------------------------- */

  /**
   * Checks whether the item with the given relative UUID has been favorited
   * @param {string} favoriteId  The relative UUID of the item to check.
   * @returns {boolean}
   */
  hasFavorite(favoriteId) {
    return !!this.favorites.find(f => f.id === favoriteId);
  }

  /* -------------------------------------------- */

  /**
   * Add a favorite item to this actor.
   * If the given item is already favorite, this method has no effect.
   * @param {ActorFavorites5e} favorite  The favorite to add.
   * @returns {Promise<Actor5e>}
   * @throws If the item intended to be favorited does not belong to this actor.
   */
  addFavorite(favorite) {
    if ( this.hasFavorite(favorite.id) ) return Promise.resolve(this.parent);

    if ( favorite.id.startsWith(".") && fromUuidSync(favorite.id, { relative: this.parent }) === null ) {
      // Assume that an ID starting with a "." is a relative ID.
      throw new Error(`The item with id ${favorite.id} is not owned by actor ${this.parent.id}`);
    }

    let maxSort = 0;
    const favorites = this.favorites.map(f => {
      if ( f.sort > maxSort ) maxSort = f.sort;
      return { ...f };
    });
    favorites.push({ ...favorite, sort: maxSort + CONST.SORT_INTEGER_DENSITY });
    return this.parent.update({ "system.favorites": favorites });
  }

  /* -------------------------------------------- */

  /**
   * Removes the favorite with the given relative UUID or resource ID
   * @param {string} favoriteId  The relative UUID or resource ID of the favorite to remove.
   * @returns {Promise<Actor5e>}
   */
  removeFavorite(favoriteId) {
    if ( favoriteId.startsWith("resources.") ) return this.parent.update({ [`system.${favoriteId}.max`]: 0 });
    const favorites = this.favorites.filter(f => f.id !== favoriteId);
    return this.parent.update({ "system.favorites": favorites });
  }

    /**
   * Handle an owned item or effect being dropped in the favorites area.
   * @param {DragEvent} event            The triggering event.
   * @param {ActorFavorites5e} favorite  The favorite that was dropped.
   * @returns {Promise<Actor5e>|void}
   * @protected
   */
    _onDropFavorite(event, favorite) {
      if ( this.actor.system.hasFavorite(favorite.id) ) return this._onSortFavorites(event, favorite.id);
      return this.actor.system.addFavorite(favorite);
    }

      /* -------------------------------------------- */

  /**
   * Handle removing a favorite.
   * @param {PointerEvent} event  The triggering event.
   * @returns {Promise<Actor5e>|void}
   * @protected
   */
  _onRemoveFavorite(event) {
    const { favoriteId } = event.currentTarget.closest("[data-favorite-id]")?.dataset ?? {};
    if ( !favoriteId ) return;
    return this.actor.system.removeFavorite(favoriteId);
  }

  /* -------------------------------------------- */

  /**
   * Handle re-ordering the favorites list.
   * @param {DragEvent} event  The drop event.
   * @param {string} srcId     The identifier of the dropped favorite.
   * @returns {Promise<Actor5e>|void}
   * @protected
   */
  _onSortFavorites(event, srcId) {
    const dropTarget = event.target.closest("[data-favorite-id]");
    if ( !dropTarget ) return;
    let source;
    let target;
    const targetId = dropTarget.dataset.favoriteId;
    if ( srcId === targetId ) return;
    const siblings = this.actor.system.favorites.filter(f => {
      if ( f.id === targetId ) target = f;
      else if ( f.id === srcId ) source = f;
      return f.id !== srcId;
    });
    const updates = SortingHelpers.performIntegerSort(source, { target, siblings });
    const favorites = this.actor.system.favorites.reduce((map, f) => map.set(f.id, { ...f }), new Map());
    for ( const { target, update } of updates ) {
      const favorite = favorites.get(target.id);
      foundry.utils.mergeObject(favorite, update);
    }
    return this.actor.update({ "system.favorites": Array.from(favorites.values()) });
  }
  ```