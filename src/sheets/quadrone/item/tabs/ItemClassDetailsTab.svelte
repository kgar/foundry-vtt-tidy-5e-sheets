<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DetailsSpellcasting from '../parts/DetailsSpellcasting.svelte';
  import ItemStartingEquipment from '../parts/ItemStartingEquipment.svelte';
  import { mapMulticlassingAbilitiesToSave } from 'src/utils/system-properties-quadrone';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;

  let abilities = $derived(context.primaryAbilities ?? []);
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemClassDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <FormGroup
    field={context.fields.identifier}
    document={context.item}
    config={{
      id: `${appId}-identifier`,
      disabled: !context.unlocked,
      placeholder: context.item.identifier,
      value: context.source.identifier,
    }}
    hint="{localize('DND5E.ClassIdentifierHint', {
      identifier: context.item.identifier,
    })} {localize('DND5E.IdentifierError')}"
  />
  <div class="form-group">
    <label for="{appId}-identifier">{localize('DND5E.Identifier')}</label>
    <div class="form-fields">
      <TextInputQuadrone
        id="{appId}-identifier"
        document={context.item}
        field="system.identifier"
        value={context.source.identifier}
        placeholder={context.item.identifier}
        disabled={!context.unlocked}
      />
    </div>
    <p class="hint">
      {@html localize('DND5E.ClassIdentifierHint', {
        identifier: context.item.identifier,
      })}
      {localize('DND5E.IdentifierError')}
    </p>
  </div>

  
  <div class="form-group split-group">
    <label for="{appId}-hit-dice"
      >{localize('DND5E.CLASS.FIELDS.hd.label')}</label
    >
    <div class="form-fields">
      <div class="form-group label-top">
        <label for="{appId}-hit-dice">{localize('DND5E.Denomination')}</label>
        <div class="form-fields">
          <SelectQuadrone
            id="{appId}-hit-dice"
            document={context.item}
            field="system.hd.denomination"
            value={context.source.hd.denomination}
            disabled={!context.unlocked}
          >
            {#each context.config.hitDieTypes as type}
              <option value={type}>{type}</option>
            {/each}
          </SelectQuadrone>
        </div>
      </div>

      <div class="form-group label-top">
        <label for="{appId}-hit-dice-spent"
          >{localize('DND5E.CLASS.FIELDS.hd.spent.label')}</label
        >
        <div class="form-fields">
          <NumberInputQuadrone
            id="{appId}-hitDiceUsed"
            document={context.item}
            field="system.hd.spent"
            value={context.source.hd.spent}
            placeholder="0"
            disabled={!context.unlocked}
          />
        </div>
      </div>
    </div>
  </div>

  <div class="form-group">
    <label>{localize('DND5E.CLASS.FIELDS.hd.additional.label')}</label>
    <div class="form-fields">
      <TextInputQuadrone
        document={context.item}
        field="system.hd.additional"
        value={context.source.hd.additional}
        disabled={!context.unlocked}
      />
    </div>
    <p class="hint">
      {localize('DND5E.CLASS.FIELDS.hd.additional.hint')}
    </p>
  </div>
</fieldset>

<fieldset>
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

<fieldset>
  <legend>
    {localize('DND5E.Spellcasting')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <DetailsSpellcasting />
</fieldset>

<ItemStartingEquipment />
