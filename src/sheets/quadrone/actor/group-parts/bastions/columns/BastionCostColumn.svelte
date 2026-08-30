<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    cost: number | null;
  }

  let { cost }: Props = $props();
</script>

{#if cost !== null}
  <span class="font-label-medium">{FoundryAdapter.formatNumber(cost)}</span>
{:else}
  <span class="color-text-lightest">&mdash;</span>
{/if}
