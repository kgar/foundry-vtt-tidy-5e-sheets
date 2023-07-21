<script>
  import { slide } from 'svelte/transition';
</script>

<div class="item-table-summary" transition:slide|global={{ duration: 200 }}>
  <slot>(Item table summary here!)</slot>
</div>
