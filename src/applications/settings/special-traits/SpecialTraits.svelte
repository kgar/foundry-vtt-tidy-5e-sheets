<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import type { SpecialTraitsContext } from 'src/settings/editors/special-traits-settings-editor.svelte';
  import type { Actor5e, SpecialTraitSectionField } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

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
      {#if 'group' in fieldContext}
        <FormGroup
          labelFor="{actor.id}-{fieldContext.fields[0]?.name
            .slugify()
            .replaceAll('.', '-')}"
          localize={true}
          groupClasses="split-group"
          disableOverriddenInputs
          label={fieldContext.group.label}
          hint={fieldContext.group.hint}
        >
          {#each fieldContext.fields as fieldGroupMember}
            {const id = $derived(
              `${actor.id}-${fieldGroupMember.name.slugify().replaceAll('.', '-')}`,
            )}
            <FormGroup
              field={fieldGroupMember.field}
              choices={fieldGroupMember.choices}
              label={fieldGroupMember.label}
              labelFor={id}
              config={{
                id: id,
                value: fieldGroupMember.value,
                name: fieldGroupMember.name,
                classes: fieldGroupMember.classes,
                placeholder: fieldGroupMember.placeholder,
              }}
              groupClasses="label-top"
              onChange={(value) => {
                fieldGroupMember.value = value;
              }}
            />
          {/each}
        </FormGroup>
      {:else}
        {const isCheckbox = $derived(
          fieldContext instanceof foundry.data.fields.BooleanField,
        )}
        {const id = $derived(
          `${actor.id}-${fieldContext.name.slugify().replaceAll('.', '-')}`,
        )}
        <FormGroup
          labelFor={id}
          label={fieldContext.label}
          field={fieldContext.field}
          choices={fieldContext.choices}
          config={{
            id,
            value: fieldContext.value,
            name: fieldContext.name,
            classes: fieldContext.classes,
            placeholder: fieldContext.placeholder,
          }}
          localize={true}
          groupClasses={[{ slim: isCheckbox }, fieldContext.classes]}
          disableOverriddenInputs
          onChange={(value) => {
            fieldContext.value = value;
          }}
        />
      {/if}
    {/each}
  </fieldset>
{/each}
