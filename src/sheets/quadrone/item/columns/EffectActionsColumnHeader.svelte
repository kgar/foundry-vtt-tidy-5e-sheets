<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnHeaderProps } from 'src/runtime/types';
  import type { ActiveEffectSection } from 'src/types/types';

  let {
    sheetDocument,
    section,
  }: ColumnHeaderProps<any, any, ActiveEffectSection> = $props();

  let localize = FoundryAdapter.localize;

  // TODO: Determine if _addDocument can be used and what is needed to make it work
  function onAddClicked(section: ActiveEffectSection) {
    return FoundryAdapter.addEffect(section.type, sheetDocument);
  }
</script>

{#if section.canCreate}
  <a
    class="tidy-table-button"
    title={localize('DND5E.EffectCreate')}
    onclick={(event) => onAddClicked(section)}
  >
    <i class="fas fa-plus"></i>
  </a>
{/if}
{#if section.disabled}
  <span class="tidy-table-button">
    <i
      class="fa-solid fa-info-circle"
      data-tooltip="DND5E.EffectUnavailableInfo"
    ></i>
  </span>
{/if}
