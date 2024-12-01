<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.document.id;

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.Usage')}</h3>

<!-- Uses -->
<div class="form-group split-group">
  <label for="{appId}-uses-spent">{localize('DND5E.LimitedUses')}</label>
  <div class="form-fields">
    <!-- Spent  -->
    <div class="form-group label-top">
      <label for="{appId}-uses-spent">{localize('DND5E.Spent')}</label>
      <NumberInput
        id="{appId}-uses-spent"
        document={$context.item}
        field="system.uses.spent"
        value={$context.source.uses.spent}
        disabled={!$context.editable}
      />
    </div>

    <!-- Max -->
    <div class="form-group label-top">
      <label for="{appId}-uses-max">{localize('DND5E.Max')}</label>
      <TextInput
        id="{appId}-uses-max"
        document={$context.item}
        field="system.uses.max"
        value={$context.source.uses.max}
        disabled={!$context.editable}
      />
    </div>
  </div>
</div>

<!-- Auto-Destroy -->
{#if $context.system.uses.autoDestroy}
  <div class="form-group">
    <label for="{appId}-uses-autoDestroy"
      >{localize('DND5E.CONSUMABLE.FIELDS.uses.autoDestroy.label')}</label
    >
    <Checkbox
      id="{appId}-uses-autoDestroy"
      document={$context.item}
      field="system.uses.autoDestroy"
      checked={$context.source.uses.autoDestroy}
      disabled={!$context.editable}
    />
    <p class="hint">
      {localize('DND5E.CONSUMABLE.FIELDS.uses.autoDestroy.hint')}
    </p>
  </div>
{/if}

{#if $context.item.hasLimitedUses}
  <h3 class="form-header">
    <span>
      {localize('DND5E.Recovery')}
    </span>
    {#if $context.editable}
      <button
        type="button"
        class="inline-icon-button create-recovery-button"
        data-tooltip="DND5E.USES.Recovery.Action.Create"
        aria-label={localize('DND5E.USES.Recovery.Action.Create')}
        on:click={() => $context.item.sheet.addRecovery()}
        tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      >
        <i class="fas fa-plus"></i>
      </button>
    {/if}
  </h3>

  {#each $context.usesRecovery as recovery, index}
    <div class="form-group split-group full-width card" data-index={index}>
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
            disabled={!$context.editable}
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
            <label for="{appId}-uses-recovery-{index}-type">
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
              disabled={!$context.editable}
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
                disabled={!$context.editable}
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
                disabled={!$context.editable}
                value={recovery.data.formula ?? ''}
              />
            {/if}
          </div>
        {/if}

        {#if $context.editable}
          <button
            type="button"
            class="inline-icon-button align-self-stretch"
            data-action="deleteRecovery"
            title={localize('DND5E.USES.Recovery.Action.Delete')}
            aria-label={localize('DND5E.USES.Recovery.Action.Delete')}
            on:click={() => $context.item.sheet.deleteRecovery(index)}
            tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
          >
            <i class="fas fa-minus"></i>
          </button>
        {/if}
      </div>
    </div>
  {:else}
    <div class="empty">{localize('DND5E.UsesPeriods.Never')}</div>
  {/each}
{/if}
