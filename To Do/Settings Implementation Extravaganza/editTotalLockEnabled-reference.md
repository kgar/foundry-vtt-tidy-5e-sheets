## "editTotalLockEnabled" reference

- [ ] List out all of the fields which should be locked down and then task it out
  - [ ] Universal
    - [ ] When the padlock is locked (allow-edit === false)
      - [x] Remove the skill config button
      - [x] Make proficiency toggle button read-only
      - [x] Disable attribute textinput (str, int, wis, etc.)
      - [x] Make ability save proficiency readonly
      - [x] Remove ability config button
      - [x] Disable INI mod input
      - [x] Remove INI config button
      - [x] Disable HP Max
      - [x] Make Ability Proficiency Toggle read-only
      - [x] Remove the Ability Config Button
      - [x] Remove Traits Config Button
      - [x] Remove Traits Edit Button
      - [x] Make Tools Proficiency Selector read-only
      - [x] Remove Tools config button
      - [x] Make Spellcasting Ability either read-only or swap altogether with some text
      - [x] Make Max Prepared Spells read-only
      - [x] Remove max spell slot override pencil and editability / make sure the max spell slots field is read-only
      - [ ] Make all contenteditable fields read-only (📝 Let's do this on a case-by-case basis)
  - [x] PCs
    - [x] Disable Resource Name Input
    - [x] Disable Resource Max Input
    - [x] Remove Resource Config Button and functionality
  - [x] NPCs
    - [x] When allow-edit === false
      - [x] Spellcaster level: read-only
      - [x] Legendary action max: read-only
      - [x] Legendary resistance max: read-only
      - [x] Lair Action Checkbox: read-only
      - [x] Lair Action Ini: read-only 
      - [x] Remove Spellbook tab / Spellbook section in Attr tab when there are no spells in the spellbook
  - [x] Vehicles
    - [x] When the padlock is locked (allow-edit === false)
      - [x] Disable AC While In Motion
      - [x] Disable AC While Motionless
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