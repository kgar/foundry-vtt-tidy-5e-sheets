<script lang="ts">
  import AcShieldBase from './AcShieldBase.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContext } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  /**
   * The Armor Class value.
   */
  export let ac: string | number = '0';

  /**
   * Optional CSS class list string to apply to the AC Shield container element.
   */
  export let cssClass: string = '';

  let context = getContext<Readable<ActorSheetContext>>('context');
</script>

<AcShieldBase {cssClass}>
  <button
    type="button"
    on:click={() => FoundryAdapter.renderArmorConfig($context.actor)}
    on:mouseover={(ev) => $context.actor.sheet._onPropertyAttribution(ev)}
    on:focus
    class="config-button attribute-value transparent-button"
    data-attribution="attributes.ac"
    data-attribution-caption="DND5E.ArmorClass"
    data-tooltip-direction="DOWN"
    disabled={!$context.owner}
  >
    {ac}
  </button>
</AcShieldBase>

<style lang="scss">
  .attribute-value {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 2.25rem;
    font-weight: 700;
  }
</style>
