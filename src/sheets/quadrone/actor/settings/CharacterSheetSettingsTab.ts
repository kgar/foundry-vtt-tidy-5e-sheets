import {
  type RadioSetting,
  type SectionOptionGroup,
} from 'src/applications/settings/editors/configure-sections-settings-editor.svelte';
import { CONSTANTS } from 'src/constants';
import { getCharacterSheetTabActionSectionsQuadrone } from 'src/features/actions/actions.svelte';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { SheetSectionConfigurationTab } from 'src/runtime/types';
import { SettingsProvider } from 'src/settings/settings.svelte';
import type { CharacterSheetQuadroneContext } from 'src/types/types';

export function buildCharacterSheetSettingsTab(
  context: CharacterSheetQuadroneContext,
  tabId: string,
): SheetSectionConfigurationTab {
  const localize = FoundryAdapter.localize;

  const organization =
    SettingsProvider.settings.characterSheetTabOrganization.get();

  const optionsGroups: SectionOptionGroup[] = [
    {
      title: 'TIDY5E.SectionOrganization',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label: localize('TIDY5E.GenericDefaultPrefix', {
                value: localize(
                  SettingsProvider.settings.characterSheetTabOrganization
                    .options.choices[organization],
                ),
              }),
              value: null,
            },
            {
              label:
                SettingsProvider.settings.characterSheetTabOrganization.options
                  .choices.action,
              value: CONSTANTS.SECTION_ORGANIZATION_ACTION,
            },
            {
              label:
                SettingsProvider.settings.characterSheetTabOrganization.options
                  .choices.origin,
              value: CONSTANTS.SECTION_ORGANIZATION_ORIGIN,
            },
          ],
          prop: TidyFlags.characterSheetTabSectionOrganization.prop,
          doc: context.actor,
          default: null,
        } satisfies RadioSetting<string | null>,
      ],
    },
    {
      title: 'TIDY5E.AutomaticallyIncludeUsableItems',
      settings: [
        {
          type: 'radio',
          options: [
            {
              label: localize('TIDY5E.GenericDefaultPrefix', {
                value:
                  SettingsProvider.settings.characterSheetTabAutomaticallyIncludeUsableItems.get()
                    ? 'Yes'
                    : 'No',
              }),
              value: null,
            },
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
          prop: TidyFlags.characterSheetTabAutomaticallyIncludeUsableItems.prop,
          doc: context.actor,
          default: null,
        } satisfies RadioSetting<boolean | null>,
      ],
    },
    {
      title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
      settings: [
        SheetPinsProvider.getGlobalSectionSetting(context.document.type, tabId),
      ],
    },
  ];

  const tab = context.tabs.find((t) => t.id === tabId);
  const rawTitle: unknown = tab?.title;
  const resolvedTitle =
    typeof rawTitle === 'function'
      ? (rawTitle as () => string)()
      : ((rawTitle as string | undefined) ?? '');
  const tabName = localize(resolvedTitle);
  const defaultSections = context.sheet.createSheetTabOriginSections(
    context
  );

  return {
    tabId,
    sections: context.sheetTabSections,
    defaultSections: defaultSections,
    optionsGroups,
    formTitle: localize('TIDY5E.ConfigureTab.Title', { tabName }),
  };
}
