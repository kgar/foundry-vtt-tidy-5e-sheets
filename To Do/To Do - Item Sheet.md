## To Do

- [x] ~~Create a subclass of Application with the empty article template~~ nah, it expects a form, and a form should be there for module devs who want to use form elements with `name`.
- [x] Create components for each known shared tab
  - [x] {{> "dnd5e.item-advancement"}}
  - [x] {{> "dnd5e.item-description"}}
  - [x] {{> "dnd5e.active-effects"}}
- [x] Create components for each item type, and scaffold their known tabs
  - [x] `background.hbs`
  - [x] `backpack.hbs`
  - [x] `class.hbs`
  - [x] `consumable.hbs`
  - [x] `equipment.hbs`
  - [x] `feat.hbs`
  - [x] `loot.hbs`
  - [x] `spell.hbs`
  - [x] `subclass.hbs`
  - [x] `tool.hbs`
  - [x] `weapon.hbs`
- [x] Implement auto-resize
- [x] Look for all the hidden jquery behaviors that wire during activateListeners; task out the ones we should keep
  - [x] dnd5e
    - [x] Secret block Reveal/Hide buttons (this was more universal than just item sheets, but I fixed it here 💪)
    - [x] Advancement Context Menu Options
  - [x] Tidy 5e
    - [x] Implement Spell Class in the ItemSpell sheet. It only appears when spellbook filtering is turned on.
    - [x] Apply Item Locks
- [x] Troubleshoot: I'm getting an error sometimes about a missing form tag. I may have to use the form tag template... or suppress the submit function
  - [x] Put a debugger; tag on submit to see if I can prevent it from submitting.
- [x] Consider taking all stock tabs and making either a function or a statically available version of them that can be cloned into a tab list. This will allow me to make changes to tabcontent classes, for example, in one place instead of everywhere that the tab is used.
- [x] Rename the `item` folder to `items`. Rename the individual item sheet components to remove the `Item` prefix and suffix with `Sheet`, so `ItemSpell` should be `SpellSheet`.
- [ ] Create a map from item type to sheet and eliminate the big giant switch?
  - **important**: This will open the door to custom Tidy 5e item sheets from module developers.

## Spell Class Filter Options impl

```js
import CONSTANTS from "./constants.js";

const classesConfiguration = {
	artificer: "TIDY5E.ClassArtificer",
	barbarian: "TIDY5E.ClassBarbarian",
	bard: "TIDY5E.ClassBard",
	cleric: "TIDY5E.ClassCleric",
	druid: "TIDY5E.ClassDruid",
	fighter: "TIDY5E.ClassFighter",
	monk: "TIDY5E.ClassMonk",
	paladin: "TIDY5E.ClassPaladin",
	ranger: "TIDY5E.ClassRanger",
	rogue: "TIDY5E.ClassRogue",
	sorcerer: "TIDY5E.ClassSorcerer",
	warlock: "TIDY5E.ClassWarlock",
	wizard: "TIDY5E.ClassWizard",
	custom: "TIDY5E.ClassCustom"
};

let classesConfigurationTmp = {};

export async function applySpellClassFilterItemSheet(app, html, itemData) {
	if (!game.settings.get(CONSTANTS.MODULE_ID, "spellClassFilterSelect")) {
		return;
	}
	// The module already do the job so for avoid redundance...
	if (game.modules.get("spell-class-filter-for-5e")?.active) {
		return;
	}
	// collect relevant settings first
	const user_setting_filterSelect = game.settings.get(CONSTANTS.MODULE_ID, "spellClassFilterSelect");
	const user_setting_iconReplace = game.settings.get(CONSTANTS.MODULE_ID, "spellClassFilterIconReplace");

	const item = app.object;
	const type = item.type;

	// If this is a spell construct the HTML and inject it onto the page.
	if (type == "spell") {
		classesConfigurationTmp = classesConfiguration;
		const user_setting_addClasses = game.settings.get(CONSTANTS.MODULE_ID, "spellClassFilterAdditionalClasses");
		if (user_setting_addClasses && user_setting_addClasses.includes("|")) {
			let classes = [];
			if (user_setting_addClasses.includes(",")) {
				classes = user_setting_addClasses.split(",");
			} else {
				classes = [user_setting_addClasses];
			}
			for (let clazz of classes) {
				const c = clazz.split("|");
				const id = c[0];
				const name = c[1];
				if (id && name) {
					classesConfigurationTmp[id] = name;
				}
			}
		}

		const spellDetailsDiv = html.find(".tab.details");
		const firstChild = spellDetailsDiv.children("h3:first");
		const spellClassForm = await renderTemplate(
			"modules/tidy5e-sheet/templates/items/tidy5e-spell-class-filter-form.html",
			{
				SCF: classesConfigurationTmp,
				item,
				flags: item.flags
			}
		);
		// Under the first header in the details tab.
		firstChild.after(spellClassForm);
	}
}

// Any time an actor sheet is rendered check if it is a player character.  If so add the option to set the filter.
// Then hide elements that do not match the filter.
export async function applySpellClassFilterActorSheet(app, html, actorData) {
	if (!game.settings.get(CONSTANTS.MODULE_ID, "spellClassFilterSelect")) {
		return;
	}
	// The module already do the job so for avoid redundance...
	if (game.modules.get("spell-class-filter-for-5e")?.active) {
		return;
	}
	// collect relevant settings first
	const user_setting_filterSelect = game.settings.get(CONSTANTS.MODULE_ID, "spellClassFilterSelect");
	const user_setting_iconReplace = game.settings.get(CONSTANTS.MODULE_ID, "spellClassFilterIconReplace");

	// collect some data to use later
	const actor = app.object;
	const type = actor.type;
	const flags = actor.flags;
	const actorSCFlags = flags[CONSTANTS.MODULE_ID];

	if (type == "character") {
		const spellbook = html.find(".tab.spellbook");
		const filterList = spellbook.find("ul.filter-list");
		const firstItem = filterList.children("li.filter-item:first");
		// const itemData = actor.items
		const actorItems = actor.items;

		// Inject a simple dropdown menu.
		if (user_setting_filterSelect) {
			classesConfigurationTmp = classesConfiguration;
			const user_setting_addClasses = game.settings.get(CONSTANTS.MODULE_ID, "spellClassFilterAdditionalClasses");
			if (user_setting_addClasses && user_setting_addClasses.includes("|")) {
				let classes = [];
				if (user_setting_addClasses.includes(",")) {
					classes = user_setting_addClasses.split(",");
				} else {
					classes = [user_setting_addClasses];
				}
				for (let clazz of classes) {
					const c = clazz.split("|");
					const id = c[0];
					const name = c[1];
					if (id && name) {
						classesConfigurationTmp[id] = name;
					}
				}
			}
			const actorClassFilter = await renderTemplate(
				"modules/tidy5e-sheet/templates/actors/parts/tidy5e-spellbook-class-filter.html",
				{
					SCF: classesConfigurationTmp,
					actor,
					flags: flags,
					scFlags: actor.flags[CONSTANTS.MODULE_ID]
				}
			);
			firstItem.before(actorClassFilter);
		}

		// Get a list of classes for the actor and store their img.
		let classes = {};
		for (let item of actorItems) {
			if (item.type == "class") {
				let className = item.name.toLowerCase();
				let classImg = item.img;
				classes[className] = classImg;
			}
		}
		// spellClassFilter.log(true, classes)
		// Loop through some elements and get thier data
		const spellList = spellbook.find(".inventory-list");
		const items = spellList.find(".item");
		items.each(function () {
			let itemID = $(this).data("item-id");
			let item = actorItems.get(itemID);
			let itemFlags = item.flags;
			let itemSCFlags = itemFlags[CONSTANTS.MODULE_ID]; //Should return undefined if doesn't exist.

			if (user_setting_iconReplace) {
				// Replace spell icon image
				if (itemSCFlags) {
					if (classes.hasOwnProperty(itemSCFlags.parentClass)) {
						// spellClassFilter.log(false, $(this))
						// $(this).css('background-image', 'url('+classes[itemSCFlags.parentClass]+')')
						let imgdiv = $(this).find(".item-image");
						imgdiv.css("background-image", `url(${classes[itemSCFlags.parentClass]})`);
					}
				}
			}

			if (user_setting_filterSelect) {
				if (hasProperty(actorSCFlags, "classFilter")) {
					// Hide each element that doesn't match. Or don't hide anything if nothing is selected.
					if (actorSCFlags.classFilter != "") {
						if (itemSCFlags) {
							if (!(itemSCFlags.parentClass == actorSCFlags.classFilter)) {
								$(this).hide();
							}
						} else {
							$(this).hide();
						}
					}
				}
			}
		});
	} //end if character
} //end actorsheet hook
```

```hbs
<div class="form-group">
	<label>{{ localize "TIDY5E.SpellClass" }}</label>
	<select name="flags.tidy5e-sheet.parentClass">
		{{#select flags.tidy5e-sheet.parentClass}}
		<option value="">---</option>
		{{#each SCF as |name key|}}
		<option value="{{key}}">{{ localize name}}</option>
		{{/each}} {{/select}}
	</select>
</div>

```

## Apply Item Locks

```js
export function applyLocksItemSheet(app, html, actorData) {
	if (game.user.isGM) {
		return;
	}
	if (game.settings.get(CONSTANTS.MODULE_ID, "lockItemQuantity")) {
		// for (const elem of html.find("input[data-path^='system.quantity']")) {
		// 	elem.setAttribute("readonly", true);
		// }
		for (const elem of html.find("input[name^='system.quantity']")) {
			elem.setAttribute("readonly", true);
		}
	}
	if (game.settings.get(CONSTANTS.MODULE_ID, "lockConfigureSheet")) {
		for (const elem of html.find("a[class$='configure-sheet']")) {
			elem.style.pointerEvents = "none";
			elem.style.cursor = "default";
			elem.style.display = "none";
		}
	}
}
```

## Advancement Context Menu options

```js
  /** @inheritDoc */
  activateListeners(html) {
    super.activateListeners(html);
    if ( this.isEditable ) {
      html.find(".damage-control").click(this._onDamageControl.bind(this));
      html.find(".trait-selector").click(this._onConfigureTraits.bind(this));
      html.find(".effect-control").click(ev => {
        const unsupported = game.dnd5e.isV10 && this.item.isOwned;
        if ( unsupported ) return ui.notifications.warn("Managing Active Effects within an Owned Item is not currently supported and will be added in a subsequent update.");
        ActiveEffect5e.onManageActiveEffect(ev, this.item);
      });
      html.find(".advancement .item-control").click(event => {
        const t = event.currentTarget;
        if ( t.dataset.action ) this._onAdvancementAction(t, t.dataset.action);
      });
    }

    // Advancement context menu
    const contextOptions = this._getAdvancementContextMenuOptions();
    /**
     * A hook event that fires when the context menu for the advancements list is constructed.
     * @function dnd5e.getItemAdvancementContext
     * @memberof hookEvents
     * @param {jQuery} html                      The HTML element to which the context options are attached.
     * @param {ContextMenuEntry[]} entryOptions  The context menu entries.
     */
    Hooks.call("dnd5e.getItemAdvancementContext", html, contextOptions);
    if ( contextOptions ) new ContextMenu(html, ".advancement-item", contextOptions);
  }

    /**
   * Get the set of ContextMenu options which should be applied for advancement entries.
   * @returns {ContextMenuEntry[]}  Context menu entries.
   * @protected
   */
  _getAdvancementContextMenuOptions() {
    const condition = li => (this.advancementConfigurationMode || !this.isEmbedded) && this.isEditable;
    return [
      {
        name: "DND5E.AdvancementControlEdit",
        icon: "<i class='fas fa-edit fa-fw'></i>",
        condition,
        callback: li => this._onAdvancementAction(li[0], "edit")
      },
      {
        name: "DND5E.AdvancementControlDuplicate",
        icon: "<i class='fas fa-copy fa-fw'></i>",
        condition: li => {
          const id = li[0].closest(".advancement-item")?.dataset.id;
          const advancement = this.item.advancement.byId[id];
          return condition() && advancement?.constructor.availableForItem(this.item);
        },
        callback: li => this._onAdvancementAction(li[0], "duplicate")
      },
      {
        name: "DND5E.AdvancementControlDelete",
        icon: "<i class='fas fa-trash fa-fw' style='color: rgb(255, 65, 65);'></i>",
        condition,
        callback: li => this._onAdvancementAction(li[0], "delete")
      }
    ];
  }

    /**
   * Handle one of the advancement actions from the buttons or context menu.
   * @param {Element} target  Button or context menu entry that triggered this action.
   * @param {string} action   Action being triggered.
   * @returns {Promise|void}
   */
  _onAdvancementAction(target, action) {
    const id = target.closest(".advancement-item")?.dataset.id;
    const advancement = this.item.advancement.byId[id];
    let manager;
    if ( ["edit", "delete", "duplicate"].includes(action) && !advancement ) return;
    switch (action) {
      case "add": return game.dnd5e.applications.advancement.AdvancementSelection.createDialog(this.item);
      case "edit": return new advancement.constructor.metadata.apps.config(advancement).render(true);
      case "delete":
        if ( this.item.isEmbedded && !game.settings.get("dnd5e", "disableAdvancements") ) {
          manager = AdvancementManager.forDeletedAdvancement(this.item.actor, this.item.id, id);
          if ( manager.steps.length ) return manager.render(true);
        }
        return this.item.deleteAdvancement(id);
      case "duplicate": return this.item.duplicateAdvancement(id);
      case "modify-choices":
        const level = target.closest("li")?.dataset.level;
        manager = AdvancementManager.forModifyChoices(this.item.actor, this.item.id, Number(level));
        if ( manager.steps.length ) manager.render(true);
        return;
      case "toggle-configuration":
        this.advancementConfigurationMode = !this.advancementConfigurationMode;
        return this.render();
    }
  }
```

