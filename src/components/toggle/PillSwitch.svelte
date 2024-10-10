<script lang="ts">
  import Dnd5eIcon from '../icon/Dnd5eIcon.svelte';
  import FieldToggle from './FieldToggle.svelte';

  export let checked: boolean = false;
  export let checkedIconClass: string | undefined = undefined;
  export let checkedSvgSrc: string | undefined = undefined;
  export let uncheckedIconClass: string | undefined = undefined;
  export let uncheckedSvgSrc: string | undefined = undefined;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
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
    <slot />
  </span>
  <FieldToggle bind:checked on:change />
</label>
