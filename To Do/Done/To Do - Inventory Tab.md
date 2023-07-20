- [x] Make a component
- [ ] Functionality
  - [ ] ...
  - [x] Configure item count to update on blur
  - [x] Implement hover / static item count
  - [x] ammo dropdown
- [x] Footer
  - [x] Attunement
  - [x] Money
  - [x] encumbrance
    - [x] the rest
    - [x] hideStandardEncumbranceBar setting
- [x] Make types for `ui`, such as `ui.notifications`
- [x] Styles
  - [x] ... the rest
  - [x] item summary looks unfinished
- [x] Ok, now do the grid version
- [x] Determine what Stacks are and how they should work
- [x] Settings / features
  - [x] hideIconsNextToTheItemName : If enabled this setting hides the support icons present next to the object name (Favorite, Attunement, etc.), this is usually useful with the 'Use classic item controls in list view' setting enabled in order to avoid a redundancy of icons...
  - [x] ammoEquippedOnly : Enable to only show currently equipped ammunition in Weapon ammo selector.
  - [x] quantityAlwaysShownEnabled : Always show item quantity
- [x] The context menu has too many options. Is that because of tidy 5e module being on? Yes.
- [x] Test ammo switching on a synthetic token

## Inventory Impl

```hbs
{{!-- Inventory Header --}}
{{> "modules/tidy5e-sheet/templates/actors/parts/tidy5e-inventory-header.html"}}

<div class="list-layout">

  <ul class="inventory-list items-list {{#if actor.flags.tidy5e-sheet.allow-edit}}unlocked{{/if}}">
    {{#each sections as |section sid|}}

    <li class="items-header">
      <h3 class="item-name">{{localize section.label}}</h3>

      <div class="items-header-labels">

        {{#if section.columns}}
          {{#each section.columns}}
          <div class="items-header-{{css}}">{{label}}</div>
          {{/each}}
        {{else}}
          {{#if @root.isCharacter}}
          <div class="items-header-weight" title="{{localize 'DND5E.Weight'}} ({{ @root.weightUnit }})"><i class="fas fa-weight-hanging"></i></div>
          {{/if}}
          <div class="items-header-charge" title="{{localize 'DND5E.Charges'}}"><i class="fas fa-bolt"></i></div>
          <div class="items-header-usage">{{localize 'DND5E.Usage'}}</div>
          <div class="items-header-controls"></div>
        {{/if}}
      </div>
      <div class="item-control inventory-plus-helper" {{#each section.dataset as |v k|}}data-{{k}}="{{v}}"{{/each}}></div>
    </li>
    <!--
    <li class="items-header flexrow">
      <h3 class="item-name flexrow">{{localize section.label}}</h3>

      {{#if section.columns}}
          {{#each section.columns}}
              <div class="item-detail {{css}}">{{label}}</div>
          {{/each}}
      {{else}}
          {{#if @root.isCharacter}}
              <div class="item-detail item-weight">{{localize "DND5E.Weight"}}</div>
          {{/if}}

          <div class="item-detail item-uses">{{localize "DND5E.Charges"}}</div>
          <div class="item-detail item-action">{{localize "DND5E.Usage"}}</div>
      {{/if}}

      {{#if @root.owner}}
      <div class="item-controls flexrow">

        <a class="item-control item-create" data-action="itemCreate" data-tooltip="DND5E.ItemCreate"
            {{#each section.dataset as |v k|}}data-{{k}}="{{v}}"{{/each}}>
            <i class="fas fa-plus"></i> {{localize "DND5E.Add"}}
        </a>

      </div>

      {{/if}}
    </li>
    -->

    <ul class="item-list">
      {{#each section.items as |item iid|}}
      {{#with (lookup @root.itemContext item.id) as |ctx|}}
        <li class="item {{section.css}} {{#if (or item.flags.magicitems.enabled item.system.properties.mgc)}}magic-item{{/if}} {{item.attunement.cls}} {{#if item.system.equipped}}equipped{{/if}}" data-item-id="{{#if section.editableName}}{{iid}}{{else}}{{item.id}}{{/if}}" data-item-index="{{#if section.editableName}}{{iid}}{{else}}{{item._id}}{{/if}}">
          <div class="item-name {{@root.rollableClass}}">
            {{#if section.editableName}}
              <input type="text" value="{{item.name}}">
            {{else}}

              <div class="item-image" style="background-image: url('{{item.img}}')">
                <i class="fa fa-dice-d20"></i>
              </div>
              <h4>
                {{item.name~}}
                <!--
                {{~#if ctx.isStack}} ({{item.system.quantity}}){{/if}}
                -->
              </h4>
              {{#if item.system.properties.amm}}
              <span class="ammo" data-id="{{item._id}}"></span>
              {{/if}}
              <span class="item-quantity{{#if item.isStack}} isStack{{/if}}">
                (<input class="item-count" name="system.quantity" type="text" value="{{item.system.quantity}}" maxlength="3" >)
              </span>
            {{/if}}
          </div>

          {{#if @root.notHideIconsNextToTheItemName }}
            {{#if ctx.attunement}}
            <div class="item-detail attunement">
                <i class="item-state-icon fas {{ctx.attunement.icon}} {{ctx.attunement.cls}}" title="{{localize ctx.attunement.title}}"></i>
            </div>
            {{/if}}

            {{#if item.flags.tidy5e-sheet.favorite}}
            <div class="item-state-icon" title="{{localize 'TIDY5E.isFav'}}"><i class="fas fa-bookmark icon-fav"></i></div>
            {{/if}}
          {{/if}}
          {{#if section.columns}}
            {{#each section.columns}}
              <div class="item-detail {{css}}">
                {{#with (getProperty item property)}}
                  {{#if ../editable}}
                    <input type="text" value="{{this}}" placeholder="&mdash;"
                                    data-dtype="{{../editable}}" data-property="{{../property}}">
                  {{else}}
                    {{this}}
                  {{/if}}
                {{/with}}
              </div>
            {{/each}}
          {{else}}
            {{#if @root.isCharacter}}
            <div class="item-detail item-weight" title="{{localize 'DND5E.Weight'}}: {{ item.system.weight }} {{ @root.weightUnit }}">
              {{#if ctx.totalWeight}}
                  {{ ctx.totalWeight }} {{ @root.weightUnit }}
              {{ else }}
                  {{ item.system.weight }} {{ @root.weightUnit }}
              {{/if}}
            </div>
            {{/if}}

            <div class="item-detail item-uses" title="{{localize 'DND5E.Uses'}}">
              {{#if ctx.hasUses }}
              <input class="uses-value" type="text" name="system.uses.value" value="{{item.system.uses.value}}" placeholder="0"/> /
              <input class="uses-max" type="text" name="system.uses.max" value="{{item.system.uses.max}}">
              <!-- {{item.system.uses.max}} -->

              {{else}}
              <a class="addCharges" value="Add">Add</a>
              {{/if}}
            </div>

            <div class="item-detail item-action" title="{{localize 'DND5E.Usage'}}">
              {{#if item.system.activation.type }}
                {{item.labels.activation}}
              {{/if}}
            </div>
          {{/if}}


          <div class="info-card {{~#if (or item.flags.magicitems.enabled item.system.properties.mgc)}} magic-item {{/if}} {{item.attunement.cls}} {{~#if item.system.equipped}} equipped {{/if}}" data-item-id="{{item._id}}" data-item-index="{{item._id}}" >
            <p class="info-card-name">{{item.name}}</p>
            <div class="info-card-states">
              {{~#if (or item.flags.magicitems.enabled item.system.properties.mgc)}}<span><i class="fas fa-magic"></i>Magic Item</span>{{/if}}
              {{~#if ctx.attunement}}<span class="info-attuned {{item.attunement.cls}}"><i class="fas fa-sun"></i>{{localize item.attunement.title}}</span>{{/if}}
            </div>
            {{#if item.hasUses }}
            <div class="info-card-amount">
              <span><i class="fas fa-bolt"></i><b>{{localize 'DND5E.Charges'}}:</b> {{item.system.uses.value}}/{{item.system.uses.max}}</span>
            </div>
            {{/if}}
            <div class="info-card-amount">
              <!-- {{#if item.system.weight }} {{/if}} -->
              <span class="info-weight"><b>{{localize 'DND5E.Weight'}}:</b> {{ item.system.weight }} {{ @root.weightUnit }}</span>
              <!-- {{#if item.system.quantity}} {{/if}} -->
              <span class="info-quantity"><b>{{localize 'DND5E.Quantity'}}:</b> {{item.system.quantity}} &times; {{item.system.price.value}} {{item.system.price.denomination}}</span>
            </div>
            <div class="description-wrap">
              <div class="info-card-description">
                <!-- item description -->
              </div>
            </div>
            <article class="mod-roll-buttons"></article>
          </div>

          {{#if @root.owner}}
          <div class="item-controls flexrow" {{#if @root.classicControlsDisabled}} style="display:none" {{/if}}>
            {{#if ctx.attunement}}
              <a class="item-control item-attunement {{#if (eq item.system.attunement 2) }}active{{/if}} {{item.attunement.cls}}" title="{{localize item.attunement.title}}">
                {{#if (eq item.system.attunement 2) }}
                  <i class="item-state-icon fas fa-sun"></i>
                {{else}}
                  <i class="item-state-icon fas fa-sun not-attuned"></i>
                {{/if}}
                <span class="control-label">
                  {{#if (eq item.system.attunement 2) }}
                    {{localize "TIDY5E.Deattune"}}
                  {{else}}
                    {{localize "TIDY5E.Attune"}}
                  {{/if}}
                </span>
              </a>
            {{/if}}
            {{#if ctx.canToggle}}
            <!--
            <a class="item-control item-toggle {{ctx.toggleClass}}" data-action="itemToggle" data-tooltip='{{ctx.toggleTitle}}'>
                <i class="fas fa-shield-alt"></i>
            </a>
            -->
            <a class="item-control item-toggle {{ctx.toggleClass}}" data-action="itemToggle" data-tooltip='{{ctx.toggleTitle}}'>
              {{#if (eq ctx.toggleClass 'active')}}
                <i class="fas fa-user-alt"></i>
                <span class="control-label">{{localize "TIDY5E.Unequip"}}</span>
              {{else}}
                <i class="fas fa-user-alt inactive"></i>
                <span class="control-label">{{localize "TIDY5E.Equip"}}</span>
              {{/if}}
            </a>
            {{/if}}
            {{#unless section.editableName}}
            <a class="item-control item-edit" data-action="itemEdit" data-tooltip="DND5E.ItemEdit">
                <i class="fas fa-edit fa-fw"></i>
            </a>
            <a class="item-control item-duplicate" data-action="itemDuplicate" title="{{localize 'DND5E.ContextMenuActionDuplicate'}}">
              <i class="fas fa-copy fa-fw"></i>
            </a>
            {{/unless}}
            <a class="item-control item-delete" data-action="itemDelete" data-tooltip="DND5E.ItemDelete">
                <i class="fas fa-trash fa-fw"></i>
            </a>
          </div>
          {{/if}}
        </li>
      {{/with}}
      {{/each}}

      {{#if @root.owner}}
      <li class="items-footer">
        <a class="item-create" data-action="itemCreate" data-tooltip="DND5E.ItemCreate" {{#each section.dataset as |v k|}}data-{{k}}="{{v}}"{{/each}}>
          <i class="fas fa-plus-circle"></i>
          {{localize "DND5E.Add"}}
        </a>
      </li>
      {{/if}}
    </ul>
    {{/each}}
  </ul>

</div>

{{!-- Inventory Footer --}}
{{> "modules/tidy5e-sheet/templates/actors/parts/tidy5e-inventory-footer.html"}}

```

