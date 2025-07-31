<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import DetailsMountable from '../parts/DetailsMountable.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
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
    {localize('DND5E.ItemEquipmentDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Equipment Type -->
  <div class="form-group">
    <label for="{appId}-type-value">{localize('DND5E.ItemEquipmentType')}</label
    >
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-type-value"
        document={context.item}
        field="system.type.value"
        value={context.source.type.value}
        blankValue=""
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.equipmentTypes}
          labelProp="label"
          valueProp="value"
          blank=""
        />
      </SelectQuadrone>
    </div>
  </div>

  <!-- Equipment Base -->
  {#if Object.keys(context.baseItems).length}
    <div class="form-group">
      <label for="{appId}-type-baseItem"
        >{localize('DND5E.ItemEquipmentBase')}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-type-baseItem"
          document={context.item}
          field="system.type.baseItem"
          value={context.source.type.baseItem}
          blankValue=""
          disabled={!context.unlocked}
        >
          <SelectOptions
            data={context.baseItems}
            labelProp="label"
            valueProp="value"
            blank=""
          />
        </SelectQuadrone>
      </div>
    </div>
  {/if}

  <!-- Proficiency -->
  <div class="form-group">
    <label for="{appId}-proficient">{localize('DND5E.ProficiencyLevel')}</label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-proficient"
        document={context.item}
        field="system.proficient"
        value={context.source.proficient}
        blankValue=""
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.weaponAndArmorProficiencyLevels}
          labelProp="label"
          valueProp="value"
          blank={localize('DND5E.Automatic')}
        />
      </SelectQuadrone>
    </div>
  </div>

  <!-- Armor -->
  {#if context.system.isArmor}
    <div class="form-group split-group">
      <label for="{appId}-armor-value">{localize('DND5E.Armor')}</label>

      <div class="form-fields">
        <div class="form-group label-top">
          <label for="{appId}-armor-value">{localize('DND5E.AC')}</label>
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-armor-value"
              document={context.item}
              field="system.armor.value"
              value={context.source.armor.value}
              step="1"
              disabled={!context.unlocked}
            />
          </div>
        </div>

        {#if context.hasDexModifier}
          <div class="form-group label-top">
            <label for="{appId}-armor-dex"
              >{localize('DND5E.ItemEquipmentDexModAbbr')}</label
            >
            <div class="form-fields">
              <NumberInputQuadrone
                id="{appId}-armor-dex"
                document={context.item}
                field="system.armor.dex"
                value={context.source.armor.dex}
                step="1"
                placeholder="∞"
                disabled={!context.unlocked}
              />
            </div>
          </div>
        {/if}

        <div class="form-group label-top">
          <label for="{appId}-armor-strength"
            >{localize('DND5E.AbilityStr')}</label
          >
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-armor-strength"
              document={context.item}
              field="system.strength"
              value={context.source.strength}
              step="1"
              placeholder="—"
              disabled={!context.unlocked}
            />
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Properties -->
  <div class="form-group stacked equipment-properties checkbox-grid">
    <label for="">{localize('DND5E.ItemEquipmentProperties')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  <!-- Magical Properties -->
  {#if context.properties.object.mgc}
    <div class="form-group split-group">
      <label for="{appId}-attunement"
        >{localize('DND5E.ITEM.Property.Magical')}</label
      >
      <div class="form-fields">
        {#if !context.item.isMountable}
          <div class="form-group label-top">
            <label for="{appId}-attunement">
              {localize('DND5E.Attunement')}
            </label>
            <div class="form-fields">
              <!-- Attuned -->
              <label class="checkbox" for="{appId}-attuned">
                <CheckboxQuadrone
                  id={`${appId}-system-attuned`}
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
                id="{appId}-attunement"
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
        {/if}
        <div class="form-group label-top">
          <label for="{appId}-magical-bonus">{localize('DND5E.Bonus')}</label>
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-magical-bonus"
              value={context.source.armor.magicalBonus}
              field="system.armor.magicalBonus"
              document={context.item}
              disabled={!context.unlocked}
              min="0"
              step="1"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  {/if}
</fieldset>

{#if context.system.isMountable}
  <DetailsMountable />
{/if}

<FieldUses />
