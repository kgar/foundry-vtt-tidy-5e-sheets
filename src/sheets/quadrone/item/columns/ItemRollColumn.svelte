<script lang="ts">
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';
  import type { Item5e } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  type Props = {
    rowContext: any;
    rowDocument?: Item5e;
  };

  const localize = FoundryAdapter.localize;
  let { rowContext, rowDocument }: Props = $props();
  let identified = $derived(rowDocument?.system?.identified !== false);
</script>

{#if identified && !isNil(rowContext.toHit)}
  {const mod = $derived(getModifierData(rowContext.toHit))}
  <span class="modifier">
    <span class="sign font-default-medium color-text-lightest">{mod.sign}</span
    ><span class="value font-label-medium">{mod.value}</span>
  </span>
{:else if identified && rowContext.save?.ability}
  <div class="stacked">
    <span class="ability uppercase color-text-gold-emphasis font-label-medium"
      >{rowContext.save.ability}</span
    >
    <span class="value font-label-medium">{rowContext.save.dc.value}</span>
  </div>
{:else}
  <span class="color-text-disabled">{identified ? '—' : localize('TIDY5E.Table.UnidentifiedPlaceholder')}</span>
{/if}
