import type {
  RadioSetting,
  SectionOptionGroup,
} from 'src/settings/editors/configure-sections-settings-editor.svelte';
import { CONSTANTS } from 'src/constants';
import { SheetSections } from 'src/features/sections/SheetSections';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { SheetSectionConfigurationTab } from 'src/runtime/types';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
import type {
  FeatureSection,
  NpcSheetQuadroneContext,
  SpellbookSection,
} from 'src/types/types';

export function buildNpcStatblockSections(
  context: NpcSheetQuadroneContext,
  tabId: string
): (FeatureSection | SpellbookSection)[] {
  return SheetSections.configureStatblock(
    context.features,
    context,
    tabId,
    UserSheetPreferencesService.getByType(context.actor.type),
    TidyFlags.sectionConfig.get(context.actor)?.[tabId]
  );
}

export function buildNpcStatblockSettingsTab(
  context: NpcSheetQuadroneContext,
  tabId: string
): SheetSectionConfigurationTab {
  const localize = FoundryAdapter.localize;
  const sections = buildNpcStatblockSections(context, tabId);

  const preferences = UserPreferencesService.get();

  const legendariesProp = `${UserPreferencesService.prop}.${CONSTANTS.SHOW_LEGENDARIES_ON_NPC_STATBLOCK_PREFERENCE}`;
  const spellbookInStatblockProp = `${UserPreferencesService.prop}.${CONSTANTS.INCLUDE_SPELLBOOK_IN_NPC_STATBLOCK_PREFERENCE}`;

  const legendariesUserPreference =
    preferences.showLegendariesOnNpcStatblock ?? true;
  const spellbookInStatblockUserPreference =
    preferences.includeSpellbookInNpcStatblockTab ?? true;

  const legendariesDefaultTextKey = legendariesUserPreference
    ? 'TIDY5E.Show'
    : 'TIDY5E.Hide';

  const spellbookInStatblockDefaultTextKey = spellbookInStatblockUserPreference
    ? 'TIDY5E.Show'
    : 'TIDY5E.Hide';

  const optionsGroups: SectionOptionGroup[] = [
    {
      title: 'TIDY5E.LegendaryLairToolbar',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label: 'TIDY5E.Show',
              value: true,
            },
            {
              label: 'TIDY5E.Hide',
              value: false,
            },
            {
              label: FoundryAdapter.localize(
                'TIDY5E.UseSpecificDefaultValue.Label',
                { value: FoundryAdapter.localize(legendariesDefaultTextKey) }
              ),
              value: null,
            },
          ],
          selected: TidyFlags.showLegendariesOnNpcStatblock.get(context.actor),
          prop: TidyFlags.showLegendariesOnNpcStatblock.prop,
          doc: context.actor,
          default: null,
        } satisfies RadioSetting<boolean | null>,
      ],
    },
    {
      title: 'TIDY5E.SpellbookSections',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label: 'TIDY5E.Show',
              value: true,
            },
            {
              label: 'TIDY5E.Hide',
              value: false,
            },
            {
              label: FoundryAdapter.localize(
                'TIDY5E.UseSpecificDefaultValue.Label',
                {
                  value: FoundryAdapter.localize(
                    spellbookInStatblockDefaultTextKey
                  ),
                }
              ),
              value: null,
            },
          ],
          selected: TidyFlags.includeSpellbookInNpcStatblockTab.get(
            context.actor
          ),
          prop: TidyFlags.includeSpellbookInNpcStatblockTab.prop,
          doc: context.actor,
          default: null,
        } satisfies RadioSetting<boolean | null>,
      ],
    },
    {
      title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
      settings: [
        {
          type: 'boolean',
          label: 'TIDY5E.Utilities.ShowLegendaryTrackersOnNpcStatblock',
          doc: game.user,
          prop: legendariesProp,
          default: legendariesUserPreference,
        },
        {
          type: 'boolean',
          label: 'TIDY5E.Utilities.IncludeSpellbookInNpcStatblockTab',
          doc: game.user,
          prop: spellbookInStatblockProp,
          default: spellbookInStatblockUserPreference,
        },
        SheetPinsProvider.getGlobalSectionSetting(
          context.document.type,
          tabId
        ),
      ],
    },
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
    defaultSections: context.features,
    optionsGroups,
    formTitle: localize('TIDY5E.ConfigureTab.Title', { tabName }),
  };
}
