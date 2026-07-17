import type { SectionOptionGroup } from 'src/settings/editors/sheet-tab-options-settings-editor.svelte';
import { SheetSections } from 'src/features/sections/SheetSections';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type {
  ConfiguredSectionColumnSpecification,
  SectionColumnContext,
  TabOptions,
} from 'src/runtime/types';
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
import { getDefaultItemColumns } from 'src/runtime/tables/default-item-columns';
import McdmPowerSpecialtyColumn from '../McdmPowerSpecialtyColumn.svelte';

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

  const rowActions = TableRowActionsRuntime.getInventoryRowActions(context);
  for (const power of allPowers) {
    const ctx = (context.itemContext[power.id] ??= {});
    ctx.rowActions = rowActions.filter(
      (action) => !action.condition || action.condition({ item: power }),
    );

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

  const defaultColumns = getDefaultItemColumns();
  const allSpecs: ConfiguredSectionColumnSpecification[] = [
    {
      key: 'concentration',
      headerContent: {
        type: 'html',
        html: '',
      },
      cellContent: {
        type: 'callback',
        callback: (rowDocument, rowContext) => {
          if (!rowDocument.requiresConcentration) return '';
          return `
              <span class="concentration-icon">
                <dnd5e-icon src="systems/dnd5e/icons/svg/statuses/concentrating.svg">
              </span>
            `;
        },
      },
      widthRems: 2,
      order: 100,
      priority: 900,
    },
    { ...defaultColumns.uses, key: 'uses', order: 200, priority: 200 },
    {
      key: 'specialty',
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize(
          'MCDMCB.TALENT.POWERS.SPECIALTIES.Header',
        ),
      },
      cellContent: {
        type: 'component',
        component: McdmPowerSpecialtyColumn,
      },
      widthRems: 3.5,
      order: 300,
      priority: 100,
    },
    { ...defaultColumns.time, key: 'time', order: 400, priority: 500 },
    { ...defaultColumns.formula, key: 'formula', order: 500, priority: 300 },
    { ...defaultColumns.target, key: 'target', order: 600, priority: 400 },
    { ...defaultColumns.range, key: 'range', order: 700, priority: 600 },
    { ...defaultColumns.roll, key: 'roll', order: 800, priority: 700 },
  ];

  const columns: SectionColumnContext = {
    map: allSpecs.reduce<Record<string, ConfiguredSectionColumnSpecification>>(
      (prev, curr) => {
        prev[curr.key] = curr;
        return prev;
      },
      {},
    ),
    prioritized: allSpecs
      .toSorted((a, b) => b.priority - a.priority)
      .map((s) => s.key),
    sorted: allSpecs.toSorted((a, b) => a.order - b.order).map((s) => s.key),
  };

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
      columns,
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
      columns,
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
