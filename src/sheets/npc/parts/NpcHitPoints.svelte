<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContext } from 'src/types/types';
  import { isRealNumber } from 'src/utils/numbers';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');

  // TODO: Break this down so it's simple for the reader
  $: hpBarCalculationCurrent =
    (100 /
      ((isRealNumber($store.hp?.max) ? $store.hp.max! : 1) +
        (isRealNumber($store.hp?.tempmax) ? $store.hp.tempmax! : 0))) *
      (isRealNumber($store.hp?.value) ? $store.hp.value! : 0) +
    (isRealNumber($store.hp?.temp) ? $store.hp.temp! : 0);

  const localize = FoundryAdapter.localize;
</script>

<div class="portrait-hp" title={localize('DND5E.HitPoints')}>
  <div
    class="hp-bar"
    style="background: linear-gradient(
                        -90deg,
                        transparent 0%,
                        transparent calc(100% -  {hpBarCalculationCurrent}),
                             rgba(0, 200, 0, 0.5) calc(100% - {hpBarCalculationCurrent}),
                             rgba(0, 200, 0, 0.5) 100%);"
  />
  <input
    class="hp-min"
    name="system.attributes.hp.value"
    type="text"
    value={$store.hp?.value}
    placeholder="10"
    title={localize('DND5E.HitPointsCurrent')}
    data-dtype="Number"
    maxlength="5"
    aria-describedby="tooltip"
  />
  <span class="value-seperator sep"> / </span>
  <input
    class="hp-max"
    name="system.attributes.hp.max"
    type="text"
    value={$store.hp?.max}
    placeholder="10"
    title={localize('DND5E.HitPointsMax')}
    data-dtype="Number"
    maxlength="5"
    aria-describedby="tooltip"
  />
</div>

<style lang="scss">
    // TODO: Pick up here.
</style>