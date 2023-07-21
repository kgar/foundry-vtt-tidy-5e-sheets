<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import { SettingsProvider } from 'src/settings/settings';
  import type { DropdownOption } from 'src/types/types';

  export let context: ActorSheetContext;

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

  const selectedClassFilter =
    FoundryAdapter.tryGetFlag(context.actor, 'classFilter') ?? '';
</script>

<select class="class-filter" name="flags.{CONSTANTS.MODULE_ID}.classFilter">
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
