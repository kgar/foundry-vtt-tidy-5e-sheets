<script lang="ts">
  import ConfigurableSource from '../../shared/ConfigurableSource.svelte';
  import SheetHeaderEditModeToggle from 'src/sheets/classic/shared/SheetHeaderEditModeToggle.svelte';
  import { getContainerSheetHightouchContext } from 'src/sheets/sheet-context.svelte';

  const context = $derived(getContainerSheetHightouchContext());

  let sourceText = $derived(
    context.editable
      ? context.system.source?.label ||
          game.i18n.localize('DND5E.SOURCE.FIELDS.source.label')
      : context.system.source?.label,
  );
</script>

<SheetHeaderEditModeToggle class="header-control" />

<ConfigurableSource
  document={context.document}
  keyPath="system.source"
  {sourceText}
  unlocked={context.unlocked}
  buttonClass="header-control unbutton"
/>
