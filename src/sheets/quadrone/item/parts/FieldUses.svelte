<script lang="ts">
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset disabled={!context.unlocked}>
  <legend
    >{localize('DND5E.Usage')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Uses -->
  <FormGroup
    labelFor="{appId}-uses-spent"
    label="DND5E.LimitedUses"
    groupClasses="split-group"
  >
    <FormGroup
      field={context.fields.uses.fields.spent}
      label="DND5E.Spent"
      document={context.document}
      labelFor="{appId}-uses-spent"
      config={{
        id: `${appId}-uses-spent`,
        value: context.source.uses.spent,
      }}
      groupClasses="label-top"
    />
    <FormGroup
      field={context.fields.uses.fields.max}
      label="DND5E.Max"
      document={context.document}
      labelFor="{appId}-uses-max"
      config={{
        id: `${appId}-uses-max`,
        value: context.source.uses.max,
      }}
      groupClasses="label-top"
    />
  </FormGroup>

  <!-- Auto-Destroy -->
  {#if context.system.schema.fields.uses?.fields?.autoDestroy}
    <FormGroup
      labelFor="{appId}-uses-autoDestroy"
      document={context.document}
      field={context.fields.uses.fields.autoDestroy}
      config={{
        id: `${appId}-uses-autoDestroy`,
        value: context.source.uses.autoDestroy,
      }}
      disabledValue={context.system.uses.autoDestroy}
    />
  {/if}
</fieldset>

{#if context.item.hasLimitedUses}
  <fieldset disabled={!context.unlocked}>
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
          <FormGroup
            label="DND5E.Period"
            labelFor="{appId}-uses-recovery-${index}-period"
            document={context.document}
            field={recovery.fields.period}
            config={{
              id: `${appId}-uses-recovery-${index}-period`,
              value: !disabled
                ? recovery.data.period
                : systemRecovery[index].period,
              disabled,
              name: `${recovery.prefix}period`,
            }}
            choices={context.recoveryPeriods}
            groupClasses="label-top"
          />

          <!-- Type -->
          {#if recovery.data.period !== 'recharge'}
            <FormGroup
              label="DND5E.Recovery"
              labelFor="{appId}-uses-recovery-${index}-type"
              document={context.document}
              field={recovery.fields.type}
              config={{
                id: `${appId}-uses-recovery-${index}-type`,
                value: !disabled
                  ? recovery.data.type
                  : systemRecovery[index].type,
                disabled,
                name: `${recovery.prefix}type`,
              }}
              choices={context.recoveryTypes}
              groupClasses="label-top"
            />
          {/if}

          <!-- Formula -->
          {#if recovery.data.type === 'formula' || recovery.formulaOptions}
            <FormGroup
              label="DND5E.Formula"
              labelFor="{appId}-uses-recovery-${index}-formula"
              document={context.document}
              field={recovery.fields.formula}
              config={{
                id: `${appId}-uses-recovery-${index}-formula`,
                value: !disabled
                  ? recovery.data.formula
                  : systemRecovery[index].formula,
                disabled,
                name: `${recovery.prefix}formula`,
                blank: false,
              }}
              choices={recovery.formulaOptions}
              groupClasses="label-top"
            />
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
