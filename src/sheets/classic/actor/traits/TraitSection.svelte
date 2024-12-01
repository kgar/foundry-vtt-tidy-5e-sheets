<script lang="ts">
  import { preventDefault, stopPropagation } from 'svelte/legacy';

  import { CONSTANTS } from 'src/constants';
  import { settingStore } from 'src/settings/settings';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  interface Props {
    title: string;
    configureButtonTitle: string;
    iconCssClass?: string | undefined;
    traitCssClass?: string | undefined;
    show: boolean;
    customIcon?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let {
    title,
    configureButtonTitle,
    iconCssClass = undefined,
    traitCssClass = '',
    show,
    customIcon,
    children,
  }: Props = $props();

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
        <i class={iconCssClass}></i>
      {/if}
      {@render customIcon?.()}
    </span>
    <div
      class="trait-label-and-list"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTOR_TRAIT_DETAILS}
    >
      {#if $settingStore.showTraitLabels}
        <span class="trait-label">{title}</span>
      {/if}
      {@render children?.()}
    </div>
    {#if $context.unlocked}
      <button
        type="button"
        class="trait-editor inline-icon-button flex-row align-items-flex-start justify-content-center"
        title={configureButtonTitle}
        onclick={stopPropagation(
          preventDefault((event) => dispatcher('onConfigureClicked', event)),
        )}
        tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      >
        <i class="fas fa-pencil-alt"></i>
      </button>
    {/if}
  </div>
{/if}