## How does it work?

Item Sheet is actually a large switch-point to a variety of different sheets.

Look at how they break it down into different templates, based on which item type it is:

```js
  get template() {
    return `systems/dnd5e/templates/items/${this.item.type}.hbs`;
  }
```

### What Should We Do?

If I am going to the svelte-y way, then we would do a switch in `activateListeners()` on `item.type`.

**What about the default case?** It would be a good idea to provide a view which explains that Tidy 5e has not implemented the target item type. Explain what the type is, provide a link to the repo to file an issue, etc.

## Tidy 5e Item Sheet impl

```js
export class Tidy5eItemSheet extends dnd5e.applications.item.ItemSheet5e {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['tidy5e', 'dnd5ebak', 'sheet', 'item'],
    });
  }

  activateListeners(html) {
    super.activateListeners(html);

    let item = this.item;
    debug(`tidy5e-item | activateListeners | item: ${item}`);

    tidy5eShowItemArt(html, item);
  }
}

async function addEditorHeadline(app, html, data) {
  html
    .find('.tab[data-tab=description] .editor')
    .prepend(
      `<h2 class="details-headline">${game.i18n.localize(
        'TIDY5E.ItemDetailsHeadline'
      )}</h2>`
    );
}

// Register Tidy5e Item Sheet and make default
Items.registerSheet('dnd5e', Tidy5eItemSheet, { makeDefault: true });

Hooks.on('renderTidy5eItemSheet', (app, html, data) => {
  addEditorHeadline(app, html, data);
  applySpellClassFilterItemSheet(app, html, data);

  // NOTE LOCKS ARE THE LAST THING TO SET
  applyLocksItemSheet(app, html, data);
});
```

## DND5E Item Sheet Impl

