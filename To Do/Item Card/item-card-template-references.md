## info-card locations

### tidy5e-features.html

```hbs
<!--
    Line 152 :
    inside the section loop, inside the item loop,
    so one of these per item
-->
<div class="info-card {{~#if (or item.flags.magicitems.enabled item.system.properties.mgc)}} magic-item {{/if}} {{item.attunement.cls}} {{~#if item.system.equipped}} equipped {{/if}}" data-item-id="{{item._id}}">
    <p class="info-card-name">{{item.name}}</p>
    {{#if item.hasUses }}
    <div class="info-card-amount">
    <span><i class="fas fa-bolt"></i><b>{{localize 'DND5E.Charges'}}:</b> {{item.system.uses.value}}/{{item.system.uses.max}}</span>
    </div>
    {{/if}}
    <div class="description-wrap">
    <div class="info-card-description">
        <!-- item description -->
    </div>
    </div>
    <article class="mod-roll-buttons"></article>
</div>
```

### tidy5e-inventory-grid.html

```hbs
<div class="info-card {{~#if (or item.flags.magicitems.enabled item.system.properties.mgc)}} magic-item {{/if}} {{item.attunement.cls}} {{~#if item.system.equipped}} equipped {{/if}}" data-item-id="{{item._id}}" data-item-index="{{item._id}}" >
    <p class="info-card-name">{{item.name}}</p>
    {{#if item.system.properties.amm}}
        <span class="ammo" data-id="{{item._id}}"></span>
    {{/if}}
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
        <span class="info-weight"><b>{{localize 'DND5E.Weight'}}:</b> {{ item.system.weight }} {{ @root.weightUnit }}</span>
        <span class="info-quantity"><b>{{localize 'DND5E.Quantity'}}:</b> {{item.system.quantity}}</span>
    </div>
    <div class="description-wrap">
        <div class="info-card-description">
        <!-- item description -->
        </div>
    </div>
    <article class="mod-roll-buttons"></article>
</div>
```

### tidy5e-inventory.html

```hbs
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
```

### tidy5e-npc-spellbook.html

```hbs
<div class="info-card {{~#if item.system.preparation.prepared}} equipped {{/if}} {{#if (eq item.system.preparation.mode 'always')}} alwaysprepared{{/if}} {{#if (eq item.system.preparation.mode 'pact')}} pact{{/if}} {{#if (eq item.system.preparation.mode 'atwill')}} atwill{{/if}} {{#if (eq item.system.preparation.mode 'innate')}} innate{{/if}}" data-item-id="{{item._id}}">
    <p class="info-card-name">{{item.name}}</p>
    <div class="info-card-states">
        <!-- <span>{{item.labels.school}}</span> -->
        <!-- <span><i class="fas fa-hat-wizard"></i><b>{{localize 'DND5E.SpellSchool'}}:</b>{{item.labels.school}}</span>  -->
        {{#if @root.owner}}
        {{#if section.canPrepare}}
        <span>{{ctx.toggleTitle}}</span>
        {{/if}}
        {{/if}}
    </div>
    <div class="info-card-amount">
        {{#if item.hasUses }}
        <span><i class="fas fa-bolt"></i><b>{{localize 'DND5E.Charges'}}:</b> {{item.system.uses.value}}/{{item.system.uses.max}}</span>
        {{/if}}
    </div>
    <div class="description-wrap">
        <div class="info-card-description">
        <!-- item description -->
        </div>
    </div>
    <article class="mod-roll-buttons"></article>
</div>
```

### tidy5e-spellbook-grid.html

```hbs
<div class="info-card {{~#if item.system.preparation.prepared}} equipped {{/if}} {{#if (eq item.system.preparation.mode 'always')}} alwaysprepared{{/if}} {{#if (eq item.system.preparation.mode 'pact')}} pact{{/if}} {{#if (eq item.system.preparation.mode 'atwill')}} atwill{{/if}} {{#if (eq item.system.preparation.mode 'innate')}} innate{{/if}}" data-item-id="{{item._id}}">
    <p class="info-card-name">{{item.name}}</p>
    <div class="info-card-states">
        <span>{{labels.school}}</span>
        <!-- 
        <span>
        <i class="fas fa-hat-wizard"></i>
        <b>{{localize 'DND5E.SpellSchool'}}:</b> {{item.labels.school}}
        </span> 
        -->
        {{#if @root.owner}}
        {{#if section.canPrepare}}
        <span>{{ctx.toggleTitle}}</span>
        {{/if}}
        {{/if}}
    </div>
    <div class="info-card-amount">
        {{#if item.hasUses }}
        <span><i class="fas fa-bolt"></i><b>{{localize 'DND5E.Charges'}}:</b> {{item.system.uses.value}}/{{item.system.uses.max}}</span>
        {{/if}}
    </div>
    <div class="description-wrap">
        <div class="info-card-description">
        <!-- item description -->
        </div>
    </div>
    <article class="mod-roll-buttons"></article>
</div>
```

### tidy5e-spellbook.html

```hbs
<div class="info-card {{~#if item.system.preparation.prepared}} equipped {{/if}} {{#if (eq item.system.preparation.mode 'always')}} alwaysprepared{{/if}} {{#if (eq item.system.preparation.mode 'pact')}} pact{{/if}} {{#if (eq item.system.preparation.mode 'atwill')}} atwill{{/if}} {{#if (eq item.system.preparation.mode 'innate')}} innate{{/if}}" data-item-id="{{item._id}}">
    <p class="info-card-name">{{item.name}}</p>
    <div class="info-card-states">
        <!-- <i class="fas fa-hat-wizard"></i><b>{{localize 'DND5E.SpellSchool'}}:</b>  -->
        <span>{{item.labels.school}}</span>
        {{#if @root.owner}}
        {{#if section.canPrepare}}
        <span>{{ctx.toggleTitle}}</span>
        {{/if}}
        {{/if}}
    </div>
    <div class="info-card-amount">
        {{#if item.hasUses }}
        <span><i class="fas fa-bolt"></i><b>{{localize 'DND5E.Charges'}}:</b> {{item.system.uses.value}}/{{item.system.uses.max}}</span>
        {{/if}}
    </div>
    <div class="description-wrap">
        <div class="info-card-description">
        <!-- item description -->
        </div>
    </div>
    <article class="mod-roll-buttons"></article>
</div>
```