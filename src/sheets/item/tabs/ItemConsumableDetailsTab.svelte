<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import { CONSTANTS } from 'src/constants';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import FieldDamage from '../parts/FieldDamage.svelte';
  import FieldUses from '../parts/FieldUses.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={$context.concealDetails}>
  <h3 class="form-header">{localize('DND5E.ItemConsumableDetails')}</h3>

  <ItemFormGroup
    labelText={localize('DND5E.ItemConsumableType')}
    field="system.type.value"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.type.value"
      value={$context.system.type.value}
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.config.consumableTypes} labelProp="label" />
    </Select>
  </ItemFormGroup>
  {#if $context.itemSubtypes}
    {@const consumableSubTypeLabel = localize('DND5E.ItemConsumableSubtype', {
      category:
        $context.config.consumableTypes[$context.system.type.value]?.label,
    })}

    <ItemFormGroup
      labelText={consumableSubTypeLabel}
      field="system.type.subtype"
      let:inputId
    >
      <Select
        id={inputId}
        document={$context.item}
        field="system.type.subtype"
        value={$context.system.type.subtype}
        disabled={!$context.editable}
      >
        <SelectOptions data={$context.itemSubtypes} blank="" />
      </Select>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup
    cssClass="stacked consumable-properties"
    labelText={$context.system.type.value === 'ammo'
      ? localize('DND5E.ItemAmmoProperties')
      : localize('DND5E.ItemConsumableProperties')}
  >
    <ItemProperties />
  </ItemFormGroup>

  {#if $context.properties.object.mgc}
    <!-- Attunement -->
    <ItemFormGroup
      labelText={localize('DND5E.Item.Property.Magical')}
      field="system.attunement"
      let:inputId
    >
      <div class="form-fields">
        <div class="form-group label-top no-gap">
          <label for={inputId}>
            {localize('DND5E.Attunement')}
          </label>
          <div class="flex-row no-gap">
            <!-- Attuned -->
            <Checkbox
              id={`${appId}-system-attuned`}
              document={$context.item}
              field="system.attuned"
              checked={$context.system.attuned}
              disabled={!$context.editable ||
                !$context.config.attunementTypes[$context.system.attunement]}
              title={localize('DND5E.AttunementAttuned')}
            ></Checkbox>
            <!-- Attunement -->
            <Select
              id={inputId}
              document={$context.item}
              field="system.attunement"
              value={$context.system.attunement}
              disabled={!$context.editable}
              class="flex-1"
            >
              <SelectOptions
                data={$context.config.attunementTypes}
                blank={localize('DND5E.AttunementNone')}
              />
            </Select>
          </div>
        </div>
        <!-- Magical Bonus for Ammo -->
        {#if $context.system.type.value === CONSTANTS.ITEM_SYSTEM_TYPE_AMMO}
          <div class="form-group label-top">
            <label for="{appId}-magical-bonus">{localize('DND5E.Bonus')}</label>
            <NumberInput
              id="{appId}-magical-bonus"
              value={$context.system.magicalBonus}
              field="system.magicalBonus"
              document={$context.item}
              disabled={!$context.editable}
              min="0"
              step="1"
              placeholder="0"
            />
          </div>
        {/if}
      </div>
    </ItemFormGroup>
  {/if}

  <h3 class="form-header">
    {localize('DND5E.CONSUMABLE.FIELDS.damage.label')}
  </h3>

  <ItemFormGroup
    labelText={localize('DND5E.CONSUMABLE.FIELDS.damage.replace.label')}
    field="system.damage.replace"
    let:inputId
  >
    <Checkbox
      id={inputId}
      document={$context.item}
      field="system.damage.replace"
      checked={$context.system.damage.replace}
    />
    <p class="hint">
      {localize('DND5E.CONSUMABLE.FIELDS.damage.replace.hint')}
    </p>
  </ItemFormGroup>

  {#if $context.system.type.value === CONSTANTS.ITEM_SYSTEM_TYPE_AMMO}
    <FieldDamage />
  {/if}

  <FieldUses />
</ContentConcealer>
