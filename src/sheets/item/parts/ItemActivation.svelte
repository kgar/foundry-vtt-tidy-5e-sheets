<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup labelText={localize('DND5E.ItemActivationCost')} cssClass="input-select">
  <div class="form-fields">
    {#if $store.system.activation.type}
      <input
        type="number"
        step="any"
        value={$store.system.activation.cost}
        placeholder="&emdash;"
        on:change={(event) =>
          $store.item.update({
            'system.activation.cost': event.currentTarget.value,
          })}
      />
    {/if}
    <select
      value={$store.system.activation.type.toString()}
      data-tooltip={localize('DND5E.ItemActivationType')}
      on:change={(event) =>
        $store.item.update({
          'system.activation.type': event.currentTarget.value,
        })}
    >
      <option value="">{localize('DND5E.None')}</option>
      {#each Object.entries($store.config.abilityActivationTypes) as [key, displayName]}
        <option value={key}>{displayName}</option>
      {/each}
    </select>
  </div>
</ItemFormGroup>

{#if $store.system.activation.type}
  <ItemFormGroup
    labelText={localize('DND5E.ItemActivationCondition')}
    field="system.activation.condition"
    let:inputId
  >
    <div class="form-fields">
      <input
        id={inputId}
        type="text"
        value={$store.system.activation.condition}
        on:change={(event) =>
          $store.item.update({
            'system.activation.condition': event.currentTarget.value,
          })}
      />
    </div>
  </ItemFormGroup>

  {#if $store.isCrewed}
    <ItemFormGroup
      labelText={localize('DND5E.Cover')}
      field="system.cover"
      let:inputId
    >
      <div class="form-fields">
        <select
          id={inputId}
          data-dtype="Number"
          value={$store.system.cover}
          on:change={(event) =>
            $store.item.update({
              'system.cover': event.currentTarget.value,
            })}
        >
          <option value="" />
          {#each Object.entries($store.config.cover) as [key, displayName]}
            <option value={key}>{displayName}</option>
          {/each}
        </select>
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup cssClass="input-select-select" labelText={localize ('DND5E.Target')}>
    <div class='form-fields'>
      {#if $store.system.hasScalarTarget}
        <input
          type='number'
          step='any'
          value='{$store.system.target.value}'
          placeholder='&mdash;'
          on:change={event => $store.item.update({
            'system.target.value': event.currentTarget.value
          })}
        />
      {/if}
      {#if system.hasAreaTarget}
        <select value={$store.system.target.units} 
          data-tooltip='DND5E.TargetUnits'
          on:change={event => $store.item.update({
            'system.target.units': event.currentTarget.value
          })}>
          <option value=""></option>
          {#each Object.entries($store.config.movementUnits) as [key, displayName]}
          <option value={key}>{displayName}</option>
          {/each}
        </select>
      {/if}
      <select value={$store.system.target.type} data-tooltip='DND5E.TargetType' on:change={event => $store.item.update({
        'system.target.type': event.currentTarget.value
      })}>
          <option value=''>{localize ('DND5E.None')}</option>
          <optgroup label='{localize ("DND5E.TargetTypeIndividual")}'>
            {#each Object.entries($store.config.individualTargetTypes) as [key, displayName]}
              <option value={key}>{displayName}</option>
            {/each}
          </optgroup>
          <optgroup label='{localize ("DND5E.TargetTypeArea")}'>
            {#each Object.entries($store.config.areaTargetTypes) as [key, type]}
              <option value={key}>{type.label}</option>
            {/each}
          </optgroup>
      </select>
    </div>
</ItemFormGroup>

  {#if $store.isLine}
  <ItemFormGroup cssClass="input-select-select" labelText={localize ('DND5E.TargetWidth')}>
      <div class='form-fields'>
        <input
          type='number'
          step='any'
          value='{$store.system.target.width}'
          placeholder='&mdash;'
          on:change={event => $store.item.update({ 'system.target.width' : event.currentTarget.value})}
          />
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup cssClass="input-select" labelText={localize ('DND5E.Range')}>
    <div class='form-fields'>
      {#if $store.system.hasScalarRange}
        <input
          type='number'
          step='any'
          value='{$store.system.range.value}'
          placeholder='{localize ("DND5E.Normal")}'
          data-tooltip='DND5E.RangeNormal'
          on:change={event => $store.item.update({
            'system.range.value': event.currentTarget.value
          })}
        />
        <span class='sep'>/</span>
        <input
          type='number'
          step='any'
          value='{$store.system.range.long}'
          placeholder='{localize ("DND5E.Long")}'
          data-tooltip='DND5E.RangeLong'
          on:change={event => $store.item.update({
           'system.range.long': event.currentTarget.value
          })}
        />
      {/if}
      <select value={$store.system.range.units} data-tooltip='DND5E.RangeUnits' on:change={event => $store.item.update({'system.range.units': event.currentTarget.value})}>
          <option value=''>{localize ('DND5E.None')}</option>
          <optgroup label='{localize ("DND5E.RangeDistance")}'>
            {#each Object.entries($store.config.movementUnits) as [key, displayName]}
              <option value={key}>{displayName}</option>
            {/each}
          </optgroup>
          {#each Object.entries($store.config.rangeTypes) as [key, displayName]}
            <option value={key}>{displayName}</option>
          {/each}
      </select>
    </div>
</ItemFormGroup>

<ItemFormGroup 
cssClass="input-select" labelText={localize ('DND5E.Duration')}>
    <div class='form-fields'>
      {#if $store.system.hasScalarDuration}
      <!-- TODO: Figure out what data-formula-editor is doing and recreate -->
        <input
          type='text'
          value='{$store.source.duration.value}'
          placeholder='&mdash;'
          data-tooltip='DND5E.DurationValue'
          data-formula-editor
        />
      {/if}
      <select 
        value={$store.system.duration.units} 
        data-tooltip='DND5E.DurationType'
        on:change={event => $store.item.update({'system.duration.units': event.currentTarget.value})}>
          <option value=''>{localize ('DND5E.None')}</option>
          <optgroup label='{localize ("DND5E.DurationTime")}'>
            {#each Object.entries($store.config.scalarTimePeriods) as [key, displayName]}
              <option value={key}>{displayName}</option>
            {/each}
          </optgroup>
          <optgroup label='{localize ("DND5E.DurationPermanent")}'>
            {#each Object.entries($store.config.permanentTimePeriods) as [key, displayName]}
              <option value={key}>{displayName}</option>
            {/each}
          </optgroup>
          {#each Object.entries($store.config.specialTimePeriods) as [key, displayName]}
              <option value={key}>{displayName}</option>
            {/each}
      </select>
    </div>
</ItemFormGroup>

<ItemFormGroup cssClass="uses-per" labelText={localize ('DND5E.LimitedUses')}>
    <div class='form-fields'>
      <input
        type='number'
        step='any'
        value='{$store.system.uses.value}'
        data-tooltip='DND5E.UsesAvailable'
        on:change={event => $store.item.update({'system.uses.value': event.currentTarget.value})}
      />
      <span class='sep'>{localize ('DND5E.of')}</span>
      <!-- TODO: Figure out what data-formula-editor is doing and recreate -->
      <input
        type='text'
        value='{$store.source.uses.max}'
        data-tooltip='DND5E.UsesMax'
        data-formula-editor
      />
      <span class='sep'>{localize ('DND5E.per')}</span>
      <select value={$store.system.uses.per} data-tooltip='DND5E.UsesPeriod' on:change={event => $store.item.udpate({'system.uses.per': event.currentTarget.value})}>
        <option value=""></option>
        {#each Object.entries($store.config.limitedUsePeriods) as [key, displayName]}
        <option value={key}>{displayName}</option>
        {/each}
      </select>
    </div>
</ItemFormGroup>

  {#if ($store.system.uses.per === 'charges')}
  <ItemFormGroup labelText={localize ('DND5E.RecoveryFormula')} field="system.uses.recovery" let:inputId>
      <div class='form-fields'>
        <!-- TODO: Figure out what data-formula-editor is doing and recreate -->
        <input
        id={inputId}
        type='text'
        value='{$store.system.uses.recovery}'
        data-formula-editor
        />
      </div>
  </ItemFormGroup>  
  {/if}

  <ItemFormGroup 
    cssClass="consumption" 
    labelText={localize ('DND5E.ConsumeTitle')}>
    <div class='form-fields'>
      {#if $store.system.consume.type}
        <input
          type='number'
          step='any'
          value='{$store.system.consume.amount}'
          data-tooltip='DND5E.ConsumeQuanity'
          on:change={event => $store.item.update({'system.consume.amount': event.currentTarget.value})}
        />
        <select 
          value={$store.system.consume.target} 
          data-tooltip='DND5E.ConsumeTarget'
          on:change={event => $store.item.update({
            'system.consume.target': event.currentTarget.value
          })}
          >
          <option value=""></option>
          {#each Object.entries($store.abilityConsumptionTargets) as [key, displayName]}
<option value={key}>{displayName}</option>
          {/each}
        </select>
      {/if}
      <select name='system.consume.type' data-tooltip='DND5E.ConsumeType'>
        {selectOptions
          config.abilityConsumptionTypes
          selected=system.consume.type
          blank=(localize 'DND5E.None')
        }
      </select>
    </div>

  </ItemFormGroup> 
{/if}
