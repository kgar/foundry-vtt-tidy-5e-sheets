<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import type { CONFIG } from 'src/foundry/config.types';
  import { mapSystemBaseDamageTypesToSave } from 'src/utils/system-properties';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<!-- Custom Formula -->
<ItemFormGroup cssClass="split-group">
  <!-- <div class="form-fields"> -->
  <!-- checkbox  system.damage.base.custom.enabled-->
  <label for="{appId}-damage-base-custom-enabled">Formula</label>
  <div class="form-fields">
    <Checkbox
      id="{appId}-damage-base-custom-enabled"
      document={$context.item}
      field="system.damage.base.custom.enabled"
      checked={$context.system.damage.base.custom.enabled}
    />

    <TextInput
      id="{appId}-damage-base-custom-formula"
      document={$context.item}
      field="system.damage.base.custom.formula"
      value={$context.system.damage.base.custom.formula}
      class={$context.item.system.damage.base.custom.enabled ? '' : 'invisible'}
    />
  </div>
  <!-- </div> -->
</ItemFormGroup>

<!-- Simple Input -->
{#if !$context.item.system.damage.base.custom.enabled}
  <ItemFormGroup
    cssClass="split-group"
    labelText={$context.system.damage.heal
      ? localize('DND5E.HEAL.Title')
      : localize('DND5E.DAMAGE.Title')}
  >
    <div class="form-fields">
      <div class="form-group label-top">
        <label for="{appId}-damage-base-number"
          >{localize('DND5E.Number')}</label
        >
        <!-- Number -->
        <NumberInput
          id="{appId}-damage-base-number"
          document={$context.item}
          field="system.damage.base.number"
          value={$context.system.damage.base.number}
          min="0"
          step="1"
        />
      </div>

      <!-- Die -->
      <div class="form-group label-top">
        <label for="{appId}-damage-base-denomination"
          >{localize('DND5E.Die')}</label
        >
        <Select
          id="{appId}-damage-base-denomination"
          document={$context.item}
          field="system.damage.base.denomination"
          value={$context.system.damage.base.denomination}
          blankValue=""
        >
          <SelectOptions
            data={$context.denominationOptions}
            labelProp="label"
            valueProp="value"
          />
        </Select>
      </div>

      <!-- Bonus -->
      <div class="form-group label-top">
        <label for="{appId}-damage-base-bonus">
          {localize('DND5E.Bonus')}
        </label>
        <TextInput
          id="{appId}-damage-base-bonus"
          document={$context.item}
          field="system.damage.base.bonus"
          value={$context.system.damage.base.bonus}
        />
      </div>
    </div>
  </ItemFormGroup>
{/if}

<!-- Types -->
{#if $context.damageTypes}
  <ItemFormGroup
    cssClass="stacked damage-types"
    labelText={localize('DND5E.Type')}
  >
    {#each $context.damageTypes as { value, label } (value)}
      <Checkbox
        labelCssClass="checkbox"
        document={$context.item}
        field="system.damage.base.types"
        checked={$context.system.damage.base.types.has(value)}
        {value}
        disabled={!$context.editable}
        onDataPreparing={(ev) => mapSystemBaseDamageTypesToSave($context, ev)}
      >
        {label}
      </Checkbox>
    {/each}
  </ItemFormGroup>
{/if}

<!-- Scaling -->
{#if $context.system.damage.canScale}
  <ItemFormGroup cssClass="split-group">
    <label for=""
      >{localize('DND5E.DAMAGE.FIELDS.damage.parts.FIELDS.scaling.abbr')}</label
    >
    <div class="form-fields">
      <!-- 
        {{!-- Mode --}}
        {{ formField fields.scaling.fields.mode name=(concat prefix "scaling.mode") value=source.scaling.mode
                     options=scalingOptions label="DND5E.DAMAGE.FIELDS.damage.parts.FIELDS.scaling.mode.abbr" hint=false
                     localize=true classes="label-top" }}

        {{!-- Dice --}}
        {{#if source.scaling.mode}}
        {{ formField fields.scaling.fields.number name=(concat prefix "scaling.number") value=source.scaling.number
                     label="DND5E.DAMAGE.FIELDS.damage.parts.FIELDS.scaling.number.abbr" hint=false localize=true
                     classes="label-top" }}
        {{/if}} 
        -->
    </div>
  </ItemFormGroup>
  <!-- Formula -->
  {#if $context.system.scaling.mode}
    <!-- {{ formField fields.scaling.fields.formula name=(concat prefix "scaling.formula") value=source.scaling.formula }} -->
  {/if}
{/if}
