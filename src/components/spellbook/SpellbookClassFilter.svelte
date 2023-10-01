<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<CharacterSheetContext>>('store');

  const allClasses = FoundryAdapter.getAllClassesDropdownOptions();

  allClasses.unshift({ text: 'DND5E.Spellbook', value: '' });

  const localize = FoundryAdapter.localize;

  $: selectedClassFilter =
    FoundryAdapter.tryGetFlag($store.actor, 'classFilter') ?? '';
</script>

<select
  class="class-filter"
  on:change|stopPropagation|preventDefault={(event) =>
    $store.actor.update({
      [`flags.${CONSTANTS.MODULE_ID}.classFilter`]: event.currentTarget.value,
    })}
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
