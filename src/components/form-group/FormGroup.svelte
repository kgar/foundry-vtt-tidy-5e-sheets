<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import FormGroupBuilder from './FormGroupBuilder.svelte';
  import type {
    DataField,
    NumberField,
    StringField,
  } from 'foundry.data.fields';
  import { componentWithProps } from 'src/utils/component';
  import type { SheetLayout } from 'src/api';
  import TextInputQuadrone from '../inputs/TextInputQuadrone.svelte';
  import TextInput from '../inputs/TextInput.svelte';
  import NumberInput from '../inputs/NumberInput.svelte';
  import NumberInputQuadrone from '../inputs/NumberInputQuadrone.svelte';
  import Checkbox from '../inputs/Checkbox.svelte';
  import CheckboxQuadrone from '../inputs/CheckboxQuadrone.svelte';
  import Select from '../inputs/Select.svelte';
  import SelectQuadrone from '../inputs/SelectQuadrone.svelte';
  import SelectOptions from '../inputs/SelectOptions.svelte';
  import { isNil } from 'src/utils/data';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';

  type PartialBuilderProps = Partial<ComponentProps<typeof FormGroupBuilder>>;

  type Props = PartialBuilderProps & {
    value: any;
    name?: string;
    field: DataField;
    layout: Exclude<SheetLayout, 'all'>;
    document: any;
    editable?: boolean;
    disableOverriddenInputs?: boolean;
  };

  let {
    field,
    layout,
    document,
    value,
    name,
    editable = true,
    rootId,
    disableOverriddenInputs,
    ...rest
  }: Props = $props();

  function getFieldId(field: DataField, index?: number) {
    const identifier = name ?? field.fieldPath;
    const id = [
      rootId,
      identifier ?? '',
      index !== undefined ? index : '',
    ].filterJoin('-');

    return id;
  }

  // TODO: Send off to a static function to get the input(s) and optional rootId

  let inputs = $derived.by(() => {
    const id = !isNil(rootId) ? getFieldId(field) : undefined;

    const effectiveField = name ?? field.fieldPath;

    const disabledViaEffect =
      disableOverriddenInputs &&
      ActiveEffectsHelper.isActiveEffectAppliedToField(
        document,
        effectiveField,
      );

    const effectOverrideTooltip = disabledViaEffect ? '' : undefined;

    const disabled = !editable || disabledViaEffect;

    if (field instanceof foundry.data.fields.StringField) {
      // Handle choices - select
      let input =
        layout === 'classic' && field.choices
          ? componentWithProps(Select, {
              document: document,
              field: effectiveField,
              id: id,
              value,
              children: () => StringChoices(field),
              disabled,
              tooltip: effectOverrideTooltip,
            })
          : layout === 'classic' && !field.choices
            ? componentWithProps(TextInput, {
                document: document,
                field: effectiveField,
                id: id,
                selectOnFocus: true,
                value,
                disabled,
                tooltip: effectOverrideTooltip,
              })
            : layout === 'quadrone' && field.choices
              ? componentWithProps(SelectQuadrone, {
                  document: document,
                  field: effectiveField,
                  id: id,
                  value,
                  children: () => StringChoices(field),
                  disabled,
                  ['data-tooltip']: effectOverrideTooltip,
                })
              : layout === 'quadrone' && !field.choices
                ? componentWithProps(TextInputQuadrone, {
                    document: document,
                    field: effectiveField,
                    id: id,
                    selectOnFocus: true,
                    value,
                    disabled,
                    ['data-tooltip']: effectOverrideTooltip,
                  })
                : undefined;

      if (input !== undefined) {
        return [input];
      }
    } else if (field instanceof foundry.data.fields.NumberField) {
      // Handle choices - select
      let input =
        layout === 'classic' && field.choices
          ? componentWithProps(Select, {
              document: document,
              field: effectiveField,
              id: id,
              value,
              children: () => NumberChoices(field),
              disabled,
              tooltip: effectOverrideTooltip,
            })
          : layout === 'classic' && !field.choices
            ? componentWithProps(NumberInput, {
                document: document,
                field: effectiveField,
                id: id,
                selectOnFocus: true,
                value,
                disabled,
                tooltip: effectOverrideTooltip,
              })
            : layout === 'quadrone' && field.choices
              ? componentWithProps(SelectQuadrone, {
                  document: document,
                  field: effectiveField,
                  id: id,
                  value,
                  children: () => NumberChoices(field),
                  disabled,
                  ['data-tooltip']: effectOverrideTooltip,
                })
              : layout === 'quadrone' && !field.choices
                ? componentWithProps(NumberInputQuadrone, {
                    document: document,
                    field: effectiveField,
                    id: id,
                    selectOnFocus: true,
                    value,
                    disabled,
                    ['data-tooltip']: effectOverrideTooltip,
                  })
                : undefined;

      if (input) {
        return [input];
      }
    } else if (field instanceof foundry.data.fields.BooleanField) {
      let input =
        layout === 'classic'
          ? componentWithProps(Checkbox, {
              document: document,
              field: effectiveField,
              id: id,
              checked: !!value,
              disabled,
              tooltip: effectOverrideTooltip,
            })
          : componentWithProps(CheckboxQuadrone, {
              document: document,
              field: effectiveField,
              id: id,
              checked: !!value,
              disabled,
              ['data-tooltip']: effectOverrideTooltip,
            });

      return [input];
    } else if (field instanceof dnd5e.dataModels.fields.FormulaField) {
      let input =
        layout === 'classic' && field.choices
          ? componentWithProps(Select, {
              document: document,
              field: effectiveField,
              id: id,
              value,
              children: () => StringChoices(field),
              disabled,
              tooltip: effectOverrideTooltip,
            })
          : layout === 'classic' && !field.choices
            ? componentWithProps(TextInput, {
                document: document,
                field: effectiveField,
                id: id,
                selectOnFocus: false,
                value,
                disabled,
                tooltip: effectOverrideTooltip,
              })
            : layout === 'quadrone' && field.choices
              ? componentWithProps(SelectQuadrone, {
                  document: document,
                  field: effectiveField,
                  id: id,
                  value,
                  children: () => StringChoices(field),
                  disabled,
                  ['data-tooltip']: effectOverrideTooltip,
                })
              : layout === 'quadrone' && !field.choices
                ? componentWithProps(TextInputQuadrone, {
                    document: document,
                    field: effectiveField,
                    id: id,
                    selectOnFocus: false,
                    value,
                    disabled,
                    ['data-tooltip']: effectOverrideTooltip,
                  })
                : undefined;

      if (input) {
        return [input];
      }
    }

    return []; // TODO: Handle when we can't provide an input
  });

  let builderProps = $derived.by(() => {
    let props: PartialBuilderProps = {
      ...rest,
      label: rest.label ?? field.label ?? field.fieldPath,
      groupClasses:
        rest.groupClasses /* TODO: do we append more classes or is this just a bonus? */,
      hidden: rest.hidden,
      hint: rest.hint ?? field.hint,
      localize: !!rest.localize,
    };

    return props;
  });

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

<FormGroupBuilder {inputs} {...builderProps} />

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
