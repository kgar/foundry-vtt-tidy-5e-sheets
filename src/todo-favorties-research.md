
```js
// Base Item
  /**
   * Prepare item favorite data.
   * @returns {Promise<FavoriteData5e>}
   */
  async getFavoriteData() {
    return {
      img: this.parent.img,
      title: this.parent.name,
      subtitle: game.i18n.localize(CONFIG.Item.typeLabels[this.parent.type])
    };
  }

// Class
  /** @inheritDoc */
  async getFavoriteData() {
    const context = await super.getFavoriteData();
    if ( this.parent.subclass ) context.subtitle = this.parent.subclass.name;
    context.value = this.levels;
    return context;
  }

// Consumable
  /** @inheritDoc */
  async getFavoriteData() {
    return foundry.utils.mergeObject(await super.getFavoriteData(), {
      subtitle: [this.type.label, this.parent.labels.activation],
      uses: this.hasLimitedUses ? this.getUsesData() : null,
      quantity: this.quantity
    });
  }

// Container
  /** @inheritDoc */
  async getFavoriteData() {
    const data = super.getFavoriteData();
    const capacity = await this.computeCapacity();
    if ( Number.isFinite(capacity.max) ) return foundry.utils.mergeObject(await data, { uses: capacity });
    return await data;
  }

// Equipment
  /** @inheritDoc */
  async getFavoriteData() {
    return foundry.utils.mergeObject(await super.getFavoriteData(), {
      subtitle: [this.type.label, this.parent.labels.activation],
      uses: this.hasLimitedUses ? this.getUsesData() : null
    });
  }

// Feat
  /** @inheritDoc */
  async getFavoriteData() {
    return foundry.utils.mergeObject(await super.getFavoriteData(), {
      subtitle: [this.parent.labels.activation, this.parent.labels.recovery],
      uses: this.hasLimitedUses ? this.getUsesData() : null
    });
  }

// Spell
  /** @inheritDoc */
  async getFavoriteData() {
    return foundry.utils.mergeObject(await super.getFavoriteData(), {
      subtitle: [this.parent.labels.components.vsm, this.parent.labels.activation],
      modifier: this.parent.labels.modifier,
      range: this.range,
      save: this.activities.getByType("save")[0]?.save
    });
  }

// Tool
  /** @inheritDoc */
  async getFavoriteData() {
    return foundry.utils.mergeObject(await super.getFavoriteData(), {
      subtitle: this.type.label,
      modifier: this.parent.parent?.system.tools?.[this.type.baseItem]?.total
    });
  }

// Weapon
  /** @inheritDoc */
  async getFavoriteData() {
    return foundry.utils.mergeObject(await super.getFavoriteData(), {
      subtitle: CONFIG.DND5E.itemActionTypes[this.activities.contents[0]?.actionType],
      modifier: this.parent.labels.modifier,
      range: this.range
    });
  }
```


