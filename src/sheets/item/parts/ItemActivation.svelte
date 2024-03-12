<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<ItemFormGroup
  labelText={localize('DND5E.ItemActivationCost')}
  cssClass="input-select"
  field="system.activation.cost"
  let:inputId
>
  <div class="form-fields">
    {#if $context.system.activation.type && !$context.isCostlessAction}
      <NumberInput
        id={inputId}
        value={$context.system.activation.cost}
        title={localize('DND5E.ConsumeQuanity')}
        field="system.activation.cost"
        placeholder="&#8212;"
        document={$context.item}
        disabled={!$context.editable}
      />
    {/if}
    <Select
      id="{$context.appId}-system-activation-type"
      value={$context.system.activation.type?.toString() ?? ''}
      title={localize('DND5E.ItemActivationType')}
      document={$context.item}
      field="system.activation.type"
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.config.abilityActivationTypes} blank="" />
    </Select>
  </div>
</ItemFormGroup>

{#if $context.system.activation.type}
  <ItemFormGroup
    labelText={localize('DND5E.ItemActivationCondition')}
    field="system.activation.condition"
    let:inputId
  >
    <div class="form-fields">
      <TextInput
        id={inputId}
        value={$context.system.activation.condition}
        field="system.activation.condition"
        document={$context.item}
        disabled={!$context.editable}
      />
    </div>
  </ItemFormGroup>

  {#if $context.isCrewed}
    <ItemFormGroup
      labelText={localize('DND5E.Cover')}
      field="system.cover"
      let:inputId
    >
      <div class="form-fields">
        <Select
          id={inputId}
          value={$context.system.cover?.toString()}
          title={localize('DND5E.ItemActivationType')}
          document={$context.item}
          field="system.cover"
          disabled={!$context.editable}
        >
          <SelectOptions data={$context.config.cover} blank="" />
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
      {#if $context.system.hasScalarTarget}
        <NumberInput
          id="{$context.appId}-system-target-value"
          value={$context.system.target.value}
          placeholder="&mdash;"
          field="system.target.value"
          document={$context.item}
          disabled={!$context.editable}
        />
      {/if}
      {#if $context.system.hasAreaTarget}
        <Select
          id="{$context.appId}-system-target-units"
          value={$context.system.target.units}
          title={localize('DND5E.TargetUnits')}
          field="system.target.units"
          document={$context.item}
          disabled={!$context.editable}
        >
          <option value="" />
          <SelectOptions data={$context.config.movementUnits} />
        </Select>
      {/if}
      <Select
        id={inputId}
        value={$context.system.target.type}
        title={localize('DND5E.TargetType')}
        field="system.target.type"
        document={$context.item}
        disabled={!$context.editable}
      >
        <option value="">{localize('DND5E.None')}</option>
        <optgroup label={localize('DND5E.TargetTypeIndividual')}>
          <SelectOptions data={$context.config.individualTargetTypes} />
        </optgroup>
        <optgroup label={localize('DND5E.TargetTypeArea')}>
          <SelectOptions
            data={$context.config.areaTargetTypes}
            labelProp="label"
          />
        </optgroup>
      </Select>
    </div>
  </ItemFormGroup>

  {#if $context.isLine}
    <ItemFormGroup
      cssClass="input-select-select"
      labelText={localize('DND5E.TargetWidth')}
      field="system.target.width"
      let:inputId
    >
      <div class="form-fields">
        <NumberInput
          id={inputId}
          value={$context.system.target.width}
          placeholder="&mdash;"
          field="system.target.width"
          document={$context.item}
          disabled={!$context.editable}
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
      {#if $context.system.hasScalarRange}
        <NumberInput
          id="{$context.appId}-system-target-width"
          value={$context.system.range.value}
          placeholder={localize('DND5E.Normal')}
          title={localize('DND5E.RangeNormal')}
          field="system.range.value"
          document={$context.item}
          disabled={!$context.editable}
        />
        <span class="sep">/</span>
        <NumberInput
          id="{$context.appId}-system-range-long"
          value={$context.system.range.long}
          placeholder={localize('DND5E.Long')}
          title={localize('DND5E.RangeLong')}
          field="system.range.long"
          document={$context.item}
          disabled={!$context.editable}
        />
      {/if}
      <Select
        id={inputId}
        value={$context.system.range.units}
        title={localize('DND5E.RangeUnits')}
        document={$context.item}
        field="system.range.units"
        disabled={!$context.editable}
      >
        <option value="">{localize('DND5E.None')}</option>
        <optgroup label={localize('DND5E.RangeDistance')}>
          <SelectOptions data={$context.config.movementUnits} />
        </optgroup>
        <SelectOptions data={$context.config.rangeTypes} />
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
      {#if $context.system.hasScalarDuration}
        <TextInput
          id="{$context.appId}-source-duration-value"
          value={$context.source.duration.value}
          placeholder="&mdash;"
          title={localize('DND5E.DurationValue')}
          field="system.duration.value"
          document={$context.item}
          dataset={{ formulaEditor: true }}
          disabled={!$context.editable}
        />
      {/if}
      <Select
        id={inputId}
        value={$context.system.duration.units}
        title={localize('DND5E.DurationType')}
        document={$context.item}
        field="system.duration.units"
        disabled={!$context.editable}
      >
        <option value="">{localize('DND5E.None')}</option>
        <optgroup label={localize('DND5E.DurationTime')}>
          <SelectOptions data={$context.config.scalarTimePeriods} />
        </optgroup>
        <optgroup label={localize('DND5E.DurationPermanent')}>
          <SelectOptions data={$context.config.permanentTimePeriods} />
        </optgroup>
        <SelectOptions data={$context.config.specialTimePeriods} />
      </Select>
    </div>
  </ItemFormGroup>

  <ItemFormGroup
    cssClass="uses-per"
    labelText={localize('DND5E.LimitedUses')}
    field="system.uses.per"
    let:inputId
  >
    <div class="form-fields">
      {#if $context.system.uses.per}
        <NumberInput
          id="{$context.appId}-system-uses-value"
          value={$context.system.uses.value}
          title={localize('DND5E.UsesAvailable')}
          field="system.uses.value"
          document={$context.item}
        />
        <span class="sep">{localize('DND5E.of')}</span>
        <TextInput
          id="{$context.appId}-system-uses-max"
          value={$context.source.uses.max}
          title={localize('DND5E.UsesMax')}
          field="system.uses.max"
          document={$context.item}
          dataset={{ formulaEditor: true }}
          disabled={!$context.editable}
        />
        <span class="sep">{localize('DND5E.per')}</span>
      {/if}
      <Select
        id={inputId}
        value={$context.system.uses.per}
        title={localize('DND5E.UsesPeriod')}
        document={$context.item}
        field="system.uses.per"
        disabled={!$context.editable}
      >
        <SelectOptions
          data={$context.config.limitedUsePeriods}
          blank={localize('DND5E.None')}
        />
      </Select>
    </div>
  </ItemFormGroup>

  {#if $context.isFormulaRecharge}
    <ItemFormGroup
      labelText={localize('DND5E.RecoveryFormula')}
      field="system.uses.recovery"
      let:inputId
    >
      <div class="form-fields">
        <TextInput
          id={inputId}
          value={$context.system.uses.recovery}
          document={$context.item}
          field="system.uses.recovery"
          dataset={{ formulaEditor: true }}
          disabled={!$context.editable}
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
      {#if $context.system.consume.type}
        <NumberInput
          id="{$context.appId}-system-consume-amount"
          value={$context.system.consume.amount}
          title={localize('DND5E.ConsumeAmount')}
          field="system.consume.amount"
          document={$context.item}
          disabled={!$context.editable}
        />
        <Select
          id="{$context.appId}-system-consume-target"
          value={$context.system.consume.target}
          title={localize('DND5E.ConsumeTarget')}
          document={$context.item}
          field="system.consume.target"
          disabled={!$context.editable}
        >
          <option value="" />
          <SelectOptions data={$context.abilityConsumptionTargets} />
        </Select>
      {/if}
      <Select
        id={inputId}
        value={$context.system.consume.type}
        title={localize('DND5E.ConsumeType')}
        document={$context.item}
        field="system.consume.type"
        disabled={!$context.editable}
      >
        <option value="">{localize('DND5E.None')}</option>
        <SelectOptions data={$context.config.abilityConsumptionTypes} />
      </Select>
    </div>
  </ItemFormGroup>

  <ItemFormGroup cssClass="stacked">
    {#if $context.item.type === 'consumable'}
      <Checkbox
        labelCssClass="checkbox"
        document={$context.item}
        field="system.uses.autoDestroy"
        checked={$context.system.uses.autoDestroy}
        disabled={!$context.editable}
        title={localize('DND5E.ItemDestroyEmptyTooltip')}
      >
        {localize('DND5E.ItemDestroyEmpty')}
      </Checkbox>
    {/if}
    {#if $context.item.hasAreaTarget}
      <Checkbox
        labelCssClass="checkbox"
        document={$context.item}
        field="system.target.prompt"
        checked={$context.system.target.prompt}
        disabled={!$context.editable}
        title={localize('DND5E.TemplatePromptTooltip')}
      >
        {localize('DND5E.TemplatePrompt')}
      </Checkbox>
    {/if}
    {#if $context.system.uses.per}
      <Checkbox
        labelCssClass="checkbox"
        document={$context.item}
        field="system.uses.prompt"
        checked={$context.system.uses.prompt}
        disabled={!$context.editable}
        title={localize('DND5E.LimitedUsesPromptTooltip')}
      >
        {localize('DND5E.LimitedUsesPrompt')}
      </Checkbox>
    {/if}
    {#if $context.item.type === 'spell' && $context.system.consume.type}
      <Checkbox
        labelCssClass="checkbox"
        document={$context.item}
        field="system.consume.scale"
        checked={$context.system.consume.scale}
        disabled={!$context.editable}
        title={localize('DND5E.ConsumeScalingTooltip')}
      >
        {localize('DND5E.ConsumeScaling')}
      </Checkbox>
    {/if}
  </ItemFormGroup>
{/if}
