<script lang="ts">
  import type { ActorSheetContext } from 'src/types/types';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let title: string | null = null;
  export let text: string;
  export let hideFromTabOrder: boolean = false;
  export let attributes: Record<string, string> = {};

  const dispatcher = createEventDispatcher<{ roll: MouseEvent }>();

  let context = getContext<Readable<ActorSheetContext>>('context');
</script>

<button
  type="button"
  class:rollable={$context.editable}
  class="transparent-button"
  {title}
  on:click={(ev) => dispatcher('roll', ev)}
  disabled={!$context.editable}
  tabindex={!hideFromTabOrder ? 0 : -1}
  {...attributes}
>
  <h4 class="block-title">
    {text}
  </h4>
</button>

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
      border-bottom: 0.0625rem solid var(--t5ek-separator-color);
      position: absolute;
      left: 50%;
      bottom: -0.0625rem;
      transform: translate(-50%, 0);
    }
  }
</style>
