<script lang="ts">
  import { isNil } from 'src/utils/data';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { UtilityToolbarCommandExecuteEvent } from './types';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';

  export let title: string | undefined = undefined;
  export let iconClass: string | undefined = undefined;
  export let text: string | undefined = undefined;
  export let visible: boolean = true;

  const context = getContext<Readable<unknown>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const dispatcher = createEventDispatcher<{
    execute: UtilityToolbarCommandExecuteEvent;
  }>();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="inline-icon-button"
  class:hidden={!visible}
  on:click={(ev) => dispatcher('execute', { event: ev, context: $context })}
  {title}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.UTILITY_TOOLBAR_COMMAND}
>
  {#if !isNil(iconClass, '')}
    <i class={iconClass}></i>
  {/if}
  {#if !isNil(text, '')}
    {text}
  {/if}
</a>
