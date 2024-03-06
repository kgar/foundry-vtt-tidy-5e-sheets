<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let primary: boolean = false;
  export let cssClass: string = '';
  export let title: string | undefined = undefined;

  const isHovering = writable<boolean>(false);

  function mouseEnter(ev: MouseEvent) {
    isHovering.set(true);
  }

  function mouseLeave(ev: MouseEvent) {
    isHovering.set(false);
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="tidy-table-cell {cssClass}"
  class:primary
  {title}
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}
  {...$$props.attributes}
>
  <slot {isHovering} />
</div>
