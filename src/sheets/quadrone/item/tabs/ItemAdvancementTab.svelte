<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    AdvancementItemContext,
    ItemSheetQuadroneContext,
  } from 'src/types/item.types';
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
  import type { Component } from 'svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
  import TidyAdvancementTableRow from 'src/components/table-quadrone/TidyAdvancementTableRow.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { isNil } from 'src/utils/data';

  let localize = FoundryAdapter.localize;

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());

  let advancements = $derived(Object.entries(context.advancement));

  type TableAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    AdvancementItemContext,
    {}
  >;

  let tableActions: TableAction<any>[] = $derived.by(() => {
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

  let columnSpecs = $derived({
    value: {
      columnWidth: '3.125rem',
    },
    actions: {
      columnWidth: `calc((var(--t5e-table-button-width) * ${1 + tableActions.length}) + var(--t5e-size-halfx))`,
    },
  });
</script>

<ol>
  <li>✅ Make tidy tables for advancements</li>
  <li>Add the actor-owned view - tie to locked/unlocked</li>
  <li>Add partial config UI</li>
  <li>Add false config UI</li>
  <li>Ensure all interactibles are included</li>
</ol>

{#each advancements as [key, section]}
  <TidyTable {key}>
    {#snippet header()}
      <TidyTableHeaderRow class="theme-dark">
        <TidyTableHeaderCell primary={true} class="header-label-cell">
          <h3>
            {#if key === '0'}
              {localize('DND5E.AdvancementLevelAnyHeader')}
            {:else if key === 'unconfigured'}
              {localize('DND5E.AdvancementLevelNoneHeader')}
            {:else}
              {localize('DND5E.AdvancementLevelHeader', { level: key })}
            {/if}
          </h3>
        </TidyTableHeaderCell>
        <TidyTableHeaderCell {...columnSpecs.value}>
          {localize('DND5E.Value')}
        </TidyTableHeaderCell>
        <TidyTableHeaderCell
          class="header-cell-actions"
          {...columnSpecs.actions}
        >
          {#if context.unlocked && section.configured && key !== 'unconfigured'}
            <a
              class="item-control config-button"
              title={localize('DND5E.AdvancementModifyChoices')}
              aria-label={localize('DND5E.AdvancementModifyChoices')}
              onclick={() =>
                FoundryAdapter.modifyAdvancementChoices(key, context.item)}
            >
              <i class="fas fa-cog"></i>
            </a>
          {:else if section.configured === 'full'}
            <span
              class="info-control"
              title={localize('DND5E.AdvancementConfiguredComplete')}
              aria-label={localize('DND5E.AdvancementConfiguredComplete')}
            >
              <i class="fas fa-check-circle"></i>
            </span>
          {:else if section.configured === 'partial'}
            <span
              class="info-control"
              title={localize('DND5E.AdvancementConfiguredIncomplete')}
              aria-label={localize('DND5E.AdvancementConfiguredIncomplete')}
            >
              <i class="fas fa-exclamation-triangle"></i>
            </span>
          {/if}
        </TidyTableHeaderCell>
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
              {#if isSvg}
                <Dnd5eIcon src={advancement.icon} class="item-image" />
              {:else}
                <img
                  class="item-image"
                  src={advancement.icon}
                  alt={advancement.title ?? ''}
                />
              {/if}
            </span>
            <TidyTableCell primary={true}>
              <div class="item-name">
                <div class="cell-text">
                  <div class="cell-name">
                    {@html advancement.title}
                    {#each advancement.tags as tag}
                      <i class={tag.iconClass} title={localize(tag.label)}></i>
                    {/each}
                    <div class="advancement-cell-context">
                      {@html advancement.summary}
                    </div>
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
            <TidyTableCell class="tidy-table-actions" {...columnSpecs.actions}>
              {#if context.unlocked}
                {#each tableActions as action}
                  {@const props = action.props({ data: advancement, section })}
                  <action.component {...props} />
                {/each}
              {/if}
              <MenuButton targetSelector=".advancement-item" />
            </TidyTableCell>
          {/snippet}
        </TidyAdvancementTableRow>
      {/each}
    {/snippet}
  </TidyTable>
{/each}
