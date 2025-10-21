import type { Actor5e } from 'src/types/types';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
import { TidyFlags } from 'src/api';

/**
 * Prepare an array of context menu options which are available for a member of a group.
 * @param group    The group for which the context menu is activated.
 * @param actor    The actor for whom the context menu is activate.
 * @returns        Context menu options.
 */
export function getGroupMemberContextOptionsQuadrone(
  group: Actor5e,
  actor: Actor5e
): ContextMenuEntry[] {
  let options: ContextMenuEntry[] = [
    {
      name: 'DND5E.Group.Action.View',
      icon: `<i class="fas fa-eye fa-fw"></i>`,
      callback: async () => (await fromUuid(actor.uuid))?.sheet.render(true),
      condition: () =>
        group.isOwner && !FoundryAdapter.isLockedInCompendium(group),
      group: 'common',
    },
    {
      name: 'TIDY5E.Section.SectionSelectorChooseSectionTooltip',
      icon: '<i class="fa fa-diagram-cells"></i>',
      condition: () => group.isOwner,
      group: 'customize',
      callback: () =>
        new SectionSelectorApplication({
          flag: `${TidyFlags.sections.prop}.${actor.id}`,
          sectionType: FoundryAdapter.localize('TIDY5E.Section.Label'),
          callingDocument: group,
          document: group,
        }).render(true),
    },
    {
      name: 'DND5E.Group.Action.Remove',
      icon: `<i class="fas fa-trash fa-fw"></i>`,
      callback: async () => await group.system.removeMember(actor),
      condition: () =>
        group.isOwner && !FoundryAdapter.isLockedInCompendium(group),
      group: 'be-careful',
    },
  ];

  return options;
}
