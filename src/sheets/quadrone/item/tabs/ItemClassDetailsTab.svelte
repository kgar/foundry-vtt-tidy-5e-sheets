<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DetailsSpellcasting from '../parts/DetailsSpellcasting.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemStartingEquipment from '../parts/ItemStartingEquipment.svelte';
  import { mapMulticlassingAbilitiesToSave } from 'src/utils/system-properties';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  let abilities = $derived(
    Object.entries<any>(context.config.abilities).map(([key, value]) => ({
      key: key,
      label: value.label,
    })),
  );

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemClassDetails')}
  </legend>

  <div class="form-group">
    <label for="{appId}-identifier">{localize('DND5E.Identifier')}</label>
    <div class="form-fields">
      <TextInput
        id="{appId}-identifier"
        document={context.item}
        field="system.identifier"
        value={context.source.identifier}
        placeholder={context.item.identifier}
        disabled={!context.editable}
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
          <Select
            id="{appId}-hit-dice"
            document={context.item}
            field="system.hd.denomination"
            value={context.source.hd.denomination}
            disabled={!context.editable}
          >
            {#each context.config.hitDieTypes as type}
              <option value={type}>{type}</option>
            {/each}
          </Select>
        </div>
      </div>

      <div class="form-group label-top">
        <label for="{appId}-hit-dice-spent"
          >{localize('DND5E.CLASS.FIELDS.hd.spent.label')}</label
        >
        <div class="form-fields">
          <NumberInput
            id="{appId}-hitDiceUsed"
            document={context.item}
            field="system.hd.spent"
            value={context.source.hd.spent}
            placeholder="0"
            disabled={!context.editable}
          />
        </div>
      </div>
    </div>
  </div>

  <div class="form-group">
    <label>{localize('DND5E.CLASS.FIELDS.hd.additional.label')}</label>
    <div class="form-fields">
      <TextInput
        document={context.item}
        field="system.hd.additional"
        value={context.source.hd.additional}
      />
    </div>
    <p class="hint">
      {localize('DND5E.CLASS.FIELDS.hd.additional.hint')}
    </p>
  </div>
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.ItemClassDetails')}
  </legend>

  <div class="form-group stacked primary-abilities checkbox-grid">
    <label for=""
      >{localize('DND5E.CLASS.FIELDS.primaryAbility.value.label')}</label
    >
    <div class="form-fields">
      {#each abilities as { key, label } (key)}
        <Checkbox
          id="{appId}-primaryAbility-value-{key?.slugify()}"
          labelCssClass="checkbox"
          document={context.item}
          field="system.primaryAbility.value"
          checked={context.system.primaryAbility.value.has(key)}
          value={key}
          disabled={!context.editable}
          onDataPreparing={(ev) => mapMulticlassingAbilitiesToSave(context, ev)}
        >
          {label}
        </Checkbox>
      {/each}
    </div>
    <p class="hint">
      {localize('DND5E.CLASS.FIELDS.primaryAbility.value.hint')}
    </p>
  </div>

  {#if context.source.primaryAbility.value.size > 1}
    <div class="form-group">
      <label for="{appId}-primaryAbility-fields-all"
        >{localize('DND5E.CLASS.FIELDS.primaryAbility.all.label')}</label
      >
      <div class="form-fields">
        <Checkbox
          id="{appId}-primaryAbility-fields-all"
          document={context.item}
          field="system.primaryAbility.fields.all"
          checked={context.source.primaryAbility.all}
          disabled={!context.editable}
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
  </legend>

  <DetailsSpellcasting />
</fieldset>

<ItemStartingEquipment />
