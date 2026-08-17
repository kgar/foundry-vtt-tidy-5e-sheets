<script lang="ts">
  import {
    type DataField,
    type DocumentUUIDFieldOptions,
    type FormInputConfig,
    type NumberFieldOptions,
  } from 'foundry.data.fields';
  import SelectOptions from '../inputs/SelectOptions.svelte';
  import FoundryFormInput from './FoundryFormInput.svelte';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { buildDataset, isNil } from 'src/utils/data';
  import StringTags from '../inputs/StringTags.svelte';
  import DocumentTag from '../inputs/DocumentTag.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  type Choices<T = any> = T[] | object | Function;

  type Props = {
    blankLabel?: string;
    choices?: Choices | null;
    condition?: boolean;
    config?: FormInputConfig;
    disabledValue?: any;
    disableOverriddenInputs?: boolean;
    document: any;
    field: DataField;
    tooltip?: string;
    labelAttr?: string;
    valueAttr?: string;
    submissionMode?: 'full' | 'single' | 'none';
  };

  let {
    blankLabel,
    choices,
    condition = true,
    config = {},
    disableOverriddenInputs,
    disabledValue,
    document,
    field,
    labelAttr,
    tooltip,
    valueAttr,
    submissionMode = 'single',
  }: Props = $props();

  function enumerateChoices(
    choices: string[] | object[] | object | Function | null | undefined,
  ): { label: string; value: string }[] {
    if (Array.isArray(choices) && typeof choices[0] === 'string') {
      return choices.map((c) => ({
        label: c,
        value: c,
      }));
    }

    if (Array.isArray(choices) && typeof choices[0] === 'object') {
      return choices.map((c) => ({
        label: labelAttr ? c[labelAttr] : c.label,
        value: valueAttr ? c[valueAttr] : c.value,
        group: c.group,
        rule: c.rule,
      }));
    }

    if (typeof choices === 'function') {
      return Object.entries<string>(choices()).map(([value, label]) => ({
        label,
        value,
      }));
    }

    if (typeof choices === 'object' && choices) {
      const entries = Object.entries(choices);

      let getLabel =
        typeof entries[0]?.[1] === 'object'
          ? (value: any) => (labelAttr ? value[labelAttr] : value.label)
          : (value: any) => value;

      return entries.map(([key, value]) => ({
        label: getLabel(value),
        value: valueAttr ? value[valueAttr] : key,
      }));
    }

    return [];
  }

  function getBlankValue() {
    const usesBlank =
      !isNil(blankLabel) ||
      ('blank' in config
        ? config.blank
        : 'blank' in field
          ? field.blank
          : false);
    return usesBlank ? (blankLabel ?? '') : null;
  }

  const effectiveFieldPath = $derived(config.name ?? field.fieldPath);
  const submissionAttributes = $derived(
    submissionMode !== 'none'
      ? {
          [submissionMode === 'full' ? 'name' : 'data-name']:
            effectiveFieldPath,
        }
      : {},
  );
  const disabledViaEffect = $derived(
    disableOverriddenInputs &&
      ActiveEffectsHelper.isActiveEffectAppliedToField(
        document,
        effectiveFieldPath,
      ),
  );
  const disabled = $derived(disabledViaEffect || config.disabled);

  const attributes = $derived.by(() => {
    const attributes: Record<string, string> = {};

    if (config.dataset) {
      Object.assign(attributes, buildDataset(config.dataset));
    }

    if (config.aria) {
      for (const [k, v] of Object.entries(config.aria)) {
        attributes[`aria-${k}`] = v;
      }
    }

    const effectiveTooltip = disabledViaEffect
      ? FoundryAdapter.localize('DND5E.ActiveEffectOverrideWarning')
      : tooltip;

    if (effectiveTooltip) {
      attributes['data-tooltip'] = effectiveTooltip;
    }

    return attributes;
  });
</script>

{#if condition}
  {#if field instanceof foundry.data.fields.DocumentUUIDField}
    {const options: FormInputConfig & DocumentUUIDFieldOptions = config}
    <DocumentTag
      {document}
      field={effectiveFieldPath}
      id={options.id}
      {disabled}
      value={options.value}
      type={options.type ?? field.options.type}
    />
  {:else if field instanceof foundry.data.fields.SetField && field.element instanceof foundry.data.fields.StringField}
    <StringTags
      {document}
      field={effectiveFieldPath}
      id={config.id}
      {disabled}
      value={config.value}
      placeholder={config.placeholder}
    />
  {:else if field instanceof foundry.data.fields.StringField && (choices ?? field.choices)}
    {let stringChoices = $derived.by(() => {
      if (
        'choices' in field &&
        field instanceof foundry.data.fields.StringField
      ) {
        return choices ?? field.choices;
      }

      return null;
    })}
    {const options = $derived(enumerateChoices(stringChoices))}
    {const blankLabel = $derived(getBlankValue())}
    <select
      id={config.id}
      value={config.value?.toString()}
      {disabled}
      class={config.classes}
      {...submissionAttributes}
      {...attributes}
    >
      <SelectOptions
        blank={blankLabel}
        labelProp="label"
        valueProp="value"
        data={options}
        blankValue={field.nullable ? null : ''}
      />
    </select>
  {:else if field instanceof foundry.data.fields.StringField && !(choices ?? field.choices)}
    <input
      type="text"
      id={config.id}
      value={config.value}
      {@attach InputAttachments.selectOnFocus}
      {disabled}
      placeholder={config.placeholder}
      class={config.classes}
      data-formula-editor={field.constructor.name === 'FormulaField'
        ? ''
        : undefined}
      {...submissionAttributes}
      {...attributes}
    />
  {:else if field instanceof foundry.data.fields.NumberField && (choices ?? field.choices)}
    {let numberChoices = $derived.by(() => {
      if (
        'choices' in field &&
        field instanceof foundry.data.fields.NumberField
      ) {
        return choices ?? field.choices;
      }

      return null;
    })}
    {const options = $derived(enumerateChoices(numberChoices))}
    {const blankLabel = $derived(getBlankValue())}
    <select
      id={config.id}
      data-dtype="Number"
      value={config.value?.toString()}
      {disabled}
      class={config.classes}
      {...submissionAttributes}
      {...attributes}
    >
      <SelectOptions
        blank={blankLabel}
        labelProp="label"
        valueProp="value"
        data={options}
        blankValue={field.nullable ? null : ''}
      />
    </select>
  {:else if field instanceof foundry.data.fields.NumberField && !(choices ?? field.choices)}
    {const numberConfig = config as FormInputConfig & NumberFieldOptions}
    {const min = $derived(
      (numberConfig.min ?? numberConfig.step !== 'any') ? numberConfig.step : 1,
    )}
    <input
      type="number"
      id={config.id}
      value={numberConfig.value}
      {@attach InputAttachments.selectOnFocus}
      {disabled}
      placeholder={numberConfig.placeholder}
      min={min ?? field.min}
      max={numberConfig.max ?? field.max}
      step={numberConfig.step ?? field.step}
      class={numberConfig.classes}
      {...submissionAttributes}
      {...attributes}
    />
  {:else if field instanceof foundry.data.fields.BooleanField}
    {let value = $derived(!!config.value)}
    {let checked = $derived(disabled ? (disabledValue ?? value) : value)}
    <input
      type="checkbox"
      id={config.id}
      {checked}
      {disabled}
      class={config.classes}
      {...submissionAttributes}
      {...attributes}
    />
  {:else}
    <FoundryFormInput {field} options={config} />
  {/if}
{/if}
