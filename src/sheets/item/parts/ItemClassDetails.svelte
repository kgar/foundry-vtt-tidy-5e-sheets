<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemSpellcasting from './ItemSpellcasting.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';

  let context = getContext<Readable<ItemSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  function selectTraits(
    target: string,
    title: string,
    trait: 'saves' | 'skills.choices' | 'skills'
  ) {
    const options: Record<string, unknown> = {
      name: target,
      title,
      choices: [],
      allowCustom: false,
      suppressWarning: true,
    };
    switch (trait) {
      case 'saves':
        options.choices = CONFIG.DND5E.abilities;
        options.valueKey = null;
        options.labelKey = 'label';
        break;
      case 'skills.choices':
        options.choices = CONFIG.DND5E.skills;
        options.valueKey = null;
        options.labelKey = 'label';
        break;
      case 'skills':
        const skills = $context.item.system.skills;
        const choices = skills.choices?.length
          ? skills.choices
          : Object.keys(CONFIG.DND5E.skills);
        options.choices = Object.fromEntries(
          Object.entries(CONFIG.DND5E.skills).filter(([s]) =>
            choices.includes(s)
          )
        );
        options.maximum = skills.number;
        options.labelKey = 'label';
        break;
    }

    new game.dnd5e.applications.TraitSelector($context.item, options).render(
      true
    );
  }
</script>

<ItemFormGroup
  labelText={localize('DND5E.Identifier')}
  field="system.identifier"
  let:inputId
>
  <div class="form-fields">
    <TextInput
      id={inputId}
      document={$context.item}
      field="system.identifier"
      value={$context.system.identifier}
      placeholder={$context.item.identifier}
      disabled={!$context.owner}
    />
  </div>
  <p class="hint">
    {@html localize('DND5E.ClassIdentifierHint', {
      identifier: $context.item.identifier,
    })}
  </p>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.HitDice')}
  field="system.hitDice"
  let:inputId
>
  <div class="form-fields">
    <Select
      id={inputId}
      document={$context.item}
      field="system.hitDice"
      value={$context.system.hitDice}
      disabled={!$context.owner}
    >
      {#each $context.config.hitDieTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </Select>
  </div>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.HitDiceUsed')}
  field="system.hitDiceUsed"
  let:inputId
>
  <div class="form-fields">
    <NumberInput
      id={inputId}
      document={$context.item}
      field="system.hitDiceUsed"
      value={$context.system.hitDiceUsed}
      placeholder="0"
      disabled={!$context.owner}
    />
  </div>
</ItemFormGroup>

<h3 class="form-header">{localize('DND5E.Spellcasting')}</h3>
<ItemSpellcasting />

<h3 class="form-header">{localize('DND5E.Proficiency')}</h3>
<ItemFormGroup labelText={localize('DND5E.ClassSaves')}>
  <svelte:fragment slot="inside-after-label">
    {#if $context.owner && $context.editable}
      <button
        type="button"
        class="trait-selector class-saves inline-icon-button"
        on:click={() =>
          selectTraits('system.saves', localize('DND5E.ClassSaves'), 'saves')}
      >
        <i class="fas fa-edit" />
      </button>
    {/if}
  </svelte:fragment>
  <div class="form-fields">
    <ul class="traits-list">
      {#each $context.system.saves as save}
        {@const label = $context.config.abilities[save].label}
        <li class="tag {save}">{label}</li>
      {/each}
    </ul>
  </div>
</ItemFormGroup>

<ItemFormGroup
  labelText={localize('DND5E.ClassSkillsNumber')}
  field="system.skills.number"
  let:inputId
>
  <div class="form-fields">
    <NumberInput
      id={inputId}
      document={$context.item}
      field="system.skills.number"
      placeholder="0"
      value={$context.system.skills.number}
      disabled={!$context.owner}
    />
  </div>
</ItemFormGroup>

<ItemFormGroup labelText={localize('DND5E.ClassSkillsEligible')}>
  <svelte:fragment slot="inside-after-label">
    {#if $context.owner && $context.editable}
      <button
        type="button"
        class="trait-selector class-skills inline-icon-button"
        on:click={() =>
          selectTraits(
            'system.skills.choices',
            localize('DND5E.ClassSkillsEligible'),
            'skills.choices'
          )}
      >
        <i class="fas fa-edit" />
      </button>
    {/if}
  </svelte:fragment>

  <div class="form-fields">
    <ul class="traits-list">
      {#each $context.system.skills.choices as choice}
        {@const label = $context.config.skills[choice].label}
        <li class="tag {choice}">{label}</li>
      {/each}
    </ul>
  </div>
</ItemFormGroup>

<ItemFormGroup labelText={localize('DND5E.ClassSkillsChosen')}>
  <svelte:fragment slot="inside-after-label">
    {#if $context.owner && $context.editable}
      <button
        type="button"
        class="trait-selector class-skills inline-icon-button"
        on:click={() =>
          selectTraits(
            'system.skills',
            localize('DND5E.ClassSkillsChosen'),
            'skills'
          )}
      >
        <i class="fas fa-edit" />
      </button>
    {/if}
  </svelte:fragment>

  <div class="form-fields">
    <ul class="traits-list">
      {#each $context.system.skills.value as skillValue}
        {@const label = $context.config.skills[skillValue].label}
        <li class="tag {skillValue}">{label}</li>
      {/each}
    </ul>
  </div>
</ItemFormGroup>
