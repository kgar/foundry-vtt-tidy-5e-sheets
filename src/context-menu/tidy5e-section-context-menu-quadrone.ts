import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { ActorSectionCommand, TidySectionBase } from 'src/types/types';
import type { TidyExtensibleDocumentSheetMixinInstance } from 'src/mixins/TidyDocumentSheetMixin.svelte';

export function configureSectionContextMenu(
  element: HTMLElement,
  app: TidyExtensibleDocumentSheetMixinInstance
) {
  const section: TidySectionBase | undefined = app._sectionForMenu;

  if (!section) {
    return;
  }

  const sectionActions: ActorSectionCommand[] = section.sectionActions ?? [];

  ui.context.menuItems = sectionActions.map((action) => ({
    callback: () => {
      try {
        action.execute?.({
          actor: app.document,
          event: { target: element, currentTarget: element } as any, // TODO: more properly simulate an event here
          section,
        });
      } finally {
        app._sheetForMenu = undefined;
      }
    },
    icon: `<i class="${action.iconClass}"></i>`,
    name: action.label ?? action.tooltip,
  })) satisfies ContextMenuEntry[];

  // TODO: Make one if this works out
  //TidyHooks.tidy5eGetSectionContextOptions(section, ui.context.menuItems);
}
