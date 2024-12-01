<script lang="ts">
  import FloatingContextMenu from 'src/context-menu/FloatingContextMenu';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContextMenuEntry } from 'src/foundry/foundry.types';

  interface Props {
    containingElement: HTMLElement;
    targetSelector: string;
    options: ContextMenuEntry[];
  }

  let { containingElement, targetSelector, options }: Props = $props();

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

  $effect(() => {
    if (containingElement) {
      initContextMenu(containingElement);
    }
  });
</script>
