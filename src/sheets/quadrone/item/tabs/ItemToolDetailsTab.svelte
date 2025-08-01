<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import QuantityWeightPriceFormGroups from '../parts/QuantityWeightPriceFormGroups.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let appId = $derived(context.document.id);
</script>

<fieldset>
  <QuantityWeightPriceFormGroups />
</fieldset>

<!-- Tool Type -->
<div class="form-group">
  <label for="{appId}-type-value">{localize('DND5E.ItemToolType')}</label>
  <div class="form-fields">
    <SelectQuadrone
      id="{appId}-type-value"
      document={context.item}
      field="system.type.value"
      value={context.source.type.value}
      disabled={!context.unlocked}
    >
      <SelectOptions data={context.config.toolTypes} blank="" />
    </SelectQuadrone>
  </div>
</div>

<!-- Base Tool -->
{#if Object.keys(context.baseItems).length}
  <div class="form-group">
    <label for="{appId}-type-baseItem">{localize('DND5E.ItemToolBase')}</label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-type-baseItem"
        document={context.item}
        field="system.type.baseItem"
        value={context.source.type.baseItem}
        disabled={!context.unlocked}
      >
        <SelectOptions data={context.baseItems} blank="" />
      </SelectQuadrone>
    </div>
  </div>
{/if}

<!-- Tool Properties -->
<div class="form-group stacked tool-properties checkbox-grid">
  <label for="">{localize('DND5E.ItemToolProperties')}</label>
  <div class="form-fields">
    <ItemProperties />
  </div>
</div>

<!-- Ability Check -->
<div class="form-group">
  <label for="{appId}-proficient">{localize('DND5E.ActionAbil')}</label>
  <div class="form-fields">
    <!-- Proficiency -->
    <div class="form-group label-top">
      <label for="{appId}-proficient">{localize('DND5E.Proficiency')}</label>
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-proficient"
          document={context.item}
          field="system.proficient"
          value={context.source.proficient}
          disabled={!context.unlocked}
        >
          <SelectOptions
            data={context.config.proficiencyLevels}
            blank={localize('DND5E.Automatic')}
          />
        </SelectQuadrone>
      </div>
    </div>

    <!-- Ability -->
    <div class="form-group label-top">
      <label for="{appId}-ability">{localize('DND5E.Ability')}</label>
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-ability"
          document={context.item}
          field="system.ability"
          value={context.source.ability}
          disabled={!context.unlocked}
        >
          <SelectOptions
            data={context.config.abilities}
            labelProp="label"
            blank={localize('DND5E.Default')}
          />
        </SelectQuadrone>
      </div>
    </div>
  </div>
</div>

<!-- Tool Bonus -->
<div class="form-group">
  <label for="{appId}-bonus">{localize('DND5E.ItemToolBonus')}</label>
  <div class="form-fields">
    <TextInputQuadrone
      id={`${appId}-system-bonus`}
      document={context.item}
      field="system.bonus"
      value={context.source.bonus}
      disabled={!context.unlocked}
    />
  </div>
</div>

<!-- Attunement -->
{#if context.properties.object.mgc}
  <div class="form-group">
    <label for="{appId}-attunement">{localize('DND5E.Attunement')}</label>
    <div class="form-fields">
      <!-- Attuned -->
      <label class="checkbox" for="{appId}-attuned">
        <CheckboxQuadrone
          id={`${appId}-system-attuned`}
          document={context.item}
          field="system.attuned"
          checked={context.source.attuned}
          disabledChecked={context.system.attuned}
          disabled={!context.unlocked ||
            !context.config.attunementTypes[context.source.attunement]}
          title={localize('DND5E.Attuned')}
        />
      </label>

      <!-- Attunement -->
      <SelectQuadrone
        id="{appId}-attunement"
        document={context.item}
        field="system.attunement"
        value={context.source.attunement}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.attunementTypes}
          blank={localize('DND5E.AttunementNone')}
        />
      </SelectQuadrone>
    </div>
  </div>
{/if}

<FieldUses />
