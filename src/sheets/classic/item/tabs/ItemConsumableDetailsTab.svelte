<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import { CONSTANTS } from 'src/constants';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import FieldDamage from '../parts/FieldDamage.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={context.concealDetails}>
  <h3 class="form-header">{localize('DND5E.ItemConsumableDetails')}</h3>

  <div class="form-group">
    <label for="{appId}-type-value"
      >{localize('DND5E.ItemConsumableType')}</label
    >
    <Select
      id="{appId}-type-value"
      document={context.item}
      field="system.type.value"
      value={context.system.type.value}
      disabled={!context.editable}
      blankValue=""
    >
      <SelectOptions
        data={context.config.consumableTypes}
        labelProp="label"
        blank=""
      />
    </Select>
  </div>
  {#if context.itemSubtypes}
    {@const consumableSubTypeLabel = localize('DND5E.ItemConsumableSubtype', {
      category:
        context.config.consumableTypes[context.system.type.value]?.label,
    })}

    <div class="form-group">
      <label for="{appId}-type-subtype">{consumableSubTypeLabel}</label>
      <Select
        id="{appId}-type-subtype"
        document={context.item}
        field="system.type.subtype"
        value={context.system.type.subtype}
        disabled={!context.editable}
      >
        <SelectOptions data={context.itemSubtypes} blank="" />
      </Select>
    </div>
  {/if}

  <div class="form-group stacked consumable-properties">
    <label for=""
      >{context.system.type.value === 'ammo'
        ? localize('DND5E.ItemAmmoProperties')
        : localize('DND5E.ItemConsumableProperties')}</label
    >
    <ItemProperties />
  </div>

  {#if context.properties.object.mgc}
    <!-- Attunement -->
    <div class="form-group split-group">
      <label for="${appId}-system-attunement"
        >{localize('DND5E.Item.Property.Magical')}</label
      >
      <div class="form-fields">
        <div class="form-group label-top no-gap">
          <label for="${appId}-system-attuned">
            {localize('DND5E.Attunement')}
          </label>
          <div class="form-fields">
            {#if context.source.attunement}
              <!-- Attuned -->
              <Checkbox
                id="${appId}-system-attuned"
                document={context.item}
                field="system.attuned"
                checked={context.source.attuned}
                disabled={!context.editable ||
                  !context.config.attunementTypes[context.system.attunement]}
                title={localize('DND5E.AttunementAttuned')}
              />
            {/if}
            <!-- Attunement -->
            <Select
              id="${appId}-system-attunement"
              document={context.item}
              field="system.attunement"
              value={context.system.attunement}
              disabled={!context.editable}
              class="flex-1"
            >
              <SelectOptions
                data={context.config.attunementTypes}
                blank={localize('DND5E.AttunementNone')}
              />
            </Select>
          </div>
        </div>
        <!-- Magical Bonus for Ammo -->
        {#if context.system.type.value === CONSTANTS.ITEM_SYSTEM_TYPE_AMMO}
          <div class="form-group label-top">
            <label for="{appId}-magical-bonus">{localize('DND5E.Bonus')}</label>
            <NumberInput
              id="{appId}-magical-bonus"
              value={context.system.magicalBonus}
              field="system.magicalBonus"
              document={context.item}
              disabled={!context.editable}
              min="0"
              step="1"
              placeholder="0"
            />
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <h3 class="form-header">
    {localize('DND5E.CONSUMABLE.FIELDS.damage.label')}
  </h3>

  <div class="form-group">
    <label for="{appId}-damage-replace"
      >{localize('DND5E.CONSUMABLE.FIELDS.damage.replace.label')}</label
    >
    <Checkbox
      id="{appId}-damage-replace"
      document={context.item}
      field="system.damage.replace"
      checked={context.source.damage.replace}
      disabled={!context.editable}
    />
    <p class="hint">
      {localize('DND5E.CONSUMABLE.FIELDS.damage.replace.hint')}
    </p>
  </div>

  {#if context.system.type.value === CONSTANTS.ITEM_SYSTEM_TYPE_AMMO}
    <FieldDamage
      prefix="system.damage.base."
      source={context.source.damage.base}
      denominationOptions={context.denominationOptions}
      types={context.damageTypes}
    />
  {/if}

  <FieldUses />
</ContentConcealer>
