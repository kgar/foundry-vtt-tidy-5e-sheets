<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let title: string | null = null;
  export let text: string;
  export let attributes: Record<string, string> = {};

  const dispatcher = createEventDispatcher<{ roll: MouseEvent }>();

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  class:rollable={$context.editable}
  class="transparent-button"
  {title}
  on:click={(ev) => $context.editable && dispatcher('roll', ev)}
  {...attributes}
>
  <h4 class="block-title">
    {text}
  </h4>
</a>

<style lang="scss">
  .block-title {
    position: relative;
    font-family: var(--t5e-title-font-family);
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
      border-bottom: 0.0625rem solid var(--t5e-separator-color);
      position: absolute;
      left: 50%;
      bottom: -0.0625rem;
      transform: translate(-50%, 0);
    }
  }
</style>
