<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { SectionCommand, TidySectionBase } from 'src/types/types';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  type Props = {
    action: SectionCommand;
    section: TidySectionBase;
    sheetDocument: any;
  } & HTMLAnchorAttributes;

  let { action, section, sheetDocument, ...attributes }: Props = $props();

  const localize = FoundryAdapter.localize;

  const tooltip = $derived(localize(action.tooltip ?? action.label ?? ''));
</script>

<a
  class="tidy-table-button"
  data-tooltip={tooltip}
  aria-label={tooltip}
  onclick={(event) =>
    action.execute?.({ document: sheetDocument, event, section })}
  {...attributes}
>
  {#if action.iconClass}
    <i class={action.iconClass}></i>
  {/if}
</a>
