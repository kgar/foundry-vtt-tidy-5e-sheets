<script lang="ts">
  export let item: any;
  export let itemContext: any;

  $: ctx = itemContext[item.id];
</script>

<slot {ctx} />
