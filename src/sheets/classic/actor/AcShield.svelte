<script lang="ts">
  import AcShieldBase from './AcShieldBase.svelte';
  import { onMount } from 'svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import type { FocusEventHandler } from 'svelte/elements';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    /**
     * The Armor Class value.
     */
    ac?: string | number;
    /**
     * Optional CSS class list string to apply to the AC Shield container element.
     */
    cssClass?: string;
    onfocus?: FocusEventHandler<HTMLElement>;
  }

  let { ac = '0', cssClass = '', onfocus }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetContextV1>());
</script>

<AcShieldBase {cssClass}>
  <button
    type="button"
    onclick={() => FoundryAdapter.renderArmorConfig(context.actor)}
    {onfocus}
    class="config-button attribute-value transparent-button"
    data-attribution="attributes.ac"
    data-attribution-caption="DND5E.ArmorClass"
    data-tooltip-direction="DOWN"
    disabled={!context.editable}
    tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
  >
    {ac}
  </button>
</AcShieldBase>

<style lang="less">
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
