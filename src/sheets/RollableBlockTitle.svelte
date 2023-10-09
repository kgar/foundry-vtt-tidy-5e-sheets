<script lang="ts">
  import type { ActorSheetContext } from 'src/types/types';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let title: string | null = null;
  export let text: string;

  const dispatcher = createEventDispatcher<{ roll: MouseEvent }>();

  let store = getContext<Readable<ActorSheetContext>>('store');
</script>

<h4
  class:rollable={$store.owner}
  class="block-title"
  {title}
  on:click={(ev) => $store.owner && dispatcher('roll', ev)}
>
  {text}
</h4>

<style lang="scss">
  .block-title {
    position: relative;
    font-family: var(--t5ek-title-font-family);
    font-size: 1.25rem;
    line-height: 1;
    margin: 0;
    text-transform: capitalize;
    text-align: center;

    &::after {
      display: block;
      content: '';
      height: 0;
      width: 60%;
      border-bottom: 1px solid var(--t5ek-faint-color);
      position: absolute;
      left: 50%;
      bottom: -1px;
      transform: translate(-50%, 0);
    }
  }
</style>
