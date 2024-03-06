<script lang="ts">
  export let primary: boolean = false;
  export let baseWidth: string | null = null;
  export let title: string | null = null;
</script>

<div
  class="tidy-table-header-cell {$$restProps.class ?? ''}"
  class:primary
  style:flex-basis={baseWidth}
  {title}
>
  <slot />
</div>
