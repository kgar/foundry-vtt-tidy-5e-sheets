<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import type { MouseEventHandler } from 'svelte/elements';

  interface Props {
    title?: string | null;
    text: string;
    hideFromTabOrder?: boolean;
    attributes?: Record<string, string>;
    onRoll?: MouseEventHandler<HTMLElement>;
  }

  let {
    title = null,
    text,
    hideFromTabOrder = false,
    attributes = {},
    onRoll,
  }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetContextV1>());
</script>

<button
  type="button"
  class:rollable={context.editable}
  class="transparent-button"
  {title}
  onclick={(ev) => onRoll?.(ev)}
  disabled={!context.editable}
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
