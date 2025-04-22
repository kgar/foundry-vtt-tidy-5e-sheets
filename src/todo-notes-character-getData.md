## Notes for Character Data Context Prep

From module\applications\mixins\sheet-v2-mixin.mjs:
```js
    /** @inheritDoc */
    async getData(options) {
      const context = await super.getData(options);
      context.editable = this.isEditable && (this._mode === this.constructor.MODES.EDIT);
      context.cssClass = context.editable ? "editable" : this.isEditable ? "interactable" : "locked";
      return context;
    }
```

From module\applications\actor\base-sheet.mjs:
```js
  /** @override */
  async getData(options) {

    // The Actor's data
    const source = this.actor.toObject();

    // Basic data
    const context = {
      actor: this.actor,
      source: source.system,
      system: this.actor.system,
      items: Array.from(this.actor.items),
      itemContext: {},
      abilities: foundry.utils.deepClone(this.actor.system.abilities),
      skills: foundry.utils.deepClone(this.actor.system.skills ?? {}),
      tools: foundry.utils.deepClone(this.actor.system.tools ?? {}),
      labels: this._getLabels(),
      movement: this._getMovementSpeed(this.actor.system),
      senses: this._getSenses(this.actor.system),
      effects: EffectsElement.prepareCategories(this.actor.allApplicableEffects()),
      warnings: foundry.utils.deepClone(this.actor._preparationWarnings),
      filters: this._filters,
      owner: this.actor.isOwner,
      limited: this.actor.limited,
      options: this.options,
      editable: this.isEditable,
      cssClass: this.actor.isOwner ? "editable" : "locked",
      isCharacter: this.actor.type === "character",
      isNPC: this.actor.type === "npc",
      isVehicle: this.actor.type === "vehicle",
      config: CONFIG.DND5E,
      rollableClass: this.isEditable ? "rollable" : "",
      rollData: this.actor.getRollData(),
      overrides: {
        attunement: foundry.utils.hasProperty(this.actor.overrides, "system.attributes.attunement.max")
      },
      elements: this.options.elements
    };

    // Remove items in containers & sort remaining
    context.items = context.items
      .filter(i => !this.actor.items.has(i.system.container))
      .sort((a, b) => (a.sort || 0) - (b.sort || 0));

    // Temporary HP
    const hp = {...context.system.attributes.hp};
    if ( hp.temp === 0 ) delete hp.temp;
    if ( hp.tempmax === 0 ) delete hp.tempmax;
    context.hp = hp;

    // Ability Scores
    for ( const [a, abl] of Object.entries(context.abilities) ) {
      abl.icon = this._getProficiencyIcon(abl.proficient);
      abl.hover = CONFIG.DND5E.proficiencyLevels[abl.proficient];
      abl.label = CONFIG.DND5E.abilities[a]?.label;
      abl.baseProf = source.system.abilities[a]?.proficient ?? 0;
      abl.key = a;
    }

    // Skills & tools.
    const baseAbility = (prop, key) => {
      let src = source.system[prop]?.[key]?.ability;
      if ( src ) return src;
      if ( prop === "skills" ) src = CONFIG.DND5E.skills[key]?.ability;
      return src ?? "int";
    };
    ["skills", "tools"].forEach(prop => {
      for ( const [key, entry] of Object.entries(context[prop]) ) {
        entry.abbreviation = CONFIG.DND5E.abilities[entry.ability]?.abbreviation;
        entry.icon = this._getProficiencyIcon(entry.value);
        entry.hover = CONFIG.DND5E.proficiencyLevels[entry.value];
        entry.label = (prop === "skills") ? CONFIG.DND5E.skills[key]?.label : Trait.keyLabel(key, {trait: "tool"});
        entry.baseValue = source.system[prop]?.[key]?.value ?? 0;
        entry.baseAbility = baseAbility(prop, key);
      }
    });

    // Update traits
    context.traits = this._prepareTraits(context.system);

    // Prepare owned items
    this._prepareItems(context);
    context.expandedData = {};
    for ( const id of this._expanded ) {
      const item = this.actor.items.get(id);
      if ( item ) {
        context.expandedData[id] = await item.getChatData({secrets: this.actor.isOwner});
        if ( context.itemContext[id] ) context.itemContext[id].expanded = context.expandedData[id];
      }
    }

    // Biography HTML enrichment
    context.biographyHTML = await TextEditor.enrichHTML(context.system.details.biography.value, {
      secrets: this.actor.isOwner,
      rollData: context.rollData,
      relativeTo: this.actor
    });

    return context;
  }
```

From module\applications\actor\character-sheet.mjs:
```js
  /** @inheritDoc */
  async getData(options={}) {
    const context = await super.getData(options);

    // Resources
    context.resources = ["primary", "secondary", "tertiary"].reduce((arr, r) => {
      const res = foundry.utils.mergeObject(context.actor.system.resources[r] || {}, {
        name: r,
        placeholder: game.i18n.localize(`DND5E.Resource${r.titleCase()}`)
      }, {inplace: false});
      if ( res.value === 0 ) delete res.value;
      if ( res.max === 0 ) delete res.max;
      return arr.concat([res]);
    }, []);

    const classes = this.actor.itemTypes.class;
    return foundry.utils.mergeObject(context, {
      disableExperience: game.settings.get("dnd5e", "levelingMode") === "noxp",
      classLabels: classes.map(c => c.name).join(", "),
      labels: {
        type: context.system.details.type.label
      },
      multiclassLabels: classes.map(c => [c.subclass?.name ?? "", c.name, c.system.levels].filterJoin(" ")).join(", "),
      weightUnit: game.i18n.localize(`DND5E.Abbreviation${
        game.settings.get("dnd5e", "metricWeightUnits") ? "Kg" : "Lbs"}`),
      encumbrance: context.system.attributes.encumbrance
    });
  }
```

From module\applications\actor\character-sheet-2.mjs:
```js
  /** @inheritDoc */
  async getData(options) {
    const context = await super.getData(options);
    const { attributes, bastion, details, traits } = this.actor.system;

    // Class
    context.labels.class = Object.values(this.actor.classes).sort((a, b) => {
      return b.system.levels - a.system.levels;
    }).map(c => `${c.name} ${c.system.levels}`).join(" / ");
    context.showClassDrop = !context.labels.class || (this._mode === this.constructor.MODES.EDIT);

    // Exhaustion
    if ( CONFIG.DND5E.conditionTypes.exhaustion ) {
      const max = CONFIG.DND5E.conditionTypes.exhaustion.levels;
      context.exhaustion = Array.fromRange(max, 1).reduce((acc, n) => {
        const label = game.i18n.format("DND5E.ExhaustionLevel", { n });
        const classes = ["pip"];
        const filled = attributes.exhaustion >= n;
        if ( filled ) classes.push("filled");
        if ( n === max ) classes.push("death");
        const pip = { n, label, filled, tooltip: label, classes: classes.join(" ") };

        if ( n <= max / 2 ) acc.left.push(pip);
        else acc.right.push(pip);
        return acc;
      }, { left: [], right: [] });
    }
```