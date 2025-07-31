<script lang="ts">
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DetailsMountable from 'src/sheets/quadrone/item/parts/DetailsMountable.svelte';
  import FieldDamage from 'src/sheets/quadrone/item/parts/FieldDamage.svelte';
  import FieldUses from 'src/sheets/quadrone/item/parts/FieldUses.svelte';
  import ItemProperties from 'src/sheets/quadrone/item/parts/ItemProperties.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
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
    {localize('DND5E.ItemWeaponDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Weapon Type -->
  <div class="form-group">
    <label for="{appId}-type-value">{localize('DND5E.ItemWeaponType')}</label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-type-value"
        document={context.item}
        field="system.type.value"
        value={context.source.type.value}
        disabled={!context.unlocked}
        blankValue=""
      >
        <SelectOptions data={context.config.weaponTypes} blank="" />
      </SelectQuadrone>
    </div>
  </div>

  <!-- Weapon Base -->
  {#if Object.keys(context.baseItems).length}
    <div class="form-group">
      <label for="{appId}-type-baseItem"
        >{localize('DND5E.ItemWeaponBase')}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-type-baseItem"
          document={context.item}
          field="system.type.baseItem"
          value={context.source.type.baseItem}
          disabled={!context.unlocked}
        >
          <SelectOptions data={context.baseItems} blank="" />
        </SelectQuadrone>
      </div>
    </div>
  {/if}

  <!-- Proficiency -->
  {#if !context.item.isMountable}
    <div class="form-group">
      <label for="{appId}-proficient"
        >{localize('DND5E.ProficiencyLevel')}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-proficient"
          document={context.item}
          field="system.proficient"
          value={context.source.proficient}
          disabled={!context.unlocked}
        >
          <SelectOptions
            data={context.config.weaponAndArmorProficiencyLevels}
            blank={localize('DND5E.Automatic')}
          />
        </SelectQuadrone>
      </div>
    </div>
  {/if}

  <!-- Weapon Mastery -->
  <div class="form-group">
    <label for="{appId}-weapon-mastery">
      {localize('DND5E.WEAPON.FIELDS.mastery.label')}
    </label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-weapon-mastery"
        document={context.item}
        field="system.mastery"
        value={context.source.mastery}
        blankValue=""
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.weaponMasteries}
          labelProp="label"
          blank=""
        />
      </SelectQuadrone>
    </div>
    <p class="hint">{localize('DND5E.WEAPON.FIELDS.mastery.hint')}</p>
  </div>

  <!-- Weapon Properties -->
  <div class="form-group stacked weapon-properties checkbox-grid">
    <label for="">{localize('DND5E.ItemWeaponProperties')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  <!-- Magical Properties -->
  {#if context.properties.object.mgc}
    <!-- Attunement -->
    <div class="form-group split-group">
      <label for="{appId}-attunement"
        >{localize('DND5E.ITEM.Property.Magical')}</label
      >
      <div class="form-fields">
        <!-- Attunement -->
        {#if !context.item.isMountable}
          <div class="form-group label-top no-gap">
            <label for="{appId}-attunement">
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
                  disabledChecked={context.source.attuned}
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
        <!-- Magical Bonus -->
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
      </div>
    </div>
  {/if}

  <!-- Ammunition Type -->
  {#if context.properties.object.amm}
    <div class="form-group">
      <label for="{appId}-ammunition-type"
        >{localize('DND5E.WEAPON.FIELDS.ammunition.type.label')}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-ammunition-type"
          document={context.item}
          field="system.ammunition.type"
          value={context.source.ammunition.type}
          blankValue=""
          disabled={!context.unlocked}
        >
          <SelectOptions
            data={context.config.consumableTypes.ammo.subtypes}
            blank=""
          />
        </SelectQuadrone>
      </div>
    </div>
  {/if}
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.Range')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  {#if context.system.hasRange || !context.system.attackType}
    <div class="form-group split-group">
      <label for="">{localize('DND5E.RangeDistance')}</label>
      <div class="form-fields">
        <!-- Normal -->
        <div class="form-group label-top">
          <label for="{appId}-range-value">{localize('DND5E.Normal')}</label>
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-range-value"
              document={context.item}
              field="system.range.value"
              value={context.source.range.value}
              min="0"
              disabled={!context.unlocked}
            />
          </div>
        </div>

        <!-- Long -->
        <div class="form-group label-top">
          <label for="{appId}-range-long">{localize('DND5E.Long')}</label>
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-range-long"
              document={context.item}
              field="system.range.long"
              value={context.source.range.long}
              min="0"
              disabled={!context.unlocked}
            />
          </div>
        </div>

        <!-- Reach -->
        {#if context.system.attackType !== 'ranged'}
          <div class="form-group label-top">
            <label for="{appId}-range-reach"
              >{localize('DND5E.RANGE.FIELDS.range.reach.label')}</label
            >
            <div class="form-fields">
              <NumberInputQuadrone
                id="{appId}-range-reach"
                document={context.item}
                field="system.range.reach"
                value={context.source.range.reach}
                min="0"
                placeholder={context.system.range.reach === null
                  ? '—'
                  : context.system.range.reach}
                disabled={!context.unlocked}
              />
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- Units -->
    <div class="form-group">
      <label for="{appId}-range-units">{localize('DND5E.MovementUnits')}</label>
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-range-units"
          document={context.item}
          field="system.range.units"
          value={context.source.range.units}
          blankValue=""
          disabled={!context.unlocked}
        >
          <SelectOptions
            data={context.config.movementUnits}
            labelProp="label"
            blank=""
          />
        </SelectQuadrone>
      </div>
    </div>
  {:else}
    <div class="form-group split-group">
      <label for="">{localize('DND5E.RangeDistance')}</label>
      <div class="form-fields">
        <!-- Reach -->
        {#if context.system.attackType === 'melee'}
          <div class="form-group label-top">
            <label for="{appId}-range-reach"
              >{localize('DND5E.RANGE.FIELDS.range.reach.label')}</label
            >
            <div class="form-fields">
              <NumberInputQuadrone
                id="{appId}-range-reach"
                document={context.item}
                field="system.range.reach"
                value={context.source.range.reach}
                min="0"
                placeholder={context.system.range.reach === null
                  ? '—'
                  : context.system.range.reach}
                disabled={!context.unlocked}
              />
            </div>
          </div>
        {/if}

        <!-- Units -->
        <div class="form-group label-top">
          <label for="{appId}-range-units"
            >{localize('DND5E.MovementUnits')}</label
          >
          <div class="form-fields">
            <SelectQuadrone
              id="{appId}-range-units"
              document={context.item}
              field="system.range.units"
              value={context.source.range.units}
              disabled={!context.unlocked}
            >
              <SelectOptions
                data={context.config.movementUnits}
                labelProp="label"
              />
            </SelectQuadrone>
          </div>
        </div>
      </div>
    </div>
  {/if}
</fieldset>

{#if context.system.isMountable}
  <DetailsMountable />
{/if}

<fieldset>
  <legend>
    {localize('DND5E.DAMAGE.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-fields">
    <p class="hint">{localize('DND5E.WEAPON.FIELDS.damage.hint')}</p>
  </div>

  <FieldDamage
    prefix="system.damage.base."
    source={context.source.damage.base}
    system={context.system.damage.base}
    denominationOptions={context.denominationOptions.base}
    types={context.damageTypes}
  />
</fieldset>

{#if context.properties.object.ver}
  <fieldset>
    <legend>
      {localize('DND5E.Versatile')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <FieldDamage
      denominationOptions={context.denominationOptions.base}
      source={context.source.damage.versatile}
      system={context.system.damage.versatile}
      prefix="system.damage.versatile."
      numberPlaceholder={context.source.damage.base.number}
    />
  </fieldset>
{/if}

<FieldUses />
