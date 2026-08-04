<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import type { SpecialTraitsContext } from 'src/settings/editors/special-traits-settings-editor.svelte';
  import type { Actor5e } from 'src/types/types';

  type Props = {
    actor: Actor5e;
    config: SpecialTraitsContext;
  };

  let { actor, config = $bindable() }: Props = $props();

  let idPrefix = `special-traits-${foundry.utils.randomID()}`;

  const localize = FoundryAdapter.localize;
</script>

<h2>
  {localize('DND5E.SpecialTraits')}
</h2>

<fieldset>
  <legend>
    {localize('TYPES.Item.class')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>
  <div class="form-group">
    <label for="{idPrefix}-original-class">
      {localize('DND5E.ClassMakeOriginal')}
    </label>
    <div class="form-fields">
      <select
        bind:value={config.originalClass}
        name="system.details.originalClass"
      >
        <SelectOptions
          data={config.flags.classes}
          labelProp="label"
          valueProp="value"
        />
      </select>
    </div>
  </div>
</fieldset>

{#each config.flags.sections as section}
  <fieldset>
    <legend>
      {section.label}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>
    {#each section.fields as fieldContext}
      {const isCheckbox =
        $derived(fieldContext instanceof foundry.data.fields.BooleanField)}
      {const id = $derived(`${actor.id}-${fieldContext.name.slugify().replaceAll('.', '-')}`)}
      <FormGroup
        labelFor={id}
        field={fieldContext.field}
        config={{
          id,
          value: fieldContext.value,
          name: fieldContext.name,
        }}
        localize={true}
        groupClasses={{ slim: isCheckbox }}
        disableOverriddenInputs
        onChange={(value) => {
          fieldContext.value = value;
        }}
      />
    {/each}
  </fieldset>
{/each}
