<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemLootDetails')}
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
        disabled={!context.editable}
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
          disabled={!context.editable}
          blankValue=""
        >
          <SelectOptions data={context.itemSubtypes} blank="" />
        </SelectQuadrone>
      </div>
    </div>
  {/if}

  <!-- Loot Properties -->
  <div class="form-group stacked loot-properties">
    <label for="">{localize('DND5E.ItemLootProperties')}</label>
    <ItemProperties />
  </div>
</fieldset>
