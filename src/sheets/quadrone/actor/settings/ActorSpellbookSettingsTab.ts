import type { SectionOptionGroup } from 'src/settings/editors/sheet-tab-options-settings-editor.svelte';
import { CONSTANTS } from 'src/constants';
import { SheetSections } from 'src/features/sections/SheetSections';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { SheetSectionConfigurationTab } from 'src/runtime/types';
import { TidySheetSettingsTabIds } from 'src/applications/settings/sheet/sheet-settings-ids';
import type { Item5e } from 'src/types/item.types';
import type {
  CharacterSheetQuadroneContext,
  NpcSheetQuadroneContext,
} from 'src/types/types';

export function buildActorSpellbookSettingsTab(
  context: CharacterSheetQuadroneContext | NpcSheetQuadroneContext,
  tabId: string
): SheetSectionConfigurationTab {
  const localize = FoundryAdapter.localize;

  const sections = SheetSections.configureSpellbook(
    context.actor,
    tabId,
    context.spellbook
  );

  const actorHasSpells = context.actor.items.some(
    (item: Item5e) => item.type === CONSTANTS.ITEM_TYPE_SPELL
  );

  const optionsGroups: SectionOptionGroup[] = [
    {
      title: 'TIDY5E.Utilities.SpellSlotTrackingModeTitle',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label: 'TIDY5E.Utilities.SpellValueMax',
              value: CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX,
            },
            {
              label: 'TIDY5E.Utilities.SpellPips',
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
      title: 'TIDY5E.Utilities.CastActivitySpellGroupingTitle',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label:
                'TIDY5E.Utilities.CastActivitySpellGroupingOptionAdditional',
              value: CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_ADDITIONAL,
            },
            {
              label: 'TIDY5E.Utilities.CastActivitySpellGroupingOptionPerItem',
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
      title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
      settings: [
        SheetPinsProvider.getGlobalSectionSetting(context.document.type, tabId),
      ],
    },
    {
      title: 'TIDY5E.DisplayOptionsActor.Title',
      settings: [
        {
          type: 'boolean',
          label: 'TIDY5E.ItemFilters.Options.IncludeRitualsInCanCast',
          checked: TidyFlags.includeRitualsInCanCast.get(context.actor),
          prop: TidyFlags.includeRitualsInCanCast.prop,
          doc: context.actor,
          default: false,
        },
      ],
    },
    ...(actorHasSpells
      ? [
          {
            title: 'TIDY5E.Utilities.Tools',
            settings: [
              {
                type: 'navigationButton',
                icon: 'fa-solid fa-list-check',
                label: 'TIDY5E.Utilities.AssignSpellsToClasses',
                onclick: (_ev, app) =>
                  app.navigator?.selectTab(
                    TidySheetSettingsTabIds.spellAssignments
                  ),
              },
            ],
          },
        ] satisfies SectionOptionGroup[]
      : []),
  ];

  const tab = context.tabs.find((t) => t.id === tabId);
  const rawTitle: unknown = tab?.title;
  const resolvedTitle =
    typeof rawTitle === 'function'
      ? (rawTitle as () => string)()
      : (rawTitle as string | undefined) ?? '';
  const tabName = localize(resolvedTitle);

  return {
    tabId,
    sections,
    defaultSections: context.spellbook,
    optionsGroups,
    formTitle: localize('TIDY5E.ConfigureTab.Title', { tabName }),
  };
}
