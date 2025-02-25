<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import SectionsFormGroup from '../parts/SectionsFormGroup.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <div class="form-group">
    <label for="{appId}-weight-value">
      {localize('DND5E.Weight')}
    </label>
    <div class="form-fields">
      <NumberInputQuadrone
        id="{appId}-weight-value"
        value={context.source.weight.value}
        disabledValue={context.system.weight.value}
        step="any"
        field="system.weight.value"
        document={context.item}
        disabled={!context.unlocked}
        selectOnFocus={true}
      />
      <SelectQuadrone
        document={context.item}
        field="system.weight.units"
        value={context.source.weight.units}
        disabledValue={context.system.weight.units}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.weightUnits}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    </div>
  </div>
  <div class="form-group">
    <label for="{appId}-price-value">
      {localize('DND5E.Price')}
    </label>
    <div class="form-fields">
      <NumberInputQuadrone
        id="{appId}-price-value"
        value={context.source.price.value}
        disabledValue={context.system.price.value}
        step="any"
        field="system.price.value"
        document={context.item}
        disabled={!context.unlocked}
        selectOnFocus={true}
        class="large-value"
      />
      <SelectQuadrone
        value={context.source.price.denomination}
        disabledValue={context.system.price.denomination}
        field="system.price.denomination"
        document={context.item}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.currencies}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    </div>
  </div>
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.ItemLootDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Loot Type -->
  <div class="form-group">
    <label for="{appId}-type-value">{localize('DND5E.ItemLootType')}</label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-type-value"
        document={context.item}
        field="system.type.value"
        value={context.source.type.value}
        disabledValue={context.system.type.value}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.lootTypes}
          labelProp="label"
          blank=""
        />
      </SelectQuadrone>
    </div>
  </div>

  <!-- Loot Subtype -->
  {#if context.itemSubtypes}
    {@const subtypeLabel = localize('DND5E.ItemLootSubtype', {
      category:
        // @ts-expect-error
        context.config.lootTypes[context.system.type.value]?.label ?? '',
    })}
    <div class="form-group">
      <label for="{appId}-type-subtype">{subtypeLabel}</label>
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-type-subtype"
          document={context.item}
          field="system.type.subtype"
          value={context.source.type.subtype}
          disabledValue={context.system.type.subtype}
          disabled={!context.unlocked}
          blankValue=""
        >
          <SelectOptions data={context.itemSubtypes} blank="" />
        </SelectQuadrone>
      </div>
    </div>
  {/if}

  <!-- Loot Properties -->
  <div class="form-group stacked loot-properties checkbox-grid">
    <label for="">{localize('DND5E.ItemLootProperties')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>
</fieldset>

<SectionsFormGroup />
