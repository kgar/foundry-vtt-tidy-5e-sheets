<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';

  let context = getSheetContext<CharacterSheetContext | NpcSheetContext>();

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="spell-slot-config inline-icon-button"
  title={localize('DND5E.SpellSlotsConfig')}
  aria-label={localize('DND5E.SpellSlotsConfig')}
  onclick={() => FoundryAdapter.openSpellSlotsConfig(context.actor)}
  tabindex={settings.useAccessibleKeyboardSupport ? 0 : -1}
>
  <i class="fas fa-pencil"></i>
</button>
