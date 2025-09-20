<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ColumnHeaderProps } from 'src/runtime/types';
  import type { ActiveEffectSection } from 'src/types/types';

  let {
    sheetDocument,
    section,
  }: ColumnHeaderProps<any, any, ActiveEffectSection> = $props();

  let localize = FoundryAdapter.localize;

  function onAddClicked(section: ActiveEffectSection) {
    return FoundryAdapter.addEffect(section.type, sheetDocument);
  }
</script>

{#if section.canCreate}
  <a
    class="tidy-table-button"
    aria-label={localize('DND5E.EffectCreate')}
    data-tooltip
    onclick={() => onAddClicked(section)}
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
