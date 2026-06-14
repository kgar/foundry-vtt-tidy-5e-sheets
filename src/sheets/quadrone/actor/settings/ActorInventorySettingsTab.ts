import type { SectionOptionGroup } from 'src/applications/settings/editors/configure-sections-settings-editor.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { SheetSectionConfigurationTab } from 'src/runtime/types';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type { ActorSheetQuadroneContext } from 'src/types/types';

type InventoryTabContext = ActorSheetQuadroneContext & {
  inventory: any;
};

export function buildActorInventorySettingsTab(
  context: InventoryTabContext,
  tabId: string,
): SheetSectionConfigurationTab {
  const localize = FoundryAdapter.localize;

  const sections = SheetSections.configureInventory(
    context.inventory,
    tabId,
    UserSheetPreferencesService.getByType(context.actor.type),
    TidyFlags.sectionConfig.get(context.actor)?.[tabId],
  );

  const optionsGroups: SectionOptionGroup[] = [
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

  return {
    tabId,
    sections,
    defaultSections: context.inventory,
    optionsGroups,
    formTitle: localize('TIDY5E.ConfigureTab.Title', { tabName }),
  };
}
