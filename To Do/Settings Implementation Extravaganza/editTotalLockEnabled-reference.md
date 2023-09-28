## "editTotalLockEnabled" reference

- [ ] List out all of the fields which should be locked down and then task it out
  - [ ] Universal
    - [ ] When the padlock is locked (allow-edit === false)
      - [ ] Remove the skill config button
      - [ ] Make proficiency toggle button read-only
      - [ ] Disable attribute textinput (str, int, wis, etc.)
      - [ ] Make ability save proficiency readonly
      - [ ] Remove ability config button
      - [ ] Disable INI mod input
      - [ ] Remove INI config button
      - [ ] Disable HP Max
      - [ ] Make Ability Proficiency Toggle read-only
      - [ ] Remove the Ability Config Button
      - [ ] Remove Traits Config Button
      - [ ] Remove Traits Edit Button
      - [ ] Make Tools Proficiency Selector read-only
      - [ ] Remove Tools config button
      - [ ] Make all contenteditable fields read-only (📝 Let's do this on a case-by-case basis)
      - [ ] Make Spellcasting Ability either read-only or swap altogether with some text
      - [ ] Make Max Prepared Spells read-only
      - [ ] Remove max spell slot override pencil and editability / make sure the max spell slots field is read-only
  - [ ] PCs
    - [ ] Disable Resource Name Input
    - [ ] Disable Resource Max Input
    - [ ] Remove Resource Config Button and functionality
  - [ ] NPCs
    - [ ] When allow-edit === false
      - [ ] Spellcaster level: read-only
      - [ ] Legendary action max: read-only
      - [ ] Legendary resistance max: read-only
      - [ ] Lair Action Checkbox: read-only
      - [ ] Lair Action Ini: read-only 
      - [ ] Remove Spellbook tab / Spellbook section in Attr tab when there are no spells in the spellbook
  - [ ] Vehicles
    - [ ] When the padlock is locked (allow-edit === false)
      - [ ] Disable AC While Motionless
- [ ] Now that you have a feel for it, review it all again and see what else might could benefit from being locked down.

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
			html.find(".caster-level input").prop("disabled", true); // actually for NPCs
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
            // Resume here
			const spellbook = html.find(".spellbook .inventory-list .item-list").length;
			if (spellbook == 0) html.find(".item[data-tab='spellbook']").remove();
		}
	}

// For NPCs, also apply the PC locks, so if there are non-duplicate locks for that one, then lock 'em

```