## Ammo Switch impl

```js
export const tidy5eAmmoSwitch = function (html, actor) {
  html.find('.ammo').each(function () {
    const element = $(this);
    const itemId = element.attr('data-id');
    const token = actor.token || null;
    if (token)
      actor = actor
        .getActiveTokens(false, true)
        .find((t) => t._id === token.id).actor; // get synthetic actor
    const item = actor.items.get(itemId);
    const equippedOnly = game.settings.get(
      CONSTANTS.MODULE_ID,
      'ammoEquippedOnly'
    );
    const ammoItems = actor.items.filter(
      (x) =>
        x.system.consumableType === 'ammo' &&
        (!equippedOnly || x.system.equipped)
    );
    debug(`tidy5e-ammo-switch | tidy5eAmmoSwitch | ammoItems: ${ammoItems}`);
    const target = item.system.consume.target;
    const ammoItemStrings = ['<option value=""></option>']
      .concat(
        ammoItems.map(
          (x) =>
            `<option value="${x.id}" ${x.id === target ? 'selected' : ''}>${
              x.name
            } (${x.system.quantity})</option>`
        )
      )
      .join('');
    const selector = $(
      `<select class="ammo-switch">${ammoItemStrings}</select>`
    );
    selector.attr('data-item', item.id);
    selector.attr('data-actor', actor.id);
    if (token) selector.attr('data-token', token.id);
    selector.on('change', function () {
      const element = $(this);
      const val = element.val();
      let actor = game.actors.get(selector.attr('data-actor'));
      const token = selector.attr('data-token');
      if (token)
        actor = actor
          .getActiveTokens(false, true)
          .find((t) => t._id === token).actor; // get synthetic actor
      const item = actor.items.get(selector.attr('data-item'));
      const ammo = actor.items.get(val);
      item.update({
        system: {
          consume: {
            amount: !ammo
              ? null
              : !!item.system.consume.amount
              ? item.system.consume.amount
              : 1,
            target: !ammo ? '' : val,
            type: !ammo ? '' : ammo.system.consumableType,
          },
        },
      });
    });
    element.after(selector);
    element.remove();
  });
};
```

