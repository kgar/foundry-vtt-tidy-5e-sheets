<script lang="ts">
  import { onMount } from 'svelte';

  export let item: any;
  export let itemContext: any;

  $: ctx = itemContext[item.id];

  onMount(() => {
    // TODO: Upgrade debug so it logs object data
    console.log(ctx);
  });
</script>

<slot {ctx} />
