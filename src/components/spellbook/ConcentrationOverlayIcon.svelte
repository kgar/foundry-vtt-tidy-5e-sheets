<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    ctx: any;
  }

  let { ctx }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

{#if ctx.concentration}
  <i
    class="concentration-overlay fas fa-arrow-rotate-left fa-spin fa-spin-reverse"
    aria-label={localize('DND5E.Concentration')}
  ></i>
{/if}

<style lang="less">
  .concentration-overlay {
    --tidy-icon-font-size-internal: var(--tidy-icon-font-size, 1rem);
    position: absolute;
    opacity: 0.8;
    font-size: var(--tidy-icon-font-size-internal);
    pointer-events: none;

    color: white;
    text-shadow:
      #000 0.0625rem 0 0.25rem,
      #000 0.0625rem 0 0.25rem,
      #000 0.0625rem 0 0.25rem;
  }
</style>
