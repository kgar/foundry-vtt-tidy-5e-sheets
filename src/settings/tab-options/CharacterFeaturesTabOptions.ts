import { SheetSections } from 'src/features/sections/SheetSections';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type { TabOptions } from 'src/runtime/types';
import type { CharacterSheetQuadroneContext } from 'src/types/types';

export function buildCharacterFeaturesTabOptions(
  context: CharacterSheetQuadroneContext,
  tabId: string,
): TabOptions {
  const localize = FoundryAdapter.localize;

  const sections = SheetSections.configureFeatures(
    context.features,
    context,
    tabId,
    UserSheetPreferencesService.getByType(context.actor.type),
    TidyFlags.sectionConfig.get(context.actor)?.[tabId],
  );

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
    defaultSections: context.features,
    optionsGroups: [],
    formTitle: localize('TIDY5E.ConfigureTab.Title', { tabName }),
  };
}
