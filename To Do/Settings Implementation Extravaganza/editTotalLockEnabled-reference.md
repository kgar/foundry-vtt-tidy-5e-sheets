## "editTotalLockEnabled" reference

- [ ] List out all of the fields which should be locked down and then task it out
  - [ ] PCs
    - [ ] ...
  - [ ] NPCs
    - [ ] ...
  - [ ] Vehicles
    - [ ] ...

```
"TIDY5E.Settings.EditTotalLock": {
    "name": "Lock down sensitive fields.",
    "hint": "Enable to prevent accidentally changing sensible, mostly static values."
},
```

```js
// PC
if (!app.actor?.getFlag(CONSTANTS.MODULE_ID, "allow-edit")) {
		if (game.settings.get(CONSTANTS.MODULE_ID, "editTotalLockEnabled")) {
			html.find(".skill input").prop("disabled", true);
			html.find(".skill .config-button").remove();
			html.find(".skill .proficiency-toggle").remove();
			html.find(".ability-score").prop("disabled", true);
			html.find(".ac-display input").prop("disabled", true);
			html.find(".initiative input").prop("disabled", true);
			html.find(".hp-max").prop("disabled", true);
			html.find(".resource-name input").prop("disabled", true);
			html.find(".res-max").prop("disabled", true);
			html.find(".res-options").remove();
			html.find(".ability-modifiers .proficiency-toggle").remove();
			html.find(".ability .config-button").remove();
			html.find(".traits .config-button,.traits .trait-selector,.traits .proficiency-selector").remove();
			html.find("[contenteditable]").prop("contenteditable", false);
			html.find(".caster-level input").prop("disabled", true);
			html.find(".spellcasting-attribute select").prop("disabled", true);
		}
	}

// NPC
if (!app.actor?.getFlag(CONSTANTS.MODULE_ID, "allow-edit")) {
		if (game.settings.get(CONSTANTS.MODULE_ID, "editTotalLockEnabled")) {
			html.find(".skill input").prop("disabled", true);
			html.find(".skill .config-button").remove();
			// html.find(".skill .proficiency-toggle").remove();
			html.find(".skill .proficiency-toggle").removeClass("proficiency-toggle");
			html.find(".ability-score").prop("disabled", true);
			html.find(".ac-display input").prop("disabled", true);
			html.find(".initiative input").prop("disabled", true);
			html.find(".hp-max").prop("disabled", true);
			html.find(".resource-name input").prop("disabled", true);
			html.find(".res-max").prop("disabled", true);
			html.find(".res-options").remove();
			html.find(".ability-modifiers .proficiency-toggle").remove();
			html.find(".ability .config-button").remove();
			html.find(".traits .config-button,.traits .trait-selector,.traits .proficiency-selector").remove();
			html.find("[contenteditable]").prop("contenteditable", false);
			html.find(".spellbook .slot-max-override").remove();
			html.find(".spellcasting-attribute select").prop("disabled", true);
			const spellbook = html.find(".spellbook .inventory-list .item-list").length;
			if (spellbook == 0) html.find(".item[data-tab='spellbook']").remove();
		}
	}

// For NPCs, also apply the PC locks, so if there are non-duplicate locks for that one, then lock 'em

```