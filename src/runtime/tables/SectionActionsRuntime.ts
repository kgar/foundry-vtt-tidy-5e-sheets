import CustomItemHeaderControl from 'src/components/item-list/controls/CustomItemHeaderControl.svelte';
import {
  componentWithProps,
  type ComponentWithProps,
} from 'src/utils/component';
import { ActorItemRuntime } from '../ActorItemRuntime';
import type {
  Actor5e,
  GroupMemberQuadroneContext,
  GroupMemberSection,
  TidyItemSectionBase,
} from 'src/types/types';
import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
import { TidyFlags } from 'src/api';
import CreateItemHeaderControl from 'src/components/item-list/controls/CreateItemHeaderControl.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SheetSections } from 'src/features/sections/SheetSections';

class SectionActionsRuntime {
  getActionHeaderActions(
    actor: Actor5e,
    owner: boolean,
    unlocked: boolean,
    section: TidyItemSectionBase
  ): ComponentWithProps<any>[] {
    if (!owner) {
      return [];
    }

    const renameControl = getItemSectionRenameControl(
      actor,
      unlocked,
      section,
      TidyFlags.actionSection.prop
    );

    const runtimeCommands = ActorItemRuntime.getActorItemSectionCommands({
      actor,
      section,
      unlocked,
    }).map(
      (c) =>
        ({
          component: CustomItemHeaderControl,
          props: {
            action: c,
            section,
            sheetDocument: actor,
            unlocked,
          },
        } satisfies ComponentWithProps<typeof CustomItemHeaderControl>)
    );

    // Share, and ensure this particular version saves to Action Section instead of standard section.
    const controls = [renameControl, ...runtimeCommands];

    // TODO: Truncate to row action max size and include context menu.

    return controls;
  }

  getSpellbookItemHeaderActions(
    actor: Actor5e,
    owner: boolean,
    unlocked: boolean,
    section: TidyItemSectionBase
  ) {
    const renameControl = getItemSectionRenameControl(
      actor,
      unlocked,
      section,
      TidyFlags.section.prop
    );

    const runtimeCommands = ActorItemRuntime.getActorItemSectionCommands({
      actor,
      section,
      unlocked,
    }).map((c) =>
      componentWithProps(CustomItemHeaderControl, {
        action: c,
        section,
        sheetDocument: actor,
        unlocked,
      })
    );

    const spellbookConfigControl = componentWithProps(CustomItemHeaderControl, {
      action: {
        label: 'DND5E.SpellSlotsConfig',
        enabled: ({ unlocked, actor, section }) =>
          unlocked && actor.isOwner && section.usesSlots,
        execute: ({ actor }) => FoundryAdapter.openSpellSlotsConfig(actor),
        iconClass: 'fa-solid fa-cog',
      },
      section,
      sheetDocument: actor,
      unlocked,
    });

    const controls = [
      renameControl,
      ...runtimeCommands,
      spellbookConfigControl,
    ];

    if (owner) {
      controls.push(
        componentWithProps(CreateItemHeaderControl, {
          section,
          sheetDocument: actor,
        })
      );
    }

    return controls;
  }

  getStandardItemHeaderActions(
    actor: Actor5e,
    owner: boolean,
    unlocked: boolean,
    section: TidyItemSectionBase
  ) {
    const renameControl = getItemSectionRenameControl(
      actor,
      unlocked,
      section,
      TidyFlags.section.prop
    );

    const runtimeCommands = ActorItemRuntime.getActorItemSectionCommands({
      actor,
      section,
      unlocked,
    }).map(
      (c) =>
        ({
          component: CustomItemHeaderControl,
          props: {
            action: c,
            section,
            sheetDocument: actor,
            unlocked,
          },
        } satisfies ComponentWithProps<typeof CustomItemHeaderControl>)
    );

    const controls = [renameControl, ...runtimeCommands];

    if (owner) {
      controls.push(
        componentWithProps(CreateItemHeaderControl, {
          section,
          sheetDocument: actor,
        })
      );
    }

    return controls;
  }

  getGroupMemberHeaderActions(
    group: Actor5e,
    unlocked: boolean,
    section: GroupMemberSection
  ) {
    return [
      componentWithProps(CustomItemHeaderControl, {
        action: {
          enabled: () => unlocked && group.isOwner && !!section.members.length,
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
        },
        section,
        sheetDocument: group,
        unlocked,
      }),
    ];
  }
}

function getItemSectionRenameControl(
  actor: Actor5e,
  unlocked: boolean,
  section: TidyItemSectionBase,
  flagProp: string
): ComponentWithProps<typeof CustomItemHeaderControl> {
  return {
    component: CustomItemHeaderControl,
    props: {
      action: {
        enabled: () => unlocked && actor.isOwner && !!section.items.length,
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
      },
      section,
      sheetDocument: actor,
      unlocked,
    },
  };
}

function getItemActionsContextMenu(
  actor: Actor5e,
  unlocked: boolean,
  section: TidyItemSectionBase
): ComponentWithProps<typeof CustomItemHeaderControl> {
  return {
    component: CustomItemHeaderControl,
    props: {
      action: {
        execute: (params) => {
          alert('todo: trigger section selection dialog for whole section.');
        },
        iconClass: 'fa-solid fa-edit',
        label: 'TODO Rename',
      },
      section,
      sheetDocument: actor,
      unlocked,
    },
  };
}

const singleton = new SectionActionsRuntime();

export default singleton;
