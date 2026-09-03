<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { UsesField } from 'src/types/item.types';
  import type { AnyActorSheetQuadroneContext } from 'src/types/types';
  import { getUsesRechargeDiceRange } from 'src/utils/formula';

  interface Props {
    document: any;
    uses: UsesField;
  }

  const { document, uses }: Props = $props();

  const localize = FoundryAdapter.localize;

  const rechargeLabel = $derived(
    localize('TIDY5E.RollRecharge.Hint', {
      rechargeLabel: document.labels?.recharge ?? '',
    }),
  );

  const context = $derived(getSheetContext<AnyActorSheetQuadroneContext>());

  const disabled = $derived(!context.owner);

  const { rechargeRange, diceIconClass } = $derived(
    getUsesRechargeDiceRange(uses),
  );
</script>

<a
  class={['item-list-button', { disabled }]}
  data-tooltip=""
  aria-label={rechargeLabel}
  data-action={(document.item ?? document).isOwner ? 'recharge' : undefined}
>
  <i class="{diceIconClass} color-text-lighter text-label-icon"></i>
  <span class="recharge-range-text text-data">
    {rechargeRange}
  </span>
</a>
