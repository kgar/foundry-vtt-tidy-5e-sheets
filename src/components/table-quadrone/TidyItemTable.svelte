<script
  lang="ts"
  generics="TSection extends InventorySection | FeatureSection | SpellbookSection"
>
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { SectionVisibility } from 'src/features/sections/SectionVisibility';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ActorItemQuadroneContext,
    CharacterItemQuadroneContext,
    CharacterSheetQuadroneContext,
    FeatureSection,
    InventorySection,
    NpcSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';
  import { getContext, type Snippet } from 'svelte';
  import type { SvelteMap, SvelteSet } from 'svelte/reactivity';
  import TidyTableSubtitle from './parts/TidyTableSubtitle.svelte';
  import type { ClassValue, HTMLAttributes } from 'svelte/elements';
  import { RowActionRuntimeBase } from 'src/runtime/table-row-actions/RowActionRuntimeBase';
  import SectionActionsColumnHeader from 'src/sheets/quadrone/item/columns/SectionActionsColumnHeader.svelte';
  import type { Item5e } from 'src/types/item.types';
  import RowActionsColumn from 'src/sheets/quadrone/item/columns/RowActionsColumn.svelte';
  import TidyTableCustomHeaderCells from './parts/TidyTableCustomHeaderCells.svelte';
  import TidyTableCustomCells from './parts/TidyTableCustomCells.svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import { isNil } from 'src/utils/data';
  import InlineContainerView from 'src/sheets/quadrone/container/parts/InlineContainerView.svelte';

  interface Props {
    section: TSection;
    hiddenColumns: Set<string>;
    rowActionInfo: ReturnType<
      typeof RowActionRuntimeBase.getRowActionWidthInfo
    >;
    entries: Item5e[];
    entryContext: Record<
      string,
      ActorItemQuadroneContext | CharacterItemQuadroneContext
    >;
    entryToggleMap: SvelteMap<string, SvelteSet<string>>;
    tabId: string;
    headerRowClasses?: ClassValue;
    headerRowAttributes?: Omit<HTMLAttributes<HTMLElement>, 'class'>;
    rowClassFunction?: (entry: Item5e) => ClassValue;
    bodyNoEntries?: Snippet;
    endOfPrimaryHeaderCell?: Snippet;
    subtitle?: Snippet<[entry: Item5e, ctx: any]>;
    afterFirstCell?: Snippet<[entry: Item5e, ctx: any]>;
    afterInlineActivities?: Snippet<[entry: Item5e, ctx: any]>;
    beforeImage?: Snippet<[entry: Item5e, ctx: any]>;
    afterImage?: Snippet<[entry: Item5e, ctx: any]>;
    afterEntryRow?: Snippet<[entry: Item5e, ctx: any]>;
    root?: boolean;
  }

  let {
    entries,
    section,
    hiddenColumns,
    rowActionInfo,
    entryContext,
    entryToggleMap,
    tabId,
    rowClassFunction,
    subtitle,
    afterInlineActivities,
    afterFirstCell,
    beforeImage,
    afterImage,
    afterEntryRow,
    bodyNoEntries,
    endOfPrimaryHeaderCell,
    headerRowClasses,
    headerRowAttributes,
    root = true,
  }: Props = $props();

  const searchResults = getSearchResultsContext();

  const inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const containerToggleMap = $derived(inlineToggleService.map);

  const context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  const actor = $derived(
    context.document.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR
      ? context.document
      : context.document.actor,
  );

  const localize = FoundryAdapter.localize;

  // Item sheet context has no themeSettings; resolve from the document like ThemeQuadrone.prepare.

  const isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  const sectionSearchState = $derived(
    SectionVisibility.getItemSectionSearchState(entries, searchResults),
  );

  // A spell section with nothing to show presents as unavailable rather than
  // disappearing: slot-bearing ones always, the rest while searching. Sections
  // visible only because the sheet is unlocked stay interactive for managing.
  const unavailable = $derived(
    section.type === CONSTANTS.SECTION_TYPE_SPELLBOOK &&
      sectionSearchState.visibleItemCount === 0 &&
      (section.usesSlots || sectionSearchState.isSearching),
  );
