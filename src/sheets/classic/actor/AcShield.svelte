<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import AcShieldBase from './AcShieldBase.svelte';
  import { getContext, onMount } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    /**
     * The Armor Class value.
     */
    ac?: string | number;
    /**
     * Optional CSS class list string to apply to the AC Shield container element.
     */
    cssClass?: string;
  }

  let { ac = '0', cssClass = '' }: Props = $props();

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let acShieldButton: HTMLElement;

  onMount(() => {
    $context.actor.sheet._applyAttributionTooltips(acShieldButton);
  });
</script>

<AcShieldBase {cssClass}>
  <button
    bind:this={acShieldButton}
    type="button"
    onclick={() => FoundryAdapter.renderArmorConfig($context.actor)}
    onfocus={bubble('focus')}
    class="config-button attribute-value transparent-button"
    data-attribution="attributes.ac"
    data-attribution-caption="DND5E.ArmorClass"
    data-tooltip-direction="DOWN"
    disabled={!$context.editable}
    tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
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
