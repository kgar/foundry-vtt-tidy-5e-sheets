import type { SectionOptionGroup } from 'src/settings/editors/sheet-tab-options-settings-editor.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { TabOptions } from 'src/runtime/types';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import type {
  ActorSheetQuadroneContext,
  SectionCommand,
} from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import { ItemUtils } from 'src/utils/ItemUtils';
import SectionActions from 'src/features/sections/SectionActions';
import { MCDM_CLASS_BUNDLE_CONSTANTS } from '../McdmClassBundleConstants';
import type { PowersSection } from '../McdmClassBundle';
import { InventoryRowActionRuntime } from 'src/runtime/table-row-actions/InventoryRowActionRuntime.svelte';
import { CustomItemColumnRuntime } from 'src/runtime/table-columns/CustomItemColumnRuntime';

export function buildMcdmPowersSections(
  context: ActorSheetQuadroneContext,
  tabId: string,
  options?: {
    useDefaultSectionConfig?: boolean;
  },
): PowersSection[] {
  const allPowers: Item5e[] =
    context.actor.itemTypes[MCDM_CLASS_BUNDLE_CONSTANTS.POWER_ITEM_TYPE];

  const normalPowers: Item5e[] = [];
  const customSectionPowers: Item5e[] = [];

  for (const power of allPowers) {
    const ctx = (context.itemContext[power.id] ??= {});
    ctx.rowActions = InventoryRowActionRuntime.getRowActions({
      app: context.sheet,
      data: context,
      rowDocument: power,
      sheetDocument: context.document,
    });

    if (TidyFlags.section.get(power)) {
      allPowers.push(power);
    } else {
      normalPowers.push(power);
    }
  }

  const orderToPowersMap = Object.groupBy<any, any>(
    normalPowers,
    (p) => p.system.order,
  );

  const customSectionToPowersMap = Object.groupBy<any, any>(
    customSectionPowers,
    (p) => TidyFlags.section.get(p),
  );

  const sheetPreferences = UserSheetPreferencesService.getByType(
    context.actor.type,
  );

  const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

  const sectionConfig = !options?.useDefaultSectionConfig
    ? TidyFlags.sectionConfig.get(context.actor)?.[tabId]
    : undefined;

  const sectionActions: SectionCommand[] = [];

  if (context.owner) {
    sectionActions.push(SectionActions.getCreateItemHeaderSectionAction());
  }

  const allSections: PowersSection[] = [];

  for (const [order, powers] of Object.entries(orderToPowersMap)) {
    const section: PowersSection = {
      key: `order${order}`,
      type: 'powers',
      order: sectionConfig?.[`order${order}`]?.order ?? order,
      dataset: {
        ['system.order']: order,
      },
      items: ItemUtils.getSortedItems(powers ?? [], sortMode),
      label: `MCDMCB.TALENT.POWERS.ORDERS.${order}`,
      canCreate: true,
      sectionActions,
      show: sectionConfig?.[`order${order}`]?.show !== false,
      columns: CustomItemColumnRuntime.getColumnSpecifications({
        sheetDocument: context.document,
        editable: context.editable,
        owner: context.owner,
        unlocked: context.unlocked,
        sectionKey: `order${order}`,
        tabId: tabId,
      }),
    };

    allSections.push(section);
  }

  for (const [sectionKey, powers] of Object.entries(customSectionToPowersMap)) {
    const section: PowersSection = {
      key: sectionKey,
      type: 'powers',
      order: sectionConfig?.[sectionKey]?.order ?? 1000,
      dataset: {
        [TidyFlags.section.prop]: sectionKey,
      },
      items: ItemUtils.getSortedItems(powers ?? [], sortMode),
      label: sectionKey,
      canCreate: true,
      sectionActions,
      show: sectionConfig?.[sectionKey]?.show !== false,
      columns: CustomItemColumnRuntime.getColumnSpecifications({
        sheetDocument: context.document,
        editable: context.editable,
        owner: context.owner,
        unlocked: context.unlocked,
        sectionKey: 'powers',
        tabId: tabId,
      }),
    };

    allSections.push(section);
  }

  return SheetSections.sortKeyedSections(allSections, sectionConfig);
}

export function buildMcdmPowersSettingsTab(
  context: ActorSheetQuadroneContext,
  tabId: string,
): TabOptions {
  const localize = FoundryAdapter.localize;
  const sections = buildMcdmPowersSections(context, tabId);
  const defaultSections = buildMcdmPowersSections(context, tabId, {
    useDefaultSectionConfig: true,
  });

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
    optionsGroups,
    defaultSections,
    formTitle: localize('TIDY5E.ConfigureTab.Title', { tabName }),
  };
}
