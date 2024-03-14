<script lang="ts">
  import FloatingContextMenu from 'src/context-menu/FloatingContextMenu';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContextMenuOption } from 'src/types/types';

  export let containingElement: HTMLElement;
  export let targetSelector: string;
  export let options: ContextMenuOption[];

  $: {
    if (containingElement) {
      initContextMenu(containingElement);
    }
  }

  function initContextMenu(el: HTMLElement) {
    new FloatingContextMenu(
      FoundryAdapter.getJqueryWrappedElement(el),
      targetSelector,
      [],
      {
        onOpen: () => {
          ui.context.menuItems = options;
        },
      },
    );
  }
</script>
