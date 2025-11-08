import { ActorItemRuntime } from '../../runtime/ActorItemRuntime';
import type {
  Actor5e,
  GroupMemberQuadroneContext,
  GroupMemberSection,
  SectionCommand,
  TidyItemSectionBase,
} from 'src/types/types';
import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
import { TidyFlags } from 'src/api';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SheetSections } from 'src/features/sections/SheetSections';
import { EventHelper } from 'src/utils/events';

class SectionActions {
  getActionHeaderActions(
    actor: Actor5e,
    owner: boolean,
    unlocked: boolean,
    section: TidyItemSectionBase
  ): SectionCommand[] {
    if (!owner) {
      return [];
    }

    const renameCommand = this.getItemSectionRenameCommand(
      actor,
      unlocked,
      section,
      TidyFlags.actionSection.prop
    );

    const runtimeCommands = ActorItemRuntime.getActorItemSectionCommands({
      document: actor,
      section,
      unlocked,
    });

    const controls: SectionCommand[] = [];

    controls.push(...runtimeCommands);

    if (renameCommand) {
      controls.push(renameCommand);
    }

    return controls;
  }

  getSpellbookItemHeaderActions(
    actor: Actor5e,
    owner: boolean,
    unlocked: boolean,
    section: TidyItemSectionBase
  ): SectionCommand[] {
    const renameControl = this.getItemSectionRenameCommand(
      actor,
      unlocked,
      section,
      TidyFlags.section.prop
    );

    const runtimeCommands = ActorItemRuntime.getActorItemSectionCommands({
      document: actor,
      section,
      unlocked,
    });

    const controls: SectionCommand[] = [];

    if (owner) {
      controls.push(this.getCreateItemHeaderSectionAction());
    }

    if (
      unlocked &&
      actor.isOwner &&
      'usesSlots' in section &&
      section.usesSlots
    ) {
      controls.push({
        label: 'DND5E.SpellSlotsConfig',
        execute: ({ document }) =>
          FoundryAdapter.openSpellSlotsConfig(document),
        iconClass: 'fa-solid fa-cog',
      });
    }

    controls.push(...runtimeCommands);

    if (renameControl) {
      controls.push(renameControl);
    }

    return controls;
  }

  getStandardItemHeaderActions(
    actor: Actor5e,
    owner: boolean,
    unlocked: boolean,
    section: TidyItemSectionBase
  ): SectionCommand[] {
    const renameControl = this.getItemSectionRenameCommand(
      actor,
      unlocked,
      section,
      TidyFlags.section.prop
    );

    const runtimeCommands = ActorItemRuntime.getActorItemSectionCommands({
      document: actor,
      section,
      unlocked,
    });

    const controls: SectionCommand[] = [];

    if (owner) {
      controls.push(this.getCreateItemHeaderSectionAction());
    }

    controls.push(...runtimeCommands);

    if (renameControl) {
      controls.push(renameControl);
    }

    return controls;
  }

  getGroupMemberHeaderActions(
    group: Actor5e,
    unlocked: boolean,
    section: GroupMemberSection
  ): SectionCommand[] {
    const controls: SectionCommand[] = [];

    if (unlocked && group.isOwner && !!section.members.length) {
      controls.push({
        label: 'TIDY5E.Section.SectionSelectorChooseSectionTooltip',
        iconClass: 'fa-solid fa-diagram-cells',
        execute: (params) => {
          const firstMember = params.section.members[0].actor;
          new SectionSelectorApplication({
            flag: `${TidyFlags.sections.prop}.${firstMember.id}`,
            callingDocument: group,
            document: group,
            sectionType: FoundryAdapter.localize('TIDY5E.Section.Label'),
            getKnownCustomSections:
              SheetSections.getKnownCustomGroupMemberSections,
            async onSave(newSectionName) {
              const updates = params.section.members.reduce(
                (
                  prev: Record<string, string | null>,
                  curr: GroupMemberQuadroneContext
                ) => {
                  prev[`${TidyFlags.sections.prop}.${curr.actor.id}`] =
                    newSectionName;
                  return prev;
                },
                {}
              );

              params.document.update(updates);
            },
          }).render({ force: true });
        },
      });
    }

    return controls;
  }

  getCreateItemHeaderSectionAction(): SectionCommand {
    return {
      execute({ section, document, event }) {
        const target = event.currentTarget as HTMLElement;
        const tabId = target
          .closest('[data-tab-contents-for]')
          ?.getAttribute('data-tab-contents-for');

        document.sheet._addDocument({
          tabId,
          customSection: section.custom?.section,
          creationItemTypes: section.custom?.creationItemTypes,
          data: { type: section.key, ...section.dataset },
        });
      },
      label: 'DND5E.ItemCreate',
      iconClass: 'fas fa-plus',
    };
  }

  getItemSectionRenameCommand(
    actor: Actor5e,
    unlocked: boolean,
    section: TidyItemSectionBase,
    flagProp: string
  ): SectionCommand | undefined {
    return unlocked && actor.isOwner && !!section.items.length
      ? {
          execute: () => {
            new SectionSelectorApplication({
              flag: flagProp,
              callingDocument: actor,
              document: section.items[0],
              async onSave(newSectionName) {
                const updates = section.items.map((i) => ({
                  _id: i.id,
                  [flagProp]: newSectionName,
                }));

                return Item.updateDocuments(updates, { parent: actor });
              },
              sectionType: FoundryAdapter.localize('TIDY5E.Section.Label'),
            }).render({ force: true });
          },
          iconClass: 'fa-solid fa-diagram-cells',
          label: 'TIDY5E.Section.SectionSelectorChooseSectionTooltip',
        }
      : undefined;
  }

  getMenuActionCommand(): SectionCommand {
    return {
      execute: (params) => {
        params.document.sheet._sectionForMenu = params.section;
        EventHelper.triggerContextMenu(
          params.event as Event & { currentTarget: HTMLElement },
          '[data-context-menu]'
        );
      },
      iconClass: 'fa-solid fa-ellipsis-vertical',
      label: 'TIDY5E.Options.Title',
    };
  }
}

const singleton = new SectionActions();

export default singleton;
