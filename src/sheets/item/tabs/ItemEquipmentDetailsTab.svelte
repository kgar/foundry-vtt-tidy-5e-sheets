<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';
  import DetailsMountable from '../parts/DetailsMountable.svelte';
  import FieldUses from '../parts/FieldUses.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: appId = $context.item.sheet.appId;

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={$context.concealDetails}>
  <h3 class="form-header">
    {localize('DND5E.ItemEquipmentDetails')}
  </h3>

  <!-- Equipment Type -->
  <ItemFormGroup
    labelText={localize('DND5E.ItemEquipmentType')}
    field="system.type.value"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.type.value"
      value={$context.system.type.value}
      blankValue=""
    >
      <SelectOptions
        data={$context.equipmentTypes}
        labelProp="label"
        valueProp="value"
        blank=""
      />
    </Select>
  </ItemFormGroup>

  <!-- Equipment Base -->
  <ItemFormGroup
    labelText={localize('DND5E.ItemEquipmentBase')}
    field="system.type.baseItem"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.type.baseItem"
      value={$context.system.type.baseItem}
      blankValue=""
    >
      <SelectOptions
        data={$context.baseItems}
        labelProp="label"
        valueProp="value"
        blank=""
      />
    </Select>
  </ItemFormGroup>

  <!-- Proficiency -->
  <ItemFormGroup
    labelText={localize('DND5E.ProficiencyLevel')}
    field="system.proficient"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.proficient"
      value={$context.system.proficient}
      blankValue=""
    >
      <SelectOptions
        data={$context.config.weaponAndArmorProficiencyLevels}
        labelProp="label"
        valueProp="value"
        blank=""
      />
    </Select>
  </ItemFormGroup>

  <!-- Armor -->
  {#if $context.system.isArmor}
    <ItemFormGroup cssClass="split-group" field="">
      <label for="{appId}-armor-value">{localize('DND5E.Armor')}</label>

      <div class="form-fields">
        <div class="form-group label-top">
          <label for="{appId}-armor-value">{localize('DND5E.AC')}</label>
          <NumberInput
            document={$context.item}
            field="system.armor.value"
            value={$context.system.armor.value}
            step="1"
          />
        </div>

        {#if $context.hasDexModifier}
          <div class="form-group label-top">
            <label for="{appId}-armor-dex"
              >{localize('DND5E.ItemEquipmentDexModAbbr')}</label
            >
            <NumberInput
              document={$context.item}
              field="system.armor.dex"
              value={$context.system.armor.dex}
              step="1"
              placeholder="∞"
            />
          </div>
        {/if}

        <div class="form-group label-top">
          <label for="{appId}-strength">{localize('DND5E.AbilityStr')}</label>
          <NumberInput
            document={$context.item}
            field="system.strength"
            value={$context.system.strength}
            step="1"
            placeholder="—"
          />
        </div>
      </div>
    </ItemFormGroup>
  {/if}

  <!-- Properties -->
  <ItemFormGroup
    labelText={localize('DND5E.ItemEquipmentProperties')}
    cssClass="stacked equipment-properties"
  >
    <ItemProperties />
  </ItemFormGroup>

  <!-- Magical Properties -->
  {#if $context.properties.object.mgc}
    <ItemFormGroup
      labelText={localize('DND5E.Item.Property.Magical')}
      field="system.attunement"
      let:inputId
    >
      <div class="form-fields">
        {#if !$context.item.isMountable}
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
        {/if}
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
      </div>
    </ItemFormGroup>
  {/if}

  {#if $context.system.isMountable}
    <DetailsMountable />
  {/if}

  <FieldUses />
</ContentConcealer>