```js
/**
 * Override and extend the core ItemSheet implementation to handle specific item types.
 */
export default class ItemSheet5e extends ItemSheet {
  constructor(...args) {
    super(...args);

    // Expand the default size of the class sheet
    if (this.object.type === 'class') {
      this.options.width = this.position.width = 600;
      this.options.height = this.position.height = 680;
    } else if (this.object.type === 'subclass') {
      this.options.height = this.position.height = 540;
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 560,
      height: 400,
      classes: ['dnd5e', 'sheet', 'item'],
      resizable: true,
      scrollY: ['.tab.details'],
      tabs: [
        {
          navSelector: '.tabs',
          contentSelector: '.sheet-body',
          initial: 'description',
        },
      ],
      dragDrop: [
        { dragSelector: '[data-effect-id]', dropSelector: '.effects-list' },
        { dragSelector: '.advancement-item', dropSelector: '.advancement' },
      ],
    });
  }

  /* -------------------------------------------- */

  /**
   * Whether advancements on embedded items should be configurable.
   * @type {boolean}
   */
  advancementConfigurationMode = false;

  /* -------------------------------------------- */

  /** @inheritdoc */
  get template() {
    return `systems/dnd5e/templates/items/${this.item.type}.hbs`;
  }

  /* -------------------------------------------- */
  /*  Context Preparation                         */
  /* -------------------------------------------- */

  /** @override */
  async getData(options) {
    const context = await super.getData(options);
    const item = context.item;
    const source = item.toObject();

    // Game system configuration
    context.config = CONFIG.DND5E;

    // Item rendering data
    foundry.utils.mergeObject(context, {
      source: source.system,
      system: item.system,
      labels: item.labels,
      isEmbedded: item.isEmbedded,
      advancementEditable:
        (this.advancementConfigurationMode || !item.isEmbedded) &&
        context.editable,
      rollData: this.item.getRollData(),

      // Item Type, Status, and Details
      itemType: game.i18n.localize(CONFIG.Item.typeLabels[this.item.type]),
      itemStatus: this._getItemStatus(),
      itemProperties: this._getItemProperties(),
      baseItems: await this._getItemBaseTypes(),
      isPhysical: item.system.hasOwnProperty('quantity'),

      // Action Details
      isHealing: item.system.actionType === 'heal',
      isFlatDC: item.system.save?.scaling === 'flat',
      isLine: ['line', 'wall'].includes(item.system.target?.type),

      // Vehicles
      isCrewed: item.system.activation?.type === 'crew',

      // Armor Class
      hasDexModifier: item.isArmor && item.system.armor?.type !== 'shield',

      // Advancement
      advancement: this._getItemAdvancement(item),

      // Prepare Active Effects
      effects: ActiveEffect5e.prepareActiveEffectCategories(item.effects),
    });
    context.abilityConsumptionTargets = this._getItemConsumptionTargets();

    // Special handling for specific item types
    switch (item.type) {
      case 'feat':
        const featureType = CONFIG.DND5E.featureTypes[item.system.type?.value];
        if (featureType) {
          context.itemType = featureType.label;
          context.featureSubtypes = featureType.subtypes;
        }
        break;
      case 'spell':
        context.spellComponents = {
          ...CONFIG.DND5E.spellComponents,
          ...CONFIG.DND5E.spellTags,
        };
        break;
    }

    // Enrich HTML description
    context.descriptionHTML = await TextEditor.enrichHTML(
      item.system.description.value,
      {
        secrets: item.isOwner,
        async: true,
        relativeTo: this.item,
        rollData: context.rollData,
      }
    );
    return context;
  }

  /* -------------------------------------------- */

  /**
   * Get the display object used to show the advancement tab.
   * @param {Item5e} item  The item for which the advancement is being prepared.
   * @returns {object}     Object with advancement data grouped by levels.
   */
  _getItemAdvancement(item) {
    if (!item.system.advancement) return {};
    const advancement = {};
    const configMode = !item.parent || this.advancementConfigurationMode;
    const maxLevel = !configMode
      ? item.system.levels ??
        item.class?.system.levels ??
        item.parent.system.details?.level ??
        -1
      : -1;

    // Improperly configured advancements
    if (item.advancement.needingConfiguration.length) {
      advancement.unconfigured = {
        items: item.advancement.needingConfiguration.map((a) => ({
          id: a.id,
          order: a.constructor.order,
          title: a.title,
          icon: a.icon,
          classRestriction: a.classRestriction,
          configured: false,
        })),
        configured: 'partial',
      };
    }

    // All other advancements by level
    for (let [level, advancements] of Object.entries(
      item.advancement.byLevel
    )) {
      if (!configMode)
        advancements = advancements.filter((a) => a.appliesToClass);
      const items = advancements.map((advancement) => ({
        id: advancement.id,
        order: advancement.sortingValueForLevel(level),
        title: advancement.titleForLevel(level, { configMode }),
        icon: advancement.icon,
        classRestriction: advancement.classRestriction,
        summary: advancement.summaryForLevel(level, { configMode }),
        configured: advancement.configuredForLevel(level),
      }));
      if (!items.length) continue;
      advancement[level] = {
        items: items.sort((a, b) => a.order.localeCompare(b.order)),
        configured:
          level > maxLevel
            ? false
            : items.some((a) => !a.configured)
            ? 'partial'
            : 'full',
      };
    }
    return advancement;
  }

  /* -------------------------------------------- */

  /**
   * Get the base weapons and tools based on the selected type.
   * @returns {Promise<object>}  Object with base items for this type formatted for selectOptions.
   * @protected
   */
  async _getItemBaseTypes() {
    const type = this.item.type === 'equipment' ? 'armor' : this.item.type;
    const baseIds = CONFIG.DND5E[`${type}Ids`];
    if (baseIds === undefined) return {};

    const typeProperty = type === 'armor' ? 'armor.type' : `${type}Type`;
    const baseType = foundry.utils.getProperty(this.item.system, typeProperty);

    const items = {};
    for (const [name, id] of Object.entries(baseIds)) {
      const baseItem = await Trait.getBaseItem(id);
      if (
        baseType !== foundry.utils.getProperty(baseItem?.system, typeProperty)
      )
        continue;
      items[name] = baseItem.name;
    }
    return Object.fromEntries(
      Object.entries(items).sort((lhs, rhs) => lhs[1].localeCompare(rhs[1]))
    );
  }

  /* -------------------------------------------- */

  /**
   * Get the valid item consumption targets which exist on the actor
   * @returns {Object<string>}   An object of potential consumption targets
   * @private
   */
  _getItemConsumptionTargets() {
    const consume = this.item.system.consume || {};
    if (!consume.type) return [];
    const actor = this.item.actor;
    if (!actor) return {};

    // Ammunition
    if (consume.type === 'ammo') {
      return actor.itemTypes.consumable.reduce((ammo, i) => {
        if (i.system.consumableType === 'ammo')
          ammo[i.id] = `${i.name} (${i.system.quantity})`;
        return ammo;
      }, {});
    }

    // Attributes
    else if (consume.type === 'attribute') {
      const attrData = game.dnd5e.isV10 ? actor.system : actor.type;
      const attributes =
        TokenDocument.implementation.getConsumedAttributes(attrData);
      attributes.bar.forEach((a) => a.push('value'));
      return attributes.bar.concat(attributes.value).reduce((obj, a) => {
        let k = a.join('.');
        obj[k] = k;
        return obj;
      }, {});
    }

    // Hit Dice
    else if (consume.type === 'hitDice') {
      return {
        smallest: game.i18n.localize('DND5E.ConsumeHitDiceSmallest'),
        ...CONFIG.DND5E.hitDieTypes.reduce((obj, hd) => {
          obj[hd] = hd;
          return obj;
        }, {}),
        largest: game.i18n.localize('DND5E.ConsumeHitDiceLargest'),
      };
    }

    // Materials
    else if (consume.type === 'material') {
      return actor.items.reduce((obj, i) => {
        if (['consumable', 'loot'].includes(i.type) && !i.system.activation) {
          obj[i.id] = `${i.name} (${i.system.quantity})`;
        }
        return obj;
      }, {});
    }

    // Charges
    else if (consume.type === 'charges') {
      return actor.items.reduce((obj, i) => {
        // Limited-use items
        const uses = i.system.uses || {};
        if (uses.per && uses.max) {
          const label =
            uses.per === 'charges'
              ? ` (${game.i18n.format('DND5E.AbilityUseChargesLabel', {
                  value: uses.value,
                })})`
              : ` (${game.i18n.format('DND5E.AbilityUseConsumableLabel', {
                  max: uses.max,
                  per: uses.per,
                })})`;
          obj[i.id] = i.name + label;
        }

        // Recharging items
        const recharge = i.system.recharge || {};
        if (recharge.value)
          obj[i.id] = `${i.name} (${game.i18n.format('DND5E.Recharge')})`;
        return obj;
      }, {});
    } else return {};
  }

  /* -------------------------------------------- */

  /**
   * Get the text item status which is shown beneath the Item type in the top-right corner of the sheet.
   * @returns {string|null}  Item status string if applicable to item's type.
   * @protected
   */
  _getItemStatus() {
    switch (this.item.type) {
      case 'class':
        return game.i18n.format('DND5E.LevelCount', {
          ordinal: this.item.system.levels.ordinalString(),
        });
      case 'equipment':
      case 'weapon':
        return game.i18n.localize(
          this.item.system.equipped ? 'DND5E.Equipped' : 'DND5E.Unequipped'
        );
      case 'feat':
        const typeConfig =
          CONFIG.DND5E.featureTypes[this.item.system.type.value];
        if (typeConfig?.subtypes)
          return typeConfig.subtypes[this.item.system.type.subtype] ?? null;
        break;
      case 'spell':
        return CONFIG.DND5E.spellPreparationModes[this.item.system.preparation];
      case 'tool':
        return game.i18n.localize(
          this.item.system.proficient
            ? 'DND5E.Proficient'
            : 'DND5E.NotProficient'
        );
    }
    return null;
  }

  /* -------------------------------------------- */

  /**
   * Get the Array of item properties which are used in the small sidebar of the description tab.
   * @returns {string[]}   List of property labels to be shown.
   * @private
   */
  _getItemProperties() {
    const props = [];
    const labels = this.item.labels;
    switch (this.item.type) {
      case 'equipment':
        props.push(CONFIG.DND5E.equipmentTypes[this.item.system.armor.type]);
        if (this.item.isArmor || this.item.isMountable)
          props.push(labels.armor);
        break;
      case 'feat':
        props.push(labels.featType);
        break;
      case 'spell':
        props.push(
          labels.components.vsm,
          labels.materials,
          ...labels.components.tags
        );
        break;
      case 'weapon':
        for (const [k, v] of Object.entries(this.item.system.properties)) {
          if (v === true) props.push(CONFIG.DND5E.weaponProperties[k]);
        }
        break;
    }

    // Action type
    if (this.item.system.actionType) {
      props.push(CONFIG.DND5E.itemActionTypes[this.item.system.actionType]);
    }

    // Action usage
    if (
      this.item.type !== 'weapon' &&
      !foundry.utils.isEmpty(this.item.system.activation)
    ) {
      props.push(
        labels.activation,
        labels.range,
        labels.target,
        labels.duration
      );
    }
    return props.filter((p) => !!p);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  setPosition(position = {}) {
    if (!(this._minimized || position.height)) {
      position.height =
        this._tabs[0].active === 'details'
          ? 'auto'
          : Math.max(this.height, this.options.height);
    }
    return super.setPosition(position);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async activateEditor(name, options = {}, initialContent = '') {
    options.relativeLinks = true;
    options.plugins = {
      menu: ProseMirror.ProseMirrorMenu.build(ProseMirror.defaultSchema, {
        compact: true,
        destroyOnSave: true,
        onSave: () => this.saveEditor(name, { remove: true }),
      }),
    };
    return super.activateEditor(name, options, initialContent);
  }

  /* -------------------------------------------- */
  /*  Form Submission                             */
  /* -------------------------------------------- */

  /** @inheritDoc */
  _getSubmitData(updateData = {}) {
    const formData = foundry.utils.expandObject(
      super._getSubmitData(updateData)
    );

    // Handle Damage array
    const damage = formData.system?.damage;
    if (damage)
      damage.parts = Object.values(damage?.parts || {}).map((d) => [
        d[0] || '',
        d[1] || '',
      ]);

    // Check max uses formula
    const uses = formData.system?.uses;
    if (uses?.max) {
      const maxRoll = new Roll(uses.max);
      if (!maxRoll.isDeterministic) {
        uses.max = this.item._source.system.uses.max;
        this.form.querySelector("input[name='system.uses.max']").value =
          uses.max;
        return ui.notifications.error(
          game.i18n.format('DND5E.FormulaCannotContainDiceError', {
            name: game.i18n.localize('DND5E.LimitedUses'),
          })
        );
      }
    }

    // Check duration value formula
    const duration = formData.system?.duration;
    if (duration?.value) {
      const durationRoll = new Roll(duration.value);
      if (!durationRoll.isDeterministic) {
        duration.value = this.item._source.system.duration.value;
        this.form.querySelector("input[name='system.duration.value']").value =
          duration.value;
        return ui.notifications.error(
          game.i18n.format('DND5E.FormulaCannotContainDiceError', {
            name: game.i18n.localize('DND5E.Duration'),
          })
        );
      }
    }

    // Check class identifier
    if (
      formData.system?.identifier &&
      !dnd5e.utils.validators.isValidIdentifier(formData.system.identifier)
    ) {
      formData.system.identifier = this.item._source.system.identifier;
      this.form.querySelector("input[name='system.identifier']").value =
        formData.system.identifier;
      return ui.notifications.error(
        game.i18n.localize('DND5E.IdentifierError')
      );
    }

    // Return the flattened submission data
    return foundry.utils.flattenObject(formData);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners(html) {
    super.activateListeners(html);
    if (this.isEditable) {
      html.find('.damage-control').click(this._onDamageControl.bind(this));
      html.find('.trait-selector').click(this._onConfigureTraits.bind(this));
      html.find('.effect-control').click((ev) => {
        const unsupported = game.dnd5e.isV10 && this.item.isOwned;
        if (unsupported)
          return ui.notifications.warn(
            'Managing Active Effects within an Owned Item is not currently supported and will be added in a subsequent update.'
          );
        ActiveEffect5e.onManageActiveEffect(ev, this.item);
      });
      html.find('.advancement .item-control').click((event) => {
        const t = event.currentTarget;
        if (t.dataset.action) this._onAdvancementAction(t, t.dataset.action);
      });
    }

    // Advancement context menu
    const contextOptions = this._getAdvancementContextMenuOptions();
    /**
     * A hook event that fires when the context menu for the advancements list is constructed.
     * @function dnd5e.getItemAdvancementContext
     * @memberof hookEvents
     * @param {jQuery} html                      The HTML element to which the context options are attached.
     * @param {ContextMenuEntry[]} entryOptions  The context menu entries.
     */
    Hooks.call('dnd5e.getItemAdvancementContext', html, contextOptions);
    if (contextOptions)
      new ContextMenu(html, '.advancement-item', contextOptions);
  }

  /* -------------------------------------------- */

  /**
   * Get the set of ContextMenu options which should be applied for advancement entries.
   * @returns {ContextMenuEntry[]}  Context menu entries.
   * @protected
   */
  _getAdvancementContextMenuOptions() {
    const condition = (li) =>
      (this.advancementConfigurationMode || !this.isEmbedded) &&
      this.isEditable;
    return [
      {
        name: 'DND5E.AdvancementControlEdit',
        icon: "<i class='fas fa-edit fa-fw'></i>",
        condition,
        callback: (li) => this._onAdvancementAction(li[0], 'edit'),
      },
      {
        name: 'DND5E.AdvancementControlDuplicate',
        icon: "<i class='fas fa-copy fa-fw'></i>",
        condition: (li) => {
          const id = li[0].closest('.advancement-item')?.dataset.id;
          const advancement = this.item.advancement.byId[id];
          return (
            condition(li) &&
            advancement?.constructor.availableForItem(this.item)
          );
        },
        callback: (li) => this._onAdvancementAction(li[0], 'duplicate'),
      },
      {
        name: 'DND5E.AdvancementControlDelete',
        icon: "<i class='fas fa-trash fa-fw' style='color: rgb(255, 65, 65);'></i>",
        condition,
        callback: (li) => this._onAdvancementAction(li[0], 'delete'),
      },
    ];
  }

  /* -------------------------------------------- */

  /**
   * Add or remove a damage part from the damage formula.
   * @param {Event} event             The original click event.
   * @returns {Promise<Item5e>|null}  Item with updates applied.
   * @private
   */
  async _onDamageControl(event) {
    event.preventDefault();
    const a = event.currentTarget;

    // Add new damage component
    if (a.classList.contains('add-damage')) {
      await this._onSubmit(event); // Submit any unsaved changes
      const damage = this.item.system.damage;
      return this.item.update({
        'system.damage.parts': damage.parts.concat([['', '']]),
      });
    }

    // Remove a damage component
    if (a.classList.contains('delete-damage')) {
      await this._onSubmit(event); // Submit any unsaved changes
      const li = a.closest('.damage-part');
      const damage = foundry.utils.deepClone(this.item.system.damage);
      damage.parts.splice(Number(li.dataset.damagePart), 1);
      return this.item.update({ 'system.damage.parts': damage.parts });
    }
  }
  /* -------------------------------------------- */

  /** @inheritdoc */
  _onDragStart(event) {
    const li = event.currentTarget;
    if (event.target.classList.contains('content-link')) return;

    // Create drag data
    let dragData;

    // Active Effect
    if (li.dataset.effectId) {
      const effect = this.item.effects.get(li.dataset.effectId);
      dragData = effect.toDragData();
    } else if (li.classList.contains('advancement-item')) {
      dragData = this.item.advancement.byId[li.dataset.id]?.toDragData();
    }

    if (!dragData) return;

    // Set data transfer
    event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _onDrop(event) {
    const data = TextEditor.getDragEventData(event);
    const item = this.item;

    /**
     * A hook event that fires when some useful data is dropped onto an ItemSheet5e.
     * @function dnd5e.dropItemSheetData
     * @memberof hookEvents
     * @param {Item5e} item                  The Item5e
     * @param {ItemSheet5e} sheet            The ItemSheet5e application
     * @param {object} data                  The data that has been dropped onto the sheet
     * @returns {boolean}                    Explicitly return `false` to prevent normal drop handling.
     */
    const allowed = Hooks.call('dnd5e.dropItemSheetData', item, this, data);
    if (allowed === false) return;

    switch (data.type) {
      case 'ActiveEffect':
        return this._onDropActiveEffect(event, data);
      case 'Advancement':
      case 'Item':
        return this._onDropAdvancement(event, data);
    }
  }

  /* -------------------------------------------- */

  /**
   * Handle the dropping of ActiveEffect data onto an Item Sheet
   * @param {DragEvent} event                  The concluding DragEvent which contains drop data
   * @param {object} data                      The data transfer extracted from the event
   * @returns {Promise<ActiveEffect|boolean>}  The created ActiveEffect object or false if it couldn't be created.
   * @protected
   */
  async _onDropActiveEffect(event, data) {
    const effect = await ActiveEffect.implementation.fromDropData(data);
    if (!this.item.isOwner || !effect) return false;
    if (
      this.item.uuid === effect.parent.uuid ||
      this.item.uuid === effect.origin
    )
      return false;
    return ActiveEffect.create(
      {
        ...effect.toObject(),
        origin: this.item.uuid,
      },
      { parent: this.item }
    );
  }

  /* -------------------------------------------- */

  /**
   * Handle the dropping of an advancement or item with advancements onto the advancements tab.
   * @param {DragEvent} event                  The concluding DragEvent which contains drop data.
   * @param {object} data                      The data transfer extracted from the event.
   */
  async _onDropAdvancement(event, data) {
    let advancements;
    let showDialog = false;
    if (data.type === 'Advancement') {
      advancements = [await fromUuid(data.uuid)];
    } else if (data.type === 'Item') {
      const item = await Item.implementation.fromDropData(data);
      if (!item) return false;
      advancements = Object.values(item.advancement.byId);
      showDialog = true;
    } else {
      return false;
    }
    advancements = advancements.filter((a) => {
      return (
        !this.item.advancement.byId[a.id] &&
        a.constructor.metadata.validItemTypes.has(this.item.type) &&
        a.constructor.availableForItem(this.item)
      );
    });

    // Display dialog prompting for which advancements to add
    if (showDialog) {
      try {
        advancements = await AdvancementMigrationDialog.createDialog(
          this.item,
          advancements
        );
      } catch (err) {
        return false;
      }
    }

    if (!advancements.length) return false;
    if (
      this.item.isEmbedded &&
      !game.settings.get('dnd5e', 'disableAdvancements')
    ) {
      const manager = AdvancementManager.forNewAdvancement(
        this.item.actor,
        this.item.id,
        advancements
      );
      if (manager.steps.length) return manager.render(true);
    }

    // If no advancements need to be applied, just add them to the item
    const advancementArray = foundry.utils.deepClone(
      this.item.system.advancement
    );
    advancementArray.push(...advancements.map((a) => a.toObject()));
    this.item.update({ 'system.advancement': advancementArray });
  }

  /* -------------------------------------------- */

  /**
   * Handle spawning the TraitSelector application for selection various options.
   * @param {Event} event   The click event which originated the selection.
   * @private
   */
  _onConfigureTraits(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const options = {
      name: a.dataset.target,
      title: a.parentElement.innerText,
      choices: [],
      allowCustom: false,
      suppressWarning: true,
    };
    switch (a.dataset.options) {
      case 'saves':
        options.choices = CONFIG.DND5E.abilities;
        options.valueKey = null;
        options.labelKey = 'label';
        break;
      case 'skills.choices':
        options.choices = CONFIG.DND5E.skills;
        options.valueKey = null;
        options.labelKey = 'label';
        break;
      case 'skills':
        const skills = this.item.system.skills;
        const choices = skills.choices?.length
          ? skills.choices
          : Object.keys(CONFIG.DND5E.skills);
        options.choices = Object.fromEntries(
          Object.entries(CONFIG.DND5E.skills).filter(([s]) =>
            choices.includes(s)
          )
        );
        options.maximum = skills.number;
        options.labelKey = 'label';
        break;
    }
    new TraitSelector(this.item, options).render(true);
  }

  /* -------------------------------------------- */

  /**
   * Handle one of the advancement actions from the buttons or context menu.
   * @param {Element} target  Button or context menu entry that triggered this action.
   * @param {string} action   Action being triggered.
   * @returns {Promise|void}
   */
  _onAdvancementAction(target, action) {
    const id = target.closest('.advancement-item')?.dataset.id;
    const advancement = this.item.advancement.byId[id];
    let manager;
    if (['edit', 'delete', 'duplicate'].includes(action) && !advancement)
      return;
    switch (action) {
      case 'add':
        return game.dnd5e.applications.advancement.AdvancementSelection.createDialog(
          this.item
        );
      case 'edit':
        return new advancement.constructor.metadata.apps.config(
          advancement
        ).render(true);
      case 'delete':
        if (
          this.item.isEmbedded &&
          !game.settings.get('dnd5e', 'disableAdvancements')
        ) {
          manager = AdvancementManager.forDeletedAdvancement(
            this.item.actor,
            this.item.id,
            id
          );
          if (manager.steps.length) return manager.render(true);
        }
        return this.item.deleteAdvancement(id);
      case 'duplicate':
        return this.item.duplicateAdvancement(id);
      case 'modify-choices':
        const level = target.closest('li')?.dataset.level;
        manager = AdvancementManager.forModifyChoices(
          this.item.actor,
          this.item.id,
          Number(level)
        );
        if (manager.steps.length) manager.render(true);
        return;
      case 'toggle-configuration':
        this.advancementConfigurationMode = !this.advancementConfigurationMode;
        return this.render();
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _onSubmit(...args) {
    if (this._tabs[0].active === 'details') this.position.height = 'auto';
    await super._onSubmit(...args);
  }
}
```

## Impls of item types

### background.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

  {{!-- Item Sheet Header --}}
  <header class="sheet-header flexrow">
    <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

    <div class="header-details flexrow">
      <h1 class="charname">
        <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.BackgroundName' }}"/>
      </h1>

      <div class="item-subtitle">
        <h4 class="item-type">{{itemType}}</h4>
        <span class="item-status">{{itemStatus}}</span>
      </div>

      <ul class="summary flexrow">
        <li>
          <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
        </li>
      </ul>
    </div>
  </header>

  {{!-- Item Sheet Navigation --}}
  <nav class="sheet-navigation tabs" data-group="primary">
      <a class="item active" data-tab="description">{{ localize "DND5E.Description" }}</a>
      <a class="item" data-tab="advancement">{{ localize "DND5E.AdvancementTitle" }}</a>
  </nav>

  {{!-- Item Sheet Body --}}
  <section class="sheet-body">

    {{!-- Description Tab --}}
    <div class="tab flexrow active" data-group="primary" data-tab="description">
      {{editor descriptionHTML target="system.description.value" button=true editable=editable engine="prosemirror"
               collaborate=false}}
    </div>

    {{!-- Advancement Tab --}}
    {{> "dnd5e.item-advancement"}}
  </section>
