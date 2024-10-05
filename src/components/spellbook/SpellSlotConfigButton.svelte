<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="spell-slot-config inline-icon-button"
  title={localize('DND5E.SpellSlotsConfig')}
  aria-label={localize('DND5E.SpellSlotsConfig')}
  on:click={() => FoundryAdapter.openSpellSlotsConfig($context.actor)}
>
  <i class="fas fa-pencil" />
</a>
