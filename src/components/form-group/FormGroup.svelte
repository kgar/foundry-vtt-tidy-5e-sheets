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

  type PartialBuilderProps = Partial<ComponentProps<typeof FormGroupBuilder>>;

  type Props = PartialBuilderProps & {
    value: any;
    name?: string;
    field: DataField;
    layout: Exclude<SheetLayout, 'all'>;
    document: any;
    editable?: boolean;
  };

  let {
    field,
    layout,
    document,
    value,
    name,
    editable = true,
    rootId,
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

    if (field instanceof foundry.data.fields.StringField) {
      // Handle choices - select
      let input =
        layout === 'classic' && field.choices
          ? componentWithProps(Select, {
              document: document,
              field: name ?? field.fieldPath,
              id: id,
              value,
              children: () => StringChoices(field),
              disabled: !editable,
            })
          : layout === 'classic' && !field.choices
            ? componentWithProps(TextInput, {
                document: document,
                field: name ?? field.fieldPath,
                id: id,
                selectOnFocus: true,
                value,
                disabled: !editable,
              })
            : layout === 'quadrone' && field.choices
              ? componentWithProps(SelectQuadrone, {
                  document: document,
                  field: name ?? field.fieldPath,
                  id: id,
                  value,
                  children: () => StringChoices(field),
                  disabled: !editable,
                })
              : layout === 'quadrone' && !field.choices
                ? componentWithProps(TextInputQuadrone, {
                    document: document,
                    field: name ?? field.fieldPath,
                    id: id,
                    selectOnFocus: true,
                    value,
                    disabled: !editable,
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
              field: name ?? field.fieldPath,
              id: id,
              value,
              children: () => NumberChoices(field),
              disabled: !editable,
            })
          : layout === 'classic' && !field.choices
            ? componentWithProps(NumberInput, {
                document: document,
                field: name ?? field.fieldPath,
                id: id,
                selectOnFocus: true,
                value,
                disabled: !editable,
              })
            : layout === 'quadrone' && field.choices
              ? componentWithProps(SelectQuadrone, {
                  document: document,
                  field: name ?? field.fieldPath,
                  id: id,
                  value,
                  children: () => NumberChoices(field),
                  disabled: !editable,
                })
              : layout === 'quadrone' && !field.choices
                ? componentWithProps(NumberInputQuadrone, {
                    document: document,
                    field: name ?? field.fieldPath,
                    id: id,
                    selectOnFocus: true,
                    value,
                    disabled: !editable,
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
              field: name ?? field.fieldPath,
              id: id,
              checked: !!value,
              disabled: !editable,
            })
          : componentWithProps(CheckboxQuadrone, {
              document: document,
              field: name ?? field.fieldPath,
              id: id,
              checked: !!value,
              disabled: !editable,
            });

      return [input];
    } else if (field instanceof dnd5e.dataModels.fields.FormulaField) {
      let input =
        layout === 'classic' && field.choices
          ? componentWithProps(Select, {
              document: document,
              field: name ?? field.fieldPath,
              id: id,
              value,
              children: () => StringChoices(field),
              disabled: !editable,
            })
          : layout === 'classic' && !field.choices
            ? componentWithProps(TextInput, {
                document: document,
                field: name ?? field.fieldPath,
                id: id,
                selectOnFocus: false,
                value,
                disabled: !editable,
              })
            : layout === 'quadrone' && field.choices
              ? componentWithProps(SelectQuadrone, {
                  document: document,
                  field: name ?? field.fieldPath,
                  id: id,
                  value,
                  children: () => StringChoices(field),
                  disabled: !editable,
                })
              : layout === 'quadrone' && !field.choices
                ? componentWithProps(TextInputQuadrone, {
                    document: document,
                    field: name ?? field.fieldPath,
                    id: id,
                    selectOnFocus: false,
                    value,
                    disabled: !editable,
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
