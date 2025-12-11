<script lang="ts">
  import { isNil } from 'src/utils/data';
  import type { UtilityToolbarCommandExecuteEvent } from './types';
  import { settings } from 'src/settings/settings.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { TidySectionBase } from 'src/types/types';

  interface Props {
    title?: string | undefined;
    iconClass?: string | undefined;
    text?: string | undefined;
    visible?: boolean;
    sections?: TidySectionBase[];
    onExecute?: (event: UtilityToolbarCommandExecuteEvent) => void;
  }

  let {
    title = undefined,
    iconClass = undefined,
    text = undefined,
    visible = true,
    sections = [],
    onExecute,
  }: Props = $props();

  const context = $derived(getSheetContext<unknown>());
</script>

<button
  type="button"
  class="inline-icon-button"
  class:hidden={!visible}
  onclick={(ev) => onExecute?.({ event: ev, context: context, sections })}
  {title}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.UTILITY_TOOLBAR_COMMAND}
>
  {#if !isNil(iconClass, '')}
    <i class={iconClass}></i>
  {/if}
  {#if !isNil(text, '')}
    {text}
  {/if}
</button>
