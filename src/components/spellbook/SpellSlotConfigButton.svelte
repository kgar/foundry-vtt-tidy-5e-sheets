<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings.svelte';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="spell-slot-config inline-icon-button"
  title={localize('DND5E.SpellSlotsConfig')}
  aria-label={localize('DND5E.SpellSlotsConfig')}
  onclick={() => FoundryAdapter.openSpellSlotsConfig($context.actor)}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  <i class="fas fa-pencil"></i>
</button>
