<script lang="ts">
  import { getContext } from 'svelte';
  import ConfigurableSource from '../../shared/ConfigurableSource.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { Readable } from 'svelte/store';
  import type { ContainerSheetHightouchContext } from 'src/types/item.types';
  import SheetHeaderEditModeToggle from 'src/sheets/classic/shared/SheetHeaderEditModeToggle.svelte';

  const context = getContext<Readable<ContainerSheetHightouchContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: sourceText = $context.editable
    ? $context.system.source?.label ||
      game.i18n.localize('DND5E.SOURCE.FIELDS.source.label')
    : $context.system.source?.label;
</script>

<SheetHeaderEditModeToggle class="header-control" />

<ConfigurableSource
  document={$context.document}
  keyPath="system.source"
  {sourceText}
  unlocked={$context.unlocked}
  buttonClass="header-control unbutton"
/>
