<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  interface Props {
    uses: number;
    index: number;
    onclick?: MouseEventHandler<HTMLAnchorElement>;
    onmouseenter?: MouseEventHandler<HTMLAnchorElement>;
    onmouseleave?: MouseEventHandler<HTMLAnchorElement>;
  }

  let {
    uses,
    index,
    onclick,
    onmouseenter,
    onmouseleave,
  }: Props = $props();

  let isEmpty = $derived(index >= uses);
  let previousIsEmpty = $state<boolean | null>(null);

  let pipEl: HTMLElement;

  $effect(() => {
    if (previousIsEmpty === null) {
      previousIsEmpty = isEmpty;
      return;
    }

    if (previousIsEmpty !== isEmpty) {
      let className = !isEmpty ? 'animate-restored' : 'animate-expended';
      let controller = new AbortController();

      // Trigger onetime animation, remove the class, and stop listening to events.
      pipEl.addEventListener(
        'transitionend',
        () => {
          pipEl.classList.remove(className);
          controller.abort();
        },
        { signal: controller.signal },
      );

      pipEl.classList.add(className);

      previousIsEmpty = isEmpty;
    }
  });
</script>

<a
  bind:this={pipEl}
  class="pip spell-pip"
  class:inactive={isEmpty}
  class:active={!isEmpty}
  {onclick}
  {onmouseenter}
  {onmouseleave}
></a>
