<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { mapSystemDamageTypesToSave } from 'src/utils/system-properties';
  import type { GroupableSelectOption } from 'src/types/types';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';

  interface Props {
    source: any;
    system: any;
    prefix: string;
    denominationOptions: GroupableSelectOption[];
    numberPlaceholder?: string;
    types?: { label: string; value: string; selected: boolean }[] | undefined;
  }

  let {
    source,
    system,
    prefix,
    denominationOptions,
    numberPlaceholder = '',
    types = undefined,
  }: Props = $props();

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);
  let idPrefix = $derived(`${appId}-${prefix.replaceAll('.', '-')}`);

  const localize = FoundryAdapter.localize;
</script>

<!-- Custom Formula -->
<div class="form-group split-group">
  <label for="{idPrefix}custom-enabled">Formula</label>
  <div class="form-fields">
    <CheckboxQuadrone
      id="{idPrefix}custom-enabled"
      document={context.item}
      field="{prefix}custom.enabled"
      checked={source.custom.enabled}
      disabledChecked={system.custom.enabled}
      disabled={!context.unlocked}
    />

    {#if source.custom.enabled}
      <TextInputQuadrone
        id="{idPrefix}custom-formula"
        document={context.item}
        field="{prefix}custom.formula"
        value={source.custom.formula}
        disabledValue={system.custom.formula}
        disabled={!context.unlocked}
      />
    {/if}
  </div>
</div>

<!-- Simple Input -->
{#if !source.custom.enabled}
  <div class="form-group split-group">
    <label for="{idPrefix}number"
      >{context.system.damage.heal
        ? localize('DND5E.HEAL.Title')
        : localize('DND5E.DAMAGE.Title')}</label
    >
    <div class="form-fields">
      <div class="form-group label-top">
        <label for="{idPrefix}number">{localize('DND5E.Number')}</label>
        <div class="form-fields">
          <!-- Number -->
          <NumberInputQuadrone
            id="{idPrefix}number"
            document={context.item}
            field="{prefix}number"
            value={source.number}
            disabledValue={system.number}
            placeholder={numberPlaceholder}
            min="0"
            step="1"
            disabled={!context.unlocked}
          />
        </div>
      </div>

      <!-- Die -->
      <div class="form-group label-top">
        <label for="{idPrefix}denomination">{localize('DND5E.Die')}</label>
        <div class="form-fields">
          <SelectQuadrone
            id="{idPrefix}denomination"
            document={context.item}
            field="{prefix}denomination"
            value={source.denomination}
            disabledValue={system.denomination}
            blankValue=""
            disabled={!context.unlocked}
          >
            <SelectOptions
              data={denominationOptions}
              labelProp="label"
              valueProp="value"
            />
          </SelectQuadrone>
        </div>
      </div>

      <!-- Bonus -->
      <div class="form-group label-top">
        <label for="{idPrefix}bonus">
          {localize('DND5E.Bonus')}
        </label>
        <div class="form-fields">
          <TextInputQuadrone
            id="{idPrefix}bonus"
            document={context.item}
            field="{prefix}bonus"
            value={source.bonus}
            disabledValue={system.bonus}
            disabled={!context.unlocked}
          />
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Types -->
{#if types}
  <div class="form-group stacked damage-types checkbox-grid">
    <label for="">{localize('DND5E.Type')}</label>
    <div class="form-fields">
      {#each types as { value, label, selected } (value)}
        <label for="" class="checkbox">
          <CheckboxQuadrone
            id="{idPrefix}types-{value?.slugify()}"
            document={context.item}
            field="{prefix}types"
            checked={selected}
            {value}
            disabledChecked={system.types.has(value)}
            disabled={!context.unlocked}
            onDataPreparing={(ev) =>
              mapSystemDamageTypesToSave(context, prefix, source, ev)}
          />
          {label}
        </label>
      {/each}
    </div>
  </div>
{/if}
