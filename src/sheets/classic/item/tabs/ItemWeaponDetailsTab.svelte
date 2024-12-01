<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';
  import DetailsMountable from '../parts/DetailsMountable.svelte';
  import FieldDamage from '../parts/FieldDamage.svelte';
  import FieldUses from '../parts/FieldUses.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let appId = $derived($context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={$context.concealDetails}>
  <h3 class="form-header">{localize('DND5E.ItemWeaponDetails')}</h3>

  <!-- Weapon Type -->
  <div class="form-group">
    <label for="{appId}-type-value">{localize('DND5E.ItemWeaponType')}</label>
    <Select
      id="{appId}-type-value"
      document={$context.item}
      field="system.type.value"
      value={$context.source.type.value}
      disabled={!$context.editable}
      blankValue=""
    >
      <SelectOptions data={$context.config.weaponTypes} blank="" />
    </Select>
  </div>

  <!-- Weapon Base -->
  {#if Object.keys($context.baseItems ?? {}).length}
    <div class="form-group">
      <label for="{appId}-type-baseItem"
        >{localize('DND5E.ItemWeaponBase')}</label
      >
      <Select
        id="{appId}-type-baseItem"
        document={$context.item}
        field="system.type.baseItem"
        value={$context.source.type.baseItem}
        disabled={!$context.editable}
      >
        <SelectOptions data={$context.baseItems} blank="" />
      </Select>
    </div>
  {/if}

  <!-- Proficiency -->
  {#if !$context.item.isMountable}
    <div class="form-group">
      <label for="{appId}-proficient"
        >{localize('DND5E.ProficiencyLevel')}</label
      >
      <Select
        id="{appId}-proficient"
        document={$context.item}
        field="system.proficient"
        value={$context.source.proficient}
        disabled={!$context.editable}
      >
        <SelectOptions
          data={$context.config.weaponAndArmorProficiencyLevels}
          blank={localize('DND5E.Automatic')}
        />
      </Select>
    </div>
  {/if}

  <!-- Weapon Mastery -->
  <div class="form-group">
    <label for="{appId}-weapon-mastery">
      {localize('DND5E.WEAPON.FIELDS.mastery.label')}
    </label>
    <Select
      id="{appId}-weapon-mastery"
      document={$context.item}
      field="system.mastery"
      value={$context.source.mastery}
      blankValue=""
      disabled={!$context.editable}
    >
      <SelectOptions
        data={$context.config.weaponMasteries}
        labelProp="label"
        blank=""
      />
    </Select>
    <p class="hint">{localize('DND5E.WEAPON.FIELDS.mastery.hint')}</p>
  </div>

  <!-- Weapon Properties -->
  <div class="form-group stacked weapon-properties">
    <label for="">{localize('DND5E.ItemWeaponProperties')}</label>
    <ItemProperties />
  </div>

  <!-- Magical Properties -->
  {#if $context.properties.object.mgc}
    <!-- Attunement -->
    <div class="form-group split-group">
      <label for="{appId}-attunement"
        >{localize('DND5E.Item.Property.Magical')}</label
      >
      <div class="form-fields">
        <!-- Attunement -->
        {#if !$context.item.isMountable}
          <div class="form-group label-top no-gap">
            <label for="">
              {localize('DND5E.Attunement')}
            </label>
            <div class="form-fields">
              <!-- Attuned -->
              <Checkbox
                id="{appId}-attuned"
                document={$context.item}
                field="system.attuned"
                checked={$context.source.attuned}
                disabled={!$context.editable ||
                  // @ts-expect-error
                  !$context.config.attunementTypes[$context.system.attunement]}
                title={localize('DND5E.AttunementAttuned')}
              />
              <!-- Attunement -->
              <Select
                id="{appId}-attunement"
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
        <!-- Magical Bonus -->
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
    </div>
  {/if}

  <!-- Ammunition Type -->
  {#if $context.properties.object.amm}
    <div class="form-group">
      <label for=""
        >{localize('DND5E.WEAPON.FIELDS.ammunition.type.label')}</label
      >
      <Select
        document={$context.item}
        field="system.ammunition.type"
        value={$context.source.ammunition.type}
        blankValue=""
        disabled={!$context.editable}
      >
        <SelectOptions
          data={$context.config.consumableTypes.ammo.subtypes}
          blank=""
        />
      </Select>
    </div>
  {/if}

  <h3 class="form-header">{localize('DND5E.Range')}</h3>

  {#if $context.system.hasRange || !$context.system.attackType}
    <div class="form-group split-group">
      <label for="">{localize('DND5E.RangeDistance')}</label>
      <div class="form-fields">
        <!-- Normal -->
        <div class="form-group label-top">
          <label for="{appId}-range-value">{localize('DND5E.Normal')}</label>
          <NumberInput
            id="{appId}-range-value"
            document={$context.item}
            field="system.range.value"
            value={$context.source.range.value}
            min="0"
            disabled={!$context.editable}
          />
        </div>

        <!-- Long -->
        <div class="form-group label-top">
          <label for="{appId}-range-long">{localize('DND5E.Long')}</label>
          <NumberInput
            id="{appId}-range-long"
            document={$context.item}
            field="system.range.long"
            value={$context.source.range.long}
            min="0"
            disabled={!$context.editable}
          />
        </div>

        <!-- Reach -->
        {#if $context.system.attackType !== 'ranged'}
          <div class="form-group label-top">
            <label for="{appId}-range-reach"
              >{localize('DND5E.RANGE.FIELDS.range.reach.label')}</label
            >
            <NumberInput
              id="{appId}-range-reach"
              document={$context.item}
              field="system.range.reach"
              value={$context.source.range.reach}
              min="0"
              placeholder={$context.system.range.reach === null
                ? '—'
                : $context.system.range.reach}
              disabled={!$context.editable}
            />
          </div>
        {/if}
      </div>
    </div>

    <!-- Units -->
    <div class="form-group">
      <label for="">{localize('DND5E.MovementUnits')}</label>
      <Select
        document={$context.item}
        field="system.range.units"
        value={$context.source.range.units}
        blankValue=""
        disabled={!$context.editable}
      >
        <SelectOptions data={$context.config.movementUnits} blank="" />
      </Select>
    </div>
  {:else}
    <div class="form-group split-group">
      <label for="">{localize('DND5E.RangeDistance')}</label>
      <div class="form-fields">
        <!-- Reach -->
        {#if $context.system.attackType === 'melee'}
          <!-- When Svelte 5, snippets -->
          <div class="form-group label-top">
            <label for="{appId}-range-reach"
              >{localize('DND5E.RANGE.FIELDS.range.reach.label')}</label
            >
            <NumberInput
              id="{appId}-range-reach"
              document={$context.item}
              field="system.range.reach"
              value={$context.source.range.reach}
              min="0"
              placeholder={$context.system.range.reach === null
                ? '—'
                : $context.system.range.reach}
              disabled={!$context.editable}
            />
          </div>
        {/if}

        <!-- Units -->
        <div class="form-group label-top">
          <label for="">{localize('DND5E.MovementUnits')}</label>
          <Select
            document={$context.item}
            field="system.range.units"
            value={$context.source.range.units}
            disabled={!$context.editable}
          >
            <SelectOptions data={$context.config.movementUnits} />
          </Select>
        </div>
      </div>
    </div>
  {/if}

  {#if $context.system.isMountable}
    <DetailsMountable />
  {/if}

  <h3 class="form-header">{localize('DND5E.DAMAGE.Title')}</h3>

  <div class="form-fields">
    <p class="hint">{localize('DND5E.WEAPON.FIELDS.damage.hint')}</p>
  </div>

  <FieldDamage
    prefix="system.damage.base."
    source={$context.source.damage.base}
    denominationOptions={$context.denominationOptions.base}
    types={$context.damageTypes}
  />

  {#if $context.properties.object.ver}
    <h3 class="form-header">{localize('DND5E.Versatile')}</h3>
    <FieldDamage
      denominationOptions={$context.denominationOptions.base}
      source={$context.source.damage.versatile}
      prefix="system.damage.versatile."
      numberPlaceholder={$context.source.damage.base.number}
    />
  {/if}

  <FieldUses />
</ContentConcealer>
