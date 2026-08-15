<script lang="ts">
  import SafeHtml from 'src/attachments/SafeHtml.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import { isNil } from 'src/utils/data';
  import { firstOfSet } from 'src/utils/set';

  type Props = {
    rowDocument: Item5e;
  };

  let { rowDocument: item }: Props = $props();

  const localize = FoundryAdapter.localize;

  let inferredActivation = $derived(
    item.system.activities
      ? firstOfSet<any>(item.system.activities)?.activation
      : '',
  );

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
    <SafeHtml html={fullLabel.trim()} />
  </span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}
