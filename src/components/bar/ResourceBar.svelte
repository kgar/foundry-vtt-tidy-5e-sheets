<script lang="ts">
  import Bar from './Bar.svelte';

  interface Props {
    value?: number | null | undefined;
    max?: number | null | undefined;
    percentage?: number | null;
  }

  let { value = null, max = null, percentage = null }: Props = $props();
</script>

<Bar {value} {max} {percentage} color="var(--t5e-resource-bar-color)" />
