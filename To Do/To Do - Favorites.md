## Top of Mind - Inventory

- [ ] Fix inventory truncation. Review how Tidy 5e does it. It looks good.
- [ ] Make it so you can specify what columns to include, with the default being all columns.
- [ ] Allow specifying column labels
- [ ] Use that when rendering the inventory, and only include
    - Primary column
    - charges
    - usage
    - with Item Summary
    - middle click to edit
    - context menu


## To Do

- [x] Put the favorites toggle on
  - [x] Features
  - [x] Spellbook List
  - [x] Inventory List
- [x] Ensure correct visuals
  - [x] Features
  - [x] Spellbook List
  - [x] Spellbook Grid
  - [x] Inventory List
  - [x] Inventory Grid
- [ ] Implement Favorites View on Attributes Tab - See [dedicated to-do list](#implement-favorites-view-on-attributes-tab)
- [ ] Confirm context menu works as expected
- [ ] Settings
  - [ ] enableActionListOnFavoritePanel
  - [ ] enableSortFavoritesItemsAlphabetically

## Implement Favorites View on Attributes tab

- [x] Bring all row colorization styles like innate, at-will, equipped, etc., into the ItemTableRow component. Allow it to decide based on item data.
- [ ] collect and group all items
- [ ] create a whitelist of known favorite groupings
- [ ] group by the known groupings and put the ungrouped favorites into a special unsorted group
  - [ ] inventory
  - [ ] features
  - [ ] spells by preparation mode
    - [ ] map known prep modes to friendly names
  - [ ] spells by level (excluding any spells in prep mode)
    - [ ] Ensure these spell levels are not hardcoded; dynamically determine this
  - [ ]
- [ ] Apply game setting sort option if relevant and use locale comparison
- [ ] visualize
  - [ ] inventory favorites
  - [ ] feature favorites
  - [ ] spell favorites by preparation mode
  - [ ] spell favorites by level
  - [ ] unsorted

## Stretch

- [ ] create an API hook for adding new favorite groupings
- [ ] Use the API / hooks to add the actions favorites, based on the legacy setting
- [ ] Install the actions module and favorite some of the actions as an exercise to show that they feed into favorites accordingly

## Favorites single item template impl

```hbs
<li
	class="item fav-item {{#if item.isMagic}} magic-item{{/if}} {{#if item.system.equipped}} equipped{{/if}} {{#if item.system.preparation.prepared}} prepared{{/if}} {{#if item.alwaysPrep}} alwaysprepared{{/if}} {{ item.attunement.cls }}"
	data-item-id="{{item._id}}"
	{{#if item.canPrep}}title="{{item.toggleTitle}}"{{/if}}>
	<div class="item-name rollable">
		<div class="item-image" style="background-image: url('{{item.img}}')">
			<i class="fa fa-dice-d20"></i>
		</div>
		<h4>{{item.name}}</h4>
		{{#if item.system.properties.amm}}
		<span class="ammo" data-id="{{item._id}}"></span>
		{{/if}}
		{{#if item.system.quantity}}
		<span class="item-quantity{{#if item.isStack}} isStack{{/if}}">
			(<input class="item-count" name="system.quantity" type="text" value="{{item.system.quantity}}" maxlength="3" {{#if item.editable}}{{else}}disabled{{/if}}>)
		</span>
		{{/if}}
	</div>

	{{#if item.canAttune}}
	<div class="item-state-icon {{item.attunement.cls}}" title="{{localize item.attunement.title}}">
		{{#if (eq item.system.attunement 2) }}
			<i class="item-state-icon fas fa-sun"></i>
		{{else}}
			<i class="item-state-icon fas fa-sun not-attuned"></i>
		{{/if}}
	</div>
	{{/if}}
	{{#if item.isItem}}
	<div class="item-detail item-uses" title="{{localize 'DND5E.Uses'}}">
		{{#if item.system.uses.max}}
		<input class="uses-value" type="text" name="system.uses.value"  value="{{item.system.uses.value}}" {{#if item.editable}}{{else}}disabled{{/if}}> /
		<input class="uses-max" type="text" name="system.uses.max" value="{{item.system.uses.max}}" {{#if item.editable}}{{else}}disabled{{/if}}>
		{{else}}
			{{#if item.editable}}
			<a class="addCharges" value="Add">{{localize "DND5E.Add"}}</a>
			{{/if}}
		{{/if}}
	</div>
	{{/if}} {{#if item.isFeat}}
	<div class="item-detail item-charges" title="{{localize 'DND5E.Charges'}}">
		{{#if item.isOnCooldown}}
			<a class="item-recharge rollable" title="{{item.labels.recharge}}">
				<i class="fas fa-dice-six"></i>
				{{item.system.recharge.value}}{{#if (ne item.system.recharge.value 6)}}+{{/if}}
			</a>
		{{else if item.system.recharge.value}}
			<i class="fas fa-bolt" title="{{localize 'DND5E.Charged'}}"></i>
		{{else if item.system.uses.max}}
			<input class="uses-value" type="text" name="system.uses.value" value="{{item.system.uses.value}}" {{#if item.editable}}{{else}}disabled{{/if}}> /
			<input class="uses-max" type="text" value="{{item.system.uses.max}}" {{#if item.editable}}{{else}}disabled{{/if}}> {{else}} {{#if item.editable}}
			<a class="addCharges" value="Add">{{localize "DND5E.Add"}}</a>
		{{/if}} {{/if}}
	</div>
	{{/if}} {{#if item.spellComps}}
	<div class="item-detail spell-comps" title="{{localize 'DND5E.SpellComponents'}}">
		{{item.spellComps}} {{#if item.spellCon}}
		<span class="spell-component C">C</span>
		{{/if}} {{#if item.spellRit}}
		<span class="spell-component R">R</span>
		{{/if}}
	</div>
	{{/if}}

	<div class="item-detail item-action">
		{{#each item.favLabels as |label id|}}
		<span title="{{localize 'DND5E.Usage'}}: {{label}}">{{label}}</span>
		{{/each}}
	</div>

	{{#if @root.owner}}
	<div class="item-controls flexrow" style="display:none">
	  {{#unless section.editableName}}
	  <a class="item-control item-edit" data-action="itemEdit" data-tooltip="DND5E.ItemEdit">
		  <i class="fas fa-edit fa-fw"></i>
	  </a>
	  {{/unless}}
	</div>
	{{/if}}
</li>

```

## Favorites template impl

```hbs
<div class="favorites list-layout">
	<div class="tidy5e-sheet">
	<ul class="inventory-list items-list inventory-favorites-list">
		{{#if favItems}}
		<li class="items-header">
			<h3>{{localize 'DND5E.Inventory'}}</h3>
			<div class="items-header-labels">
				<div class="items-header-charge" title="{{localize 'DND5E.Charges'}}"><i class="fas fa-bolt"></i></div>
				<div class="items-header-usage">{{localize 'DND5E.Usage'}}</div>
			</div>
		</li>
		<ul class="item-list">
			{{#each favItems as |item id|}} {{> "modules/tidy5e-sheet/templates/favorites/tidy5e-favorite-item.html" item=item}} {{/each}}
		</ul>
		{{/if}} {{#if favFeats}}
		<li class="items-header">
			<h3>{{localize 'DND5E.Features'}}</h3>
			<div class="items-header-labels">
				<div class="items-header-uses">{{localize 'DND5E.Uses'}}</div>
				<div class="items-header-usage">{{localize 'DND5E.Usage'}}</div>
			</div>
		</li>
		<ul class="item-list">
			{{#each favFeats as |feat lvl|}} {{> "modules/tidy5e-sheet/templates/favorites/tidy5e-favorite-item.html" item=feat}} {{/each}}
		</ul>
		{{/if}} {{#if favSpellsPrepMode}} {{#each favSpellsPrepMode as |section lvl|}} {{#if section.spells}} {{#if lvl}}
		<li class="items-header spellbook-header">
			<div class="spell-level-slots">
				<h3>
					{{#if section.isAlways}}{{localize 'DND5E.SpellPrepAlways'}} {{else if section.isAtWill}}{{localize 'DND5E.SpellPrepAtWill'}} {{else if section.isInnate}}{{localize 'DND5E.SpellPrepInnate'}} {{else if
					section.isPact}}{{localize 'DND5E.SpellProgPact'}} {{/if}}
				</h3>
				{{#if section.isPact}}
				<span class="spell-detail spell-slots">
					<input type="text" data-target="data.spells.spell{{lvl}}.value" value="{{section.value}}" placeholder="0" />
					/
					<input class="spell-max" type="text" data-target="data.spells.spell{{lvl}}.override" value="{{section.max}}" placeholder="0" />
				</span>
				{{else}}
				<!-- <span class="spell-slots">
                &ndash; / &ndash;
              </span> -->
				{{/if}}
			</div>
		</li>
		{{/if}}
		<ul class="item-list">
			{{#each section.spells as |spell id|}} {{> "modules/tidy5e-sheet/templates/favorites/tidy5e-favorite-item.html" item=spell}} {{/each}}
		</ul>
		{{/if}} {{/each}} {{/if}} {{#if favSpells}} {{#each favSpells as |section lvl|}} {{#if section.spells}} {{#if lvl}}
		<li class="items-header spellbook-header">
			<div class="spell-level-slots">
				<h3>
					{{#if section.isCantrip}}{{localize 'DND5E.SpellCantrip'}} {{else if section.isAlways}}{{localize 'DND5E.SpellPrepAlways'}} {{else if section.isAtWill}}{{localize 'DND5E.SpellPrepAtWill'}} {{else if
					section.isInnate}}{{localize 'DND5E.SpellPrepInnate'}} {{else if section.isPact}}{{localize 'DND5E.SpellProgPact'}} {{else}}{{localize 'DND5E.SpellLevel'}} {{lvl}}{{/if}}
				</h3>
				{{#if section.isCantrip}} {{else}}
				<span class="spell-detail spell-slots">
					<input type="text" data-target="data.spells.spell{{lvl}}.value" value="{{section.value}}" placeholder="0" data-dtype="Number" />
					<span class="sep">/</span>
					<input class="spell-max" type="text" data-target="data.spells.spell{{lvl}}.override" value="{{section.max}}" placeholder="0" data-dtype="Number" />
				</span>
				{{/if}}
			</div>
			<div class="items-header-labels">
				<div class="items-header-comps">{{localize 'TIDY5E.Components'}}</div>
				<div class="items-header-usage">{{localize 'DND5E.SpellUsage'}}</div>
			</div>
		</li>
		{{/if}}
		<ul class="item-list">
			{{#each section.spells as |spell id|}} {{> "modules/tidy5e-sheet/templates/favorites/tidy5e-favorite-item.html" item=spell}} {{/each}}
		</ul>
		{{/if}} {{/each}} {{/if}}
	</ul>
	</div>
</div>

```
