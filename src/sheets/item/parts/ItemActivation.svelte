<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import Select from 'src/components/form/Select.svelte';
  import TextInput from 'src/components/form/TextInput.svelte';
  import SelectOptions from 'src/components/form/SelectOptions.svelte';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup
  labelText={localize('DND5E.ItemActivationCost')}
  cssClass="input-select"
  field="system.activation.cost"
  let:inputId
>
  <div class="form-fields">
    {#if $store.system.activation.type}
      <NumberInput
        id={inputId}
        value={$store.system.activation.cost}
        tooltip="DND5E.ConsumeQuanity"
        field="system.activation.cost"
        placeholder="&#8212;"
        document={$store.item}
      />
    {/if}
    <Select
      id="{$store.appId}-system-activation-type"
      value={$store.system.activation.type?.toString() ?? ''}
      tooltip={localize('DND5E.ItemActivationType')}
      document={$store.item}
      field="system.activation.type"
    >
      <option value="">{localize('DND5E.None')}</option>
      <SelectOptions data={$store.config.abilityActivationTypes} />
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
          <SelectOptions data={$store.config.cover} />
        </Select>
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup
    cssClass="input-select-select"
    labelText={localize('DND5E.Target')}
    field="system.target.type"
    let:inputId
  >
    <div class="form-fields">
      {#if $store.system.hasScalarTarget}
        <NumberInput
          id="{$store.appId}-system-target-value"
          value={$store.system.target.value}
          placeholder="&mdash;"
          field="system.target.value"
          document={$store.item}
        />
      {/if}
      {#if $store.system.hasAreaTarget}
        <Select
          id="{$store.appId}-system-target-units"
          value={$store.system.target.units}
          tooltip="DND5E.TargetUnits"
          field="system.target.units"
          document={$store.item}
        >
          <option value="" />
          <SelectOptions data={$store.config.movementUnits} />
        </Select>
      {/if}
      <Select
        id={inputId}
        value={$store.system.target.type}
        tooltip="DND5E.TargetType"
        field="system.target.type"
        document={$store.item}
      >
        <option value="">{localize('DND5E.None')}</option>
        <optgroup label={localize('DND5E.TargetTypeIndividual')}>
          <SelectOptions data={$store.config.individualTargetTypes} />
        </optgroup>
        <optgroup label={localize('DND5E.TargetTypeArea')}>
          <SelectOptions
            data={$store.config.areaTargetTypes}
            labelProp="label"
          />
        </optgroup>
      </Select>
    </div>
  </ItemFormGroup>

  {#if $store.isLine}
    <ItemFormGroup
      cssClass="input-select-select"
      labelText={localize('DND5E.TargetWidth')}
      field="system.target.width"
      let:inputId
    >
      <div class="form-fields">
        <NumberInput
          id={inputId}
          value={$store.system.target.width}
          placeholder="&mdash;"
          field="system.target.width"
          document={$store.item}
        />
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup
    cssClass="input-select"
    labelText={localize('DND5E.Range')}
    field="system.range.units"
    let:inputId
  >
    <div class="form-fields">
      {#if $store.system.hasScalarRange}
        <NumberInput
          id="{$store.appId}-system-target-width"
          value={$store.system.range.value}
          placeholder={localize('DND5E.Normal')}
          tooltip="DND5E.RangeNormal"
          field="system.target.width"
          document={$store.item}
        />
        <span class="sep">/</span>
        <NumberInput
          id="{$store.appId}-system-range-long"
          value={$store.system.range.long}
          placeholder={localize('DND5E.Long')}
          tooltip="DND5E.RangeLong"
          field="system.range.long"
          document={$store.item}
        />
      {/if}
      <Select
        id={inputId}
        value={$store.system.range.units}
        tooltip="DND5E.RangeUnits"
        document={$store.item}
        field="system.range.units"
      >
        <option value="">{localize('DND5E.None')}</option>
        <optgroup label={localize('DND5E.RangeDistance')}>
          <SelectOptions data={$store.config.movementUnits} />
        </optgroup>
        <SelectOptions data={$store.config.rangeTypes} />
      </Select>
    </div>
  </ItemFormGroup>

  <ItemFormGroup
    cssClass="input-select"
    labelText={localize('DND5E.Duration')}
    field="system.duration.units"
    let:inputId
  >
    <div class="form-fields">
      {#if $store.system.hasScalarDuration}
        <TextInput
          id="{$store.appId}-source-duration-value"
          value={$store.source.duration.value}
          placeholder="&mdash;"
          tooltip="DND5E.DurationValue"
          field="source.duration.value"
          document={$store.item}
          isFormulaEditor={true}
        />
      {/if}
      <Select
        id={inputId}
        value={$store.system.duration.units}
        tooltip="DND5E.DurationType"
        document={$store.item}
        field="system.duration.units"
      >
        <option value="">{localize('DND5E.None')}</option>
        <optgroup label={localize('DND5E.DurationTime')}>
          <SelectOptions data={$store.config.scalarTimePeriods} />
        </optgroup>
        <optgroup label={localize('DND5E.DurationPermanent')}>
          <SelectOptions data={$store.config.permanentTimePeriods} />
        </optgroup>
        <SelectOptions data={$store.config.specialTimePeriods} />
      </Select>
    </div>
  </ItemFormGroup>

  <ItemFormGroup
    cssClass="uses-per"
    labelText={localize('DND5E.LimitedUses')}
    field="system.uses.value"
    let:inputId
  >
    <div class="form-fields">
      <NumberInput
        id={inputId}
        value={$store.system.uses.value}
        tooltip="DND5E.UsesAvailable"
        field="system.uses.value"
        document={$store.item}
      />
      <span class="sep">{localize('DND5E.of')}</span>
      <TextInput
        id="{$store.appId}-system-uses-max"
        value={$store.source.uses.max}
        tooltip="DND5E.UsesMax"
        field="system.uses.max"
        document={$store.item}
        isFormulaEditor={true}
      />
      <span class="sep">{localize('DND5E.per')}</span>
      <Select
        id="{$store.appId}-system.uses.per"
        value={$store.system.uses.per}
        tooltip="DND5E.UsesPeriod"
        document={$store.item}
        field="system.uses.per"
      >
        <option value="" />
        <SelectOptions data={$store.config.limitedUsePeriods} />
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
        <TextInput
          id={inputId}
          value={$store.system.uses.recovery}
          document={$store.item}
          field="system.uses.recovery"
          isFormulaEditor={true}
        />
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup
    cssClass="consumption"
    labelText={localize('DND5E.ConsumeTitle')}
    field="system.consume.type"
    let:inputId
  >
    <div class="form-fields">
      {#if $store.system.consume.type}
        <NumberInput
          id="{$store.appId}-system-consume-amount"
          value={$store.system.consume.amount}
          tooltip="DND5E.ConsumeQuanity"
          field="system.consume.amount"
          document={$store.item}
        />
        <Select
          id="{$store.appId}-system-consume-target"
          value={$store.system.consume.target}
          tooltip="DND5E.ConsumeTarget"
          document={$store.item}
          field="system.consume.target"
        >
          <option value="" />
          <SelectOptions data={$store.abilityConsumptionTargets} />
        </Select>
      {/if}
      <Select
        id={inputId}
        value={$store.system.consume.type}
        tooltip="DND5E.ConsumeType"
        document={$store.item}
        field="system.consume.type"
      >
        <option value="">{localize('DND5E.None')}</option>
        <SelectOptions data={$store.config.abilityConsumptionTypes} />
      </Select>
    </div>
  </ItemFormGroup>
{/if}
