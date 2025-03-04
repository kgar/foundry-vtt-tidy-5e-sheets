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
    disabled?: boolean | undefined;
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
    disabled = false,
    onchange = undefined,
    children,
  }: Props = $props();
</script>

<label class="pill pill-switch interactive" class:disabled>
  <span class="icon-and-label-container">
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
    <span class="truncate">
      {@render children?.()}
    </span>
  </span>
  <FieldToggle {checked} {onchange} {disabled} />
</label>
