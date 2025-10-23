<script lang="ts">
  import {
    type DataField,
    type FormInputConfig,
    type NumberFieldOptions,
  } from 'foundry.data.fields';
  import {
    componentWithProps,
    type ComponentWithProps,
  } from 'src/utils/component';
  import SelectQuadrone from '../inputs/SelectQuadrone.svelte';
  import SelectOptions from '../inputs/SelectOptions.svelte';
  import FoundryFormInput from './FoundryFormInput.svelte';
  import TextInputQuadrone from '../inputs/TextInputQuadrone.svelte';
  import NumberInputQuadrone from '../inputs/NumberInputQuadrone.svelte';
  import CheckboxQuadrone from '../inputs/CheckboxQuadrone.svelte';
  import { debug } from 'src/utils/logging';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ComponentProps } from 'svelte';
  import { buildDataset } from 'src/utils/data';

  type Choices<T = any> = T[] | object | Function;

  type Props = {
    blank?: string;
    choices?: Choices;
    condition?: boolean;
    config?: FormInputConfig;
    disabledValue?: any;
    disableOverriddenInputs?: boolean;
    document: any;
    field: DataField;
    name?: string;
    tooltip?: string;
    labelAttr?: string;
    valueAttr?: string;
  };

  let {
    blank,
    choices,
    condition = true,
    config = {},
    disableOverriddenInputs,
    disabledValue,
    document,
    field,
    labelAttr,
    name,
    tooltip,
    valueAttr,
  }: Props = $props();

  function getInputComponent(
    field: DataField,
    config: FormInputConfig,
    document: any,
    disableOverriddenInputs: boolean | undefined,
  ) {
    // TODO: Hook here, allow supplying an HTML input and props (if only Svelte could work this way...)

    const effectiveFieldPath = name ?? field.fieldPath;

    const disabledViaEffect =
      disableOverriddenInputs &&
      ActiveEffectsHelper.isActiveEffectAppliedToField(
        document,
        effectiveFieldPath,
      );

    const disabled = disabledViaEffect || config.disabled;

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

    if (
      field instanceof foundry.data.fields.StringField &&
      (choices ?? field.choices)
    ) {
      return {
        ...componentWithProps(SelectQuadrone, {
          document: document,
          field: effectiveFieldPath,
          id: config.id,
          value: config.value,
          disabled,
          class: config.classes,
          ...attributes,
        }),
        childrenArgs: [],
      };
    }

    if (
      field instanceof foundry.data.fields.StringField &&
      !(choices ?? field.choices)
    ) {
      const props: ComponentProps<typeof TextInputQuadrone> = {
        document: document,
        field: effectiveFieldPath,
        id: config.id,
        value: config.value,
        selectOnFocus: true,
        disabled,
        class: config.classes,
        placeholder: config.placeholder,
        ...attributes,
      };

      if (field.constructor.name === 'FormulaField') {
        props['data-formula-editor'] = '';
      }

      return componentWithProps(TextInputQuadrone, props);
    }

    if (
      field instanceof foundry.data.fields.NumberField &&
      (choices ?? field.choices)
    ) {
      return componentWithProps(SelectQuadrone, {
        document: document,
        field: effectiveFieldPath,
        id: config.id,
        value: config.value,
        disabled,
        class: config.classes,
        ...attributes,
      });
    }

    if (
      field instanceof foundry.data.fields.NumberField &&
      !(choices ?? field.choices)
    ) {
      let numberConfig = config as FormInputConfig & NumberFieldOptions;
      return componentWithProps(NumberInputQuadrone, {
        document: document,
        field: effectiveFieldPath,
        id: numberConfig.id,
        selectOnFocus: true,
        value: numberConfig.value,
        disabled,
        placeholder: numberConfig.placeholder,
        min: numberConfig.min ?? field.min,
        max: numberConfig.max ?? field.max,
        step: numberConfig.step ?? field.step,
        class: config.classes,
        ...attributes,
      });
    }

    if (field instanceof foundry.data.fields.BooleanField) {
      return componentWithProps(CheckboxQuadrone, {
        document: document,
        field: effectiveFieldPath,
        id: config.id,
        checked: !!config.value,
        disabled,
        disabledChecked: disabledValue,
        class: config.classes,
        ...attributes,
      });
    }

    debug('FoundryFormInput returned - Missing TidyFormInput for data field', {
      label: field.label,
      fieldPath: field.fieldPath,
      field,
    });

    return componentWithProps(FoundryFormInput, {
      field: field,
      options: config,
    });
  }

  let tidyInput: ComponentWithProps<any> = $derived(
    getInputComponent(field, config, document, disableOverriddenInputs),
  );

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
        rule: c.rule
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
          ? (objValue: any) =>
              labelAttr ? objValue[labelAttr] : objValue.label
          : (objValue: any) => objValue;

      return entries.map(([value, label]) => ({
        label: getLabel(label),
        value,
      }));
    }

    return [];
  }

  // There has to be a better way.
  let stringChoices = $derived.by(() => {
    if (
      'choices' in field &&
      field instanceof foundry.data.fields.StringField
    ) {
      return choices ?? field.choices;
    }

    return null;
  });

  let numberChoices = $derived.by(() => {
    if (
      'choices' in field &&
      field instanceof foundry.data.fields.NumberField
    ) {
      return choices ?? field.choices;
    }

    return null;
  });
</script>

{#if condition}
  <tidyInput.component {...tidyInput.props}>
    {#if stringChoices}
      {@render StringChoices(stringChoices)}
    {:else if numberChoices}
      {@render NumberChoices(numberChoices)}
    {/if}
  </tidyInput.component>
{/if}

{#snippet StringChoices(stringChoices: Choices<string>)}
  {@const options = enumerateChoices(stringChoices)}
  {@const blankValue = 'blank' in field && field.blank ? (blank ?? '') : null}
  <SelectOptions
    blank={blankValue}
    labelProp="label"
    valueProp="value"
    data={options}
  />
{/snippet}

{#snippet NumberChoices(numberChoices: Choices<number>)}
  {#if numberChoices}
    {@const options = enumerateChoices(numberChoices)}
    <SelectOptions labelProp="label" valueProp="value" data={options} />
  {/if}
{/snippet}
