<script lang="ts">
  import Bar from './Bar.svelte';

  export let value: number | null | undefined = null;
  export let max: number | null | undefined = null;
  export let percentage: number | null = null;
</script>

<Bar {value} {max} {percentage} color="var(--t5ek-resource-bar-color)" />
