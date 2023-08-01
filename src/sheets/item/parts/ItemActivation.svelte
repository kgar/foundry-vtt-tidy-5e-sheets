<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import NumericInput from 'src/components/sheet-inputs/NumericInput.svelte';
  import Select from 'src/components/sheet-inputs/Select.svelte';
  import TextInput from 'src/components/sheet-inputs/TextInput.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup
  labelText={localize('DND5E.ItemActivationCost')}
  cssClass="input-select"
>
  <div class="form-fields">
    {#if $store.system.activation.type}
      <NumericInput
        value={$store.system.activation.cost}
        tooltip="DND5E.ConsumeQuanity"
        field="system.activation.cost"
        placeholder="&emdash;"
        document={$store.item}
      />
    {/if}
    <Select
      value={$store.system.activation.type?.toString() ?? ''}
      tooltip={localize('DND5E.ItemActivationType')}
      document={$store.item}
      field="system.activation.type"
    >
      <option value="">{localize('DND5E.None')}</option>
      {#each Object.entries($store.config.abilityActivationTypes) as [key, displayName]}
        <option value={key}>{displayName}</option>
      {/each}
    </Select>
  </div>
</ItemFormGroup>

{#if $store.system.activation.type}
  <ItemFormGroup
    labelText={localize('DND5E.ItemActivationCondition')}
    field="system.activation.condition"
    let:inputId
  >
    <div class="form-fields">
      <TextInput
        id={inputId}
        value={$store.system.activation.condition}
        field="system.activation.condition"
        document={$store.item}
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
        <Select
          id={inputId}
          dtype="Number"
          value={$store.system.cover}
          tooltip={localize('DND5E.ItemActivationType')}
          document={$store.item}
          field="system.cover"
        >
          <option value="" />
          {#each Object.entries($store.config.cover) as [key, displayName]}
            <option value={key}>{displayName}</option>
          {/each}
        </Select>
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup
    cssClass="input-select-select"
    labelText={localize('DND5E.Target')}
  >
    <div class="form-fields">
      {#if $store.system.hasScalarTarget}
        <NumericInput
          value={$store.system.target.value}
          placeholder="&mdash;"
          field="system.target.value"
          document={$store.item}
        />
      {/if}
      {#if $store.system.hasAreaTarget}
        <Select
          value={$store.system.target.units}
          tooltip="DND5E.TargetUnits"
          field="system.target.units"
          document={$store.item}
        >
          <option value="" />
          {#each Object.entries($store.config.movementUnits) as [key, displayName]}
            <option value={key}>{displayName}</option>
          {/each}
        </Select>
      {/if}
      <Select
        value={$store.system.target.type}
        tooltip="DND5E.TargetType"
        field="system.target.type"
        document={$store.item}
      >
        <option value="">{localize('DND5E.None')}</option>
        <optgroup label={localize('DND5E.TargetTypeIndividual')}>
          {#each Object.entries($store.config.individualTargetTypes) as [key, displayName]}
            <option value={key}>{displayName}</option>
          {/each}
        </optgroup>
        <optgroup label={localize('DND5E.TargetTypeArea')}>
          {#each Object.entries($store.config.areaTargetTypes) as [key, type]}
            <option value={key}>{type.label}</option>
          {/each}
        </optgroup>
      </Select>
    </div>
  </ItemFormGroup>

  {#if $store.isLine}
    <ItemFormGroup
      cssClass="input-select-select"
      labelText={localize('DND5E.TargetWidth')}
    >
      <div class="form-fields">
        <NumericInput
          value={$store.system.target.width}
          placeholder="&mdash;"
          field="system.target.width"
          document={$store.item}
        />
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup cssClass="input-select" labelText={localize('DND5E.Range')}>
    <div class="form-fields">
      {#if $store.system.hasScalarRange}
        <NumericInput
          value={$store.system.range.value}
          placeholder={localize('DND5E.Normal')}
          tooltip="DND5E.RangeNormal"
          field="system.target.width"
          document={$store.item}
        />
        <span class="sep">/</span>
        <NumericInput
          value={$store.system.range.long}
          placeholder={localize('DND5E.Long')}
          tooltip="DND5E.RangeLong"
          field="system.range.long"
          document={$store.item}
        />
      {/if}
      <Select
        value={$store.system.range.units}
        tooltip="DND5E.RangeUnits"
        document={$store.item}
        field="system.range.units"
      >
        <option value="">{localize('DND5E.None')}</option>
        <optgroup label={localize('DND5E.RangeDistance')}>
          {#each Object.entries($store.config.movementUnits) as [key, displayName]}
            <option value={key}>{displayName}</option>
          {/each}
        </optgroup>
        {#each Object.entries($store.config.rangeTypes) as [key, displayName]}
          <option value={key}>{displayName}</option>
        {/each}
      </Select>
    </div>
  </ItemFormGroup>

  <ItemFormGroup cssClass="input-select" labelText={localize('DND5E.Duration')}>
    <div class="form-fields">
      {#if $store.system.hasScalarDuration}
        <!-- TODO: Figure out what data-formula-editor is doing and recreate -->
        <TextInput
          value={$store.source.duration.value}
          placeholder="&mdash;"
          tooltip="DND5E.DurationValue"
          field="source.duration.value"
          document={$store.item}
          data-formula-editor
        />
      {/if}
      <Select
        value={$store.system.duration.units}
        tooltip="DND5E.DurationType"
        document={$store.item}
        field="system.duration.units"
      >
        <option value="">{localize('DND5E.None')}</option>
        <optgroup label={localize('DND5E.DurationTime')}>
          {#each Object.entries($store.config.scalarTimePeriods) as [key, displayName]}
            <option value={key}>{displayName}</option>
          {/each}
        </optgroup>
        <optgroup label={localize('DND5E.DurationPermanent')}>
          {#each Object.entries($store.config.permanentTimePeriods) as [key, displayName]}
            <option value={key}>{displayName}</option>
          {/each}
        </optgroup>
        {#each Object.entries($store.config.specialTimePeriods) as [key, displayName]}
          <option value={key}>{displayName}</option>
        {/each}
      </Select>
    </div>
  </ItemFormGroup>

  <ItemFormGroup cssClass="uses-per" labelText={localize('DND5E.LimitedUses')}>
    <div class="form-fields">
      <NumericInput
        value={$store.system.uses.value}
        tooltip="DND5E.UsesAvailable"
        field="system.uses.value"
        document={$store.item}
      />
      <span class="sep">{localize('DND5E.of')}</span>
      <!-- TODO: Figure out what data-formula-editor is doing and recreate -->
      <TextInput
        value={$store.source.uses.max}
        tooltip="DND5E.UsesMax"
        field="source.uses.max"
        document={$store.item}
        data-formula-editor
      />
      <span class="sep">{localize('DND5E.per')}</span>
      <Select
        value={$store.system.uses.per}
        tooltip="DND5E.UsesPeriod"
        document={$store.item}
        field="system.uses.per"
      >
        <option value="" />
        {#each Object.entries($store.config.limitedUsePeriods) as [key, displayName]}
          <option value={key}>{displayName}</option>
        {/each}
      </Select>
    </div>
  </ItemFormGroup>

  {#if $store.system.uses.per === 'charges'}
    <ItemFormGroup
      labelText={localize('DND5E.RecoveryFormula')}
      field="system.uses.recovery"
      let:inputId
    >
      <div class="form-fields">
        <!-- TODO: Figure out what data-formula-editor is doing and recreate -->
        <TextInput
          id={inputId}
          value={$store.system.uses.recovery}
          document={$store.item}
          field="system.uses.recovery"
          data-formula-editor
        />
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup
    cssClass="consumption"
    labelText={localize('DND5E.ConsumeTitle')}
  >
    <div class="form-fields">
      {#if $store.system.consume.type}
        <NumericInput
          value={$store.system.consume.amount}
          tooltip="DND5E.ConsumeQuanity"
          field="system.consume.amount"
          document={$store.item}
        />
        <Select
          value={$store.system.consume.target}
          tooltip="DND5E.ConsumeTarget"
          document={$store.item}
          field="system.consume.target"
        >
          <option value="" />
          {#each Object.entries($store.abilityConsumptionTargets) as [key, displayName]}
            <option value={key}>{displayName}</option>
          {/each}
        </Select>
      {/if}
      <Select
        value={$store.system.consume.type}
        tooltip="DND5E.ConsumeType"
        document={$store.item}
        field="system.consume.type"
      >
        <option value="">{localize('DND5E.None')}</option>
        {#each Object.entries($store.config.abilityConsumptionTypes) as [key, displayName]}
          <option value={key}>{displayName}</option>
        {/each}
      </Select>
    </div>
  </ItemFormGroup>
{/if}