## Item Quantity Change impl

```js
async function _onQuantityChange(event) {
  event.preventDefault();
  const itemId = event.currentTarget.closest('.item').dataset.itemId;
  const item = this.actor.items.get(itemId);
  const uses = parseInt(event.target.value ?? item.system.quantity);
  event.target.value = uses;
  return item.update({ 'system.quantity': uses });
}
```

## Footer Impl

```hbs
<div class="inventory-footer">
	<div class="attuned-items-counter" title="{{localize 'DND5E.Attunement'}}">
		<i class="fas fa-sun"></i>
		<span class="attuned-items-current">{{system.attributes.attunement.value}}</span>
		/
		<span class="attuned-items-max">{{system.attributes.attunement.max}}</span>
		<input type="number" class="attuned-items-max" name="system.attributes.attunement.max" value="{{system.attributes.attunement.max}}" placeholder="0" title="{{localize 'TIDY5E.AttunementMax'}}" />
	</div>

	<div class="inventory-currency">
		<ol class="currency">
			<!--
        <h3>
            {{localize "DND5E.Currency"}}
            <a class="action-button currency-convert {{rollableClass}}" data-action="convertCurrency" data-tooltip="DND5E.CurrencyConvert">
                <i class="fas fa-coins"></i>
            </a>
        </h3>
        {{#each system.currency as |v k|}}
        <label class="denomination {{k}}">{{ lookup ../labels.currencies k }}</label>
        <input type="text" name="system.currency.{{k}}" value="{{v}}" data-dtype="Number">
        {{/each}}
        -->
			<li class="currency-header" title="{{localize 'DND5E.Currency'}}">
				<i class="fas fa-coins"></i>
			</li>
			{{#each system.currency as |v k|}}
			<li class="currency-item {{k}}" title="{{ lookup ../labels.currencies k }}">
				<input type="number" step="any" name="system.currency.{{k}}" id="{{@root/appId}}-system.currency.{{k}}" value="{{v}}" />
				<label for="{{@root/appId}}-system.currency.{{k}}" class="denomination {{k}}" data-denom="{{k}}">{{ lookup ../label.currencies k }}</label>
			</li>
			{{/each}}
			<li class="currency-item convert">
				<a class="currency-convert rollable" data-action="convertCurrency" title="{{localize 'DND5E.CurrencyConvertHint'}}">
					<i class="fas fa-funnel-dollar"></i>
				</a>
			</li>
		</ol>
	</div>
</div>

{{#with encumbrance}}
<div class="encumbrance {{#if encumbered}}encumbered{{/if}}" title="{{localize 'TIDY5E.Encumbrance'}}">
	<span class="encumbrance-bar" style="width:{{pct}}%"></span>
	<span class="encumbrance-label">{{value}} / {{max}}</span>
	<i class="encumbrance-breakpoint encumbrance-33 arrow-up"></i>
	<i class="encumbrance-breakpoint encumbrance-33 arrow-down"></i>
	<i class="encumbrance-breakpoint encumbrance-66 arrow-up"></i>
	<i class="encumbrance-breakpoint encumbrance-66 arrow-down"></i>
</div>
{{/with}}
```

