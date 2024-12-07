<script lang="ts">
  import { isNil } from 'src/utils/data';
  import { getContext } from 'svelte';
  import type { UtilityToolbarCommandExecuteEvent } from './types';
  import { settingStore } from 'src/settings/settings.svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    title?: string | undefined;
    iconClass?: string | undefined;
    text?: string | undefined;
    visible?: boolean;
    onExecute?: (event: UtilityToolbarCommandExecuteEvent) => void;
  }

  let {
    title = undefined,
    iconClass = undefined,
    text = undefined,
    visible = true,
    onExecute,
  }: Props = $props();

  const context = getContext<Readable<unknown>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<button
  type="button"
  class="inline-icon-button"
  class:hidden={!visible}
  onclick={(ev) => onExecute?.({ event: ev, context: $context })}
  {title}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.UTILITY_TOOLBAR_COMMAND}
>
  {#if !isNil(iconClass, '')}
    <i class={iconClass}></i>
  {/if}
  {#if !isNil(text, '')}
    {text}
  {/if}
</button>
