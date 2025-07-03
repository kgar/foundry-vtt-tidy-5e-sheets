<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { SpecialTraitsContext } from './SpecialTraitsApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getSheetContext<SpecialTraitsContext>());

  let flags = $derived(context.flags);

  let idPrefix = `special-traits-${foundry.utils.randomID()}`;

  const localize = FoundryAdapter.localize;
</script>

<h2>
  {localize('DND5E.SpecialTraits')}
</h2>

<div class="special-traits-container scroll-container tidy-form">
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
        <SelectQuadrone
          field="system.details.originalClass"
          document={context.actor}
          value={context.actor.system.details.originalClass}
        >
          <SelectOptions
            data={context.flags.classes}
            labelProp="label"
            valueProp="value"
          />
        </SelectQuadrone>
      </div>
    </div>
  </fieldset>

  {#each flags.sections as section}
    <fieldset onchange={() => context.actor.sheet.submit()}>
      <legend>
        {section.label}
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>
      {#each section.fields as field}
        {@const isCheckbox = field instanceof foundry.data.fields.BooleanField}
        <FormGroup
          rootId={idPrefix}
          document={context.actor}
          field={field.field}
          value={field.value}
          layout="quadrone"
          localize={true}
          name={field.name}
          groupClasses={{ slim: isCheckbox }}
          
        />
      {/each}
    </fieldset>
  {/each}
</div>
