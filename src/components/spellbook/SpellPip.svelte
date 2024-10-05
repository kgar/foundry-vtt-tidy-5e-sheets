<script lang="ts">
  import { onMount } from 'svelte';

  export let isEmpty: boolean;
  export let willChange: boolean;
  export let disabled: boolean;

  let pipEl: HTMLElement;
  let animateExpended = false;
  let animateRestored = false;
  $: {
    handlePipAnimation(isEmpty);
  }

  let animatePips = false;
  onMount(() => {
    animatePips = true;
  });

  function handlePipAnimation(isEmpty: boolean) {
    if (
      // Don't animate when the pip is still initializing
      !animatePips ||
      // Don't animate when the pip is not visible, as it will cause the pip to animate every time it becomes visible, until toggle manually
      // Note: offsetParent === null when the pip is hidden because of an ancestor being hidden (e.g., the tab isn't selected)
      !pipEl.offsetParent
    ) {
      return;
    }
    animateExpended = isEmpty;
    animateRestored = !isEmpty;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-missing-content -->
{#if !disabled}
  <a
    bind:this={pipEl}
    class="pip"
    class:empty={isEmpty}
    class:change={willChange}
    class:animate-expended={animateExpended}
    class:animate-restored={animateRestored}
    on:click
    on:mouseenter
    on:mouseleave
    on:focusin
    on:focusout
    on:transitionend={() => {
      // Prevent unwanted additional animations after the pip effect has ended.
      animateExpended = false;
      animateRestored = false;
    }}
  ></a>
{:else}
  <a bind:this={pipEl} class="pip" class:empty={isEmpty}></a>
{/if}

<style lang="scss">
  .pip {
    margin: 0;
    padding: 0;
    line-height: normal;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background-color: var(--t5e-spell-pip-active-background);
    border: 0.0625rem solid var(--t5e-spell-pip-border-color);
    transition: background-color 0.3s ease;

    &:is(:hover, :focus-visible),
    &.change {
      background-color: var(--t5e-warning-accent-color);
    }

    &.empty {
      background: var(--t5e-spell-pip-empty-background);

      &:is(:hover, :focus-visible),
      &.change {
        background-color: var(--t5e-prepared-background);
      }
    }

    &.animate-expended {
      animation: expended-pip 0.5s ease;
    }
    &.animate-restored {
      animation: restored-pip 0.5s ease;
    }

    @keyframes expended-pip {
      0% {
        box-shadow: 0 0 0 0 var(--t5e-primary-accent-color);
      }
      100% {
        box-shadow: 0 0 0 0.375rem rgba(0, 0, 0, 0);
      }
    }

    @keyframes restored-pip {
      0% {
        box-shadow: 0 0 0 0.375rem var(--t5e-primary-accent-color);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
      }
    }
  }
</style>
