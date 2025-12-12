import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { SectionCommand, TidySectionBase } from 'src/types/types';
import type { TidyExtensibleDocumentSheetMixinInstance } from 'src/mixins/TidyDocumentSheetMixin.svelte';

export function configureSectionContextMenu(
  element: HTMLElement,
  app: TidyExtensibleDocumentSheetMixinInstance
) {
  const section: TidySectionBase | undefined = app._sectionForMenu;

  if (!section) {
    return;
  }

  app._sectionForMenu = undefined;

  const sectionActions: SectionCommand[] = section.sectionActions ?? [];

  ui.context.menuItems = sectionActions.map((action) => ({
    callback: () => {
      try {
        action.execute?.({
          document: app.document,
          event: { target: element, currentTarget: element } as any, // TODO: more properly simulate an event here; or, pray for Foundry to expose the context menu click event.
          section,
        });
      } finally {
        app._sheetForMenu = undefined;
      }
    },
    icon: `<i class="${action.iconClass}"></i>`,
    name: action.label ?? action.tooltip,
  })) satisfies ContextMenuEntry[];
}
