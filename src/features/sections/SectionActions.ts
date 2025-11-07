import { ActorItemRuntime } from '../../runtime/ActorItemRuntime';
import type {
  Actor5e,
  ActorSectionCommand,
  GroupMemberQuadroneContext,
  GroupMemberSection,
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
  ): ActorSectionCommand[] {
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
      actor,
      section,
      unlocked,
    });

    const controls: ActorSectionCommand[] = [];

    if (renameCommand) {
      controls.push(renameCommand);
    }

    controls.push(...runtimeCommands);

    return controls;
  }

  getSpellbookItemHeaderActions(
    actor: Actor5e,
    owner: boolean,
    unlocked: boolean,
    section: TidyItemSectionBase
  ): ActorSectionCommand[] {
    const renameControl = this.getItemSectionRenameCommand(
      actor,
      unlocked,
      section,
      TidyFlags.section.prop
    );

    const runtimeCommands = ActorItemRuntime.getActorItemSectionCommands({
      actor,
      section,
      unlocked,
    });

    const controls: ActorSectionCommand[] = [];

    if (renameControl) {
      controls.push(renameControl);
    }

    controls.push(...runtimeCommands);

    if (
      unlocked &&
      actor.isOwner &&
      'usesSlots' in section &&
      section.usesSlots
    ) {
      controls.push({
        label: 'DND5E.SpellSlotsConfig',
        execute: ({ actor }) => FoundryAdapter.openSpellSlotsConfig(actor),
        iconClass: 'fa-solid fa-cog',
      });
    }

    if (owner) {
      controls.push(this.getCreateItemHeaderSectionAction());
    }

    return controls;
  }

  getStandardItemHeaderActions(
    actor: Actor5e,
    owner: boolean,
    unlocked: boolean,
    section: TidyItemSectionBase
  ): ActorSectionCommand[] {
    const renameControl = this.getItemSectionRenameCommand(
      actor,
      unlocked,
      section,
      TidyFlags.section.prop
    );

    const runtimeCommands = ActorItemRuntime.getActorItemSectionCommands({
      actor,
      section,
      unlocked,
    });

    const controls: ActorSectionCommand[] = [];

    if (renameControl) {
      controls.push(renameControl);
    }

    controls.push(...runtimeCommands);

    if (owner) {
      controls.push(this.getCreateItemHeaderSectionAction());
    }

    return controls;
  }

  getGroupMemberHeaderActions(
    group: Actor5e,
    unlocked: boolean,
    section: GroupMemberSection
  ): ActorSectionCommand[] {
    const controls: ActorSectionCommand[] = [];

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

              params.actor.update(updates);
            },
          }).render({ force: true });
        },
      });
    }

    return controls;
  }

  getCreateItemHeaderSectionAction(): ActorSectionCommand {
    return {
      execute({ section, actor, event }) {
        const target = event.currentTarget as HTMLElement;
        const tabId = target
          .closest('[data-tab-contents-for]')
          ?.getAttribute('data-tab-contents-for');

        actor.sheet._addDocument({
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
  ): ActorSectionCommand | undefined {
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

  getMenuActionCommand(): ActorSectionCommand {
    return {
      execute: (params) => {
        params.actor.sheet._sectionForMenu = params.section;
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
