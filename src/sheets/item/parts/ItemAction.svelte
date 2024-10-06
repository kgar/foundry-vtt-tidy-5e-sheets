<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;

  $: damageIsEnchanted = !!FoundryAdapter.getProperty(
    $context.item.overrides,
    'system.damage.parts',
  );
  $: enchantedTooltip = damageIsEnchanted
    ? localize('DND5E.Enchantment.Warning.Override')
    : null;

  function addDamageFormula() {
    const damage = $context.item.system.damage;
    return $context.item.update({
      'system.damage.parts': damage.parts.concat([['', '']]),
    });
  }

  function deleteDamageFormula(index: number) {
    const damage = FoundryAdapter.deepClone($context.item.system.damage);
    damage.parts.splice(index, 1);
    return $context.item.update({ 'system.damage.parts': damage.parts });
  }

  $: damageParts = [...$context.system.damage.parts];

  // TODO: Leverage a more generalized data batching scheme and plug in the proper components instead of raw elements.
  function saveDamageFormulae() {
    $context.item.update({
      'system.damage.parts': damageParts,
    });
  }
</script>

<ItemFormGroup
  cssClass="select"
  labelText={localize('DND5E.ItemActionType')}
  field="system.actionType"
  let:inputId
>
  <Select
    id={inputId}
    value={$context.system.actionType}
    document={$context.item}
    field="system.actionType"
    disabled={!$context.editable}
  >
    <SelectOptions data={$context.config.itemActionTypes} blank="" />
  </Select>
</ItemFormGroup>

