<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import DetailsMountable from '../parts/DetailsMountable.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={context.concealDetails}>
  <h3 class="form-header">
    {localize('DND5E.ItemEquipmentDetails')}
  </h3>

  <!-- Equipment Type -->
  <div class="form-group">
    <label for="{appId}-type-value">{localize('DND5E.ItemEquipmentType')}</label
    >
    <Select
      id="{appId}-type-value"
      document={context.item}
      field="system.type.value"
      value={context.source.type.value}
      blankValue=""
      disabled={!context.editable}
    >
      <SelectOptions
        data={context.equipmentTypes}
        labelProp="label"
        valueProp="value"
        blank=""
      />
    </Select>
  </div>

  <!-- Equipment Base -->
  {#if Object.keys(context.baseItems).length}
    <div class="form-group">
      <label for="{appId}-type-baseItem"
        >{localize('DND5E.ItemEquipmentBase')}</label
      >
      <Select
        id="{appId}-type-baseItem"
        document={context.item}
        field="system.type.baseItem"
        value={context.source.type.baseItem}
        blankValue=""
        disabled={!context.editable}
      >
        <SelectOptions
          data={context.baseItems}
          labelProp="label"
          valueProp="value"
          blank=""
        />
      </Select>
    </div>
  {/if}

  <!-- Proficiency -->
  <div class="form-group">
    <label for="{appId}-proficient">{localize('DND5E.ProficiencyLevel')}</label>
    <Select
      id="{appId}-proficient"
      document={context.item}
      field="system.proficient"
      value={context.source.proficient}
      blankValue=""
      disabled={!context.editable}
    >
      <SelectOptions
        data={context.config.weaponAndArmorProficiencyLevels}
        labelProp="label"
        valueProp="value"
        blank={localize('DND5E.Automatic')}
      />
    </Select>
  </div>

  <!-- Armor -->
  {#if context.system.isArmor}
    <div class="form-group split-group">
      <label for="{appId}-armor-value">{localize('DND5E.Armor')}</label>

      <div class="form-fields">
        <div class="form-group label-top">
          <label for="{appId}-armor-value">{localize('DND5E.AC')}</label>
          <NumberInput
            id="{appId}-armor-value"
            document={context.item}
            field="system.armor.value"
            value={context.source.armor.value}
            step="1"
            disabled={!context.editable}
          />
        </div>

        {#if context.hasDexModifier}
          <div class="form-group label-top">
            <label for="{appId}-armor-dex"
              >{localize('DND5E.ItemEquipmentDexModAbbr')}</label
            >
            <NumberInput
              id="{appId}-armor-dex"
              document={context.item}
              field="system.armor.dex"
              value={context.source.armor.dex}
              step="1"
              placeholder="∞"
              disabled={!context.editable}
            />
          </div>
        {/if}

        <div class="form-group label-top">
          <label for="{appId}-armor-strength"
            >{localize('DND5E.AbilityStr')}</label
          >
          <NumberInput
            id="{appId}-armor-strength"
            document={context.item}
            field="system.strength"
            value={context.source.strength}
            step="1"
            placeholder="—"
            disabled={!context.editable}
          />
        </div>
      </div>
    </div>
  {/if}

  <!-- Properties -->
  <div class="form-group stacked equipment-properties">
    <label for="">{localize('DND5E.ItemEquipmentProperties')}</label>
    <ItemProperties />
  </div>

  <!-- Magical Properties -->
  {#if context.properties.object.mgc}
    <div class="form-group">
      <label for="{appId}-attunement"
        >{localize('DND5E.Item.Property.Magical')}</label
      >
      <div class="form-fields">
        {#if !context.item.isMountable}
          <div class="form-group label-top no-gap">
            <label for="{appId}-attuned">
              {localize('DND5E.Attunement')}
            </label>
            <div class="form-fields">
              <!-- Attuned -->
              <Checkbox
                id={`${appId}-system-attuned`}
                document={context.item}
                field="system.attuned"
                checked={context.source.attuned}
                disabled={!context.editable ||
                  // @ts-expect-error
                  !context.config.attunementTypes[context.system.attunement]}
                title={localize('DND5E.AttunementAttuned')}
              />
              <!-- Attunement -->
              <Select
                id="{appId}-attunement"
                document={context.item}
                field="system.attunement"
                value={context.source.attunement}
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
        {/if}
        <div class="form-group label-top">
          <label for="{appId}-magical-bonus">{localize('DND5E.Bonus')}</label>
          <NumberInput
            id="{appId}-magical-bonus"
            value={context.source.armor.magicalBonus}
            field="system.armor.magicalBonus"
            document={context.item}
            disabled={!context.editable}
            min="0"
            step="1"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  {/if}

  {#if context.system.isMountable}
    <DetailsMountable />
  {/if}

  <FieldUses />
</ContentConcealer>
