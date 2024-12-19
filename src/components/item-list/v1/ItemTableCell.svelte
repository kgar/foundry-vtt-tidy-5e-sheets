<script lang="ts">
  export let baseWidth: string | undefined = undefined;
  export let primary: boolean = false;
  export let cssClass: string = '';
  export let title: string | undefined = undefined;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="item-table-cell {cssClass}"
  class:primary
  style:flex-basis={baseWidth}
  {title}
  {...$$props.attributes}
>
  <slot />
</div>