```scss
.inventory-footer {
  margin: 0rem 14px 0.5rem 0;
  padding-top: 0.5rem;
  display: flex;
  flex: 0 0 30px;
  border-top: 1px solid var(--t5e-light-color);
}

.attuned-items-counter {
  display: flex;
  align-items: center;
  margin: 0 20px 0 3px;
  padding: 0 0 0 10px;
  border-radius: 5px;
  background: var(--t5e-faint-color);
  box-shadow: 0 0 5px var(--t5e-magic-accent) inset;
  border: 1px solid var(--t5e-magic-accent);

  &.overattuned {
    background: var(--t5e-primary-accent);
    box-shadow: 0 0 3px var(--t5e-primary-accent);
    animation: attention 2s infinite alternate ease-in-out;
    color: #fff;
  }

  span {
    font-size: 16px;
  }

  i {
    opacity: 0.6;
    font-size: 20px;
    margin-right: 5px;
    margin-left: 1px;
  }

  .attuned-items-max {
    width: 24px;
  }

  input {
    display: none;
    font-size: 16px;
    font-family: var(--t5e-signika);
  }

  &.isGM input {
    display: inline;
  }

  &.isGM span.attuned-items-max {
    display: none;
  }
}

@keyframes attention {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.4);
  }
}
// Currency

.inventory-currency {
  .currency {
    display: flex;
    align-items: center;
    list-style: none;
  }

  .currency-header {
    flex: 0 0 13px;
    text-align: center;
    align-items: center;
    margin-right: 0.5rem;

    i {
      font-size: 20px;
    }
  }

  .currency-item {
    display: flex;
    align-items: center;
    background: var(--t5e-faint-color);
    border-radius: 5px;
    padding: 0 0.5rem 0 0;
    margin-right: 0.5rem;
    line-height: 30px;

    input {
      text-align: right;
      flex: 1;
      padding-left: 0.5rem;
    }

    label {
      margin-left: 0.25rem;
      flex: unset;
    }

    &.convert {
      margin-right: 0;
      padding: 0;
      flex: 0 0 1px;
      text-align: center;
      white-space: nowrap;
    }

    a {
      display: block;
      background: var(--t5e-tertiary-color);
      color: var(--t5e-background);
      border-radius: 5px;
      padding: 0 6px;

      &:hover {
        background: var(--t5e-secondary-color);
      }
    } // a

    .denomination {
      text-transform: uppercase;
    }
  } // .currency-item
} // .inventory-currency

// encumbrance
.encumbrance {
  margin-right: 14px;
  background: var(--t5e-light-color);
  border-radius: 5px;
  position: relative;
  // overflow: hidden;
  box-shadow: 0 0 0 1px var(--t5e-encumbrance-outline) inset;

  .encumbrance-bar {
    position: absolute;
    top: 1px;
    --count-font: rgba(0, 0, 0, 0.9);
    left: 1px;
    bottom: 1px;
    max-width: calc(100% - 2px);
    border: 1px solid var(--t5e-encumbrance-bar-outline);
    background: var(--t5e-encumbrance-bar);
    border-radius: 4px;
  }

  .encumbrance-label {
    display: block;
    position: relative;
    width: 100%;
    text-align: center;
    font-weight: 700;
    color: #eee;
    text-shadow: 0 0 2px #000;
  }

  .encumbrance-breakpoint {
    position: absolute;
    width: 0;
    height: 0;
    transform: translateX(-50%);
    border: 4px solid transparent;
  }

  .encumbrance-33 {
    left: calc(100% / 3);
  }

  .encumbrance-66 {
    left: calc((100% / 3) * 2);
  }

  .arrow-up {
    bottom: 0;
    border-bottom-color: var(--t5e-encumbrance-outline);
  }

  .arrow-down {
    top: 0;
    border-top-color: var(--t5e-encumbrance-outline);
  }
}
```

