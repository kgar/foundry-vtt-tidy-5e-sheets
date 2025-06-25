<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  let warnings = $derived(context.warnings);

  function onCloseWarnings(
    event: MouseEvent & {
      currentTarget: EventTarget & HTMLDialogElement;
    },
  ) {
    if (event.target instanceof HTMLDialogElement) {
      event.target.close();
    }

    if (event.target instanceof HTMLAnchorElement) {
      event.target.closest('dialog')?.close();
    }
  }

  let dialog: HTMLDialogElement;

  function toggleWarnings(
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) {
    event.stopImmediatePropagation();
    const { top, left, height } = event.currentTarget!.getBoundingClientRect();

    const { clientWidth } = document.documentElement;

    Object.assign(dialog.style, {
      top: `${top + height}px`,
      left: `${Math.min(left - 16, clientWidth - 300)}px`,
    });

    dialog.showModal();
  }
</script>

<button
  type="button"
  onclick={toggleWarnings}
  class={[
    'actor-warnings-control',
    'header-control',
    'fa-solid fa-triangle-exclamation',
    'icon',
    { hidden: !warnings.length },
  ]}
>
  <!-- <i class="fas fa-triangle-exclamation"></i> -->
</button>

<dialog
  class="warnings active"
  bind:this={dialog}
  onclick={(event) => onCloseWarnings(event)}
>
  <ol class="unlist">
    {#each warnings as warning, index}
      <li class={warning.type}>
        {#if warning.link}
          <a
            class="inline-transparent-button"
            onclick={(ev) => context.actor.sheet._onWarningLink(ev)}
            data-target={warning.link}
          >
            {warning.message}
          </a>
        {:else}
          {warning.message}
        {/if}
      </li>
    {/each}
  </ol>
</dialog>
