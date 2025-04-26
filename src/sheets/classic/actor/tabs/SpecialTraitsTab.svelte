<script lang="ts">
  import type { FormGroupConfig, FormInputConfig } from 'foundry.data.fields';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    SpecialTraitSectionField,
  } from 'src/types/types';

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  let flags = $derived(context.flags);

  let appId = $derived(context.appId);

  const localize = FoundryAdapter.localize;

  function createFormGroupHtml(field: SpecialTraitSectionField) {
    return field.field.toFormGroup(
      {
        localize: true,
        label: field.field.label ?? field.field.fieldPath,
      } satisfies FormGroupConfig,
      {
        name: field.name,
        input: field.input,
        value: field.value,
      } satisfies FormInputConfig,
    ).outerHTML;
  }
</script>

<div class="special-traits-container scroll-container">
  <fieldset>
    <legend>{localize('TYPES.Item.class')}</legend>
    <div class="form-group">
      <label for="{appId}-original-class">
        {localize('DND5E.ClassMakeOriginal')}
      </label>
      <Select
        field="system.details.originalClass"
        document={context.actor}
        value={context.system.details.originalClass}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.flags.classes}
          labelProp="label"
          valueProp="value"
        />
      </Select>
    </div>
  </fieldset>

  {#key context}
    {#each flags.sections as section}
      <fieldset
        disabled={!context.unlocked}
        onchange={() => context.actor.sheet.submit()}
      >
        <legend>{section.label}</legend>
        {#each section.fields as field}
          <!-- TODO: Make a svelte component that can process DataField subclasses and churn out Tidy inputs and Tidy-style form group class structures. -->
          {@const element = createFormGroupHtml(field)}
          {@html element}
        {/each}
      </fieldset>
    {/each}
  {/key}
</div>
