<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { SpellSchool } from 'src/foundry/config.types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';

  let { rowDocument }: ColumnCellProps = $props();

  let context = $derived(getSheetContext());

  let spellSchoolConfig = $derived<SpellSchool | undefined>(
    context.config.spellSchools[rowDocument.system.school],
  );
</script>

{#if spellSchoolConfig?.icon}
  <Dnd5eIcon
    src={spellSchoolConfig.icon}
    data-tooltip={spellSchoolConfig.label}
  />
{:else}
  <span class="color-text-disabled">—</span>
{/if}