</script>

<TidyTable
  key={section.key}
  data-custom-section={section.custom ? true : null}
  dataset={section.dataset}
  expandedOverride={sectionSearchState.expandedOverride}
  class={{ unavailable }}
>
  {#snippet header(expanded)}
    <TidyTableHeaderRow
      class={[!isBasicTheme ? 'theme-dark' : '', headerRowClasses]}
      {...headerRowAttributes}
    >
      <TidyTableHeaderCell primary={true} class="header-label-cell">
        <h3>
          {localize(section.label)}
        </h3>
        <span class="table-header-count"
          >{sectionSearchState.visibleItemCount}</span
        >
        {@render endOfPrimaryHeaderCell?.()}
      </TidyTableHeaderCell>
      <TidyTableCustomHeaderCells
        {hiddenColumns}
        {section}
        {context}
        {expanded}
        {root}
      />
      <TidyTableHeaderCell
        class="header-cell-actions"
        columnWidth="{rowActionInfo.widthRems}rem"
        data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
      >
        <SectionActionsColumnHeader
          {section}
          maxRowActionsCount={rowActionInfo.maxRowActionsCount}
          sheetDocument={context.document}
        />
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}

  {#snippet body()}
    {const entriesWithContext = $derived(
      entries.map((entry) => ({
        entry,
        ctx: entryContext[entry.id],
      })),
    )}

    {#if entriesWithContext.length}
      {#each entriesWithContext as { entry, ctx }, i (entry.uuid)}
        {const expanded = $derived(!!entryToggleMap.get(tabId)?.has(entry.id))}
        {const classes = $derived(
          rowClassFunction ? rowClassFunction(entry) : {},
        )}
        {const hasContainerExpander = $derived(
          'containerContents' in ctx && !!ctx.containerContents,
        )}
        {const isContainer = $derived(
          entry.type === CONSTANTS.ITEM_TYPE_CONTAINER,
        )}

        <TidyItemTableRow
          item={entry}
          hidden={!searchResults.show(entry.uuid)}
          rowClass={[
            { expanded },
            { expandable: hasContainerExpander },
            classes,
          ]}
          contextMenu={{
            type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
            uuid: entry.uuid,
          }}
          {afterInlineActivities}
          {ctx}
        >
          {#snippet children({ toggleSummary, expanded })}
            {#if beforeImage}
              {@render beforeImage?.(entry, ctx)}
            {:else}
              <div class="highlight"></div>
            {/if}
            <!--svelte-ignore a11y_missing_attribute-->
            <a
              class={[
                'tidy-table-row-use-button',
                { disabled: !context.editable && !isContainer },
              ]}
              data-action={isContainer ? 'showDocument' : 'use'}
              data-uuid={isContainer ? entry.uuid : undefined}
              data-has-roll-modes={isContainer ? undefined : true}
            >
              <img class="item-image" alt={entry.name} src={entry.img} />
              <span class="roll-prompt">
                <i
                  class={isContainer
                    ? 'fa-solid fa-box-open'
                    : 'fa-solid fa-dice-d20'}
                ></i>
              </span>
            </a>

            {#if afterImage}
              {@render afterImage?.(entry, ctx)}
            {:else}
              {#if 'containerContents' in ctx && !!ctx.containerContents}
                <!-- svelte-ignore a11y_missing_attribute -->
                <a
                  class="container-expander"
                  onclick={() => inlineToggleService.toggle(tabId, entry.id)}
                  role="button"
                  tabindex="0"
                  aria-label={localize('DND5E.ToggleDescription')}
                  onkeydown={(ev) =>
                    ev.key === 'Enter' ||
                    (ev.key === ' ' &&
                      inlineToggleService.toggle(tabId, entry.id))}
                >
                  <i
                    class="fa-solid fa-angle-right expand-indicator"
                    class:expanded={containerToggleMap
                      .get(tabId)
                      ?.has(entry.id)}
                  >
                  </i>
                </a>
              {/if}
            {/if}
            <TidyTableCell primary={true} class="item-label text-cell">
              <!--svelte-ignore a11y_missing_attribute-->
              <a
                class="item-name"
                role="button"
                data-keyboard-focus
                tabindex="0"
                onclick={(ev) => toggleSummary()}
                onkeydown={(ev) =>
                  ev.key === 'Enter' || (ev.key === ' ' && toggleSummary())}
              >
                <span class="cell-text">
                  <span class="cell-name">{entry.name}</span>

                  {#if subtitle}
                    {@render subtitle(entry, ctx)}
                  {:else if root && ctx.containerName}
                    <TidyTableSubtitle>
                      {@html ctx.containerName}
                    </TidyTableSubtitle>
                  {:else if ctx.subtitle}
                    <TidyTableSubtitle>
                      {@html ctx.subtitle}
                    </TidyTableSubtitle>
                  {/if}
                </span>
                <span
                  class={[
                    'row-detail-expand-indicator',
                    expanded ? 'expanded' : 'collapsed',
                  ]}
                >
                  <i class="fa-solid fa-angle-right expand-indicator"> </i>
                </span>
              </a>
            </TidyTableCell>

            {#if afterFirstCell}
              {@render afterFirstCell?.(entry, ctx)}
            {:else}
              {#if 'inspirationSource' in context && context.inspirationSource?.itemId === entry.id}
                <i
                  class={[
                    'fa-solid',
                    'fa-sparkles',
                    'item-state-indicator',
                    'color-text-gold-emphasis',
                  ]}
                  data-tooltip="TIDY5E.ACTOR.Inspiration.Source.Tooltip"
                ></i>
              {/if}

              {const mastered = $derived(
                actor?.system.traits?.weaponProf?.mastery?.value?.has(
                  entry.system.type?.baseItem ?? '',
                ),
              )}

              {#if mastered}
                {const mastery = $derived(
                  CONFIG.DND5E.weaponMasteries[entry.system.mastery],
                )}
                {const reference = $derived(
                  SettingsProvider.settings.referenceTooltipMastery.get()
                    ? mastery?.reference
                    : undefined,
                )}
                {const tooltip = $derived(
                  !isNil(mastery?.label, '')
                    ? FoundryAdapter.localize(
                        'TIDY5E.ITEM.Weapon.Mastery.Label',
                        {
                          mastery: mastery.label,
                        },
                      )
                    : game.i18n.format('DND5E.WEAPON.Mastery.Label'),
                )}

                <i
                  class="fa-solid fa-circle-star color-icon-theme-highlight highlighted mastery item-state-indicator"
                  data-tooltip={!reference ? tooltip : null}
                  data-reference-tooltip={reference}
                ></i>
              {/if}

              {#if 'attunement' in ctx && ctx.attunement}
                {const iconClass = $derived(
                  entry.system.attuned
                    ? 'fa-solid fa-sun color-icon-theme-highlight highlighted'
                    : 'fa-regular fa-sun color-text-lightest',
                )}

                {const title = $derived(localize(ctx.attunement.title))}
                <i
                  class={[iconClass, 'item-state-indicator']}
                  data-tooltip={title}
                ></i>
              {:else if entry.system.equipped}
                <i
                  class="fa-solid fa-hand-fist equip-icon color-text-lightest item-state-indicator"
                  data-tooltip={localize('DND5E.Equipped')}
                ></i>
              {/if}
            {/if}

            <TidyTableCustomCells
              {hiddenColumns}
              {ctx}
              {entry}
              {section}
              {context}
            />

            <RowActionsColumn
              columnWidth="{rowActionInfo.widthRems}rem"
              rowActions={ctx.rowActions ?? []}
              data={{
                item: entry,
                ctx,
              }}
            />
          {/snippet}
        </TidyItemTableRow>

        {#if afterEntryRow}
          {@render afterEntryRow?.(entry, ctx)}
        {:else}
          {#if 'containerContents' in ctx && !!ctx.containerContents}
            <InlineContainerView
              container={entry}
              containerContents={ctx.containerContents}
              editable={context.editable}
              {inlineToggleService}
              searchCriteria={searchResults.criteria}
              sheetDocument={context.document}
            />
          {/if}
        {/if}
      {/each}
    {:else}
      {@render bodyNoEntries?.()}
    {/if}
  {/snippet}
</TidyTable>
