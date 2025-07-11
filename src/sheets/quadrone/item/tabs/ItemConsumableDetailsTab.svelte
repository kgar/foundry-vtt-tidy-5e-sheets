<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import { CONSTANTS } from 'src/constants';
  import FieldDamage from '../parts/FieldDamage.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import SectionsFormGroup from '../parts/SectionsFormGroup.svelte';
  import QuantityWeightPriceFormGroups from '../parts/QuantityWeightPriceFormGroups.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <QuantityWeightPriceFormGroups />
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.ItemConsumableDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-group">
    <label for="{appId}-type-value"
      >{localize('DND5E.ItemConsumableType')}</label
    >
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-type-value"
        document={context.item}
        field="system.type.value"
        value={context.source.type.value}
        disabled={!context.unlocked}
        blankValue=""
      >
        <SelectOptions
          data={context.config.consumableTypes}
          labelProp="label"
          blank=""
        />
      </SelectQuadrone>
    </div>
  </div>
  {#if context.itemSubtypes}
    {@const consumableSubTypeLabel = localize('DND5E.ItemConsumableSubtype', {
      category:
        context.config.consumableTypes[context.system.type.value]?.label,
    })}

    <div class="form-group">
      <label for="{appId}-type-subtype">{consumableSubTypeLabel}</label>
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-type-subtype"
          document={context.item}
          field="system.type.subtype"
          value={context.source.type.subtype}
          disabled={!context.unlocked}
        >
          <SelectOptions data={context.itemSubtypes} blank="" />
        </SelectQuadrone>
      </div>
    </div>
  {/if}

  <div class="form-group stacked consumable-properties checkbox-grid">
    <label for=""
      >{context.system.type.value === 'ammo'
        ? localize('DND5E.ItemAmmoProperties')
        : localize('DND5E.ItemConsumableProperties')}</label
    >
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  {#if context.properties.object.mgc}
    <!-- Attunement -->
    <div class="form-group split-group">
      <label for="${appId}-system-attunement"
        >{localize('DND5E.ITEM.Property.Magical')}</label
      >
      <div class="form-fields">
        <div class="form-group label-top no-gap">
          <label for="${appId}-system-attunement">
            {localize('DND5E.Attunement')}
          </label>
          <div class="form-fields">
            <!-- Attuned -->
            <label class="checkbox" for="{appId}-attuned">
              <CheckboxQuadrone
                id="{appId}-attuned"
                document={context.item}
                field="system.attuned"
                checked={context.source.attuned}
                disabledChecked={context.system.attuned}
                disabled={!context.unlocked ||
                  !context.config.attunementTypes[context.system.attunement]}
                title={localize('DND5E.AttunementAttuned')}
              />
            </label>
            <!-- Attunement -->
            <SelectQuadrone
              id="${appId}-system-attunement"
              document={context.item}
              field="system.attunement"
              value={context.source.attunement}
              disabled={!context.unlocked}
              class="flex-1"
            >
              <SelectOptions
                data={context.config.attunementTypes}
                blank={localize('DND5E.AttunementNone')}
              />
            </SelectQuadrone>
          </div>
        </div>
        <!-- Magical Bonus for Ammo -->
        {#if context.system.type.value === CONSTANTS.ITEM_SYSTEM_TYPE_AMMO}
          <div class="form-group label-top">
            <label for="{appId}-magical-bonus">{localize('DND5E.Bonus')}</label>
            <div class="form-fields">
              <NumberInputQuadrone
                id="{appId}-magical-bonus"
                value={context.source.magicalBonus}
                field="system.magicalBonus"
                document={context.item}
                disabled={!context.unlocked}
                min="0"
                step="1"
                placeholder="0"
              />
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</fieldset>


{#if context.system.type.value === CONSTANTS.ITEM_SYSTEM_TYPE_AMMO}
<fieldset>
  <legend>
    {localize('DND5E.CONSUMABLE.FIELDS.damage.label')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-group">
    <label for="{appId}-damage-replace"
      >{localize('DND5E.CONSUMABLE.FIELDS.damage.replace.label')}</label
    >
    <div class="form-fields">
      <label class="checkbox" for="{appId}-damage-replace">
        <CheckboxQuadrone
          id="{appId}-damage-replace"
          document={context.item}
          field="system.damage.replace"
          checked={context.source.damage.replace}
          disabledChecked={context.system.damage.replace}
          disabled={!context.unlocked}
        />
      </label>
    </div>
    <p class="hint">
      {localize('DND5E.CONSUMABLE.FIELDS.damage.replace.hint')}
    </p>
  </div>
    <FieldDamage
      prefix="system.damage.base."
      source={context.source.damage.base}
      system={context.system.damage.base}
      denominationOptions={context.denominationOptions}
      types={context.damageTypes}
    />
</fieldset>
{/if}

<FieldUses />

<SectionsFormGroup />
