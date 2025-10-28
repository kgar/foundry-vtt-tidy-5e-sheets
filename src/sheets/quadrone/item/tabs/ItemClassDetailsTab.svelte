<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DetailsSpellcasting from '../parts/DetailsSpellcasting.svelte';
  import ItemStartingEquipment from '../parts/ItemStartingEquipment.svelte';
  import { mapMulticlassingAbilitiesToSave } from 'src/utils/system-properties-quadrone';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;

  let abilities = $derived(context.primaryAbilities ?? []);
</script>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.ItemClassDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <FormGroup
    labelFor="{appId}-identifier"
    field={context.fields.identifier}
    document={context.item}
    config={{
      id: `${appId}-identifier`,
      placeholder: context.item.identifier,
      value: context.source.identifier,
    }}
    hint="{localize('DND5E.ClassIdentifierHint', {
      identifier: context.item.identifier,
    })} {localize('DND5E.IdentifierError')}"
  />

  <FormGroup
    labelFor="{appId}-hit-dice"
    label={localize('DND5E.CLASS.FIELDS.hd.label')}
    document={context.item}
    groupClasses="split-group"
  >
    <FormGroup
      label="DND5E.Denomination"
      localize={true}
      labelFor="{appId}-hit-dice"
      document={context.item}
      groupClasses="label-top"
      field={context.fields.hd.fields.denomination}
      config={{
        id: `${appId}-hit-dice`,
        value: context.source.hd.denomination,
      }}
      choices={context.config.hitDieTypes}
    ></FormGroup>
    <FormGroup
      label="DND5E.Spent"
      localize={true}
      labelFor="{appId}-hit-dice-spent"
      document={context.item}
      groupClasses="label-top"
      field={context.fields.hd.fields.spent}
      config={{
        id: `${appId}-hit-dice-spent`,
        value: context.source.hd.spent,
        placeholder: '0',
      }}
    ></FormGroup>
  </FormGroup>

  <FormGroup
    label="DND5E.CLASS.FIELDS.hd.additional.label"
    localize={true}
    labelFor="{appId}-hit-dice-additional"
    document={context.item}
    field={context.fields.hd.fields.additional}
    config={{
      id: `${appId}-hit-dice-additional`,
      value: context.source.hd.additional,
    }}
  ></FormGroup>

  <div class="form-group stacked class-properties checkbox-grid">
    <label for="">{localize(context.fields.properties.label ?? '')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.CLASS.Multiclass.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-group stacked primary-abilities checkbox-grid">
    <label for=""
      >{localize('DND5E.CLASS.FIELDS.primaryAbility.value.label')}</label
    >
    <div class="form-fields">
      {#each abilities as { value, label, selected } (value)}
        <label
          class="checkbox"
          for="{appId}-primaryAbility-value-{value?.slugify()}"
        >
          <CheckboxQuadrone
            id="{appId}-primaryAbility-value-{value?.slugify()}"
            document={context.item}
            field="system.primaryAbility.value"
            checked={selected}
            disabledChecked={context.system.primaryAbility.value.has(value)}
            {value}
            disabled={!context.unlocked}
            onDataPreparing={(ev) =>
              mapMulticlassingAbilitiesToSave(context, ev)}
          />
          {label}
        </label>
      {/each}
    </div>
    <p class="hint">
      {localize('DND5E.CLASS.FIELDS.primaryAbility.value.hint')}
    </p>
  </div>

  {#if Array.from(context.source.primaryAbility.value).length > 1}
    <div class="form-group">
      <label for="{appId}-primaryAbility-fields-all"
        >{localize('DND5E.CLASS.FIELDS.primaryAbility.all.label')}</label
      >
      <div class="form-fields">
        <CheckboxQuadrone
          id="{appId}-primaryAbility-fields-all"
          document={context.item}
          field="system.primaryAbility.fields.all"
          checked={context.source.primaryAbility.all}
          disabledChecked={context.system.primaryAbility.all}
          disabled={!context.unlocked}
        />
      </div>

      <p class="hint">
        {localize('DND5E.CLASS.FIELDS.primaryAbility.all.hint')}
      </p>
    </div>
  {/if}
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('DND5E.Spellcasting')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <DetailsSpellcasting />
</fieldset>

<ItemStartingEquipment />
