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
  import SectionsFormGroup from '../parts/SectionsFormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <div class="form-group">
    <label for="{appId}-weight-value">
      {localize('DND5E.Weight')}
    </label>
    <div class="form-fields">
      <NumberInputQuadrone
        id="{appId}-weight-value"
        value={context.source.weight.value}
        disabledValue={context.system.weight.value}
        step="any"
        field="system.weight.value"
        document={context.item}
        disabled={!context.unlocked}
        selectOnFocus={true}
      />
      <SelectQuadrone
        document={context.item}
        field="system.weight.units"
        value={context.source.weight.units}
        disabledValue={context.system.weight.units}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.weightUnits}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    </div>
  </div>
  <div class="form-group">
    <label for="{appId}-price-value">
      {localize('DND5E.Price')}
    </label>
    <div class="form-fields">
      <NumberInputQuadrone
        id="{appId}-price-value"
        value={context.source.price.value}
        disabledValue={context.system.price.value}
        step="any"
        field="system.price.value"
        document={context.item}
        disabled={!context.unlocked}
        selectOnFocus={true}
        class="large-value"
      />
      <SelectQuadrone
        value={context.source.price.denomination}
        disabledValue={context.system.price.denomination}
        field="system.price.denomination"
        document={context.item}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.currencies}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    </div>
  </div>
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
        disabledValue={context.system.type.value}
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
          disabledValue={context.system.type.baseItem}
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
          disabledValue={context.system.proficient}
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
        disabledValue={context.system.mastery}
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
        >{localize('DND5E.Item.Property.Magical')}</label
      >
      <div class="form-fields">
        <!-- Attunement -->
        {#if !context.item.isMountable}
          <div class="form-group label-top no-gap">
            <label for="">
              {localize('DND5E.Attunement')}
            </label>
            <div class="form-fields">
              <!-- Attuned -->
              <CheckboxQuadrone
                id="{appId}-attuned"
                document={context.item}
                field="system.attuned"
                checked={context.source.attuned}
                disabledChecked={context.source.attuned}
                disabled={!context.unlocked ||
                  // @ts-expect-error
                  !context.config.attunementTypes[context.system.attunement]}
                title={localize('DND5E.AttunementAttuned')}
              />
              <!-- Attunement -->
              <SelectQuadrone
                id="{appId}-attunement"
                document={context.item}
                field="system.attunement"
                value={context.source.attunement}
                disabledValue={context.system.attunement}
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
              disabledValue={context.system.magicalBonus}
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
      <label for=""
        >{localize('DND5E.WEAPON.FIELDS.ammunition.type.label')}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          document={context.item}
          field="system.ammunition.type"
          value={context.source.ammunition.type}
          disabledValue={context.system.ammunition.type}
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
              disabledValue={context.system.range.value}
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
              disabledValue={context.system.range.long}
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
                disabledValue={context.system.range.reach}
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
      <label for="">{localize('DND5E.MovementUnits')}</label>
      <div class="form-fields">
        <SelectQuadrone
          document={context.item}
          field="system.range.units"
          value={context.source.range.units}
          disabledValue={context.system.range.units}
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
                disabledValue={context.system.range.reach}
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
          <label for="">{localize('DND5E.MovementUnits')}</label>
          <div class="form-fields">
            <SelectQuadrone
              document={context.item}
              field="system.range.units"
              value={context.source.range.units}
              disabledValue={context.system.range.units}
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

<SectionsFormGroup />