</form>

```

### backpack.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

	{{!-- Item Sheet Header --}}
	<header class="sheet-header flexrow">
		<img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

		<div class="header-details flexrow">
			<h1 class="charname">
				<input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.ItemName' }}"/>
			</h1>

			<div class="item-subtitle">
				<h4 class="item-type">{{itemType}}</h4>
				<span class="item-status">{{itemStatus}}</span>
			</div>

			<ul class="summary flexrow">
				<li>
					<select name="system.rarity">
						{{selectOptions config.itemRarity selected=system.rarity blank=""}}
					</select>
				</li>
				<li>
					<input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
				</li>
			</ul>
		</div>
	</header>

	{{!-- Item Sheet Navigation --}}
	<nav class="sheet-navigation tabs" data-group="primary">
		<a class="item active" data-tab="description">{{ localize "DND5E.Description" }}</a>
		<a class="item" data-tab="details">{{ localize "DND5E.Details" }}</a>
	</nav>

	{{!-- Item Sheet Body --}}
	<section class="sheet-body">

		{{!-- Description Tab --}}
		{{> "dnd5e.item-description"}}

		{{!-- Details Tab --}}
		<div class="tab details" data-group="primary" data-tab="details">
			<h3 class="form-header">{{localize 'DND5E.ItemContainerDetails'}}</h3>

			<div class="form-group">
				<label>{{localize 'DND5E.ItemContainerCapacity'}}</label>
				<div class="form-fields">
					{{numberInput system.capacity.value name="system.capacity.value" placeholder="&mdash;"}}
				</div>
			</div>

			<div class="form-group">
				<label>{{localize 'DND5E.ItemContainerCapacityType'}}</label>
				<select name="system.capacity.type">
					{{selectOptions config.itemCapacityTypes selected=system.capacity.type}}
				</select>
			</div>

			<div class="form-group stacked">
				<label>{{localize 'DND5E.ItemContainerProperties'}}</label>
				<label class="checkbox">
					<input type="checkbox" name="system.capacity.weightless" {{checked system.capacity.weightless}}>
					{{localize 'DND5E.ItemContainerWeightless'}}
				</label>
			</div>
	</section>
</form>

```

