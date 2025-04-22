<script lang="ts">
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  let localize = FoundryAdapter.localize;
</script>

<div class="form-group">
  <label for="{appId}-quantity">
    {localize('DND5E.Quantity')}
  </label>
  <div class="form-fields">
    <NumberInputQuadrone
      id="{appId}-quantity"
      value={context.source.quantity}
      field="system.quantity"
      document={context.item}
      step="1"
      min="0"
      disabled={!context.unlocked}
      selectOnFocus={true}
    />
  </div>
</div>
<div class="form-group">
  <label for="{appId}-weight-value">
    {localize('DND5E.Weight')}
  </label>
  <div class="form-fields">
    <NumberInputQuadrone
      id="{appId}-weight-value"
      value={context.source.weight.value}
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
      step="any"
      field="system.price.value"
      document={context.item}
      disabled={!context.unlocked}
      selectOnFocus={true}
      class="large-value"
    />
    <SelectQuadrone
      value={context.source.price.denomination}
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
