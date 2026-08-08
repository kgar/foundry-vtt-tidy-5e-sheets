<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { Activities } from 'src/features/activities/activities';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { getUsesRechargeDiceRange } from 'src/utils/formula';
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import type { ActivityItemContext } from 'src/types/types';

  type Props = {
    rowDocument: Activity5e;
    rowContext: ActivityItemContext;
  };

  let { rowDocument: activity, rowContext: ctx }: Props = $props();

  let conceal = $derived(activity.item.system.identified === false);

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;

  let rechargeLabel = $derived(
    localize('TIDY5E.RollRecharge.Hint', {
      rechargeLabel: activity.labels?.recharge ?? '',
    }),
  );

  let { rechargeRange, diceIconClass } = $derived(
    getUsesRechargeDiceRange(activity.uses),
  );

  const configurable = $derived(Activities.isConfigurable(ctx.activity));
</script>

{#if configurable && ctx.hasLimitedUses && !conceal}
  {#if ctx.hasRecharge && ctx.isOnCooldown}
    <a
      class={['item-list-button', { disabled: !activity.item.isOwner }]}
      data-activity-id={activity.id}
      data-tooltip=""
      aria-label={rechargeLabel}
      data-action="recharge"
    >
      <i class="{diceIconClass} color-text-lighter text-label-icon"></i>
      <span class="recharge-range-text text-data">
        {rechargeRange}
      </span>
    </a>
  {:else if ctx.hasRecharge && !ctx.isOnCooldown}
    <span class="charged-text">
      {#if activity.uses.value > 1}
        <span>{activity.uses.value}</span>
      {/if}
      <i class="fas fa-bolt" data-tooltip={localize('DND5E.Charged')}></i>
    </span>
  {:else}
    <!-- 
      Activity Uses must specify the item ID, because it could be included  
      in a Cast Activity Spell table row whose related item ID would not
      yield the activity to be updated.
    -->
    <input
      type="text"
      inputmode="numeric"
      value={activity.uses.value}
      {@attach InputAttachments.selectOnFocus}
      data-name="uses.value"
      class="uninput uses-value color-text-default"
      disabled={!context.editable}
      data-item-id={activity.item.id}
      data-activity-id={activity.id}
    />
    <span class="color-text-gold">/</span>
    <span class="uses-max color-text-lighter">{activity.uses.max}</span>
  {/if}
{:else}
  <span class="color-text-disabled">&mdash;</span>
{/if}
