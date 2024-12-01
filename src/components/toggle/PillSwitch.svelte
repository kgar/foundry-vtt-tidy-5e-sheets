<script lang="ts">
    import type { Snippet } from 'svelte';
  import Dnd5eIcon from '../icon/Dnd5eIcon.svelte';
  import FieldToggle from './FieldToggle.svelte';

  interface Props {
    checked?: boolean;
    checkedIconClass?: string | undefined;
    checkedSvgSrc?: string | undefined;
    uncheckedIconClass?: string | undefined;
    uncheckedSvgSrc?: string | undefined;
    onchange?:
      | ((
          event: Event & {
            currentTarget: EventTarget & HTMLInputElement;
          },
        ) => void)
      | undefined;
    children?: Snippet;
  }

  let {
    checked = $bindable(false),
    checkedIconClass = undefined,
    checkedSvgSrc = undefined,
    uncheckedIconClass = undefined,
    uncheckedSvgSrc = undefined,
    onchange = undefined,
    children,
  }: Props = $props();
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<label class="pill pill-switch">
  <span>
    <span class="pill-switch-icon-container" class:hidden={!checked}>
      {#if checkedIconClass}
        <i class={checkedIconClass}></i>
      {/if}
      {#if checkedSvgSrc}
        <Dnd5eIcon class="fa-fw" src={checkedSvgSrc} />
      {/if}
    </span>
    <span class="pill-switch-icon-container" class:hidden={checked}>
      {#if uncheckedIconClass}
        <i class={uncheckedIconClass}></i>
      {/if}
      {#if uncheckedSvgSrc}
        <Dnd5eIcon class="fa-fw" src={uncheckedSvgSrc} />
      {/if}
    </span>
    {@render children?.()}
  </span>
  <!-- kgar-migration-task - make sure this still works as intended -->
  <FieldToggle {checked} {onchange} />
</label>
