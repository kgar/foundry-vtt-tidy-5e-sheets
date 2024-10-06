<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  export let title: string;
  export let configureButtonTitle: string;
  export let iconCssClass: string | undefined = undefined;
  export let traitCssClass: string | undefined = '';
  export let show: boolean;

  const dispatcher = createEventDispatcher<{
    onConfigureClicked: MouseEvent;
  }>();
</script>

{#if show}
  <div
    class="trait-form-group {traitCssClass ?? ''}"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTOR_TRAIT}
  >
    <span class="trait-icon" aria-label={title} {title}>
      {#if iconCssClass !== undefined}
        <i class={iconCssClass} />
      {/if}
      <slot name="custom-icon" />
    </span>
    <div
      class="trait-label-and-list"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTOR_TRAIT_DETAILS}
    >
      {#if $context.settings.showTraitLabels}
        <span class="trait-label">{title}</span>
      {/if}
      <slot />
    </div>
    {#if $context.unlocked}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        class="trait-editor inline-icon-button flex-row align-items-flex-start justify-content-center"
        title={configureButtonTitle}
        on:click|stopPropagation|preventDefault={(event) =>
          dispatcher('onConfigureClicked', event)}
      >
        <i class="fas fa-pencil-alt" />
      </a>
    {/if}
  </div>
{/if}
