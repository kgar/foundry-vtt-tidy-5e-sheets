<script lang="ts">
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e } from 'src/types/item.types';
  import { type DropdownListOption } from 'src/types/types';

  let context = $derived(getCharacterSheetContext());

  let allClasses: DropdownListOption[] = $derived([
    { text: 'DND5E.Spellbook', value: '' },
    ...Object.entries(context.actor.spellcastingClasses).map(
      ([key, value]: [string, Item5e]) => ({
        text: value.name,
        value: key,
      }),
    ),
  ]);

  const localize = FoundryAdapter.localize;

  let selectedClassFilter = $derived(
    context.actor.sheet.classSpellbookFilter ?? '',
  );
</script>

<select
  class="class-filter"
  onchange={(event) => {
    event.preventDefault();
    event.stopPropagation();
    context.actor.sheet.setClassSpellbookFilter(event.currentTarget.value);
  }}
  disabled={!context.editable}
>
  {#each allClasses as option}
    <option
      value={option.value}
      selected={option.value === (selectedClassFilter ?? undefined)}
      >{localize(option.text)}</option
    >
  {/each}
</select>

<style lang="less">
  .class-filter {
    text-overflow: ellipsis;
  }
</style>
