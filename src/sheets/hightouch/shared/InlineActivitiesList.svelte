<script lang="ts">
    import type { Item5e } from 'src/types/item.types';
    import type { Activity5e } from 'src/foundry/dnd5e.types';
    import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
    import { getContext } from 'svelte';
    import { CONSTANTS } from 'src/constants';
      
    export let item: Item5e | null = null;
    export let inlineToggleService: InlineToggleService;
  
    $: inlineToggleServiceStore = inlineToggleService.store;
  
    let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
  
    const gridTemplateColumns = `
      /* Name */
      1fr
      /* Uses */
      5rem
      /* Usage */
      5rem
    `;
  
    function rollActivity(activity: Activity5e, event: MouseEvent) {
      activity.use({ event });
    }
  
    function getActivityUsageLabel(activity: Activity5e) {
      return (
        // @ts-expect-error
        CONFIG.DND5E.activityActivationTypes[activity.activation.type]?.label ??
        activity.activation.type
      );
    }
  </script>

  Activities List Here! 💪🏋️‍♂️