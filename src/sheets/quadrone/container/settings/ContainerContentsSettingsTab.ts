import type { SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { SheetSectionConfigurationTab } from 'src/runtime/types';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type { ContainerSheetQuadroneContext } from 'src/types/item.types';
import type { InventorySection } from 'src/types/types';

export function buildContainerContentsSections(
  context: ContainerSheetQuadroneContext,
  tabId: string
): InventorySection[] {
  return SheetSections.configureInventory(
    context.containerContents.contents,
    tabId,
    UserSheetPreferencesService.getByType(context.item.type),
    TidyFlags.sectionConfig.get(context.item)?.[tabId]
  );
}

export function buildContainerContentsSettingsTab(
  context: ContainerSheetQuadroneContext,
  tabId: string
): SheetSectionConfigurationTab {
  const localize = FoundryAdapter.localize;
  const sections = buildContainerContentsSections(context, tabId);

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
      : (rawTitle as string | undefined) ?? '';
  const tabName = localize(resolvedTitle);

  return {
    tabId,
    sections,
    optionsGroups,
    formTitle: localize('TIDY5E.ConfigureTab.Title', { tabName }),
  };
}
