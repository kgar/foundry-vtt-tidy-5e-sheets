<script lang="ts">
  import { Activities } from 'src/features/activities/activities';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { ActivityItemContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';

  type Props = {
    rowDocument: Item5e;
    rowContext?: { activities?: ActivityItemContext[] };
  };

  let { rowDocument: item, rowContext }: Props = $props();

  const localize = FoundryAdapter.localize;

  // Prefer prepared visible activities; otherwise match system getUsageData / _prepareLabels.
  let inferredActivation = $derived.by(() => {
    const prepared = rowContext?.activities;
    const activity = prepared
      ? prepared.map((ctx) => ctx.activity).find((a) => a?.activation)
      : item.system.activities?.find(
          (a: any) => 'activation' in a && Activities.isActivityVisible(a),
        );
    return activity?.activation;
  });

  let abbrOrLabel = $derived(
    FoundryAdapter.getActivationText(inferredActivation?.type),
  );

  let tooltipContent = $derived(
    (inferredActivation?.value ?? '') +
      ' ' +
      (inferredActivation?.condition !== undefined &&
      inferredActivation?.condition !== ''
        ? abbrOrLabel.label + ', ' + inferredActivation?.condition
        : abbrOrLabel.label),
  );

  function getFullLabel() {
    return [inferredActivation?.value, localize(abbrOrLabel.label)].filterJoin(
      ' ',
    );
  }
</script>

{#if !isNil(abbrOrLabel.abbreviation, '')}
  <span class="overflow-wrap-anywhere" data-tooltip={tooltipContent.trim()}>
    {@html inferredActivation?.value != null && inferredActivation?.value !== ''
      ? inferredActivation.value + '&nbsp;'
      : ''}
    {localize(abbrOrLabel.abbreviation)}
  </span>
{:else if !isNil(abbrOrLabel.label, '')}
  {const fullLabel = $derived(getFullLabel().trim())}
  <span class="overflow-wrap-anywhere" data-tooltip={tooltipContent.trim()}>
    {@html fullLabel.trim()}
  </span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
