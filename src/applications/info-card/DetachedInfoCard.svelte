<script lang="ts">
  import type { InfoCardState } from 'src/components/item-info-card/info-card.svelte';
  import { warn } from 'src/utils/logging';

  interface Props {
    cardState: InfoCardState<any>;
  }

  let { cardState }: Props = $props();

  function onError(error: unknown) {
    warn('An error occurred while managing the info card', false, {
      error,
      card: cardState,
    });
  }
</script>

<section class="tidy-info-card">
  <section class="info-card-body">
    <svelte:boundary onerror={onError}>
      <cardState.component {...cardState.props} />
    </svelte:boundary>
  </section>
</section>
