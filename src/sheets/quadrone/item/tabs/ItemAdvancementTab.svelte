<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    AdvancementItemContext,
    AdvancementSectionContext,
    ItemSheetQuadroneContext,
  } from 'src/types/item.types';
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
  import type { Component } from 'svelte';
  import TableHeaderButton from 'src/components/table-quadrone/table-buttons/TableHeaderButton.svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
  import TidyAdvancementTableRow from 'src/components/table-quadrone/TidyAdvancementTableRow.svelte';
  import { isNil } from 'src/utils/data';
  import { CONSTANTS } from 'src/constants';

  let localize = FoundryAdapter.localize;

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());

  let advancements = $derived(Object.entries(context.advancement));

  type TableAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    AdvancementItemContext,
    {}
  >;

  let tableRowActions: TableAction<any>[] = $derived.by(() => {
    let result: TableAction<any>[] = [];

    if (context.unlocked) {
      result.push({
        component: EditButton,
        props: (args) => ({
          doc: context.item.advancement?.byId[args.data.id],
        }),
      } satisfies TableAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (args) => ({
          doc: context.item.advancement?.byId[args.data.id],
          deleteFn: () =>
            context.item.advancement?.byId[args.data.id]?.deleteDialog(),
        }),
      } satisfies TableAction<typeof DeleteButton>);
    }

    return result;
  });

  type TableHeaderAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    { key: string },
    AdvancementSectionContext
  >;

  let tableHeaderActions: TableHeaderAction<any>[] = $derived.by(() => {
    let result: TableHeaderAction<any>[] = [];

    result.push({
      component: TableHeaderButton,
      condition: (args) =>
        context.unlocked &&
        args.data.key !== CONSTANTS.ADVANCEMENT_LEVEL_UNCONFIGURED &&
        !!args.section.configured,
      props: (args) => ({
        title: 'DND5E.AdvancementModifyChoices',
        onControlClick: (ev, args) =>
          FoundryAdapter.modifyAdvancementChoices(args.data.key, context.item),
        iconClass: 'fa-solid fa-cog',
        controlContext: args,
      }),
    } satisfies TableHeaderAction<typeof TableHeaderButton>);

    result.push({
      component: TableHeaderButton,
      condition: (args) =>
        !context.unlocked &&
        args.section.configured === CONSTANTS.ADVANCEMENT_CONFIGURATION_FULL,
      props: () => ({
        title: 'DND5E.AdvancementConfiguredComplete',
        iconClass: 'fa-solid fa-badge-check emphasis',
      }),
    } satisfies TableHeaderAction<typeof TableHeaderButton>);

    result.push({
      component: TableHeaderButton,
      condition: (args) =>
        !context.unlocked &&
        args.section.configured === CONSTANTS.ADVANCEMENT_CONFIGURATION_PARTIAL,
      props: () => ({
        title: 'DND5E.AdvancementConfiguredIncomplete',
        iconClass: 'fas fa-exclamation-triangle warning',
      }),
    } satisfies TableHeaderAction<typeof TableHeaderButton>);

    return result;
  });

  let actionColumnButtonCount = $derived.by(() => {
    let length = 0;

    for (let [key, section] of advancements) {
      length = Math.max(
        length,
        tableHeaderActions.filter(
          (a) => a.condition?.({ data: { key }, section }) ?? 0,
        ).length,
      );
    }

    return Math.max(length, tableRowActions.length);
  });

  let columnSpecs = $derived({
    value: {
      columnWidth: '3.75rem',
    },
    actions: {
      columnWidth: `calc((var(--t5e-table-button-width) * ${1 + actionColumnButtonCount}) + var(--t5e-size-halfx))`,
    },
  });
</script>

{#each advancements as [key, section]}
  <TidyTable {key}>
    {#snippet header()}
      <TidyTableHeaderRow class="theme-dark">
        <TidyTableHeaderCell primary={true} class="header-label-cell">
          <h3>
            {#if key === CONSTANTS.ADVANCEMENT_LEVEL_ZERO}
              {localize('DND5E.AdvancementLevelAnyHeader')}
            {:else if key === CONSTANTS.ADVANCEMENT_LEVEL_UNCONFIGURED}
              {localize('DND5E.AdvancementLevelNoneHeader')}
            {:else}
              {localize('DND5E.AdvancementLevelHeader', { level: key })}
            {/if}
          </h3>
        </TidyTableHeaderCell>
        <TidyTableHeaderCell {...columnSpecs.value}>
          {localize('DND5E.Value')}
        </TidyTableHeaderCell>
        {#if context.editable}
          <TidyTableHeaderCell
            class="header-cell-actions"
            {...columnSpecs.actions}
          >
            {#each tableHeaderActions as headerAction}
              {#if headerAction.condition?.( { data: { key }, section: section }, ) ?? true}
                <headerAction.component
                  {...headerAction.props({ data: { key }, section })}
                />
              {/if}
            {/each}

            <a
              class="tidy-table-button"
              title={localize('DND5E.ADVANCEMENT.Action.Create')}
              aria-label={localize('DND5E.ADVANCEMENT.Action.Create')}
              onclick={() =>
                FoundryAdapter.createAdvancementSelectionDialog(context.item)}
            >
              <i class="fas fa-plus"></i>
            </a>
          </TidyTableHeaderCell>
        {/if}
      </TidyTableHeaderRow>
    {/snippet}
    {#snippet body()}
      {#each section.items as advancement (advancement.id)}
        <TidyAdvancementTableRow
          {advancement}
          item={context.item}
          rowClass="advancement-item"
        >
          {#snippet children()}
            {@const isSvg = advancement.icon?.endsWith('.svg')}
            <span class="tidy-table-button tidy-table-row-use-button disabled">
              <img
                class="item-image"
                src={advancement.icon}
                alt={advancement.title ?? ''}
              />
            </span>
            <TidyTableCell primary={true}>
              <div class="item-name">
                <div class="cell-text">
                  <div class="cell-name">
                    {@html advancement.title}
                    {#each advancement.tags as tag}
                      <i class={tag.iconClass} title={localize(tag.label)}></i>
                    {/each}
                  </div>
                  <div class="advancement-cell-context">
                    {@html advancement.summary}
                  </div>
                </div>
              </div>
            </TidyTableCell>
            <TidyTableCell {...columnSpecs.value}>
              {#if !isNil(advancement.value)}
                {@const value = advancement.value?.toString()}
                <span>
                  {value}
                </span>
              {:else}
                <span class="color-text-disabled">&mdash;</span>
              {/if}
            </TidyTableCell>
            {#if context.editable}
              <TidyTableCell
                class="tidy-table-actions"
                {...columnSpecs.actions}
              >
                {#if context.unlocked}
                  {#each tableRowActions as action}
                    {@const props = action.props({
                      data: advancement,
                      section,
                    })}
                    <action.component {...props} />
                  {/each}
                {/if}
                <MenuButton targetSelector=".advancement-item" />
              </TidyTableCell>
            {/if}
          {/snippet}
        </TidyAdvancementTableRow>
      {/each}
    {/snippet}
  </TidyTable>
{:else}
  <button
    type="button"
    class="button button-primary"
    title={localize('DND5E.ADVANCEMENT.Action.Create')}
    aria-label={localize('DND5E.ADVANCEMENT.Action.Create')}
    onclick={() =>
      FoundryAdapter.createAdvancementSelectionDialog(context.item)}
  >
    <i class="fas fa-plus"></i>
    {localize('DND5E.ADVANCEMENT.Action.Create')}
  </button>
{/each}
