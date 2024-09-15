<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemMountable from '../parts/ItemMountable.svelte';
  import ItemActivation from '../parts/ItemActivation.svelte';
  import ItemAction from '../parts/ItemAction.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';
  import FieldUses from '../parts/FieldUses.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">
  {#if $context.item.type === CONSTANTS.ITEM_TYPE_WEAPON}
    {localize('DND5E.ItemSiegeProperties')}
  {:else if $context.item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT}
    {localize('DND5E.ItemVehicleProperties')}
  {/if}
</h3>
<!-- 
<legend>
        {{#if (eq item.type "weapon")}}{{ localize "DND5E.ItemSiegeProperties" }}
        {{else if (eq item.type "equipment")}}{{ localize "DND5E.ItemVehicleProperties" }}{{/if}}
    </legend>
 -->

<!-- Armor Class -->
<ItemFormGroup
  field="system.armor.value"
  labelText={localize('DND5E.AC')}
  let:inputId
>
  <NumberInput
    id={inputId}
    document={$context.item}
    field="system.armor.value"
    value={$context.system.armor.value}
    step="1"
  />
</ItemFormGroup>

<!-- 
 
    

    {{!-- Armor Class --}}
    {{ formField fields.armor.fields.value value=source.armor.value localize=true }}

    {{!-- Hit Points --}}
    <div class="form-group split-group">
        <label>{{ localize "DND5E.HitPoints" }}</label>
        <div class="form-fields">

            {{!-- Current --}}
            {{ formField fields.hp.fields.value value=source.hp.value label="DND5E.Current" placeholder="0"
                         localize=true classes="label-top" }}

            {{!-- Max --}}
            {{ formField fields.hp.fields.max value=source.hp.max label="DND5E.Max" placeholder="0" localize=true
                         classes="label-top" }}

            {{!-- Threshold --}}
            {{ formField fields.hp.fields.dt value=source.hp.dt label="DND5E.Threshold" placeholder="—" localize=true
                         classes="label-top" }}
        </div>

        {{!-- Conditions --}}
        {{ formInput fields.hp.fields.conditions value=source.hp.conditions input=inputs.createTextInput
                     placeholder=(localize "DND5E.HealthConditions") localize=true classes="full-width" }}
    </div>

    {{!-- Speed --}}
    {{#if (eq item.type "equipment")}}
    <div class="form-group split-group">
        <label>{{ localize "DND5E.Speed" }}</label>
        <div class="form-fields">

            {{!-- Value --}}
            {{ formField fields.speed.fields.value value=source.speed.value placeholder="0" label="DND5E.Value"
                         localize=true classes="label-top" }}
        </div>

        {{!-- Conditions --}}
        {{ formInput fields.speed.fields.conditions value=source.speed.conditions input=inputs.createTextInput
                     placeholder=(localize "DND5E.SpeedConditions") localize=true classes="full-width" }}
    </div>
    {{/if}}


-->
