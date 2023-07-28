<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import { SettingsProvider } from 'src/settings/settings';
  import type { DropdownOption } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const allClasses: DropdownOption[] = Object.entries(
    CONSTANTS.DND5E_CLASSES
  ).map((x) => ({
    value: x[0],
    text: x[1],
  }));

  const additionalClassText =
    SettingsProvider.settings.spellClassFilterAdditionalClasses.get() ?? '';

  if (additionalClassText?.trim() !== '') {
    const additionalClasses = additionalClassText
      .split(',')
      .reduce((arr: DropdownOption[], x: string) => {
        const pieces = x.split('|');
        if (pieces.length !== 2) {
          return arr;
        }
        arr.push({
          value: pieces[0],
          text: pieces[1],
        });
        return arr;
      }, []);

    allClasses.push(...additionalClasses);
  }

  allClasses.sort((a, b) => a.text.localeCompare(b.text));

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
