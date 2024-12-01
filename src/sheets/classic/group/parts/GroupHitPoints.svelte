<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/types';
  import { settingStore } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { CharacterSheetContext } from 'src/types/types';
  import HpBar from 'src/components/bar/HpBar.svelte';
  import ResourceWithBar from 'src/components/bar/ResourceWithBar.svelte';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    value: number;
    max: number;
    actor: Actor5e;
  }

  let { value, max, actor }: Props = $props();

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<!-- TODO: Just use the bar and put own readonly text in the bar -->
<!-- TODO: Curate the tooltip to show selected members for calculation. -->
<div
  class="group-hp-container"
  class:widen-for-rounded-portrait={$context.useRoundedPortraitStyle}
  title={localize('DND5E.GroupHP')}
>
  <ResourceWithBar
    document={actor}
    {value}
    valueField="system.attributes.hp.value"
    valueTitle={null}
    valueDisabled={true}
    {max}
    maxField="system.attributes.hp.max"
    maxTitle={null}
    maxDisabled={true}
    percentage={$context.healthPercentage}
    Bar={$settingStore.useHpBar ? HpBar : null}
  />
</div>
