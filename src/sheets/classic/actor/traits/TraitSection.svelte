<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { type Snippet } from 'svelte';
  import type { MouseEventHandler } from 'svelte/elements';

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  interface Props {
    title: string;
    configureButtonTitle: string;
    iconCssClass?: string | undefined;
    traitCssClass?: string | undefined;
    show: boolean;
    customIcon?: Snippet;
    onConfigureClicked?: MouseEventHandler<HTMLElement>;
    children?: Snippet;
  }

  let {
    title,
    configureButtonTitle,
    iconCssClass = undefined,
    traitCssClass = '',
    show,
    customIcon,
    onConfigureClicked,
    children,
  }: Props = $props();
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
      {#if settings.value.showTraitLabels}
        <span class="trait-label">{title}</span>
      {/if}
      {@render children?.()}
    </div>
    {#if context.unlocked}
      <button
        type="button"
        class="trait-editor inline-icon-button flex-row align-items-flex-start justify-content-center"
        title={configureButtonTitle}
        onclick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onConfigureClicked?.(event);
        }}
        tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
      >
        <i class="fas fa-pencil-alt"></i>
      </button>
    {/if}
  </div>
{/if}
