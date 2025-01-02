<script lang="ts">
  import ConfigurableSource from '../../shared/ConfigurableSource.svelte';
  import SheetHeaderEditModeToggle from 'src/sheets/classic/shared/SheetHeaderEditModeToggle.svelte';
  import { getContainerSheetHightouchContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import type { ScrollInfo } from '../../Tidy5eContainerSheetHightouch.svelte';

  const context = $derived(getContainerSheetHightouchContext());

  let sourceText = $derived(
    context.editable
      ? context.system.source?.label ||
          game.i18n.localize('DND5E.SOURCE.FIELDS.source.label')
      : context.system.source?.label,
  );

  let scrollInfo = getContext<ScrollInfo>('window-content-scroll-info');
</script>

<div class="header-over-sidebar">
  <SheetHeaderEditModeToggle class="header-control" />

  <span class="header-item-type-label">
    {context.itemType}
  </span>
</div>

{#if scrollInfo.scrollHeight > scrollInfo.clientHeight && scrollInfo.scrollTop >= 65}
  <div class="container-header-start-document-name truncate">
    {context.item.name}
  </div>
{/if}

<ConfigurableSource
  document={context.document}
  keyPath="system.source"
  {sourceText}
  unlocked={context.unlocked}
  buttonClass="header-control unbutton"
/>
