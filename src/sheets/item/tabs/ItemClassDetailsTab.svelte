<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DetailsSpellcasting from '../parts/DetailsSpellcasting.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemStartingEquipment from '../parts/ItemStartingEquipment.svelte';
  import { CONSTANTS } from 'src/constants';
  import { mapMulticlassingAbilitiesToSave } from 'src/utils/system-properties';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  $: abilities = Object.entries<any>($context.config.abilities).map(
    ([key, value]) => ({
      key: key,
      label: value.label,
    }),
  );

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.ItemClassDetails')}</h3>

<div class="form-group">
  <label for="{appId}-identifier">{localize('DND5E.Identifier')}</label>
  <div class="form-fields">
    <TextInput
      id="{appId}-identifier"
      document={$context.item}
      field="system.identifier"
      value={$context.source.identifier}
      placeholder={$context.item.identifier}
      disabled={!$context.editable}
    />
  </div>
  <p class="hint">
    {@html localize('DND5E.ClassIdentifierHint', {
      identifier: $context.item.identifier,
    })}
    {localize('DND5E.IdentifierError')}
  </p>
</div>

<div class="form-group split-group">
  <label for="{$context.appId}-hit-dice">{localize('DND5E.HitDice')}</label>
  <div class="form-fields">
    <div class="form-group label-top">
      <label for="{$context.appId}-hit-dice"
        >{localize('DND5E.Denomination')}</label
      >
      <Select
        id="{$context.appId}-hit-dice"
        document={$context.item}
        field="system.hitDice"
        value={$context.source.hitDice}
        disabled={!$context.editable}
      >
        {#each $context.config.hitDieTypes as type}
          <option value={type}>{type}</option>
        {/each}
      </Select>
    </div>

    <div class="form-group label-top">
      <label for="{$context.appId}-hit-dice-spent"
        >{localize('DND5E.Spent')}</label
      >
      <NumberInput
        id="{$context.appId}-hitDiceUsed"
        document={$context.item}
        field="system.hitDiceUsed"
        value={$context.source.hitDiceUsed}
        placeholder="0"
        disabled={!$context.editable}
      />
    </div>
  </div>
</div>

<h3 class="form-header">{localize('DND5E.ItemClassDetails')}</h3>

<div class="form-group stacked primary-abilities">
  <label for=""
    >{localize('DND5E.CLASS.FIELDS.primaryAbility.value.label')}</label
  >
  {#each abilities as { key, label } (key)}
    <Checkbox
      labelCssClass="checkbox"
      document={$context.item}
      field="system.primaryAbility.value"
      checked={$context.source.primaryAbility.value.has(key)}
      value={key}
      disabled={!$context.editable}
      onDataPreparing={(ev) => mapMulticlassingAbilitiesToSave($context, ev)}
    >
      {label}
    </Checkbox>
  {/each}
  <p class="hint">{localize('DND5E.CLASS.FIELDS.primaryAbility.value.hint')}</p>
</div>

{#if $context.source.primaryAbility.value.size > 1}
  <div class="form-group">
    <label for="{appId}-system-primaryAbility-fields-all"
      >{localize('DND5E.CLASS.FIELDS.primaryAbility.all.label')}</label
    >
    <Checkbox
      id="{appId}-system-primaryAbility-fields-all"
      document={$context.item}
      field="system.primaryAbility.fields.all"
      checked={$context.source.primaryAbility.all}
    ></Checkbox>

    <p class="hint">{localize('DND5E.CLASS.FIELDS.primaryAbility.all.hint')}</p>
  </div>
{/if}

<h3 class="form-header">{localize('DND5E.Spellcasting')}</h3>
<DetailsSpellcasting />

<ItemStartingEquipment />
