<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { AvailableClassLevel } from 'src/types/types';
  import { formatAsModifier } from 'src/utils/formatting';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    availableLevels?: AvailableClassLevel[];
    disabled?: boolean;
    item: any;
    class?: ClassValue;
  }

  let {
    availableLevels = [],
    disabled = false,
    item,
    class: classValue,
  }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<select
  class={[classValue]}
  onchange={(event) => FoundryAdapter.onLevelChange(event, item, item.actor)}
  {disabled}
>
  {#each availableLevels as availableLevel}
    <option
      value={availableLevel.delta}
      disabled={availableLevel.disabled || undefined}
      selected={availableLevel.delta === 0}
    >
      {localize('DND5E.LevelNumber', {
        level: availableLevel.level,
      })}
      {#if availableLevel.delta}
        ({formatAsModifier(availableLevel.delta)})
      {/if}
    </option>
  {/each}
</select>
