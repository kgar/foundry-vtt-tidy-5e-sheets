<script lang="ts">
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend
    >{localize('DND5E.Usage')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Uses -->
  <div class="form-group split-group">
    <label for="{appId}-uses-spent">{localize('DND5E.LimitedUses')}</label>
    <div class="form-fields">
      <!-- Spent  -->
      <div class="form-group label-top">
        <label for="{appId}-uses-spent">{localize('DND5E.Spent')}</label>
        <NumberInputQuadrone
          id="{appId}-uses-spent"
          document={context.item}
          field="system.uses.spent"
          value={context.source.uses.spent}
          disabled={!context.unlocked}
        />
      </div>

      <!-- Max -->
      <div class="form-group label-top">
        <label for="{appId}-uses-max">{localize('DND5E.Max')}</label>
        <div class="form-fields">
          <TextInputQuadrone
            id="{appId}-uses-max"
            document={context.item}
            field="system.uses.max"
            value={context.source.uses.max}
            disabled={!context.unlocked}
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Auto-Destroy -->
  {#if context.system.schema.fields.uses?.fields?.autoDestroy}
    <div class="form-group">
      <label for="{appId}-uses-autoDestroy"
        >{localize('DND5E.CONSUMABLE.FIELDS.uses.autoDestroy.label')}</label
      >
      <div class="form-fields">
        <label class="checkbox" for="{appId}-uses-autoDestroy">
          <CheckboxQuadrone
            id="{appId}-uses-autoDestroy"
            document={context.item}
            field="system.uses.autoDestroy"
            checked={context.source.uses.autoDestroy}
            disabledChecked={context.system.uses.autoDestroy}
            disabled={!context.unlocked}
          />
        </label>
      </div>
      <p class="hint">
        {localize('DND5E.CONSUMABLE.FIELDS.uses.autoDestroy.hint')}
      </p>
    </div>
  {/if}
</fieldset>

{#if context.item.hasLimitedUses}
  <fieldset>
    <legend>
      <div class="legend-with-button">
        <span>
          {localize('DND5E.Recovery')}
        </span>
        {#if context.editable}
          <button
            type="button"
            class="create-recovery-button button-borderless"
            data-tooltip="DND5E.USES.Recovery.Action.Create"
            aria-label={localize('DND5E.USES.Recovery.Action.Create')}
            onclick={() => context.sheet.addRecovery()}
            disabled={!context.unlocked}
          >
            <i class="fas fa-plus"></i>
            {localize('TIDY5E.AddSpecific', {
              name: localize('DND5E.Recovery'),
            })}
          </button>
        {/if}
      </div>
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    {#each context.usesRecovery as recovery, index}
      {@const systemRecovery = context.system.uses.recovery}
      {@const disabled = !context.unlocked}
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
              value={!disabled
                ? recovery.data.period
                : systemRecovery[index].period}
              onchange={(ev) =>
                context.sheet.updateRecovery(
                  index,
                  'period',
                  ev.currentTarget.value,
                )}
              {disabled}
            >
              <SelectOptions
                data={context.recoveryPeriods}
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
                value={!disabled
                  ? recovery.data.type
                  : systemRecovery[index].type}
                onchange={(ev) =>
                  context.sheet.updateRecovery(
                    index,
                    'type',
                    ev.currentTarget.value,
                  )}
                {disabled}
              >
                <SelectOptions
                  data={context.recoveryTypes}
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
                {localize(
                  'DND5E.USES.FIELDS.uses.recovery.FIELDS.formula.label',
                )}
              </label>
              {#if recovery.formulaOptions}
                <select
                  id="{appId}-uses-recovery-{index}-formula"
                  data-tidy-field="system.uses.recovery.{index}.formula"
                  onchange={(ev) =>
                    context.sheet.updateRecovery(
                      index,
                      'formula',
                      ev.currentTarget.value,
                    )}
                  value={!disabled
                    ? recovery.data.formula
                    : systemRecovery[index].formula}
                  {disabled}
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
                  onchange={(ev) =>
                    context.sheet.updateRecovery(
                      index,
                      'formula',
                      ev.currentTarget.value,
                    )}
                  {disabled}
                  value={(!disabled
                    ? recovery.data.formula
                    : systemRecovery[index].formula) ?? ''}
                />
              {/if}
            </div>
          {/if}

          {#if context.unlocked}
            <button
              type="button"
              class="inline-icon-button align-self-stretch button-icon-only button-borderless"
              data-action="deleteRecovery"
              title={localize('DND5E.USES.Recovery.Action.Delete')}
              aria-label={localize('DND5E.USES.Recovery.Action.Delete')}
              onclick={() => context.sheet.deleteRecovery(index)}
            >
              <i class="fas fa-minus"></i>
            </button>
          {/if}
        </div>
      </div>
    {:else}
      <div class="empty">{localize('DND5E.USES.Recovery.Never')}</div>
    {/each}
  </fieldset>
{/if}
