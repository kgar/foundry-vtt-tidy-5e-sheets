<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<!-- Custom Formula -->
<ItemFormGroup cssClass="split-group">
  <div class="form-fields">
    <!-- checkbox  system.damage.base.custom.enabled-->
    {#if $context.item.system.damage.base.custom.enabled}
      <!-- textinput  system.damage.base.custom.formula -->
    {/if}
  </div>
</ItemFormGroup>

<!-- Simple Input -->
{#if !$context.item.system.damage.base.custom.enabled}
  <ItemFormGroup cssClass="split-group">
    <!-- 
    <label>{{#if heal}}{{ localize "DND5E.HEAL.Title" }}{{else}}{{ localize "DND5E.DAMAGE.Title" }}{{/if}}</label>
    <div class="form-fields">

        {{!-- Number --}}
        {{ formField fields.number name=(concat prefix "number") value=source.number label="DND5E.Number" localize=true
                     hint=false classes="label-top" placeholder=numberPlaceholder }}

        {{!-- Die --}}
        {{ formField fields.denomination name=(concat prefix "denomination") value=source.denomination label="DND5E.Die"
                     hint=false localize=true options=denominationOptions classes="label-top" }}

        {{!-- Bonus --}}
        {{ formField fields.bonus name=(concat prefix "bonus") value=source.bonus label="DND5E.Bonus" localize=true
                     hint=false classes="label-top" }}
    </div> 
    -->
  </ItemFormGroup>
{/if}

<!-- Types -->
<!-- checkbox group for system.damage.base.types -->

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
