<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import {
    type CharacterSheetContext,
    type DropdownListOption,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let allClasses: DropdownListOption[] = [];

  $: {
    allClasses = [
      { text: 'DND5E.Spellbook', value: '' },
      ...Object.entries($context.actor.spellcastingClasses).map(
        ([key, value]: [string, Item5e]) => ({
          text: value.name,
          value: key,
        }),
      ),
    ];
  }

  const localize = FoundryAdapter.localize;

  $: selectedClassFilter = TidyFlags.classFilter.get($context.actor) ?? '';
</script>

<select
  class="class-filter"
  on:change|stopPropagation|preventDefault={(event) =>
    $context.actor.update({
      [TidyFlags.classFilter.prop]: event.currentTarget.value,
    })}
  disabled={!$context.editable}
  data-tidy-field={TidyFlags.classFilter.prop}
>
  {#each allClasses as option}
    <option
      value={option.value}
      selected={option.value === (selectedClassFilter ?? undefined)}
      >{localize(option.text)}</option
    >
  {/each}
</select>

<style lang="scss">
  .class-filter {
    text-overflow: ellipsis;
  }
</style>
