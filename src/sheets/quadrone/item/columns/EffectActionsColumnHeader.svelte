<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnCellProps, ColumnHeaderProps } from 'src/runtime/types';
  import type {
    ActiveEffect5e,
    ActiveEffectContext,
    EffectCategory,
  } from 'src/types/types';
  import { getContext } from 'svelte';

  let {
    sheetDocument,
    sheetContext,
    section,
  }: ColumnHeaderProps<
    any,
    any,
    EffectCategory<ActiveEffectContext> & { key: string }
  > = $props();

  let localize = FoundryAdapter.localize;

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  // TODO: Determine if _addDocument can be used and what is needed to make it work
  function onAddClicked(section: EffectCategory<ActiveEffectContext>) {
    return FoundryAdapter.addEffect(section.type, sheetDocument);
  }
</script>

{#if sheetContext.editable && !section.isEnchantment}
  <a
    class="tidy-table-button"
    title={localize('DND5E.EffectCreate')}
    onclick={(event) => onAddClicked(section)}
  >
    <i class="fas fa-plus"></i>
  </a>
{/if}
