<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { mapSystemDamageTypesToSave } from 'src/utils/system-properties-quadrone';
  import type { GroupableSelectOption } from 'src/types/types';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  interface Props {
    source: any;
    fields: any;
    system: any;
    prefix: string;
    denominationOptions: GroupableSelectOption[];
    numberPlaceholder?: string;
    types?: { label: string; value: string; selected: boolean }[] | undefined;
    heal?: boolean;
  }

  let {
    source,
    fields,
    system,
    prefix,
    denominationOptions,
    numberPlaceholder = '',
    types = undefined,
    heal,
  }: Props = $props();

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);
  let idPrefix = $derived(`${appId}-${prefix.replaceAll('.', '-')}`);

  const localize = FoundryAdapter.localize;
</script>

<!-- Custom Formula -->
<FormGroup
  label="DND5E.Formula"
  document={context.document}
  groupClasses="split-group"
  fields={[
    {
      field: fields.custom.fields.enabled,
      config: {
        id: `${idPrefix}custom-enabled`,
        value: source.custom.enabled,
      },
      disabledValue: system.custom.enabled,
    },
    {
      condition: source.custom.enabled,
      field: fields.custom.fields.formula,
      config: {
        id: `${idPrefix}custom-formula`,
        value: source.custom.formula,
      },
    },
  ]}
/>

<!-- Simple Input -->
{#if !source.custom.enabled}
  <FormGroup
    label={heal ? localize('DND5E.HEAL.Title') : localize('DND5E.DAMAGE.Title')}
    groupClasses="split-group"
  >
    <FormGroup
      label="DND5E.Number"
      labelFor="{idPrefix}number"
      document={context.document}
      field={fields.number}
      config={{
        id: `${idPrefix}number`,
        value: source.number,
        placeholder: numberPlaceholder,
        step: 1,
      }}
      groupClasses="label-top"
    />
    <FormGroup
      label="DND5E.Die"
      labelFor="{idPrefix}denomination"
      document={context.document}
      field={fields.denomination}
      config={{
        id: `${idPrefix}denomination`,
        value: source.denomination,
      }}
      choices={denominationOptions}
      groupClasses="label-top"
    />
    <FormGroup
      label="DND5E.Bonus"
      labelFor="{idPrefix}bonus"
      document={context.document}
      field={fields.bonus}
      config={{
        id: `${idPrefix}bonus`,
        value: source.bonus,
      }}
      groupClasses="label-top"
    />
  </FormGroup>
{/if}

<!-- Types -->
{#if types}
  <div class="form-group stacked damage-types checkbox-grid">
    <label for="">{localize('DND5E.Type')}</label>
    <div class="form-fields">
      {#each types as { value, label, selected } (value)}
        <label class="checkbox" for="{idPrefix}types-{value?.slugify()}">
          <CheckboxQuadrone
            id="{idPrefix}types-{value?.slugify()}"
            document={context.item}
            field="{prefix}types"
            checked={selected}
            {value}
            disabledChecked={system.types.has(value)}
            disabled={!context.unlocked}
            onDataPreparing={(ev) =>
              mapSystemDamageTypesToSave(prefix, source, ev)}
          />
          {label}
        </label>
      {/each}
    </div>
  </div>
{/if}
