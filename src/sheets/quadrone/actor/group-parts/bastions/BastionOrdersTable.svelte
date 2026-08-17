<script lang="ts">
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCustomCells from 'src/components/table-quadrone/parts/TidyTableCustomCells.svelte';
  import TidyTableCustomHeaderCells from 'src/components/table-quadrone/parts/TidyTableCustomHeaderCells.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
  import ItemRollButton from 'src/sheets/quadrone/shared/ItemRollButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getTidyFacilityIcon } from 'src/features/facility/facility';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { BastionOrderColumnRuntime } from 'src/runtime/table-columns/BastionOrderColumnRuntime';
  import { RowActionRuntimeBase } from 'src/runtime/table-row-actions/RowActionRuntimeBase';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

  interface Props {
    sectionsInlineWidth: number;
  }

  let { sectionsInlineWidth }: Props = $props();

  let context = $derived(getGroupSheetQuadroneContext());

  let isBasicTheme = $derived(
    ThemeQuadrone.getSheetThemeSettings({ doc: context.document })
      .useBasicTheme ?? false,
  );

  const localize = FoundryAdapter.localize;

  let orders = $derived(context.bastionsContext.orders);

  let section = $derived({
    key: 'orders',
    label: 'DND5E.FACILITY.Orders.Label',
    show: true,
    dataset: {},
    sectionActions: [],
    columns: context.bastionsContext.orderColumns,
  });

  // TODO: Context menu only for now. Should we surface anything else?
  let rowActionInfo = $derived(
    RowActionRuntimeBase.getRowActionWidthInfo(orders, () => []),
  );

  let hiddenColumns = $derived(
    BastionOrderColumnRuntime.determineHiddenColumns(
      sectionsInlineWidth - rowActionInfo.widthPx,
      section.columns,
    ),
  );
</script>

<TidyTable key={section.key} class="bastion-orders">
  {#snippet header()}
    <TidyTableHeaderRow class={!isBasicTheme ? 'theme-dark' : ''}>
      <TidyTableHeaderCell primary={true}>
        <h3>
          {localize(section.label)}
          <span class="table-header-count">{orders.length}</span>
        </h3>
      </TidyTableHeaderCell>

      <TidyTableCustomHeaderCells {context} {section} {hiddenColumns} />

      <TidyTableHeaderCell
        class="header-cell-actions"
        columnWidth="{rowActionInfo.widthRems}rem"
        data-tidy-column-key={CONSTANTS.COLUMN_KEY_ROW_ACTIONS}
      />
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    {#each orders as order (order.facility.uuid)}
      {const icon = $derived(getTidyFacilityIcon(order.key))}

      <div
        class="tidy-table-row bastion-order"
        style:--t5e-theme-color-default={order.member.accentColor}
        style:--t5e-theme-color-highlight={order.member.highlightColor}
        data-item-id={order.facility.id}
        data-member-uuid={order.member.actor.uuid}
        data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_GROUP_BASTION_FACILITY}
      >
        <TidyTableCell primary={true} class="text-cell item-label">
          {#if order.craft}
            <ItemRollButton 
              image={order.craft.img}
              name={order.craft.name}
              onclick={(ev: MouseEvent) => {
                ev.preventDefault();
                ev.stopPropagation();
                const document = game.documents.get(order.craft.uuid);
                if (document) {
                  document.render(true);
                }
              }} 
            />
          {/if}
          <span class="bastion-order-name truncate">
            {#if icon?.type === 'fa-icon-class'}
              <i class={icon.className}></i>
            {:else if icon?.type === 'dnd5e-icon'}
              <Dnd5eIcon src={icon.src}></Dnd5eIcon>
            {/if}
            <!-- Order labels already localized by the system -->
            <span class="truncate">{order.label}</span>
          </span>
        </TidyTableCell>

        <!-- TODO: Extract group member portrait into a component out of GroupMemberNameColumn-->
        <TidyTableCustomCells
          {context}
          ctx={order}
          entry={order.facility}
          {section}
          {hiddenColumns}
        />

        <TidyTableCell
          columnWidth="{rowActionInfo.widthRems}rem"
          class="tidy-table-actions"
          attributes={{
            ['data-tidy-column-key']: CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
          }}
        >
          <MenuButton targetSelector="[data-context-menu]" />
        </TidyTableCell>
      </div>
    {/each}

    {#if !orders.length}
      <div class="empty-state-container empty-state-description">
        {localize('TIDY5E.Bastion.Group.Orders.EmptyStateHint')}
      </div>
    {/if}
  {/snippet}
</TidyTable>
