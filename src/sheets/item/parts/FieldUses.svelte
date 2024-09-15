<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import { CONSTANTS } from 'src/constants';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import FieldDamage from '../parts/FieldDamage.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<!-- Header - DND5E.Usage -->
<h3 class="form-header">{localize('DND5E.ItemConsumableDetails')}</h3>

<!-- Uses -->
<ItemFormGroup cssClass="split-group">
  <label for="">{localize('DND5E.LimitedUses')}</label>
  <div class="form-fields">
    <!-- Spent  -->
    <div class="form-fields">
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
  </div></ItemFormGroup
>

<!-- Auto-Destroy -->
{#if $context.fields.uses.fields.autoDestroy}
  <ItemFormGroup
    labelText={localize('DND5E.CONSUMABLE.uses.autoDestroy.label')}
  >
    <Checkbox
      id="{appId}-uses-autoDestroy"
      document={$context.item}
      field="system.uses.autoDestroy"
      checked={$context.item.system.uses.autoDestroy}
    />
    <p class="hint">
      {localize('DND5E.CONSUMABLE.uses.autoDestroy.hint')}
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
      <i class="fas fa-plus" inert></i>
    </button>
  </h3>

  {#each $context.system.usesRecovery as recovery}
    {JSON.stringify(recovery)}

    <!-- 
    
        <div class="form-group split-group full-width card" data-index="{{ @index }}">
        <div class="form-fields">

            {{!-- Period --}}
            {{ formField fields.period name=(concat prefix "period") value=source.period options=@root.recoveryPeriods
                         label="DND5E.Period" localize=true hint=false classes="label-top" }}

            {{!-- Type --}}
            {{#unless (eq source.period "recharge")}}
            {{ formField fields.type name=(concat prefix "type") value=source.type options=@root.recoveryTypes
                         label="DND5E.Recovery" localize=true hint=false classes="label-top" }}
            {{/unless}}

            {{!-- Formula --}}
            {{#if (or (eq source.type "formula") formulaOptions)}}
            {{ formField fields.formula name=(concat prefix "formula") value=source.formula options=formulaOptions
                         label="DND5E.Formula" localize=true hint=false classes="label-top" }}
            {{/if}}

            <button type="button" class="unbutton control-button" data-action="deleteRecovery"
                    data-tooltip="DND5E.USES.Recovery.Action.Delete"
                    aria-label="{{ localize "DND5E.USES.Recovery.Action.Delete" }}">
                <i class="fas fa-minus" inert></i>
            </button>
        </div>
    </div>
    -->
  {:else}
    <div class="empty">{localize('DND5E.UsesPeriods.Never')}</div>
  {/each}
{/if}
