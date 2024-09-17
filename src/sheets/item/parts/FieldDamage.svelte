<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { mapSystemDamageTypesToSave } from 'src/utils/system-properties';
  import type { GroupableSelectOption } from 'src/types/types';

  export let source: any;
  export let prefix: string;
  export let denominationOptions: GroupableSelectOption[];
  export let numberPlaceholder: string = '';
  export let types:
    | { label: string; value: string; selected: boolean }[]
    | undefined = undefined;

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;
  $: idPrefix = `${appId}-${prefix.replaceAll('.', '-')}`;

  const localize = FoundryAdapter.localize;
</script>

<!-- Custom Formula -->
<div class="form-group split-group">
  <label for="{idPrefix}custom-enabled">Formula</label>
  <div class="form-fields">
    <Checkbox
      id="{idPrefix}custom-enabled"
      document={$context.item}
      field="{prefix}custom.enabled"
      checked={source.custom.enabled}
    />

    {#if source.custom.enabled}
      <TextInput
        id="{idPrefix}custom-formula"
        document={$context.item}
        field="{prefix}custom.formula"
        value={source.custom.formula}
      />
    {/if}
  </div>
</div>

<!-- Simple Input -->
{#if !source.custom.enabled}
  <div class="form-group split-group">
    <label for="{idPrefix}number"
      >{$context.system.damage.heal
        ? localize('DND5E.HEAL.Title')
        : localize('DND5E.DAMAGE.Title')}</label
    >
    <div class="form-fields">
      <div class="form-group label-top">
        <label for="{idPrefix}number">{localize('DND5E.Number')}</label>
        <!-- Number -->
        <NumberInput
          id="{idPrefix}number"
          document={$context.item}
          field="{prefix}number"
          value={source.number}
          placeholder={numberPlaceholder}
          min="0"
          step="1"
        />
      </div>

      <!-- Die -->
      <div class="form-group label-top">
        <label for="{idPrefix}denomination">{localize('DND5E.Die')}</label>
        <Select
          id="{idPrefix}denomination"
          document={$context.item}
          field="{prefix}denomination"
          value={source.denomination}
          blankValue=""
        >
          <SelectOptions
            data={denominationOptions}
            labelProp="label"
            valueProp="value"
          />
        </Select>
      </div>

      <!-- Bonus -->
      <div class="form-group label-top">
        <label for="{idPrefix}bonus">
          {localize('DND5E.Bonus')}
        </label>
        <TextInput
          id="{idPrefix}bonus"
          document={$context.item}
          field="{prefix}bonus"
          value={source.bonus}
        />
      </div>
    </div>
  </div>
{/if}

<!-- Types -->
{#if types}
  <div class="form-group stacked damage-types">
    <label for="">{localize('DND5E.Type')}</label>
    {#each types as { value, label, selected } (value)}
      <Checkbox
        labelCssClass="checkbox"
        document={$context.item}
        field="{prefix}types"
        checked={selected}
        {value}
        disabled={!$context.editable}
        onDataPreparing={(ev) =>
          mapSystemDamageTypesToSave($context, prefix, source, ev)}
      >
        {label}
      </Checkbox>
    {/each}
  </div>
{/if}