{#if $context.system.actionType}
  <ItemFormGroup
    cssClass="select"
    labelText={localize('DND5E.AbilityModifier')}
    field="system.ability"
    let:inputId
  >
    <Select
      id={inputId}
      value={$context.system.ability}
      document={$context.item}
      field="system.ability"
      disabled={!$context.editable}
    >
      <option value="">{localize('DND5E.Default')}</option>
      <option value="none">{localize('DND5E.None')}</option>
      <optgroup label={localize('DND5E.Ability')}>
        <SelectOptions data={$context.config.abilities} labelProp="label" />
      </optgroup>
    </Select>
  </ItemFormGroup>

  {#if $context.system.hasAttack}
    <ItemFormGroup
      labelText={localize('DND5E.ItemAttackBonus')}
      field="system.attack.bonus"
      let:inputId
    >
      <div class="form-fields">
        <TextInput
          id={inputId}
          document={$context.item}
          field="system.attack.bonus"
          value={$context.system.attack.bonus}
          dataset={{ formulaEditor: true }}
          disabled={!$context.editable}
        />
        <Checkbox
          id="{$context.appId}-system-attack-flat"
          document={$context.item}
          field="system.attack.flat"
          checked={$context.system.attack.flat}
          labelCssClass="checkbox"
          greenCheckboxWidthOverride="{localize('DND5E.ItemAttackFlat').length +
            4}ch"
          title={localize('DND5E.ItemAttackFlatHint')}
        >
          {localize('DND5E.ItemAttackFlat')}
        </Checkbox>
      </div>
    </ItemFormGroup>

    <ItemFormGroup
      labelText={localize('DND5E.ItemCritThreshold')}
      field="system.critical.threshold"
      let:inputId
    >
      <div class="form-fields">
        <NumberInput
          id={inputId}
          value={$context.system.critical.threshold}
          document={$context.item}
          field="system.critical.threshold"
          placeholder="20"
          max="20"
          min="1"
          step="1"
          disabled={!$context.editable}
        />
      </div>
    </ItemFormGroup>

    <ItemFormGroup
      labelText={localize('DND5E.ItemCritExtraDamage')}
      field="system.critical.damage"
      let:inputId
    >
      <div class="form-fields">
        <TextInput
          id={inputId}
          document={$context.item}
          field="system.critical.damage"
          value={$context.system.critical.damage}
          disabled={!$context.editable}
        />
      </div>
    </ItemFormGroup>
  {/if}

  <h4 class="damage-header">
    {#if $context.isHealing}
      {localize('DND5E.Healing')}
    {:else}
      {localize('DND5E.Damage')}
    {/if}
    {localize('DND5E.Formula')}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="damage-formula-control add-damage"
      on:click={() =>
        $context.editable && !damageIsEnchanted && addDamageFormula()}
      data-tooltip={enchantedTooltip}
    >
      <i class="fas fa-plus" />
    </a>
  </h4>
  {#if damageParts?.length}
    <ol class="damage-parts form-group">
      {#each damageParts as [formula, damageType], i}
        <li
          class="damage-part flexrow"
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.DAMAGE_PART_CONTAINER}
          data-tidy-damage-part-index={i}
        >
          <input
            id="{$context.appId}-system-damage-part-{i}-0"
            type="text"
            bind:value={formula}
            data-formula-editor
            on:change={() => saveDamageFormulae()}
            disabled={!$context.editable || damageIsEnchanted}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.DAMAGE_PART_FORMULA}
            data-tidy-field={`system.damage.part-${i}-0`}
            data-tooltip={enchantedTooltip}
          />
          <select
            id="{$context.appId}-system-damage-part-{i}-1"
            bind:value={damageType}
            data-formula-editor
            on:change={() => saveDamageFormulae()}
            disabled={!$context.editable || damageIsEnchanted}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.DAMAGE_PART_TYPE}
            data-tidy-field={`system.damage.part-${i}-1`}
            data-tooltip={enchantedTooltip}
          >
            <option value="">{localize('DND5E.None')}</option>
            <optgroup label={localize('DND5E.Damage')}>
              <SelectOptions
                data={$context.config.damageTypes}
                labelProp="label"
              />
            </optgroup>
            <optgroup label={localize('DND5E.Healing')}>
              <SelectOptions
                data={$context.config.healingTypes}
                labelProp="label"
              />
            </optgroup>
          </select>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class="damage-formula-control delete-damage"
            on:click={() =>
              $context.editable && !damageIsEnchanted && deleteDamageFormula(i)}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
              .DAMAGE_PART_DELETE_COMMAND}
            data-tooltip={enchantedTooltip}
          >
            <i class="fas fa-minus" />
          </a>
        </li>
      {/each}
    </ol>
  {/if}

  {#if $context.system.damage.parts.length}
    <ItemFormGroup
      labelText={localize('DND5E.VersatileDamage')}
      field="system.damage.versatile"
      let:inputId
    >
      <div class="form-fields">
        <TextInput
          id={inputId}
          value={$context.system.damage.versatile}
          placeholder={localize('DND5E.Formula')}
          dataset={{ formulaEditor: true }}
          document={$context.item}
          field="system.damage.versatile"
          disabled={!$context.editable}
          additionalDataToSave={{
            // TODO: Use more universal/generalized batch saving scheme that shares the same logic between here and the related properties.
            'system.damage.parts': damageParts,
          }}
        />
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup
    labelText={localize('DND5E.OtherFormula')}
    field="system.formula"
    let:inputId
  >
    <div class="form-fields">
      <TextInput
        id={inputId}
        document={$context.item}
        field="system.formula"
        value={$context.system.formula}
        placeholder={localize('DND5E.Formula')}
        dataset={{ formulaEditor: true }}
        disabled={!$context.editable}
      />
    </div>
  </ItemFormGroup>

  <ItemFormGroup
    cssClass="input-select"
    labelText={localize('DND5E.ActionSave')}
    field="system.save.ability"
    let:inputId
  >
    <div class="form-fields">
      <Select
        id={inputId}
        value={$context.system.save.ability}
        document={$context.item}
        field="system.save.ability"
        disabled={!$context.editable}
      >
        <SelectOptions
          data={$context.config.abilities}
          labelProp="label"
          blank=""
        />
      </Select>
      <span>{localize('DND5E.VsDC')}</span>
      <NumberInput
        id="{$context.appId}-system-save-dc"
        step="any"
        document={$context.item}
        field="system.save.dc"
        value={$context.system.save.dc ?? null}
        placeholder={localize('DND5E.AbbreviationDC')}
        disabled={!$context.editable || !$context.isFlatDC}
      />
      <Select
        id="{$context.appId}-system-save-scaling"
        document={$context.item}
        field="system.save.scaling"
        value={$context.system.save.scaling}
        disabled={!$context.editable}
      >
        <option value="spell">{localize('DND5E.Spellcasting')}</option>
        <SelectOptions data={$context.config.abilities} labelProp="label" />
        <option value="flat">{localize('DND5E.Flat')}</option>
      </Select>
    </div>
  </ItemFormGroup>

  {#if $context.system.isEnchantment}
    <ItemFormGroup
      labelText={localize('DND5E.Enchantment.Label')}
      cssClass="enchantment"
    >
      <div class="form-fields">
        <button
          type="button"
          class="inline-transparent-button no-wrap highlight-on-hover"
          on:click={() => FoundryAdapter.openEnchantmentConfig($context.item)}
        >
          <i class="fa-solid fa-gear" aria-hidden="true"></i>
          {localize('DND5E.Enchantment.Action.Configure')}
        </button>
      </div>
      {#if $context.appliedEnchantments?.length}
        <ul class="separated-list">
          {#each $context.appliedEnchantments as ae}
            <li class="item" data-enchantment-uuid={ae.enchantment.uuid}>
              <div class="details flexrow">
                <img class="list-icon" src={ae.item.img} alt={ae.name} />
                <span class="name">
                  {#if ae.actor}
                    {@html localize('DND5E.Enchantment.Items.Entry', {
                      item: ae.name,
                      actor: ae.actor.name,
                    })}
                  {:else}
                    {@html ae.name}
                  {/if}
                </span>
                <div class="list-controls flexrow">
                  {#if ae.item.isOwner}
                    <button
                      type="button"
                      class="transparent-button"
                      data-uuid={ae.item.uuid}
                      data-tooltip="DND5E.ItemView"
                      aria-label={localize('DND5E.ItemView')}
                      on:click={() =>
                        FoundryAdapter.renderFromUuid(ae.item.uuid)}
                    >
                      <i class="fa-solid fa-eye" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      class="transparent-button"
                      data-tooltip="DND5E.Enchantment.Action.Remove"
                      aria-label={localize('DND5E.Enchantment.Action.Remove')}
                      on:click={() =>
                        FoundryAdapter.removeEnchantment(
                          ae.enchantment.uuid,
                          $context.item.sheet,
                        )}
                    >
                      <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
                    </button>
                  {/if}
                </div>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </ItemFormGroup>
  {/if}

  {#if $context.system.actionType === 'summ'}
    <ItemFormGroup
      labelText={localize('DND5E.Summoning.Label')}
      field="summon-config"
      cssClass="summoning"
      let:inputId
    >
      <div class="form-fields">
        <div
          role="presentation"
          class="summon-controls flex-row justify-content-space-between flex-wrap extra-small-row-gap"
        >
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <a
            id={inputId}
            class="inline-transparent-button no-wrap highlight-on-hover inline-flex-row align-items-center"
            on:click={() => FoundryAdapter.openSummonConfig($context.item)}
          >
            <i class="fa-solid fa-gear" aria-hidden="true"></i>
            {localize('DND5E.Summoning.Action.Configure')}
          </a>

          <Checkbox
            document={$context.item}
            field="system.summons.prompt"
            checked={$context.system.summons?.prompt === true}
            title={localize('DND5E.Summoning.Prompt.Hint')}
            labelCssClass="green-checkbox align-items-center"
            >{localize('DND5E.Summoning.Prompt.Label')}</Checkbox
          >
        </div>
      </div>
    </ItemFormGroup>
  {/if}

  <ItemFormGroup
    cssClass="stacked"
    labelText={localize('DND5E.ChatFlavor')}
    field="system.chatFlavor"
    let:inputId
  >
    <TextInput
      id={inputId}
      document={$context.item}
      field="system.chatFlavor"
      value={$context.system.chatFlavor}
      disabled={!$context.editable}
    />
  </ItemFormGroup>
{/if}
