<script lang="ts">
  import ConfigurableSource from '../../shared/ConfigurableSource.svelte';
  import SheetHeaderEditModeToggle from 'src/sheets/classic/shared/SheetHeaderEditModeToggle.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  const context = $derived(getContainerSheetQuadroneContext());

  let sourceText = $derived(
    context.editable
      ? context.system.source?.label ||
          game.i18n.localize('DND5E.SOURCE.FIELDS.source.label')
      : context.system.source?.label,
  );
</script>

<div class="header-over-sidebar theme-dark">
  <SheetHeaderEditModeToggle class="header-control" />

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
