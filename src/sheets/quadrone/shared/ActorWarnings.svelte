<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  let warnings = $derived(context.warnings);

  function closeDialog() {
    dialog.close();
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

  async function onWarningLink(
    warning: Partial<{
      message: string;
      link: string;
      type: string;
    }>,
  ) {
    if (warning.link === 'armor') {
      FoundryAdapter.renderArmorConfig(context.actor);
      return;
    }

    const doc = await fromUuid(warning.link);
    doc?.sheet.render(true);
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
</button>

<dialog
  class="warnings active"
  bind:this={dialog}
  onclick={(event) => closeDialog()}
>
  <ol class="unlist">
    {#each warnings as warning, index}
      <li class={warning.type} onclick={() => closeDialog()}>
        {#if warning.link}
          <a
            class="inline-transparent-button"
            onclick={() => onWarningLink(warning)}
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
