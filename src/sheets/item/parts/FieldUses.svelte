<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import { CONSTANTS } from 'src/constants';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.Usage')}</h3>

<!-- Uses -->
<ItemFormGroup cssClass="split-group">
  <label for="">{localize('DND5E.LimitedUses')}</label>
  <div class="form-fields">
    <!-- Spent  -->
    <div class="form-group label-top">
      <label for="{appId}-uses-spent">{localize('DND5E.Spent')}</label>
      <NumberInput
        id="{appId}-uses-spent"
        document={$context.item}
        field="system.uses.spent"
        value={$context.system.uses.spent}
      />
    </div>

    <!-- Max -->
    <div class="form-group label-top">
      <label for="{appId}-uses-max">{localize('DND5E.Max')}</label>
      <TextInput
        id="{appId}-uses-max"
        document={$context.item}
        field="system.uses.max"
        value={$context.system.uses.max}
      />
    </div>
  </div>
</ItemFormGroup>

<!-- Auto-Destroy -->
{#if $context.system.uses.autoDestroy}
  <ItemFormGroup
    labelText={localize('DND5E.CONSUMABLE.FIELDS.uses.autoDestroy.label')}
  >
    <Checkbox
      id="{appId}-uses-autoDestroy"
      document={$context.item}
      field="system.uses.autoDestroy"
      checked={$context.system.uses.autoDestroy}
    />
    <p class="hint">
      {localize('DND5E.CONSUMABLE.FIELDS.uses.autoDestroy.hint')}
    </p>
  </ItemFormGroup>
{/if}

{#if $context.item.hasLimitedUses}
  <h3 class="form-header">
    <span>
      {localize('DND5E.Recovery')}
    </span>
    <button
      type="button"
      class="inline-icon-button create-recovery-button"
      data-tooltip="DND5E.USES.Recovery.Action.Create"
      aria-label={localize('DND5E.USES.Recovery.Action.Create')}
      on:click={() => $context.item.sheet.addRecovery()}
    >
      <i class="fas fa-plus"></i>
    </button>
  </h3>

  {#each $context.usesRecovery as recovery, index}
    <ItemFormGroup
      cssClass="split-group full-width card"
      attributes={{ ['data-index']: index }}
    >
      <div class="form-fields">
        <!-- Period -->
        <div class="form-group label-top">
          <label for="{appId}-uses-recovery-{index}-period">
            {localize('DND5E.USES.FIELDS.uses.recovery.FIELDS.period.label')}
          </label>
          <select
            id="{appId}-uses-recovery-{index}-period"
            data-tidy-field="system.uses.recovery.{index}.period"
            value={recovery.data.period}
            on:change={(ev) =>
              $context.item.sheet.updateRecovery(
                index,
                'period',
                ev.currentTarget.value,
              )}
          >
            <SelectOptions
              data={$context.recoveryPeriods}
              labelProp="label"
              valueProp="value"
            />
          </select>
        </div>

        <!-- Type -->
        {#if recovery.data.period !== 'recharge'}
          <div class="form-group label-top">
            <label for="">
              {localize('DND5E.USES.FIELDS.uses.recovery.FIELDS.type.label')}
            </label>
            <select
              id="{appId}-uses-recovery-{index}-type"
              data-tidy-field="system.uses.recovery.{index}.type"
              value={recovery.data.type}
              on:change={(ev) =>
                $context.item.sheet.updateRecovery(
                  index,
                  'type',
                  ev.currentTarget.value,
                )}
            >
              <SelectOptions
                data={$context.recoveryTypes}
                labelProp="label"
                valueProp="value"
              />
            </select>
          </div>
        {/if}

        <!-- Formula -->
        {#if recovery.data.type === 'formula' || recovery.formulaOptions}
          <div class="form-group label-top">
            <label for="{appId}-uses-recovery-{index}-formula">
              {localize('DND5E.USES.FIELDS.uses.recovery.FIELDS.formula.label')}
            </label>
            {#if recovery.formulaOptions}
              <select
                id="{appId}-uses-recovery-{index}-formula"
                data-tidy-field="system.uses.recovery.{index}.formula"
                on:change={(ev) =>
                  $context.item.sheet.updateRecovery(
                    index,
                    'formula',
                    ev.currentTarget.value,
                  )}
                value={recovery.data.formula}
              >
                <SelectOptions
                  data={recovery.formulaOptions}
                  labelProp="label"
                  valueProp="value"
                />
              </select>
            {:else if recovery.data.type === 'formula'}
              <input
                type="text"
                id="{appId}-uses-recovery-{index}-formula"
                data-tidy-field="system.uses.recovery.{index}.formula"
                on:change={(ev) =>
                  $context.item.sheet.updateRecovery(
                    index,
                    'formula',
                    ev.currentTarget.value,
                  )}
              />
            {/if}
          </div>
        {/if}

        <button
          type="button"
          class="inline-icon-button align-self-stretch"
          data-action="deleteRecovery"
          title={localize('DND5E.USES.Recovery.Action.Delete')}
          aria-label={localize('DND5E.USES.Recovery.Action.Delete')}
          on:click={() => $context.item.sheet.deleteRecovery(index)}
        >
          <i class="fas fa-minus"></i>
        </button>
      </div>
    </ItemFormGroup>
  {:else}
    <div class="empty">{localize('DND5E.UsesPeriods.Never')}</div>
  {/each}
{/if}
