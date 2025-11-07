<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSectionCommand, TidySectionBase } from 'src/types/types';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  type Props = {
    action: ActorSectionCommand;
    section: TidySectionBase;
    sheetDocument: any;
  } & HTMLAnchorAttributes;

  let { action, section, sheetDocument, ...attributes }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<a
  class="tidy-table-button"
  data-tooltip
  aria-label={localize(action.tooltip ?? action.label ?? '')}
  onclick={(event) =>
    action.execute?.({ actor: sheetDocument, event, section })}
  {...attributes}
>
  {#if action.iconClass}
    <i class={action.iconClass}></i>
  {/if}
</a>
