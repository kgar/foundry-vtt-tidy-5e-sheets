<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  interface Props {
    uses: number;
    index: number;
    temp?: boolean;
    onclick?: MouseEventHandler<HTMLAnchorElement>;
  }

  let { uses, index, temp, onclick }: Props = $props();

  let isEmpty = $derived(index >= uses);
  let previousIsEmpty: boolean | null = null;

  let pipEl: HTMLElement;

  // TODO: When Classic is removed, remove all animation-related eventing from this component. Not needed!
  $effect(() => {
    const currentIsEmpty = isEmpty;

    if (previousIsEmpty === currentIsEmpty) {
      return;
    }

    const wasFirstRun = previousIsEmpty === null;
    previousIsEmpty = currentIsEmpty;

    if (wasFirstRun) {
      return;
    }

    const className = !currentIsEmpty ? 'animate-restored' : 'animate-expended';
    const controller = new AbortController();

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

    // If the pip changes or drops mid-animation drop the listener
    return () => {
      controller.abort();
      pipEl.classList.remove(className);
    };
  });
</script>

<a
  bind:this={pipEl}
  class={['pip', 'spell-pip', { temp }]}
  class:inactive={isEmpty}
  class:active={!isEmpty}
  {onclick}
></a>
