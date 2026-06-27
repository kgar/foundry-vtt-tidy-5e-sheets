import type { SectionOptionGroup } from 'src/settings/editors/sheet-tab-options-settings-editor.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { TabOptions } from 'src/runtime/types';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type { VehicleSheetQuadroneContext } from 'src/types/types';

export function buildVehicleStatblockSections(
  context: VehicleSheetQuadroneContext,
  tabId: string,
) {
  return SheetSections.configureVehicleStatblockSections(
    context.statblock,
    tabId,
    UserSheetPreferencesService.getByType(context.actor.type),
    TidyFlags.sectionConfig.get(context.actor)?.[tabId],
  );
}

export function buildVehicleStatblockTabOptions(
  context: VehicleSheetQuadroneContext,
  tabId: string,
): TabOptions {
  const localize = FoundryAdapter.localize;
  const sections = buildVehicleStatblockSections(context, tabId);

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
    defaultSections: context.statblock,
    optionsGroups,
    formTitle: localize('TIDY5E.ConfigureTab.Title', { tabName }),
  };
}
