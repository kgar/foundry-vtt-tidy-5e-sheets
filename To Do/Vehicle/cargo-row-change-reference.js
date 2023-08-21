/**
   * Handle saving a cargo row (i.e. crew or passenger) in-sheet.
   * @param {Event} event              Triggering event.
   * @returns {Promise<Actor5e>|null}  Actor after update if any changes were made.
   * @private
   */
  _onCargoRowChange(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const row = target.closest(".item");
    const idx = Number(row.dataset.itemIndex);
    const property = row.classList.contains("crew") ? "crew" : "passengers";

    // Get the cargo entry
    const cargo = foundry.utils.deepClone(this.actor.system.cargo[property]);
    const entry = cargo[idx];
    if ( !entry ) return null;

    // Update the cargo value
    const key = target.dataset.property ?? "name";
    const type = target.dataset.dtype;
    let value = target.value;
    if (type === "Number") value = Number(value);
    entry[key] = value;

    // Perform the Actor update
    return this.actor.update({[`system.cargo.${property}`]: cargo});
  }