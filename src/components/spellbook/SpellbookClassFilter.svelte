<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import {
    type CharacterSheetContext,
    type DropdownListOption,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  let allClasses: DropdownListOption[] = [];

  $: {
    allClasses = FoundryAdapter.getAllClassesDropdownOptions(
      $settingStore.spellClassFilterAdditionalClasses,
    );

    allClasses.unshift({ text: 'DND5E.Spellbook', value: '' });
  }

  const localize = FoundryAdapter.localize;

  $: selectedClassFilter =
    FoundryAdapter.tryGetFlag($context.actor, 'classFilter') ?? '';
</script>

<select
  class="class-filter"
  on:change|stopPropagation|preventDefault={(event) =>
    $context.actor.update({
      [`flags.${CONSTANTS.MODULE_ID}.classFilter`]: event.currentTarget.value,
    })}
  disabled={!$context.editable}
  data-tidy-field={`flags.${CONSTANTS.MODULE_ID}.classFilter`}
>
  {#each allClasses as option}
    <option
      value={option.value}
      selected={option.value === selectedClassFilter ?? undefined}
      >{localize(option.text)}</option
    >
  {/each}
</select>

<style lang="scss">
  .class-filter {
    text-overflow: ellipsis;
  }
</style>
