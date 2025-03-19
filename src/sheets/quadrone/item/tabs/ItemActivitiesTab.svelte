<script lang="ts">
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import type { ActivitySection } from 'src/types/types';
  import type { Component } from 'svelte';

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());

  function handleDragStart(ev: DragEvent, activityId: string) {
    const activity = context.item.system.activities?.get(activityId);

    ev.dataTransfer?.setData(
      'text/plain',
      JSON.stringify(activity.toDragData()),
    );
  }

  type TableAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    Activity5e,
    ActivitySection
  >;

  let tableActions: TableAction<any>[] = $derived.by(() => {
    let result: TableAction<any>[] = [];

    return result;
  });
</script>

Look at Effects Tab tables, emulate
Review all that you've done for all three table types, and see if this can be consolidated into a centralized, smart component.