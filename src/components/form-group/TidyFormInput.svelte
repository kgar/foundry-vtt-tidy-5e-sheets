<script lang="ts">
  import type {
    DataField,
    FormInputConfig,
    NumberField,
    StringField,
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

  type Props = {
    field: DataField;
    config: FormInputConfig;
    document: any;
    disableOverriddenInputs?: boolean;
    name?: string;
  };

  let { field, config, document, disableOverriddenInputs, name }: Props =
    $props();

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

    const tooltip = disabledViaEffect
      ? FoundryAdapter.localize('DND5E.ActiveEffectOverrideWarning')
      : undefined;

    if (field instanceof foundry.data.fields.StringField && field.choices) {
      return componentWithProps(SelectQuadrone, {
        document: document,
        field: effectiveFieldPath,
        id: config.id,
        value: config.value,
        children: () => StringChoices(field),
        disabled,
        ['data-tooltip']: tooltip,
      });
    }

    if (field instanceof foundry.data.fields.StringField && !field.choices) {
      return componentWithProps(TextInputQuadrone, {
        document: document,
        field: effectiveFieldPath,
        id: config.id,
        value: config.value,
        selectOnFocus: true,
        disabled,
        ['data-tooltip']: tooltip,
        placeholder: config.placeholder,
      });
    }

    if (field instanceof foundry.data.fields.NumberField && field.choices) {
      return componentWithProps(SelectQuadrone, {
        document: document,
        field: effectiveFieldPath,
        id: config.id,
        value: config.value,
        children: () => NumberChoices(field),
        disabled,
        ['data-tooltip']: tooltip,
      });
    }

    if (field instanceof foundry.data.fields.NumberField && !field.choices) {
      return componentWithProps(NumberInputQuadrone, {
        document: document,
        field: effectiveFieldPath,
        id: config.id,
        selectOnFocus: true,
        value: config.value,
        disabled,
        ['data-tooltip']: tooltip,
        placeholder: config.placeholder,
      });
    }

    if (field instanceof foundry.data.fields.BooleanField) {
      return componentWithProps(CheckboxQuadrone, {
        document: document,
        field: effectiveFieldPath,
        id: config.id,
        checked: !!config.value,
        disabled,
        ['data-tooltip']: tooltip,
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
    choices: string[] | object | Function,
  ): { label: string; value: string }[] {
    if (Array.isArray(choices)) {
      return choices.map((c) => ({
        label: c,
        value: c,
      }));
    }

    if (typeof choices === 'function') {
      return Object.entries<string>(choices()).map(([value, label]) => ({
        label,
        value,
      }));
    }

    if (typeof choices === 'object') {
      return Object.entries(choices).map(([value, label]) => ({
        label,
        value,
      }));
    }

    return [];
  }
</script>

<tidyInput.component {...tidyInput.props} />

{#snippet StringChoices(field: StringField)}
  {@const options = enumerateChoices(field.choices!)}
  <SelectOptions
    blank={field.blank ? '' : null}
    labelProp="label"
    valueProp="value"
    data={options}
  />
{/snippet}

{#snippet NumberChoices(field: NumberField)}
  {@const options = enumerateChoices(field.choices!)}
  <SelectOptions labelProp="label" valueProp="value" data={options} />
{/snippet}