### class.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

    {{!-- Item Sheet Header --}}
    <header class="sheet-header flexrow">
        <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

        <div class="header-details flexrow">
            <h1 class="charname">
                <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.ClassName' }}"/>
            </h1>

            <div class="item-subtitle">
                <h4 class="item-type">{{itemType}}</h4>
                <span class="item-status">{{itemStatus}}</span>
            </div>

            <ul class="summary flexrow">
                <li>
                    <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
                </li>
            </ul>
        </div>
    </header>

    {{!-- Item Sheet Navigation --}}
    <nav class="sheet-navigation tabs" data-group="primary">
        <a class="item active" data-tab="description">{{ localize "DND5E.Description" }}</a>
        <a class="item" data-tab="details">{{ localize "DND5E.Details" }}</a>
        <a class="item" data-tab="advancement">{{ localize "DND5E.AdvancementTitle" }}</a>
    </nav>

    {{!-- Item Sheet Body --}}
    <section class="sheet-body">

        {{!-- Description Tab --}}
        <div class="tab flexrow active" data-group="primary" data-tab="description">
            {{editor descriptionHTML target="system.description.value" button=true editable=editable
                     engine="prosemirror" collaborate=false}}
        </div>

        {{!-- Details Tab --}}
        <div class="tab details" data-group="primary" data-tab="details">

            {{!-- Identifier --}}
            <div class="form-group">
                <label>{{ localize "DND5E.Identifier" }}</label>
                <div class="form-fields">
                    <input type="text" name="system.identifier" value="{{system.identifier}}"
                           placeholder="{{item.identifier}}">
                </div>
                <p class="hint">
                    {{{localize "DND5E.ClassIdentifierHint" identifier=item.identifier}}}
                </p>
            </div>

            {{!-- Class Hit Dice --}}
            <div class="form-group">
                <label>{{localize "DND5E.HitDice"}}</label>
                <div class="form-fields">
                    <select name="system.hitDice">
                        {{#select system.hitDice}}
                        {{#each config.hitDieTypes}}
                        <option value="{{this}}">{{this}}</option>
                        {{/each}}
                        {{/select}}
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>{{localize "DND5E.HitDiceUsed"}}</label>
                <div class="form-fields">
                    {{numberInput system.hitDiceUsed name="system.hitDiceUsed" placeholder="0"}}
                </div>
            </div>

            {{!-- Spellcasting --}}
            <h3 class="form-header">{{localize "DND5E.Spellcasting"}}</h3>
            {{> "dnd5e.item-spellcasting"}}

            {{!-- Proficiencies --}}
            <h3 class="form-header">{{localize "DND5E.Proficiency"}}</h3>
            <div class="form-group">
                <label>
                    {{ localize "DND5E.ClassSaves" }}
                    {{#if editable}}
                    <a class="trait-selector class-saves" data-target="system.saves" data-options="saves">
                        <i class="fas fa-edit"></i>
                    </a>
                    {{/if}}
                </label>
                <div class="form-fields">
                    <ul class="traits-list">
                        {{#each system.saves}}
                            <li class="tag {{this}}">{{lookup (lookup ../config.abilities this) "label"}}</li>
                        {{/each}}
                    </ul>
                </div>
            </div>

            {{!-- Level 1 skills --}}
            <div class="form-group">
                <label>{{localize "DND5E.ClassSkillsNumber"}}</label>
                <div class="form-fields">
                    {{numberInput system.skills.number name="system.skills.number" placeholder="0"}}
                </div>
            </div>

            <div class="form-group">
                <label>
                    {{localize "DND5E.ClassSkillsEligible"}}
                    {{#if editable}}
                    <a class="trait-selector class-skills" data-target="system.skills.choices" data-options="skills.choices">
                        <i class="fas fa-edit"></i>
                    </a>
                    {{/if}}
                </label>
                <div class="form-fields">
                    <ul class="traits-list">
                        {{#each system.skills.choices}}
                        <li class="tag {{this}}">{{lookup (lookup ../config.skills this) "label"}}</li>
                        {{/each}}
                    </ul>
                </div>
            </div>

            <div class="form-group">
                <label>
                    {{localize "DND5E.ClassSkillsChosen"}}
                    {{#if editable}}
                    <a class="trait-selector class-skills" data-target="system.skills" data-options="skills">
                        <i class="fas fa-edit"></i>
                    </a>
                    {{/if}}
                </label>
                <div class="form-fields">
                    <ul class="traits-list">
                        {{#each system.skills.value}}
                            <li class="tag {{this}}">{{lookup (lookup ../config.skills this) "label"}}</li>
                        {{/each}}
                    </ul>
                </div>
            </div>
        </div>

        {{!-- Advancement Tab --}}
        {{> "dnd5e.item-advancement"}}

    </section>
</form>
```

### consumables.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

    {{!-- Item Sheet Header --}}
    <header class="sheet-header flexrow">
        <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

        <div class="header-details flexrow">
            <h1 class="charname">
                <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.ItemName' }}"/>
            </h1>

            <div class="item-subtitle">
                <h4 class="item-type">{{itemType}}</h4>
                <span class="item-status">{{itemStatus}}</span>
            </div>

            <ul class="summary flexrow">
                <li>
                    {{lookup config.consumableTypes system.consumableType }}
                </li>
                <li>
                    <select name="system.rarity">
                        {{selectOptions config.itemRarity selected=system.rarity blank=""}}
                    </select>
                </li>
                <li>
                    <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
                </li>
            </ul>
        </div>
    </header>

    {{!-- Item Sheet Navigation --}}
    <nav class="sheet-navigation tabs" data-group="primary">
        <a class="item active" data-tab="description">{{ localize "DND5E.Description" }}</a>
        <a class="item" data-tab="details">{{ localize "DND5E.Details" }}</a>
        <a class="item" data-tab="effects">{{ localize "DND5E.Effects" }}</a>
    </nav>

    {{!-- Item Sheet Body --}}
    <section class="sheet-body">

        {{!-- Description Tab --}}
        {{> "dnd5e.item-description"}}

        {{!-- Details Tab --}}
        <div class="tab details" data-group="primary" data-tab="details">
            <h3 class="form-header">{{ localize "DND5E.ItemConsumableDetails" }}</h3>

            {{!-- Consumable Type --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemConsumableType" }}</label>
                <select name="system.consumableType">
                    {{selectOptions config.consumableTypes selected=system.consumableType}}
                </select>
            </div>

            <div class="form-group">
                <label>{{localize "DND5E.Attunement"}}</label>
                <select name="system.attunement" data-dtype="Number">
                    {{selectOptions config.attunements selected=system.attunement}}
                </select>
            </div>

            <div class="form-group stacked">
                <label>{{ localize "DND5E.ItemConsumableStatus" }}</label>
                <label class="checkbox">
                    <input type="checkbox" name="system.equipped" {{checked system.equipped}}/> {{ localize "DND5E.Equipped" }}
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="system.identified" {{checked system.identified}}/> {{ localize "DND5E.Identified" }}
                </label>
            </div>

            <h3 class="form-header">{{ localize "DND5E.ItemConsumableUsage" }}</h3>

            {{!-- Item Activation Template --}}
            {{> "dnd5e.item-activation"}}
            {{#if system.activation.type}}
            <div class="form-group">
                <label class="checkbox">
                    <input type="checkbox" name="system.uses.autoDestroy" {{checked system.uses.autoDestroy}}/> {{ localize "DND5E.ItemDestroyEmpty" }}
                </label>
            </div>
            {{/if}}

            <h3 class="form-header">{{ localize "DND5E.ItemConsumableActivation" }}</h3>

            {{!-- Item Action Template --}}
            {{> "dnd5e.item-action"}}
        </div>

        {{!-- Effects Tab --}}
        <div class="tab effects flexcol" data-group="primary" data-tab="effects">
            {{> "dnd5e.active-effects"}}
        </div>
    </section>
</form>
```

### equipment.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

    {{!-- Item Sheet Header --}}
    <header class="sheet-header flexrow">
        <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

        <div class="header-details flexrow">
            <h1 class="charname">
                <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.ItemName' }}"/>
            </h1>

            <div class="item-subtitle">
                <h4 class="item-type">{{itemType}}</h4>
                <span class="item-status">{{itemStatus}}</span>
            </div>

            <ul class="summary flexrow">
                <li>
                    {{lookup config.equipmentTypes system.armor.type }}
                </li>
                <li>
                    <select name="system.rarity">
                        {{selectOptions config.itemRarity selected=system.rarity blank=""}}
                    </select>
                </li>
                <li>
                    <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
                </li>
            </ul>
        </div>
    </header>

    {{!-- Item Sheet Navigation --}}
    <nav class="sheet-navigation tabs" data-group="primary">
        <a class="item active" data-tab="description">{{ localize "DND5E.Description" }}</a>
        <a class="item" data-tab="details">{{ localize "DND5E.Details" }}</a>
        <a class="item" data-tab="effects">{{ localize "DND5E.Effects" }}</a>
    </nav>

    {{!-- Item Sheet Body --}}
    <section class="sheet-body">

        {{!-- Description Tab --}}
        {{> "dnd5e.item-description"}}

        {{!-- Details Tab --}}
        <div class="tab details" data-group="primary" data-tab="details">
            <h3 class="form-header">{{ localize "DND5E.ItemEquipmentDetails" }}</h3>

            {{!-- Equipment Type --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemEquipmentType" }}</label>
                <select name="system.armor.type">
                    <option value=""></option>
                    <optgroup label="{{ localize "DND5E.Armor" }}">
                        {{selectOptions config.armorTypes selected=system.armor.type}}
                    </optgroup>
                    {{selectOptions config.miscEquipmentTypes selected=system.armor.type}}
                </select>
            </div>

            <div class="form-group">
                <label>{{ localize "DND5E.ItemEquipmentBase" }}</label>
                <select name="system.baseItem">
                    {{selectOptions baseItems selected=system.baseItem blank=""}}
                </select>
            </div>

            {{#unless system.isMountable}}
            <div class="form-group">
                <label>{{localize "DND5E.Attunement"}}</label>
                <select name="system.attunement" data-dtype="Number">
                    {{selectOptions config.attunements selected=system.attunement}}
                </select>
            </div>

            {{!-- Equipment Status --}}
            <div class="form-group stacked">
                <label>{{ localize "DND5E.ItemEquipmentStatus" }}</label>
                <label class="checkbox">
                    <input type="checkbox" name="system.proficient" {{checked system.proficient}}/> {{ localize "DND5E.Proficient" }}
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="system.equipped" {{checked system.equipped}}/> {{ localize "DND5E.Equipped" }}
                </label>
                <label class="checkbox">
                    <input type="checkbox" name="system.identified" {{checked system.identified}}/> {{ localize "DND5E.Identified" }}
                </label>
            </div>
            {{/unless}}

            {{!-- Armor Class --}}
            {{#if (or system.isArmor system.isMountable)}}
            <div class="form-group">
                <label>{{ localize "DND5E.ArmorClass" }}</label>
                <div class="form-fields">
                    {{numberInput system.armor.value name="system.armor.value"}}
                </div>
            </div>
            {{/if}}

            {{#if hasDexModifier}}
            {{!-- Dexterity Modifier --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemEquipmentDexMod" }}</label>
                <div class="form-fields">
                    {{numberInput system.armor.dex name="system.armor.dex" placeholder=(localize "DND5E.Unlimited")}}
                </div>
            </div>
            {{/if}}

            {{#if system.isArmor}}
            {{!-- Required Strength --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemRequiredStr" }}</label>
                <div class="form-fields">
                    {{numberInput system.strength name="system.strength" placeholder=(localize "DND5E.None")}}
                </div>
            </div>

            {{!-- Stealth Disadvantage --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemEquipmentStealthDisav" }}</label>
                <input type="checkbox" name="system.stealth" {{checked system.stealth}}/>
            </div>
            {{/if}}

            {{#if system.isMountable}}
            {{> "dnd5e.item-mountable"}}
            <div class="form-group">
                <label>{{localize 'DND5E.Speed'}}</label>
                <div class="form-fields">
                    {{numberInput system.speed.value name="system.speed.value" placeholder="0"}}
                    <span class="sep">{{localize 'DND5E.FeetAbbr'}}</span>
                    <input type="text" name="system.speed.conditions"
                           value="{{system.speed.conditions}}">
                </div>
            </div>
            {{/if}}

            <h3 class="form-header">{{ localize "DND5E.ItemEquipmentUsage" }}</h3>

            {{!-- Item Activation Template --}}
            {{> "dnd5e.item-activation"}}

            <h3 class="form-header">{{ localize "DND5E.ItemEquipmentAction" }}</h3>

            {{!-- Item Action Template --}}
            {{> "dnd5e.item-action"}}
        </div>

        {{!-- Effects Tab --}}
        <div class="tab effects flexcol" data-group="primary" data-tab="effects">
            {{> "dnd5e.active-effects"}}
        </div>
    </section>
</form>
```

### feat.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

    {{!-- Item Sheet Header --}}
    <header class="sheet-header flexrow">
        <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

        <div class="header-details flexrow">
            <h1 class="charname">
                <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.ItemName' }}"/>
            </h1>

            <div class="item-subtitle">
                <h4 class="item-type">{{itemType}}</h4>
                <span class="item-status">{{itemStatus}}</span>
            </div>

            <ul class="summary flexrow">
                <li>
                    {{labels.featType}}
                </li>
                <li>
                    <input type="text" name="system.requirements" value="{{system.requirements}}" placeholder="{{ localize 'DND5E.Requirements' }}"/>
                </li>
                <li>
                    <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
                </li>
            </ul>
        </div>
    </header>

    {{!-- Item Sheet Navigation --}}
    <nav class="sheet-navigation tabs" data-group="primary">
        <a class="item active" data-tab="description">{{ localize "DND5E.Description" }}</a>
        <a class="item" data-tab="details">{{ localize "DND5E.Details" }}</a>
        <a class="item" data-tab="effects">{{ localize "DND5E.Effects" }}</a>
    </nav>

    {{!-- Item Sheet Body --}}
    <section class="sheet-body">

        {{!-- Description Tab --}}
        {{> "dnd5e.item-description"}}

        {{!-- Details Tab --}}
        <div class="tab details" data-group="primary" data-tab="details">
            <h3 class="form-header">{{localize "DND5E.ItemFeatureDetails"}}</h3>

            {{!-- Feature Type --}}
            <div class="form-group">
                <label>{{localize "DND5E.ItemFeatureType"}}</label>
                <select name="system.type.value">
                    {{selectOptions config.featureTypes selected=system.type.value blank="" labelAttr="label"}}
                </select>
            </div>

            {{#if featureSubtypes}}
            <div class="form-group">
                <label>
                    {{localize "DND5E.ItemFeatureSubtype"
                        category=(lookup (lookup config.featureTypes system.type.value) "label")}}
                </label>
                <select name="system.type.subtype">
                    {{selectOptions featureSubtypes selected=system.type.subtype blank=""}}
                </select>
            </div>
            {{/if}}

            <h3 class="form-header">{{ localize "DND5E.FeatureUsage" }}</h3>

            {{!-- Item Activation Template --}}
            {{> "dnd5e.item-activation"}}

            {{!-- Recharge Requirement --}}
            {{#if system.activation.type}}
            <div class="form-group recharge">
                <label>{{ localize "DND5E.FeatureActionRecharge" }}</label>
                <div class="form-fields">
                    <span>{{ localize "DND5E.FeatureRechargeOn" }}</span>
                    {{numberInput system.recharge.value name="system.recharge.value"
                        placeholder=(localize "DND5E.FeatureRechargeResult")}}
                    <label class="checkbox">
                        {{ localize "DND5E.Charged" }}
                        <input type="checkbox" name="system.recharge.charged" {{checked system.recharge.charged}}/>
                    </label>
                </div>
            </div>
            {{/if}}

            <h3 class="form-header">{{ localize "DND5E.FeatureAttack" }}</h3>

            {{!-- Item Action Template --}}
            {{> "dnd5e.item-action"}}
        </div>

        {{!-- Effects Tab --}}
        <div class="tab effects flexcol" data-group="primary" data-tab="effects">
            {{> "dnd5e.active-effects"}}
        </div>
    </section>
</form>
```

### loot.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

    {{!-- Item Sheet Header --}}
    <header class="sheet-header loot-header flexrow">
        <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

        <div class="header-details flexrow">
            <h1 class="charname">
                <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.ItemName' }}"/>
            </h1>

            <div class="item-subtitle">
                <h4 class="item-type">{{itemType}}</h4>
                <span class="item-status">{{itemStatus}}</span>
            </div>

            <ul class="summary flexrow">
                <li>
                    <select name="system.rarity">
                        {{selectOptions config.itemRarity selected=system.rarity blank=""}}
                    </select>
                </li>
                <li>
                    <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
                </li>
            </ul>
        </div>
    </header>

    {{!-- Item Sheet Body --}}
    <section class="sheet-body">
        {{> "dnd5e.item-description"}}
    </section>
</form>
```

### spell.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

    {{!-- Item Sheet Header --}}
    <header class="sheet-header flexrow">
        <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

        <div class="header-details flexrow">
            <h1 class="charname">
                <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.SpellName' }}"/>
            </h1>

            <div class="item-subtitle">
                <h4 class="item-type">{{itemType}}</h4>
                <span class="item-status">{{itemStatus}}</span>
            </div>

            <ul class="summary flexrow">
                <li>
                    {{labels.level}}
                </li>
                <li>
                    {{labels.school}}
                </li>
                <li>
                    <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
                </li>
            </ul>
        </div>
    </header>

    {{!-- Item Sheet Navigation --}}
    <nav class="sheet-navigation tabs" data-group="primary">
        <a class="item active" data-tab="description">{{ localize "DND5E.Description" }}</a>
        <a class="item" data-tab="details">{{ localize "DND5E.Details" }}</a>
        <a class="item" data-tab="effects">{{ localize "DND5E.Effects" }}</a>
    </nav>

    {{!-- Item Sheet Body --}}
    <section class="sheet-body">

        {{!-- Description Tab --}}
        {{> "dnd5e.item-description"}}

        {{!-- Details Tab --}}
        <div class="tab details" data-group="primary" data-tab="details">
            <h3 class="form-header">{{ localize "DND5E.SpellDetails" }}</h3>

            {{!-- Spell Level --}}
            <div class="form-group">
                <label>{{ localize "DND5E.SpellLevel" }}</label>
                <select name="system.level" data-dtype="Number">
                    {{#select system.level}}
                    {{#each config.spellLevels as |name lvl|}}
                    <option value="{{lvl}}">{{name}}</option>
                    {{/each}}
                    {{/select}}
                </select>
            </div>

            {{!-- Spell School --}}
            <div class="form-group">
                <label>{{ localize "DND5E.SpellSchool" }}</label>
                <select name="system.school">
                    {{selectOptions config.spellSchools selected=system.school blank=""}}
                </select>
            </div>

            {{!-- Spell Components --}}
            <div class="spell-components form-group stacked">
                <label>{{ localize "DND5E.SpellComponents" }}</label>
                {{#each spellComponents as |component key|}}
                <label class="checkbox">
                    <input type="checkbox" name="system.components.{{key}}" {{checked (lookup ../system.components key)}}>
                    {{component.label}}
                </label>
                {{/each}}
            </div>

            {{!-- Material Components --}}
            <div class="form-group stacked">
                <label>{{ localize "DND5E.SpellMaterials" }}</label>
                <input class="materials" type="text" name="system.materials.value" value="{{system.materials.value}}"/>
                {{#if system.materials.value}}
                <div class="spell-materials flexrow">
                    <label>{{ localize "DND5E.Supply" }}</label>
                    {{numberInput system.materials.supply name="system.materials.supply" placeholder="0"}}
                    <label>{{ localize "DND5E.CostGP" }}</label>
                    {{numberInput system.materials.cost name="system.materials.cost" placeholder="&mdash;"}}
                    <label>{{ localize "DND5E.Consumed" }}</label>
                    <input type="checkbox" name="system.materials.consumed" {{checked system.materials.consumed}}/>
                </div>
                {{/if}}
            </div>

            {{!-- Preparation Mode --}}
            <div class="form-group input-select">
                <label>{{ localize "DND5E.SpellPreparationMode" }}</label>
                <div class="form-fields">
                    <label class="checkbox prepared">
                        {{ localize "DND5E.SpellPrepared" }} <input type="checkbox" name="system.preparation.prepared" {{checked system.preparation.prepared}}/>
                    </label>
                    <select name="system.preparation.mode">
                        {{ selectOptions config.spellPreparationModes selected=system.preparation.mode }}
                    </select>
                </div>
            </div>

            <h3 class="form-header">{{ localize "DND5E.SpellCastingHeader" }}</h3>

            {{!-- Item Activation Template --}}
            {{> "dnd5e.item-activation"}}

            <h3 class="form-header">{{ localize "DND5E.SpellEffects" }}</h3>

            {{!-- Item Action Template --}}
            {{> "dnd5e.item-action"}}

            {{!-- Spell Level Scaling --}}
            <div class="form-group">
                <label>{{ localize "DND5E.LevelScaling" }}</label>
                <div class="form-fields">
                    <select name="system.scaling.mode">
                        {{#select system.scaling.mode}}
                        {{#each config.spellScalingModes as |name key|}}
                        <option value="{{key}}">{{name}}</option>
                        {{/each}}
                        {{/select}}
                    </select>
                    <input type="text" name="system.scaling.formula" value="{{system.scaling.formula}}"
                           placeholder="{{ localize 'DND5E.ScalingFormula' }}" data-formula-editor/>
                </div>
            </div>
        </div>

        {{!-- Effects Tab --}}
        <div class="tab effects flexcol" data-group="primary" data-tab="effects">
            {{> "dnd5e.active-effects"}}
        </div>
    </section>
</form>
```

### subclass.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

  {{!-- Item Sheet Header --}}
  <header class="sheet-header flexrow">
    <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

    <div class="header-details flexrow">
      <h1 class="charname">
        <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.SubclassName' }}"/>
      </h1>

      <div class="item-subtitle">
        <h4 class="item-type">{{itemType}}</h4>
        <span class="item-status">{{itemStatus}}</span>
      </div>

      <ul class="summary flexrow">
        <li>
          <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
        </li>
      </ul>
    </div>
  </header>

  {{!-- Item Sheet Navigation --}}
  <nav class="sheet-navigation tabs" data-group="primary">
    <a class="item active" data-tab="description">{{localize "DND5E.Description"}}</a>
    <a class="item" data-tab="details">{{localize "DND5E.Details"}}</a>
    <a class="item" data-tab="advancement">{{localize "DND5E.AdvancementTitle"}}</a>
  </nav>

  {{!-- Item Sheet Body --}}
  <section class="sheet-body">

    {{!-- Description Tab --}}
    <div class="tab flexrow active" data-group="primary" data-tab="description">
      {{editor descriptionHTML target="system.description.value" button=true editable=editable engine="prosemirror"
               collaborate=false}}
    </div>

    {{!-- Details Tab --}}
    <div class="tab details" data-group="primary" data-tab="details">

      {{!-- Identifier --}}
      <div class="form-group">
        <label>{{localize "DND5E.Identifier"}}</label>
        <div class="form-fields">
          <input type="text" name="system.identifier" value="{{system.identifier}}" placeholder="{{item.identifier}}">
        </div>
      </div>

      <div class="form-group">
        <label>{{localize "DND5E.ClassIdentifier"}}</label>
        <div class="form-fields">
          <input type="text" name="system.classIdentifier" value="{{system.classIdentifier}}">
        </div>
        <p class="hint">
            {{localize "DND5E.SubclassIdentifierHint"}}
        </p>
      </div>

      {{!-- Spellcasting --}}
      <h3 class="form-header">{{localize "DND5E.Spellcasting"}}</h3>
      {{> "dnd5e.item-spellcasting"}}

    </div>

    {{!-- Advancement Tab --}}
    {{> "dnd5e.item-advancement"}}

  </section>
</form>
```

### tool.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

    {{!-- Item Sheet Header --}}
    <header class="sheet-header flexrow">
        <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

        <div class="header-details flexrow">
            <h1 class="charname">
                <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.ItemName' }}"/>
            </h1>

            <div class="item-subtitle">
                <h4 class="item-type">{{itemType}}</h4>
                <span class="item-status">{{itemStatus}}</span>
            </div>

            <ul class="summary flexrow">
                <li>
                    {{#if system.toolType}}
                      {{lookup config.toolTypes system.toolType}}
                    {{else}}
                      {{localize "ITEM.TypeTool"}}
                    {{/if}}
                </li>
                <li>
                    <select name="system.rarity">
                        {{selectOptions config.itemRarity selected=system.rarity blank=""}}
                    </select>
                </li>
                <li>
                    <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
                </li>
            </ul>
        </div>
    </header>

    {{!-- Item Sheet Navigation --}}
    <nav class="sheet-navigation tabs" data-group="primary">
        <a class="item active" data-tab="description">{{ localize "DND5E.Description" }}</a>
        <a class="item" data-tab="details">{{ localize "DND5E.Details" }}</a>
        <a class="item" data-tab="effects">{{ localize "DND5E.Effects" }}</a>
    </nav>

    {{!-- Item Sheet Body --}}
    <section class="sheet-body">

        {{!-- Description Tab --}}
        {{> "dnd5e.item-description"}}

        {{!-- Details Tab --}}
        <div class="tab details" data-group="primary" data-tab="details">

            {{!-- Tool Type --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemToolType" }}</label>
                <select name="system.toolType">
                    {{selectOptions config.toolTypes selected=system.toolType blank=""}}
                </select>
            </div>

            <div class="form-group">
                <label>{{ localize "DND5E.ItemToolBase" }}</label>
                <select name="system.baseItem">
                    {{selectOptions baseItems selected=system.baseItem blank=""}}
                </select>
            </div>

            <div class="form-group">
                <label>{{localize "DND5E.Attunement"}}</label>
                <select name="system.attunement" data-dtype="Number">
                    {{selectOptions config.attunements selected=system.attunement}}
                </select>
            </div>

            {{!-- Tool Proficiency --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemToolProficiency" }}</label>
                <select name="system.proficient" data-dtype="Number">
                    {{selectOptions config.proficiencyLevels selected=system.proficient}}
                </select>
            </div>

            {{!-- Ability Check --}}
            <div class="form-group">
                <label>{{ localize "DND5E.DefaultAbilityCheck" }}</label>
                <select name="system.ability">
                    {{selectOptions config.abilities labelAttr="label" selected=system.ability
                                    blank=(localize "DND5E.Default")}}
                </select>
            </div>

            {{!-- Tool Bonus --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemToolBonus" }}</label>
                <input type="text" name="system.bonus" value="{{system.bonus}}" data-formula-editor/>
            </div>

            {{!-- Chat Message Flavor --}}
            <div class="form-group stacked">
                <label>{{ localize "DND5E.ChatFlavor" }}</label>
                <input type="text" name="system.chatFlavor" value="{{system.chatFlavor}}"/>
            </div>
        </div>

        {{!-- Effects Tab --}}
        <div class="tab effects flexcol" data-group="primary" data-tab="effects">
            {{> "dnd5e.active-effects"}}
        </div>
    </section>
</form>
```

### weapon.hbs

```hbs
<form class="{{cssClass}} flexcol" autocomplete="off">

    {{!-- Item Sheet Header --}}
    <header class="sheet-header flexrow">
        <img class="profile" src="{{item.img}}" data-tooltip="{{item.name}}" data-edit="img"/>

        <div class="header-details flexrow">
            <h1 class="charname">
                <input name="name" type="text" value="{{item.name}}" placeholder="{{ localize 'DND5E.ItemName' }}"/>
            </h1>

            <div class="item-subtitle">
                <h4 class="item-type">{{itemType}}</h4>
                <span class="item-status">{{itemStatus}}</span>
            </div>

            <ul class="summary flexrow">
                <li>
                    {{lookup config.weaponTypes system.weaponType }}
                </li>
                <li>
                    <select name="system.rarity">
                        {{selectOptions config.itemRarity selected=system.rarity blank=""}}
                    </select>
                </li>
                <li>
                    <input type="text" name="system.source" value="{{system.source}}" placeholder="{{ localize 'DND5E.Source' }}"/>
                </li>
            </ul>
        </div>
    </header>

    {{!-- Item Sheet Navigation --}}
    <nav class="sheet-navigation tabs" data-group="primary">
        <a class="item active" data-tab="description">{{ localize "DND5E.Description" }}</a>
        <a class="item" data-tab="details">{{ localize "DND5E.Details" }}</a>
        <a class="item" data-tab="effects">{{ localize "DND5E.Effects" }}</a>
    </nav>

    {{!-- Item Sheet Body --}}
    <section class="sheet-body">

        {{!-- Description Tab --}}
        {{> "dnd5e.item-description"}}

        {{!-- Details Tab --}}
        <div class="tab details" data-group="primary" data-tab="details">
            <h3 class="form-header">{{ localize "DND5E.ItemWeaponDetails" }}</h3>

            {{!-- Weapon Type --}}
            <div class="form-group">
                <label>{{ localize "DND5E.ItemWeaponType" }}</label>
                <select name="system.weaponType">
                    {{selectOptions config.weaponTypes selected=system.weaponType}}
                </select>
            </div>

            <div class="form-group">
                <label>{{ localize "DND5E.ItemWeaponBase" }}</label>
                <select name="system.baseItem">
                    {{selectOptions baseItems selected=system.baseItem blank=""}}
                </select>
            </div>

            {{#unless system.isMountable}}
            <div class="form-group">
                <label>{{localize "DND5E.Attunement"}}</label>
                <select name="system.attunement" data-dtype="Number">
                    {{selectOptions config.attunements selected=system.attunement}}
                </select>
            </div>

            {{!-- Weapon Status --}}
            <div class="form-group stacked">
                <label>{{ localize "DND5E.ItemWeaponStatus" }}</label>
                <div class="form-fields">
                    <label class="checkbox">
                        <input type="checkbox" name="system.proficient" {{checked system.proficient}}/> {{ localize "DND5E.Proficient" }}
                    </label>
                    <label class="checkbox">
                        <input type="checkbox" name="system.equipped" {{checked system.equipped}}/> {{ localize "DND5E.Equipped" }}
                    </label>
                    <label class="checkbox">
                        <input type="checkbox" name="system.identified" {{checked system.identified}}/> {{ localize "DND5E.Identified" }}
                    </label>
                </div>
            </div>
            {{/unless}}

            {{!-- Weapon Properties --}}
            <div class="form-group stacked weapon-properties">
                <label>{{ localize "DND5E.ItemWeaponProperties" }}</label>
                {{#each config.weaponProperties as |name prop|}}
                <label class="checkbox">
                    <input type="checkbox" name="system.properties.{{prop}}" {{checked (lookup ../system.properties prop)}}/> {{ name }}
                </label>
                {{/each}}
            </div>

            {{#if system.isMountable}}
            <div class="form-group">
                <label>{{localize 'DND5E.ArmorClass'}}</label>
                <div class="form-fields">
                    {{numberInput system.armor.value name="system.armor.value"}}
                </div>
            </div>

            {{> "dnd5e.item-mountable"}}
            {{/if}}

            <h3 class="form-header">{{ localize "DND5E.ItemWeaponUsage" }}</h3>

            {{!-- Item Activation Template --}}
            {{> "dnd5e.item-activation"}}

            <h3 class="form-header">{{ localize "DND5E.ItemWeaponAttack" }}</h3>

            {{!-- Item Action Template --}}
            {{> "dnd5e.item-action"}}
        </div>

        {{!-- Effects Tab --}}
        <div class="tab effects flexcol" data-group="primary" data-tab="effects">
            {{> "dnd5e.active-effects"}}
        </div>
    </section>
</form>
```

## Impls of item parts

### item-action.hbs

```hbs
{{!-- Action Type --}}
<div class="form-group select">
    <label>{{ localize "DND5E.ItemActionType" }}</label>
    <select name="system.actionType">
        {{selectOptions config.itemActionTypes selected=system.actionType blank=""}}
    </select>
</div>
{{#if system.actionType}}

{{!-- Ability Modifier --}}
<div class="form-group select">
    <label>{{ localize "DND5E.AbilityModifier" }}</label>
    <select name="system.ability">
        {{selectOptions config.abilities selected=system.ability labelAttr="label" blank=(localize "DND5E.Default")}}
    </select>
</div>

{{#if system.hasAttack}}
{{!-- Attack Roll Bonus --}}
<div class="form-group">
    <label>{{ localize "DND5E.ItemAttackBonus" }}</label>
    <div class="form-fields">
        <input type="text" name="system.attackBonus" value="{{system.attackBonus}}" data-formula-editor/>
    </div>
</div>

{{!-- Critical Hit Threshold --}}
<div class="form-group">
    <label>{{ localize "DND5E.ItemCritThreshold" }}</label>
    <div class="form-fields">
        {{numberInput system.critical.threshold name="system.critical.threshold" placeholder="20" max=20 min=1 step=1}}
    </div>
</div>

{{!-- Critical Hit Damage --}}
<div class="form-group">
    <label>{{ localize "DND5E.ItemCritExtraDamage" }}</label>
    <div class="form-fields">
        <input type="text" name="system.critical.damage" value="{{system.critical.damage}}">
    </div>
</div>
{{/if}}

{{!-- Damage Formula --}}
<h4 class="damage-header">
    {{#unless isHealing}}{{ localize "DND5E.Damage" }}{{ else }}{{ localize "DND5E.Healing" }}{{/unless}}
    {{ localize "DND5E.Formula" }}
    <a class="damage-control add-damage"><i class="fas fa-plus"></i></a>
</h4>
<ol class="damage-parts form-group">
    {{#each system.damage.parts as |part i| }}
    <li class="damage-part flexrow" data-damage-part="{{i}}">
        <input type="text" name="system.damage.parts.{{i}}.0" value="{{lookup this "0"}}" data-formula-editor/>
        <select name="system.damage.parts.{{i}}.1">
            {{#select (lookup this "1")}}
                <option value="">{{ localize "DND5E.None" }}</option>
                <optgroup label="{{localize 'DND5E.Damage'}}">
                    {{selectOptions @root.config.damageTypes}}
                </optgroup>
                <optgroup label="{{localize 'DND5E.Healing'}}">
                    {{selectOptions @root.config.healingTypes}}
                </optgroup>
            {{/select}}
        </select>
        <a class="damage-control delete-damage"><i class="fas fa-minus"></i></a>
    </li>
    {{/each}}
</ol>

{{!-- Versatile Damage --}}
{{#if system.damage.parts.length }}
<div class="form-group">
    <label>{{ localize "DND5E.VersatileDamage" }}</label>
    <div class="form-fields">
        <input type="text" name="system.damage.versatile" value="{{system.damage.versatile}}"
               placeholder="{{ localize 'DND5E.Formula' }}" data-formula-editor>
    </div>
</div>
{{/if}}

{{!-- Other Formula --}}
<div class="form-group">
    <label>{{ localize "DND5E.OtherFormula" }}</label>
    <div class="form-fields">
        <input type="text" name="system.formula" value="{{system.formula}}"
               placeholder="{{ localize 'DND5E.Formula' }}" data-formula-editor>
    </div>
</div>

{{!-- Saving Throw --}}
<div class="form-group input-select">
    <label>{{ localize "DND5E.ActionSave" }}</label>
    <div class="form-fields">
        <select name="system.save.ability">
            {{selectOptions config.abilities selected=system.save.ability labelAttr="label" blank=""}}
        </select>
        <span>{{ localize "DND5E.VsDC" }}</span>
        <input type="number" step="any" name="system.save.dc"
            value="{{#if system.save.dc}}{{system.save.dc}}{{/if}}"
            placeholder="{{ localize 'DND5E.AbbreviationDC' }}" {{#unless isFlatDC}}disabled{{/unless}}>
        <select name="system.save.scaling">
            {{#select system.save.scaling}}
                <option value="spell">{{ localize "DND5E.Spellcasting" }}</option>
                {{selectOptions config.abilities labelAttr="label"}}
                <option value="flat">{{ localize "DND5E.Flat" }}</option>
            {{/select}}
        </select>
    </div>
</div>

{{!-- Chat Message Flavor --}}
<div class="form-group stacked">
    <label>{{ localize "DND5E.ChatFlavor" }}</label>
    <input type="text" name="system.chatFlavor" value="{{system.chatFlavor}}"/>
</div>
{{/if}}
```

### item-activation.hbs

```hbs
{{! Activation Cost }}
<div class='form-group input-select'>
  <label>{{localize 'DND5E.ItemActivationCost'}}</label>
  <div class='form-fields'>
    {{#if system.activation.type}}
      <input
        type='number'
        step='any'
        name='system.activation.cost'
        value='{{system.activation.cost}}'
        placeholder='&mdash;'
      />
    {{/if}}
    <select
      name='system.activation.type'
      data-tooltip='DND5E.ItemActivationType'
    >
      {{selectOptions
        config.abilityActivationTypes
        selected=system.activation.type
        blank=(localize 'DND5E.None')
      }}
    </select>
  </div>
</div>
{{#if system.activation.type}}

  {{! Activation Condition }}
  <div class='form-group'>
    <label>{{localize 'DND5E.ItemActivationCondition'}}</label>
    <div class='form-fields'>
      <input
        type='text'
        name='system.activation.condition'
        value='{{system.activation.condition}}'
      />
    </div>
  </div>

  {{#if isCrewed}}
    <div class='form-group'>
      <label>{{localize 'DND5E.Cover'}}</label>
      <div class='form-fields'>
        <select name='system.cover' data-dtype='Number'>
          {{selectOptions config.cover selected=system.cover blank=''}}
        </select>
      </div>
    </div>
  {{/if}}

  {{! Ability Target }}
  <div class='form-group input-select-select'>
    <label>{{localize 'DND5E.Target'}}</label>
    <div class='form-fields'>
      {{#if system.hasScalarTarget}}
        <input
          type='number'
          step='any'
          name='system.target.value'
          value='{{system.target.value}}'
          placeholder='&mdash;'
        />
      {{/if}}
      {{#if system.hasAreaTarget}}
        <select name='system.target.units' data-tooltip='DND5E.TargetUnits'>
          {{selectOptions
            config.movementUnits
            selected=system.target.units
            blank=''
          }}
        </select>
      {{/if}}
      <select name='system.target.type' data-tooltip='DND5E.TargetType'>
        {{#select system.target.type}}
          <option value=''>{{localize 'DND5E.None'}}</option>
          <optgroup label='{{localize "DND5E.TargetTypeIndividual"}}'>
            {{selectOptions config.individualTargetTypes}}
          </optgroup>
          <optgroup label='{{localize "DND5E.TargetTypeArea"}}'>
            {{selectOptions config.areaTargetTypes labelAttr='label'}}
          </optgroup>
        {{/select}}
      </select>
    </div>
  </div>

  {{! Ability Target Width }}
  {{#if isLine}}
    <div class='form-group input-select-select'>
      <label>{{localize 'DND5E.TargetWidth'}}</label>
      <div class='form-fields'>
        <input
          type='number'
          step='any'
          name='system.target.width'
          value='{{system.target.width}}'
          placeholder='&mdash;'
        />
      </div>
    </div>
  {{/if}}

  {{! Ability Range }}
  <div class='form-group input-select'>
    <label>{{localize 'DND5E.Range'}}</label>
    <div class='form-fields'>
      {{#if system.hasScalarRange}}
        <input
          type='number'
          step='any'
          name='system.range.value'
          value='{{system.range.value}}'
          placeholder='{{localize "DND5E.Normal"}}'
          data-tooltip='DND5E.RangeNormal'
        />
        <span class='sep'>/</span>
        <input
          type='number'
          step='any'
          name='system.range.long'
          value='{{system.range.long}}'
          placeholder='{{localize "DND5E.Long"}}'
          data-tooltip='DND5E.RangeLong'
        />
      {{/if}}
      <select name='system.range.units' data-tooltip='DND5E.RangeUnits'>
        {{#select system.range.units}}
          <option value=''>{{localize 'DND5E.None'}}</option>
          <optgroup label='{{localize "DND5E.RangeDistance"}}'>
            {{selectOptions config.movementUnits}}
          </optgroup>
          {{selectOptions config.rangeTypes}}
        {{/select}}
      </select>
    </div>
  </div>

  {{! Effect Duration }}
  <div class='form-group input-select'>
    <label>{{localize 'DND5E.Duration'}}</label>
    <div class='form-fields'>
      {{#if system.hasScalarDuration}}
        <input
          type='text'
          name='system.duration.value'
          value='{{source.duration.value}}'
          placeholder='&mdash;'
          data-tooltip='DND5E.DurationValue'
          data-formula-editor
        />
      {{/if}}
      <select name='system.duration.units' data-tooltip='DND5E.DurationType'>
        {{#select system.duration.units}}
          <option value=''>{{localize 'DND5E.None'}}</option>
          <optgroup label='{{localize "DND5E.DurationTime"}}'>
            {{selectOptions config.scalarTimePeriods}}
          </optgroup>
          <optgroup label='{{localize "DND5E.DurationPermanent"}}'>
            {{selectOptions config.permanentTimePeriods}}
          </optgroup>
          {{selectOptions config.specialTimePeriods}}
        {{/select}}
      </select>
    </div>
  </div>

  {{! Limited Uses }}
  <div class='form-group uses-per'>
    <label>{{localize 'DND5E.LimitedUses'}}</label>
    <div class='form-fields'>
      <input
        type='number'
        step='any'
        name='system.uses.value'
        value='{{system.uses.value}}'
        data-tooltip='DND5E.UsesAvailable'
      />
      <span class='sep'>{{localize 'DND5E.of'}}</span>
      <input
        type='text'
        name='system.uses.max'
        value='{{source.uses.max}}'
        data-tooltip='DND5E.UsesMax'
        data-formula-editor
      />
      <span class='sep'>{{localize 'DND5E.per'}}</span>
      <select name='system.uses.per' data-tooltip='DND5E.UsesPeriod'>
        {{selectOptions
          config.limitedUsePeriods
          selected=system.uses.per
          blank=''
        }}
      </select>
    </div>
  </div>

  {{#if (eq system.uses.per 'charges')}}
    <div class='form-group'>
      <label>{{localize 'DND5E.RecoveryFormula'}}</label>
      <div class='form-fields'>
        <input
          type='text'
          name='system.uses.recovery'
          value='{{system.uses.recovery}}'
          data-formula-editor
        />
      </div>
    </div>
  {{/if}}

  {{! Consumption }}
  <div class='form-group consumption'>
    <label>{{localize 'DND5E.ConsumeTitle'}}</label>
    <div class='form-fields'>
      {{#if system.consume.type}}
        <input
          type='number'
          step='any'
          name='system.consume.amount'
          value='{{system.consume.amount}}'
          data-tooltip='DND5E.ConsumeQuanity'
        />
        <select name='system.consume.target' data-tooltip='DND5E.ConsumeTarget'>
          {{selectOptions
            abilityConsumptionTargets
            selected=system.consume.target
            blank=''
          }}
        </select>
      {{/if}}
      <select name='system.consume.type' data-tooltip='DND5E.ConsumeType'>
        {{selectOptions
          config.abilityConsumptionTypes
          selected=system.consume.type
          blank=(localize 'DND5E.None')
        }}
      </select>
    </div>
  </div>
{{/if}}
```

### item-advancement.hbs

```hbs
<div
  class='tab details advancement'
  data-group='primary'
  data-tab='advancement'
>
  <ol class='items-list'>
    {{#if editable}}
      <li class='items-header flexrow main-controls'>
        <div class='item-controls flexrow configuration-mode-control'>
          {{#if isEmbedded}}
            {{#if advancementEditable}}
              <a
                class='item-control'
                data-action='toggle-configuration'
                data-tooltip='DND5E.AdvancementConfigurationActionDisable'
              >
                <i class='fas fa-lock-open'></i>
                {{localize 'DND5E.AdvancementConfigurationModeEnabled'}}
              </a>
            {{else}}
              <a
                class='item-control'
                data-action='toggle-configuration'
                data-tooltip='DND5E.AdvancementConfigurationActionEnable'
              >
                <i class='fas fa-lock'></i>
                {{localize 'DND5E.AdvancementConfigurationModeDisabled'}}
              </a>
            {{/if}}
          {{/if}}
        </div>
        {{#if advancementEditable}}
          <div class='item-controls flexrow add-button'>
            <a
              class='item-control'
              data-action='add'
              data-tooltip='DND5E.AdvancementControlCreate'
            >
              <i class='fas fa-plus'></i>
            </a>
          </div>
        {{/if}}
      </li>
    {{/if}}

    {{#each advancement as |data level|}}
      <li class='items-header flexrow' data-level='{{level}}'>
        <h3 class='item-name flexrow'>
          {{#if (eq level '0')}}
            {{localize 'DND5E.AdvancementLevelAnyHeader'}}
          {{else if (eq level 'unconfigured')}}
            {{localize 'DND5E.AdvancementLevelNoneHeader'}}
          {{else}}
            {{localize 'DND5E.AdvancementLevelHeader' level=level}}
          {{/if}}
        </h3>

        {{#if (and @root.editable data.configured (ne level 'unconfigured'))}}
          <div>
            <a class='item-control' data-action='modify-choices'>{{localize
                'DND5E.AdvancementModifyChoices'
              }}</a>
          </div>
        {{/if}}

        {{#if (eq data.configured 'full')}}
          <div
            class='item-checkmark'
            data-tooltip='DND5E.AdvancementConfiguredComplete'
          >
            <i class='fas fa-check-circle'></i>
          </div>
        {{else if (eq data.configured 'partial')}}
          <div
            class='item-warning'
            data-tooltip='DND5E.AdvancementConfiguredIncomplete'
          >
            <i class='fas fa-exclamation-triangle'></i>
          </div>
        {{/if}}
      </li>
      <ol class='item-list'>
        {{#each data.items}}
          <li class='advancement-item item flexrow' data-id='{{this.id}}'>
            <div class='item-name flexrow'>
              <div
                class='item-image'
                style="background-image: url('{{this.icon}}')"
              ></div>
              <h4>{{{this.title}}}</h4>
            </div>
            {{#if (or @root.advancementEditable (not @root.isEmbedded))}}
              <div class='flexrow'>
                {{#if (eq this.classRestriction 'primary')}}
                  {{localize 'DND5E.AdvancementClassRestrictionPrimary'}}
                {{else if (eq this.classRestriction 'secondary')}}
                  {{localize 'DND5E.AdvancementClassRestrictionSecondary'}}
                {{/if}}
              </div>
            {{/if}}
            {{#if @root.advancementEditable}}
              <div class='item-controls flexrow'>
                <a
                  class='item-control'
                  data-action='edit'
                  data-tooltip='DND5E.AdvancementControlEdit'
                >
                  <i class='fas fa-edit'></i>
                </a>
                <a
                  class='item-control'
                  data-action='delete'
                  data-tooltip='DND5E.AdvancementControlDelete'
                >
                  <i class='fas fa-trash'></i>
                </a>
              </div>
            {{/if}}
            {{#if this.summary}}
              <div class='item-summary'>
                {{{this.summary}}}
              </div>
            {{/if}}
          </li>
        {{/each}}
      </ol>
    {{/each}}

  </ol>
</div>
```

### item-description.hbs

```hbs
<div class='tab flexrow active' data-group='primary' data-tab='description'>

  <div class='item-properties'>
    {{#if isPhysical}}
      <div class='form-group'>
        <label>{{localize 'DND5E.Quantity'}}</label>
        {{numberInput system.quantity name='system.quantity'}}
      </div>

      <div class='form-group'>
        <label>{{localize 'DND5E.Weight'}}</label>
        {{numberInput system.weight name='system.weight'}}
      </div>

      <div class='form-group'>
        <label>{{localize 'DND5E.Price'}}</label>
        {{numberInput system.price.value name='system.price.value'}}
        <select name='system.price.denomination'>
          {{selectOptions
            config.currencies
            selected=system.price.denomination
            labelAttr='abbreviation'
          }}
        </select>
      </div>
    {{/if}}

    {{#if (or labels.toHit labels.derivedDamage)}}
      <h4 class='properties-header'>{{localize 'DND5E.Attack'}}/{{localize
          'DND5E.Damage'
        }}</h4>
      <ol class='properties-list'>
        {{#if labels.save}}
          <li>
            {{labels.save}}
          </li>
        {{/if}}

        {{#if labels.toHit}}
          <li>
            {{labels.toHit}}
            {{localize 'DND5E.ToHit'}}
          </li>
        {{/if}}

        {{#each labels.derivedDamage}}
          <li>
            {{label}}
          </li>
        {{/each}}
      </ol>
    {{/if}}

    {{#if itemProperties.length}}
      <h4 class='properties-header'>{{localize 'DND5E.Properties'}}</h4>
      <ol class='properties-list'>
        {{#each itemProperties}}
          <li>{{this}}</li>
        {{/each}}
      </ol>
    {{/if}}
  </div>

  {{editor
    descriptionHTML
    target='system.description.value'
    button=true
    editable=editable
    engine='prosemirror'
    collaborate=false
  }}
</div>
```

### item-mountable.hbs

```hbs
<div class='form-group'>
  <label>{{localize 'DND5E.HitPoints'}}</label>
  <div class='form-fields'>
    {{numberInput system.hp.value name='system.hp.value' placeholder='0'}}
    <span class='sep'>&sol;</span>
    {{numberInput system.hp.max name='system.hp.max' placeholder='0'}}
    {{numberInput
      system.hp.dt
      name='system.hp.dt'
      placeholder=(localize 'DND5E.Threshold')
    }}
  </div>
</div>

<div class='form-group'>
  <label>{{localize 'DND5E.HealthConditions'}}</label>
  <div class='form-fields'>
    <input
      type='text'
      name='system.hp.conditions'
      value='{{system.hp.conditions}}'
    />
  </div>
</div>
```

### item-spellcasting.hbs

```hbs
<div class='form-group'>
  <label>{{localize 'DND5E.SpellProgression'}}</label>
  <div class='form-fields'>
    <select name='system.spellcasting.progression'>
      {{selectOptions
        config.spellProgression
        selected=system.spellcasting.progression
      }}
    </select>
  </div>
</div>

<div class='form-group'>
  <label>{{localize 'DND5E.SpellAbility'}}</label>
  <div class='form-fields'>
    <select name='system.spellcasting.ability'>
      {{selectOptions
        config.abilities
        selected=system.spellcasting.ability
        labelAttr='label'
        blank=''
      }}
    </select>
  </div>
</div>
```

### item-summary.hbs

```hbs
<div class='item-summary'>
  {{{description.value}}}

  <div class='item-properties'>
    {{#each properties}}<span class='tag'>{{this}}</span>{{/each}}
  </div>
</div>
```

## Item SCSS

```scss
.tidy5e.sheet.item {
  min-height: 500px;

  .window-content {
    padding: 0;

    form {
      height: 100%;
      overflow: hidden;
    }
  }

  a:hover {
    text-shadow: none;
  }

  // Checkbox styling

  input[type='checkbox'],
  button,
  select {
    cursor: pointer;
    font-family: var(--t5e-signika);
  }

  // input[type="checkbox"] {
  // 	height: 20px;
  // }

  button,
  select {
    border: none;
    color: var(--t5e-primary-font);
  }

  select {
    padding: 0;
  }

  input[type='text'] {
    border: none;
    padding: 0 6px;
    color: var(--t5e-primary-font);
  }

  input[type='text']:hover,
  input[type='text']:focus {
    border: none;
    box-shadow: 0 0 0 1px var(--t5e-primary-accent) inset;
  }

  input[type='checkbox'] {
    margin: 2px;
  }

  .sheet-header {
    flex: 0 0 80px;
    padding: 1rem;
    background: var(--t5e-header-background);
    align-items: flex-start;

    .item-image {
      flex: 0 0 80px;
      width: 80px;
      height: 80px;
      position: relative;

      .item-menu {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &.hidden {
          display: none;
        }

        a {
          background: var(--t5e-background);
          color: var(--t5e-primary-font);
          border: none;
          margin: 1px 0;
          padding: 4px 6px;
          line-height: 1;
          font-size: 12px;
          border: 1px solid var(--t5e-light-color);
          border-radius: 5px;
          text-align: center;
        }
      }
    }

    img.profile {
      flex: 0 0 80px;
      width: 80px;
      height: 80px;
      border-radius: 5px;
      margin-right: 0;
    }

    .header-details {
      margin-left: 1rem;
      align-items: center;
    }

    .charname {
      padding: 0;
      height: 30px;
      line-height: 18px;

      input {
        margin: 0;
        padding: 0;
        font-size: 24px;
        height: 100%;
        width: 100%;
        font-family: var(--t5e-modesto);
        background: transparent;
      }
    }

    .item-subtitle {
      padding: 2px 4px;
      background: var(--t5e-faint-color);
      border-radius: 5px;
      color: var(--t5e-tertiary-color);
      display: flex;
      align-items: flex-end;
      height: 20px;
      margin-left: 1rem;
      flex: 0 0 1px;
      font-family: var(--t5e-modesto);

      .item-type {
        margin: 0;
        font-size: 20px;
        line-height: 16px;
        color: var(--t5e-secondary-color);
      }

      .item-status {
        font-size: 16px;
        line-height: 14px;
        margin-left: 4px;
        color: var(--t5e-tertiary-color);
        white-space: nowrap;
      }
    } //.item-subtitle

    .summary {
      border: 1px solid var(--t5e-light-color);
      border-left: none;
      border-right: none;
      display: flex;
      font-size: 13px;
      font-family: var(--t5e-signika);
      height: 22px;
      flex: 0 0 100%;
      list-style: none;
      margin: 0;
      padding: 0;
      width: 100%;

      li {
        border-left: 1px solid var(--t5e-faint-color);
        line-height: 20px;
        font-weight: 600;

        input {
          height: 20px;
          background: transparent;
          font-weight: 400;
        }

        select {
          width: 100%;
          height: 20px;
          text-transform: capitalize;
        }

        &:first-child {
          border: none;
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      } //li
    } //.summary
  } //.sheet-header

  // navigation

  .sheet-navigation {
    display: flex;
    flex: 0 0 1px;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;

    .item {
      padding: 5px 1rem 0 1rem;
      background: var(--t5e-header-background);
      border: 1px solid transparent;
      border-bottom: 1px solid var(--t5e-header-border);
      font-size: 13px;
      text-align: left;
      height: 26px;
      flex: 1 1 auto;

      &:hover {
        color: var(--t5e-primary-accent);
      }
    }

    .item.active {
      background: transparent;
      border: 1px solid var(--t5e-header-border);
      border-bottom-color: transparent;
      font-weight: 700;
      cursor: default;
      text-shadow: none;

      &:hover {
        color: inherit;
      }
    }

    .item:first-child.active {
      border-left-color: transparent;
    }

    .item:last-child.active {
      border-right-color: transparent;
    }
  } //.sheet-navigation

  // item sheet body

  .sheet-body {
    padding: 1rem;
    padding-right: 0.25rem;
    overflow: hidden;

    // item properties

    .item-properties {
      flex: 0 0 120px;
      margin: 0;
      padding: 0 0.5rem 0 0;
      border-right: 1px solid var(--t5e-faint-color);
      height: 100%;

      .form-group {
        margin: 0;
        border-bottom: 1px solid var(--t5e-faint-color);
        color: var(--t5e-secondary-color);
        font-size: 13px;

        &:last-of-type {
          border: none;
        }

        label {
          font-weight: 600;
          line-height: 20px;
        }

        input {
          flex: 0 0 40px;
          text-align: right;
          background: none;
          height: 16px;
        }
      }

      .properties-list {
        margin-top: 0.25rem;
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          margin: 0 0 2px 0;
          border: 1px solid var(--t5e-faint-color);
          border-radius: 5px;
          font-size: 11px;
          line-height: 16px;
          padding: 0 2px;
          background: rgba(0, 0, 0, 0.05);
          text-align: center;
        }
      }

      .form-group + .properties-list {
        margin-top: 0.5rem;
      }
    }

    // item sheet editor

    .editor {
      margin-left: 0.5rem;
      height: 100%;
      font-size: 13px;
      display: flex;
      flex-direction: column;

      .details-headline {
        font-weight: 600;
        font-size: 13px;
        line-height: 1;
        margin-bottom: 0.5rem;
        border: none;
      }

      .editor-edit {
        right: 0.75rem;
        top: 0;
        padding: 0;
        border: none;
        box-shadow: none;
        background: transparent;

        i {
          font-size: 1em;
          position: absolute;
          top: 0;
          right: 5px;
          cursor: pointer;
          text-shadow: none;
        }
      } //.editor-edit

      .editor-content {
        margin: 0;
        padding: 0 0.75rem 0 0;

        p,
        li {
          line-height: 1.4;
        }

        a.entity-link,
        a.inline-roll {
          padding: 1px 2px 0px 2px;
          border-radius: 5px;
          background: var(--t5e-faint-color);
          color: var(--t5e-primary-font);
        }
      } //.editor-content

      .tox {
        .tox-toolbar__group {
          padding: 0;
        }

        .tox-tbtn {
          width: 24px;
          height: 24px;
        }

        &.tox-tinymce .tox-tbtn[title='Formats'],
        &.tox-prosemirror .tox-tbtn[title='Formats'] {
          width: 90px;
        }

        .tox-tbtn--select {
          width: auto;
        }
      } //.tox
    } //.editor

    // tabs
    .tab {
      overflow: hidden auto;
      height: 100%;
      align-content: flex-start;
      // 	padding: 0;

      &.item-betterRolls,
      &.details,
      &.advancement,
      &.dynamiceffects,
      &.magic-items {
        padding-right: 0.75rem;

        .form-header {
          margin: 8px 6px 4px 6px;
          font-size: 18px;
          line-height: 16px;
          font-family: var(--t5e-modesto);
          font-weight: 600;
          color: var(--t5e-primary-font);

          &:first-child {
            margin-top: 0;
          }
        }

        .form-group {
          margin: 2px 0;
          padding: 3px;
          background: var(--t5e-faintest-color);
          border-radius: 5px;

          .form-fields {
            justify-content: flex-start;
            gap: 1px;
          }

          &.stacked {
            display: flex;
            flex-wrap: wrap;
            gap: 1px;
          }

          span {
            text-align: center;
          }

          label {
            margin-left: 4px;
            line-height: 20px;
            font-size: 13px;
            font-weight: 600;
            color: var(--t5e-secondary-color);
            white-space: nowrap;

            &.checkbox {
              position: relative;
              z-index: 1;
              margin: 0;
              padding: 1px;
              display: flex;
              border-radius: 3px;
              overflow: hidden;
              border: 1px solid var(--t5e-checkbox-outline);
              background: var(--t5e-checkbox-checked);
              height: 20px;
              cursor: pointer;
              color: var(--t5e-checkbox-font);
              font-size: 13px;
              line-height: 16px;
              flex: 0 0 calc(100% / 4 - 1px);
              font-weight: 400;

              &:hover {
                background: var(--t5e-checkbox-checked);
              }

              &:hover input::after {
                background: var(--t5e-checkbox-checked);
              }
            }
          }

          select,
          input[type='text'],
          button {
            background: rgba(255, 255, 255, 0.3);
            height: 20px;
            font-size: 13px;

            &:hover {
              background: rgba(255, 255, 255, 0.5);
            }
          }

          input:disabled {
            background: transparent;
            color: var(--t5e-secondary-color);

            &:hover {
              border: none !important;
            }
          }

          .checkbox input {
            position: static;
            margin: 0;

            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              z-index: -1;
              background: var(--t5e-checkbox-unchecked);
              width: 100%;
              height: 100%;
              cursor: pointer;
            }

            &:checked::after {
              display: none;
            }
          }

          input[name='data.activation.cost'],
          input[name='data.target.value'],
          input[name='data.range.value'],
          input[name='data.duration.value'],
          input[name='data.uses.value'],
          &.damage-parts input {
            text-align: right;
          }

          input[name='data.save.dc'] {
            text-align: center;
            flex: 0 0 30px;
          }

          input[type='text']:hover,
          select:hover,
          button:hover,
          select:focus {
            border: none;
            box-shadow: 0 0 0 1px var(--t5e-primary-accent) inset;
          }
        } //.form-group

        .form-group label.prepared,
        .form-group.recharge label {
          flex: unset !important;
          padding-right: 8px;
          margin: 0 0.5rem 0 0;
          flex-direction: row-reverse;

          input {
            width: 20px;
            height: 16px;
            top: initial;
            margin: 0 4px 0 0;
          }
        }

        .form-group.recharge label {
          margin-right: 0;
        }
      } //.tab children

      &.item-betterRolls .form-group label.checkbox {
        flex: 0 0 calc(100% / 3 - 1px);
      }

      &.effects,
      &.advancement {
        .items-list {
          flex: 1;
          padding: 0 9px 8px 0;
          margin: 0;
          list-style: none;
          overflow-y: scroll;

          .item-list {
            padding: 0 0 0 8px;
            margin: 0;
          }

          .items-header {
            align-items: center;
            margin: 8px 0 2px 0;
            padding: 4px 0 2px 6px;
            line-height: 12px;
            font-size: 12px;
            background: var(--t5e-faint-color);
            box-shadow: 0 0 3px inset var(--t5e-light-color);
            border-radius: 5px;

            &:first-child {
              margin-top: 0;
            }

            h3 {
              font-size: 12px;
              line-height: 12px;
              flex: 1 0 70px;
              white-space: nowrap;
              margin: 0;
              font-weight: 600;
            }

            div:not(.item-name) {
              color: var(--t5e-tertiary-color);
            }
          }

          .effect-source,
          .effect-duration {
            flex: 0 0 120px;
            text-align: center;
            justify-content: center;
          }

          .effect-controls {
            flex: 0 0 61px;
            text-align: center;
            justify-content: center;
          }

          .items-header .effect-controls i {
            margin-right: 4px;
          }

          .effect-control {
            flex: 0 0 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--t5e-tertiary-color);

            .fas.fa-trash {
              color: var(--t5e-unsafe-accent);
            }

            &:hover {
              color: var(--t5e-secondary-color);

              .fas.fa-trash {
                color: var(--t5e-unlinked-accent);
              }
            }
          }

          //.items-header-label

          .item {
            background: var(--t5e-faintest-color);
            margin: 2px 0;
            border-radius: 5px;
            font-size: 12px;
            color: var(--t5e-primary-font);

            div:not(.item-name) {
              border-left: 1px solid var(--t5e-faint-color);
              display: flex;
              align-items: center;
              justify-content: center;
            }

            div.item-summary {
              flex: 100%;
              justify-content: flex-start;
              gap: 0.5em;
              padding: 0.5em 2em;
              border: none;
            }

            .item-name {
              align-items: center;

              h4 {
                margin: 0;
              }
            }

            .item-name .item-image {
              flex: 0 0 24px;
              height: 24px;
              border-radius: 5px 0px 0px 5px;
              margin-right: 4px;
              border: none;
              background-size: cover;

              i {
                color: var(--t5e-tertiary-color);
                display: none;
                text-align: center;
                font-size: 18px;
              }
            }
          } //.item
        } //.effects-list
      } //.effects
    } //.tab

    input[type='checkbox'] {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: none;
      border: 1px solid var(--t5e-tertiary-color);
      box-shadow: 0 0 2px var(--t5e-light-color) inset;
      border-radius: 3px;
      background-image: var(--t5e-check-default);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 60%;
    }

    label input[type='checkbox'] {
      border: none;
      box-shadow: none;
      position: relative;
    }

    input[type='checkbox']:checked {
      background: var(--t5e-secondary-color);
      background-image: var(--t5e-check-checked);
      background-size: 60%;
      background-repeat: no-repeat;
      background-position: center;
    }

    .checkbox input[type='checkbox']:checked {
      background-image: var(--t5e-check-checked);
    }

    label input[type='checkbox']:checked {
      background-color: transparent;
    }
  }

  .damage-header {
    margin: 8px 4px 4px 6px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    font-family: var(--t5e-modesto);
    font-size: 18px;
  }

  .damage-control {
    margin: 0 0.5rem;
    text-align: center;
    display: flex;
    align-items: center;
    flex: 0 0 1px;
    white-space: nowrap;
    color: var(--t5e-tertiary-color);
    font-family: var(--t5e-signika);
    font-size: 13px;

    // &::after {
    // 	display: inline-block;
    // 	content: 'Add Formula';
    // 	margin-left: .25rem;
    //   font-size: 12px;
    // }
  }

  .damage-parts {
    flex-direction: column;

    li {
      margin-top: 2px;
      width: 100%;
      border-bottom: 1px solid var(--t5e-faint-color);
      padding-bottom: 2px;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        border: none;
        padding: 0;
      }

      input {
        margin-right: 4px;
      }
    }
  }
}
```
