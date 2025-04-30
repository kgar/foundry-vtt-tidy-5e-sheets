<script lang="ts">
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
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

  {#each flags.sections as section}
    <fieldset
      disabled={!context.unlocked}
      onchange={() => context.actor.sheet.submit()}
    >
      <legend>{section.label}</legend>
      {#each section.fields as field}
        <FormGroup
          document={context.actor}
          field={field.field}
          value={field.value}
          layout="classic"
          localize={true}
          editable={context.unlocked}
          name={field.name}
        />
      {/each}
    </fieldset>
  {/each}
</div>