## Inventory grid stuff

```hbs
{{~#if ctx.attunement}}
  <i class="fas fa-sun icon-attuned {{item.attunement.cls}}" title="{{localize item.attunement.title}}"></i>
{{/if}}

{{#if item.flags.tidy5e-sheet.favorite}}
<i class="fas fa-bookmark icon-fav" title="{{localize 'TIDY5E.isFav'}}"></i>
{{/if}}

{{#if @root.owner}}
<a class="item-control item-edit" style="display:none" data-action="itemEdit" data-tooltip="DND5E.ItemEdit">
  <i class="fas fa-edit fa-fw"></i>
</a>
{{/if}}

<div class="item-name rollable" >
  <div class="item-image" style="background-image: url('{{item.img}}')">
    <i class="fa fa-dice-d20"></i>
  </div>
</div>
<div class="item-stats">

  <span class="item-quantity{{#if item.isStack}} isStack{{/if}}" title="{{localize 'DND5E.Quantity'}}">
    <input class="item-count" name="system.quantity" type="text" value="{{item.system.quantity}}" maxlength="2" >
  </span>

  <div class="item-detail item-uses" title="{{localize 'DND5E.Uses'}}: {{item.system.uses.value}}/{{item.system.uses.max}} ">
    {{#if item.hasUses }}
    <i class="fas fa-bolt"></i><input type="text" name="system.uses.value" value="{{item.system.uses.value}}" placeholder="0" maxlength="2" >
    {{/if}}
  </div>

</div>
```
