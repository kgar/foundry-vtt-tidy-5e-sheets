<script lang="ts">
  import ConfigurableSource from '../../shared/ConfigurableSource.svelte';
  import SheetHeaderEditModeToggleV2 from 'src/sheets/classic/shared/SheetHeaderModeToggleV2.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ContainerSheetQuadroneContext,
    ItemSheetQuadroneContext,
  } from 'src/types/item.types';

  const context =
    $derived(
      getSheetContext<
        ItemSheetQuadroneContext | ContainerSheetQuadroneContext
      >(),
    );

  let sourceText = $derived(
    context.unlocked && !context.system.source?.label
      ? game.i18n.localize('DND5E.SOURCE.FIELDS.source.label')
      : context.system.source?.label,
  );
</script>

<div class="header-over-sidebar theme-dark">
  <SheetHeaderEditModeToggleV2 class="header-control" />

  <span title={context.itemType} class="header-item-type-label truncate">
    {context.itemType}
  </span>
</div>

<div class="item-header-start-document-name truncate">
  {context.item.name}
</div>

<ConfigurableSource
  document={context.document}
  keyPath="system.source"
  {sourceText}
  unlocked={context.unlocked}
  buttonClass="header-control unbutton"
/>
