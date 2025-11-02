<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { RegisteredActorItemSectionCommand } from 'src/runtime/types';
  import type { TidySectionBase } from 'src/types/types';

  type Props = {
    action: RegisteredActorItemSectionCommand;
    section: TidySectionBase;
    sheetDocument: any;
  };

  let { action, section, sheetDocument }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<a
  class="tidy-table-button"
  data-tooltip
  aria-label={localize(action.tooltip ?? action.label ?? '')}
  onclick={(event) =>
    action.execute?.({ actor: sheetDocument, event, section })}
>
  {#if action.iconClass}
    <i class={action.iconClass}></i>
  {/if}
</a>
