<script lang="ts">
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<div class="form-group split-group">
  <label for="{appId}-activation-value">{localize('DND5E.SpellCastTime')}</label
  >

  <div class="form-fields">
    <!-- Amount -->
    {#if context.system.activation.scalar}
      <div class="form-group label-top">
        <label for="{appId}-activation-value">
          {localize('DND5E.Amount')}
        </label>
        <div class="form-fields">
          <NumberInputQuadrone
            id="{appId}-activation-value"
            document={context.item}
            field="system.activation.value"
            value={context.source.activation.value}
            disabledValue={context.system.activation.value}
            placeholder="—"
            min="0"
            disabled={!context.unlocked}
          />
        </div>
      </div>
    {/if}

    <!-- Type -->
    <div class="form-group label-top">
      <label for="{appId}-activation-type">
        {localize('DND5E.Cost')}
      </label>
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-activation-type"
          document={context.item}
          field="system.activation.type"
          value={context.source.activation.type}
          disabledValue={context.system.activation.type}
          disabled={!context.unlocked}
        >
          <SelectOptions
            data={context.activationTypes}
            labelProp="label"
            valueProp="value"
          />
        </SelectQuadrone>
      </div>
    </div>
  </div>

  <!-- Condition -->
  <TextInputQuadrone
    id="{appId}-activation-condition"
    document={context.item}
    field="system.activation.condition"
    value={context.source.activation.condition}
    disabledValue={context.system.activation.condition}
    placeholder={localize('DND5E.ItemActivationCondition')}
    class="full-width"
    disabled={!context.unlocked}
  />
</div>
