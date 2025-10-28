<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import QuantityWeightPriceFormGroups from '../parts/QuantityWeightPriceFormGroups.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset disabled={!context.unlocked}>
  <QuantityWeightPriceFormGroups />
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.ItemLootDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Loot Type -->
  <FormGroup
    label="DND5E.ItemLootType"
    labelFor="{appId}-type-value"
    document={context.document}
    field={context.fields.type.fields.value}
    config={{
      id: `${appId}-type-value`,
      value: context.source.type.value,
    }}
    choices={context.config.lootTypes}
  />

  <!-- Loot Subtype -->
  {#if context.itemSubtypes}
    {@const subtypeLabel = localize('DND5E.ItemLootSubtype', {
      category:
        context.config.lootTypes[context.system.type.value]?.label ?? '',
    })}

    <FormGroup
      label={subtypeLabel}
      labelFor="{appId}-type-subtype"
      document={context.document}
      field={context.fields.type.fields.subtype}
      config={{
        id: `${appId}-type-subtype`,
        value: context.source.type.subtype,
      }}
      choices={context.itemSubtypes}
    />
  {/if}

  <!-- Loot Properties -->
  <div class="form-group stacked loot-properties checkbox-grid">
    <label for="">{localize('DND5E.ItemLootProperties')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>
</fieldset>
