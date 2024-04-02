<script lang="ts">
  import { isNil } from 'src/utils/data';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { UtilityToolbarCommandExecuteEvent } from './types';
  import { settingStore } from 'src/settings/settings';
    import type { Readable } from 'svelte/store';

  export let title: string | undefined = undefined;
  export let iconClass: string | undefined = undefined;
  export let text: string | undefined = undefined;
  export let visible: boolean = true;

  const context = getContext<Readable<unknown>>('context');

  const dispatcher = createEventDispatcher<{
    execute: UtilityToolbarCommandExecuteEvent;
  }>();
</script>

<button
  type="button"
  class="inline-icon-button"
  class:hidden={!visible}
  on:click={(ev) => dispatcher('execute', { event: ev, context: $context })}
  {title}
  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
>
  {#if !isNil(iconClass, '')}
    <i class={iconClass}></i>
  {/if}
  {#if !isNil(text, '')}
    {text}
  {/if}
</button>
