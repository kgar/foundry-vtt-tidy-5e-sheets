<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { RegisteredActorItemSectionCommand } from 'src/runtime/types';
  import type { TidySectionBase } from 'src/types/types';

  type Props = {
    action: RegisteredActorItemSectionCommand;
    section: TidySectionBase;
    sheetDocument: any;
    unlocked: boolean;
  };

  let { action, section, sheetDocument, unlocked }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

{#if !action.enabled || action.enabled( { actor: sheetDocument, section, unlocked }, )}
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
{/if}
