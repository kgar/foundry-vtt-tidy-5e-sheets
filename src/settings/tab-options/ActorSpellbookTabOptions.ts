import type { SectionOptionGroup } from 'src/settings/editors/sheet-tab-options-settings-editor.svelte';
import { CONSTANTS } from 'src/constants';
import { SheetSections } from 'src/features/sections/SheetSections';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { TabOptions } from 'src/runtime/types';
import { TidySheetSettingsTabIds } from 'src/applications/settings/sheet/sheet-settings-ids';
import type { Item5e } from 'src/types/item.types';
import type {
  CharacterSheetQuadroneContext,
  NpcSheetQuadroneContext,
} from 'src/types/types';

export function buildActorSpellbookTabOptions(
  context: CharacterSheetQuadroneContext | NpcSheetQuadroneContext,
  tabId: string,
): TabOptions {
  const localize = FoundryAdapter.localize;

  const sections = SheetSections.configureSpellbook(
    context.actor,
    tabId,
    context.spellbook,
  );

  const actorHasSpells = context.actor.items.some(
    (item: Item5e) => item.type === CONSTANTS.ITEM_TYPE_SPELL,
  );

  const optionsGroups: SectionOptionGroup[] = [
    {
      title: 'TIDY5E.SPELLS.SlotTracking.Title',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label: 'TIDY5E.SPELLS.SlotTracking.ValueMax',
              value: CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
            },
            {
              label: 'TIDY5E.SPELLS.SlotTracking.Pips',
              value: CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS,
            },
          ],
          // TODO: make it so TidyFlags can provide this info.
          prop: `flags.tidy5e-sheet.sheetPreferences.${context.actor.type}.spellSlotTrackerMode`,
          doc: game.user,
          default: CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
        },
      ],
    },
    {
      title: 'TIDY5E.SPELLS.CastActivity.Grouping.Title',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label:
                'TIDY5E.SPELLS.CastActivity.Grouping.Additional',
              value: CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_ADDITIONAL,
            },
            {
              label: 'TIDY5E.SPELLS.CastActivity.Grouping.PerItem',
              value: CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_PER_ITEM,
            },
          ],
          prop: 'flags.tidy5e-sheet.userPreferences.castActivitySpellGrouping',
          doc: game.user,
          default: CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_ADDITIONAL,
        },
      ],
    },
    {
      title: 'TIDY5E.SETTINGS.TabOptions.DisplayOptions.Actor',
      settings: [
        {
          type: 'boolean',
          label: 'TIDY5E.FILTER.CanCast.IncludeRituals',
          checked: TidyFlags.includeRitualsInCanCast.get(context.actor),
          prop: TidyFlags.includeRitualsInCanCast.prop,
          doc: context.actor,
          default: false,
        },
      ],
    },
    ...(actorHasSpells
      ? ([
          {
            title: 'TIDY5E.SETTINGS.TabOptions.Group.Tools',
            settings: [
              {
                type: 'navigationButton',
                icon: 'fa-solid fa-list-check',
                label: 'TIDY5E.SPELLS.Action.AssignToClasses',
                onclick: (_ev, app) =>
                  app.navigator?.selectTab(
                    TidySheetSettingsTabIds.spellAssignments,
                  ),
              },
            ],
          },
        ] satisfies SectionOptionGroup[])
      : []),
  ];

  const tab = context.tabs.find((t) => t.id === tabId);
  const rawTitle: unknown = tab?.title;
  const resolvedTitle =
    typeof rawTitle === 'function'
      ? (rawTitle as () => string)()
      : ((rawTitle as string | undefined) ?? '');
  const tabName = localize(resolvedTitle);

  return {
    tabId,
    sections,
    defaultSections: context.spellbook,
    optionsGroups,
    formTitle: localize('TIDY5E.SETTINGS.TabOptions.ConfigureTab.Title', { tabName }),
  };
}
