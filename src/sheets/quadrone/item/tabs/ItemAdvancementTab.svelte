<script lang="ts">
  import TidyEffectTableRow from 'src/components/table-quadrone/TidyEffectTableRow.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import type { ActiveEffectContext, EffectCategory } from 'src/types/types';
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
  import EffectToggleButton from 'src/components/table-quadrone/table-buttons/EffectToggleButton.svelte';
  import type { Component } from 'svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());

  let advancements = $derived(
    Object.entries(context.advancement),
  );
</script>

<ol>
  <li>Make tidy tables for advancements</li>
  <li>Add the actor-owned view</li>
  <li>Add partial config UI</li>
  <li>Add false config UI</li>
  <li>Ensure all interactibles are included</li>
</ol>