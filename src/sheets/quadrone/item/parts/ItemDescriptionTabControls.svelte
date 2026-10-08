<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import DescriptionControls from '../../shared/DescriptionControls.svelte';

  /**
   * Description controls for item sheets, for display inline with the 
   * sheet tabs within `tabEnd`.
   */
  interface Props {
    selectedTabId: string;
  }

  let { selectedTabId }: Props = $props();

  let context = $derived(getItemSheetContextQuadrone());
</script>

{#if selectedTabId === CONSTANTS.TAB_DESCRIPTION && !context.unlocked}
  <span
    style="margin-inline-start: auto;"
    data-prop="system.description.value"
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_DESCRIPTIONS}
    data-description-selector="[data-tab-contents-for='description'] [data-target]"
  >
    <DescriptionControls />
  </span>
{/if}