```hbs
    {{!-- Favorites --}}
    <div class="favorites">
        <h3 class="icon">
            <i class="fas fa-bookmark" inert></i>
            <span class="roboto-upper">{{ localize "DND5E.Favorites" }}</span>
        </h3>
        <ul class="unlist">
            {{#each favorites}}

            {{!-- Favorite --}}
            <li class="{{#if itemId}}item-tooltip{{/if}} {{ type }} {{~#if suppressed}} suppressed{{/if}}
                {{~#if draggable}} draggable{{/if}}" data-favorite-id="{{ id }}"
                {{#if key}}data-key="{{ key }}"{{/if}}
                {{#if itemId}}data-item-id="{{ itemId }}"{{/if}}
                {{#if effectId}}data-effect-id="{{ effectId }}"{{/if}}
                {{#if parentId}}data-parent-id="{{ parentId }}"{{/if}}
                {{#if activityId}}data-activity-id="{{ activityId }}" data-action="useFavorite"{{/if}}
                {{#if reference}}data-reference-tooltip="{{ reference }}"{{/if}}
                {{#if preparationMode}}data-preparation-mode="{{ preparationMode }}"{{/if}}
                {{#if level}}data-level="{{ level }}"{{/if}}>

                {{!-- Icon --}}
                <figure>
                    <img class="gold-icon" alt="{{ title }}" src="{{ img }}">

                    {{!-- Favorite Deletion --}}
                    {{#if @root.editable}}
                    <button type="button" class="deletion-control unbutton" data-action="deleteFavorite"
                            data-tooltip-class data-tooltip-direction data-tooltip="DND5E.FavoriteRemove"
                            aria-label="{{ localize 'DND5E.FavoriteRemove' }}">
                        <i class="fas fa-circle-xmark" inert></i>
                    </button>
                    {{/if}}
                </figure>

                {{!-- Name --}}
                <div class="name-stacked {{ rollableClass }}" role="button" data-action="useFavorite">
                    <span class="title">{{ title }}</span>
                    {{#if subtitle}}
                    <span class="subtitle">{{{ subtitle }}}</span>
                    {{/if}}
                </div>

                {{!-- Info --}}
                <div class="info">
                    <div class="primary {{ css }}">
                        {{!-- Item Uses & Capacity --}}
                        {{#if uses.max}}
                        {{#with uses}}
                        {{#if (and name @root.actor.isOwner)}}
                        <input type="text" class="uninput value" value="{{ value }}"
                               {{#unless ../bareName}}data-{{/unless}}name="{{ name }}"
                               data-dtype="Number" inputmode="numeric" pattern="[+=\-]?\d*">
                        {{else}}
                        <span class="value">{{ value }}</span>
                        {{/if}}
                        <span class="separator">&sol;</span>
                        <span class="max">{{ max }}</span>
                        {{/with}}

                        {{!-- Modifiers --}}
                        {{else if modifier includeZero=true}}
                        {{ dnd5e-formatModifier modifier }}

                        {{!-- Passive Score --}}
                        {{#if passive}}
                        <span class="passive">({{ passive }})</span>
                        {{/if}}

                        {{!-- Saves --}}
                        {{else if save.dc.value}}
                        {{#with save}}
                        <span class="ability">
                            {{ ability }}
                        </span>
                        <span class="value">{{ dc.value }}</span>
                        {{/with}}

                        {{!-- Other Value --}}
                        {{else if value includeZero=true}}
                        <span class="value">{{ value }}</span>

                        {{!-- Quantity --}}
                        {{else if quantity}}
                        <span class="sign">&times;</span>
                        <span class="value">{{ quantity }}</span>

                        {{!-- Toggleable --}}
                        {{else if toggle.applicable}}
                        <i class="fas fa-toggle-{{#if toggle.value}}on{{else}}off{{/if}}"></i>

                        {{!-- Legacy Resources --}}
                        {{else if resource}}
                        {{#if @root.actor.isOwner}}
                        <input type="text" class="uninput value" value="{{ resource.value }}"
                               data-dtype="Number" name="system.{{ id }}.value" inputmode="numeric"
                               pattern="[+=\-]?\d*">
                        {{else}}
                        <span class="value">{{ resource.value }}</span>
                        {{/if}}
                        <span class="separator">&sol;</span>
                        {{#if @root.editable}}
                        <input type="text" class="uninput max" value="{{ resource.source.max }}"
                               data-dtype="Number" name="system.{{ id }}.max" inputmode="numeric"
                               pattern="[+=\-]?\d*">
                        {{else}}
                        <span class="max">{{ resource.max }}</span>
                        {{/if}}
                        {{/if}}
                    </div>
                    <div class="secondary">
                        {{!-- Quantity --}}
                        {{#if (and uses quantity)}}
                        <span class="quantity">&times; {{ quantity }}</span>

                        {{!-- Range --}}
                        {{else if range.value}}
                        {{#with range}}
                        <span class="range">
                            {{ value }}
                            {{#if long}}&sol; {{ long }}{{/if}}
                            {{ units }}
                        </span>
                        {{/with}}

                        {{!-- Reach --}}
                        {{else if range.reach}}
                        <span class="range">{{ range.reach }} {{ range.units }}</span>
                        {{/if}}
                    </div>
                </div>

            </li>

            {{/each}}

            {{!-- Drop Indicator --}}
            <li class="drop roboto-upper">{{ localize "DND5E.FavoriteDrop" }}</li>
        </ul>
    </div>
```

