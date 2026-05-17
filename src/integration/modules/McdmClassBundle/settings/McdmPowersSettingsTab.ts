import type { SectionOptionGroup } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { SheetSectionConfigurationTab } from 'src/runtime/types';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type {
  ActorSheetQuadroneContext,
  SectionCommand,
} from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import { ItemUtils } from 'src/utils/ItemUtils';
import SectionActions from 'src/features/sections/SectionActions';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import { MCDM_CLASS_BUNDLE_CONSTANTS } from '../McdmClassBundleConstants';
import type { PowersSection } from '../McdmClassBundle';

export function buildMcdmPowersSections(
  context: ActorSheetQuadroneContext,
  tabId: string
): PowersSection[] {
  const allPowers: Item5e[] =
    context.actor.itemTypes[MCDM_CLASS_BUNDLE_CONSTANTS.POWER_ITEM_TYPE];
  const customSectionPowers = allPowers.filter((p) => TidyFlags.section.get(p));
  const normalPowers = allPowers.filter(
    (p) => !customSectionPowers.includes(p),
  );

  const orderToPowersMap = Object.groupBy<any, any>(normalPowers, (p) =>
    p.system.order,
  );
  const customSectionToPowersMap = Object.groupBy<any, any>(
    customSectionPowers,
    (p) => TidyFlags.section.get(p),
  );

  const sheetPreferences = UserSheetPreferencesService.getByType(
    context.actor.type,
  );
  const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';
  const sectionConfig = TidyFlags.sectionConfig.get(context.actor)?.[tabId];
  const sectionActions: SectionCommand[] = [];
  if (context.owner) {
    sectionActions.push(SectionActions.getCreateItemHeaderSectionAction());
  }

  const allSections = Object.entries(orderToPowersMap)
    .map<PowersSection>(([order, powers]) => ({
      key: `order${order}`,
      type: 'powers',
      order: sectionConfig?.[`order${order}`]?.order ?? order,
      dataset: {
        ['system.order']: order,
      },
      items: ItemUtils.getSortedItems(powers ?? [], sortMode),
      label: `MCDMCB.TALENT.POWERS.ORDERS.${order}`,
      canCreate: true,
      rowActions: TableRowActionsRuntime.getInventoryRowActions(context),
      sectionActions,
      show: sectionConfig?.[`order${order}`]?.show !== false,
    }))
    .concat(
      Object.entries(customSectionToPowersMap).map(([sectionKey, powers]) => ({
        key: sectionKey,
        type: 'powers',
        order: sectionConfig?.[sectionKey]?.order ?? 1000,
        dataset: {
          [TidyFlags.section.prop]: sectionKey,
        },
        items: ItemUtils.getSortedItems(powers ?? [], sortMode),
        label: sectionKey,
        canCreate: true,
        rowActions: TableRowActionsRuntime.getInventoryRowActions(context),
        sectionActions,
        show: sectionConfig?.[sectionKey]?.show !== false,
      })),
    );
  return SheetSections.sortKeyedSections(allSections, sectionConfig);
}

export function buildMcdmPowersSettingsTab(
  context: ActorSheetQuadroneContext,
  tabId: string
): SheetSectionConfigurationTab {
  const localize = FoundryAdapter.localize;
  const sections = buildMcdmPowersSections(context, tabId);

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
