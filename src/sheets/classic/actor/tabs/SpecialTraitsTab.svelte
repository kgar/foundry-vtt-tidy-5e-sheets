<script lang="ts">
  import FormGroupClassic from 'src/components/form-group/FormGroupClassic.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  let flags = $derived(context.flags);

  let appId = $derived(context.appId);

  const localize = FoundryAdapter.localize;
</script>

<div class="special-traits-container scroll-container tidy-form">
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

  {#each flags.sections as section}
    <fieldset
      disabled={!context.unlocked}
      onchange={() => context.actor.sheet.submit()}
    >
      <legend>{section.label}</legend>
      {#each section.fields as field}
        <FormGroupClassic
          rootId={context.rootId}
          document={context.actor}
          field={field.field}
          value={field.value}
          localize={true}
          editable={context.unlocked}
          name={field.name}
        />
      {/each}
    </fieldset>
  {/each}
</div>
