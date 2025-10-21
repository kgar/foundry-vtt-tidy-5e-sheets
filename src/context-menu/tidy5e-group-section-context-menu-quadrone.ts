import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
import type { Tidy5eGroupSheetQuadrone } from 'src/sheets/quadrone/Tidy5eGroupSheetQuadrone.svelte';

// TODO: Determine if we really want to support full section rename. It seems doable without pigeonholing
//       into Item-centric or overly specialized (group members only) implementations
//       if we leverage the class hierarchy of TidyExtensibleDocumentSheetMixin.
// Things to accomplish beyond this prototype:
// 1. When the new section doesn't exist yet, ensure it resides in the same place as the section whose name changed.
//    Doing this in a way that accounts for all possible scenarios is difficult without simply enforcing a new order 
//    for all sections based on their incidental order upon rename.
// 2. Have the section rename be part of the Multi-actor sheet base class and not relying upon query selectors for 
//    getting the members to update.
// 3. Generalize this so that all Tidy document sheets support it. 
//    TidyExtensibleDocumentSheetMixin.renameSection(tabId, currentKey, newKey, sections)
//    Tidy5eMultiActorSheetQuadroneBase.renameSection(tabId, currentKey, newKey, sections) 
//        - any tab other than Members would defer to the super.renameSection(...)
// 4. Decide the best / most appropriate UI for providing this option. Context menu was within reach 
//    and easy to reason about on the dev side, but what about for the user?
// 5. Eliminate the need for the `data-custom-section` attr.

export function configureGroupSectionContextMenu(
  element: HTMLElement,
  app: Tidy5eGroupSheetQuadrone
) {
  const sectionEl = element.closest(
    '[data-custom-section][data-tidy-section-key]'
  );

  if (!sectionEl) {
    return;
  }

  const key = sectionEl.getAttribute('data-tidy-section-key') ?? '';

  let firstMemberId = sectionEl
    .querySelector('[data-member-id]')
    ?.getAttribute('data-member-id');

  ui.context.menuItems = [
    {
      name: 'TODO: Rename Section',
      icon: '',
      group: 'customize',
      callback: () =>
        new SectionSelectorApplication({
          flag: `${TidyFlags.sections.prop}.${firstMemberId}`,
          sectionType: FoundryAdapter.localize('TIDY5E.Section.Label'),
          callingDocument: app.document,
          document: app.document,
          async onSave(section) {
            const sections = TidyFlags.sections.get(app.document);
            Array.from(sectionEl.querySelectorAll('[data-member-id]'))
              .map((el) => el.getAttribute('data-member-id'))
              .forEach((id) => {
                if (!!id) {
                  sections[id] = section;
                }
              });
            // If this new section is not yet in section config, adopt the old section's settings.
            const config = TidyFlags.sectionConfig.get(app.document);
            if (
              section !== null &&
              config?.['members'] &&
              !config['members'][section]
            ) {
              config['members'][section] = config?.['members']?.[key];
              delete config?.['members']?.[key];
              await TidyFlags.sectionConfig.set(app.document, config);
            }

            TidyFlags.sections.set(app.document, sections);
          },
        }).render(true),
    },
  ] satisfies ContextMenuEntry[];

  // TODO: Make one if this works out
  //TidyHooks.dnd5eGetItemContextOptions(item, ui.context.menuItems);
}
