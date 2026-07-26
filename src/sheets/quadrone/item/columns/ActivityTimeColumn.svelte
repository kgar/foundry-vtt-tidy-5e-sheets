<script lang="ts">
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';
  import { coalesce } from 'src/utils/formatting';

  type Props = {
    rowDocument: Activity5e;
  };

  let { rowDocument: activity }: Props = $props();

  let inferredActivation = $derived(activity.activation);

  let abbrOrLabel = $derived(
    FoundryAdapter.getActivationText(inferredActivation?.type),
  );

  let text = $derived(
    coalesce(abbrOrLabel.abbreviation, abbrOrLabel.label, ''),
  );

  let tooltipContent = $derived(
    (inferredActivation?.value ?? '') +
      ' ' +
      (inferredActivation?.condition !== undefined &&
      inferredActivation?.condition !== ''
        ? abbrOrLabel.label + ', ' + inferredActivation?.condition
        : abbrOrLabel.label),
  );

  const localize = FoundryAdapter.localize;
</script>

{#if !isNil(text, '')}
  <span class="overflow-wrap-anywhere" data-tooltip={tooltipContent.trim()}>
    {!isNil(inferredActivation?.value)
      ? inferredActivation?.value + '&nbsp;'
      : ''}
    {localize(text).trim()}
  </span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
