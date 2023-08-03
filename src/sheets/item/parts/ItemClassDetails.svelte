<script lang="ts">
  import NumberInput from 'src/components/form/NumberInput.svelte';
  import Select from 'src/components/form/Select.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemSpellcasting from './ItemSpellcasting.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div class="form-group">
  <label>{localize('DND5E.Identifier')}</label>
  <div class="form-fields">
    <input
      type="text"
      name="system.identifier"
      value={$store.system.identifier}
      placeholder={$store.item.identifier}
    />
  </div>
  <p class="hint">
    {@html localize('DND5E.ClassIdentifierHint', {
      identifier: $store.item.identifier,
    })}
  </p>
</div>

<div class="form-group">
  <label>{localize('DND5E.HitDice')}</label>
  <div class="form-fields">
    <Select
      document={$store.item}
      field="system.hitDice"
      value={$store.system.hitDice}
    >
      {#each $store.config.hitDieTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </Select>
  </div>
</div>

<div class="form-group">
  <label>{localize('DND5E.HitDiceUsed')}</label>
  <div class="form-fields">
    <NumberInput
      document={$store.item}
      field="system.hitDiceUsed"
      value={$store.system.hitDiceUsed}
      placeholder="0"
    />
  </div>
</div>

<h3 class="form-header">{localize('DND5E.Spellcasting')}</h3>
<ItemSpellcasting />

<h3 class="form-header">{localize('DND5E.Proficiency')}</h3>
<div class="form-group">
  <label>
    {localize('DND5E.ClassSaves')}
    {#if $store.editable}
      <a
        class="trait-selector class-saves"
        data-target="system.saves"
        data-options="saves"
      >
        <i class="fas fa-edit" />
      </a>
    {/if}
  </label>
  <div class="form-fields">
    <ul class="traits-list">
      {#each $store.system.saves as save}
        {@const label = $store.config.abilities[save].label}
        <li class="tag {save}">{label}</li>
      {/each}
    </ul>
  </div>
</div>

<div class="form-group">
  <label>{localize('DND5E.ClassSkillsNumber')}</label>
  <div class="form-fields">
    <NumberInput
      document={$store.item}
      field="system.skills.number"
      placeholder="0"
    />
  </div>
</div>

<div class="form-group">
  <label>
    {localize('DND5E.ClassSkillsEligible')}
    {#if $store.editable}
      <a
        class="trait-selector class-skills"
        data-target="system.skills.choices"
        data-options="skills.choices"
      >
        <i class="fas fa-edit" />
      </a>
    {/if}
  </label>
  <div class="form-fields">
    <ul class="traits-list">
      {#each $store.system.skills.choices as choice}
        {@const label = $store.config.skills[choice].label}
        <li class="tag {choice}">{label}</li>
      {/each}
    </ul>
  </div>
</div>

<div class="form-group">
  <label>
    {localize('DND5E.ClassSkillsChosen')}
    {#if $store.editable}
      <a
        class="trait-selector class-skills"
        data-target="system.skills"
        data-options="skills"
      >
        <i class="fas fa-edit" />
      </a>
    {/if}
  </label>
  <div class="form-fields">
    <ul class="traits-list">
      {#each $store.system.skills.value as skillValue}
        {@const label = $store.config.skills[skillValue].label}
        <li class="tag {skillValue}">{label}</li>
      {/each}
    </ul>
  </div>
</div>
