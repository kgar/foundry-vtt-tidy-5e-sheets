<script lang="ts">
  import TidyEffectTableRow from 'src/components/table-quadrone/TidyEffectTableRow.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import type { ActiveEffectContext, EffectCategory } from 'src/types/types';
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
  import EffectToggleButton from 'src/components/table-quadrone/table-buttons/EffectToggleButton.svelte';
  import type { Component } from 'svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());

  let effects = $derived(Object.entries(context.effects));

  const localize = FoundryAdapter.localize;

  type TableAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    ActiveEffectContext,
    EffectCategory<ActiveEffectContext>
  >;

  let tableActions: TableAction<any>[] = $derived.by(() => {
    let result: TableAction<any>[] = [];

    result.push({
      component: EffectToggleButton,
      props: (args) => ({ effect: args.data.effect }),
      condition: (args) => !args.section.isEnchantment,
    } satisfies TableAction<typeof EffectToggleButton>);

    if (context.unlocked) {
      result.push({
        component: EditButton,
        props: (args) => ({ doc: args.data.effect }),
      } satisfies TableAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (args) => ({
          doc: args.data.effect,
          deleteFn: () => args.data.effect.deleteDialog(),
        }),
      } satisfies TableAction<typeof DeleteButton>);
    }

    return result;
  });

  let columnSpecs = $derived({
    source: {
      columnWidth: '8rem',
      hideUnder: 450,
    },
    duration: {
      columnWidth: '6rem',
      hideUnder: 350,
    },
    actions: {
      columnWidth: `calc((var(--t5e-table-button-width) * ${1 + tableActions.length}) + var(--t5e-size-halfx))`,
    },
  });

  function onAddClicked(section: any) {
    const owner = context.item;
    return FoundryAdapter.addEffect(section.type, owner);
  }
</script>

{#each effects as [key, section] (key)}
  {#if !section.hidden}
    <TidyTable {key}>
      {#snippet header()}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
            <span class="table-header-count">{section.effects.length}</span>
          </TidyTableHeaderCell>
          <TidyTableHeaderCell {...columnSpecs.source}>
            {localize('DND5E.SOURCE.FIELDS.source.label')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell {...columnSpecs.duration}>
            {localize('DND5E.Duration')}
          </TidyTableHeaderCell>
          <TidyTableHeaderCell
            class="header-cell-actions"
            {...columnSpecs.actions}
          >
            {#if context.editable}
              <a
                class="tidy-table-button"
                title={localize('DND5E.EffectCreate')}
                onclick={(event) => onAddClicked(section)}
              >
                <i class="fas fa-plus"></i>
              </a>
            {/if}
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {@const effectEntries = section.effects.map(
          (effect: ActiveEffectContext) => ({
            effect,
          }),
        )}

        {#each effectEntries as { effect } (effect.id)}
          <TidyEffectTableRow effectContext={effect}>
            {#snippet children({ toggleSummary, expanded })}
              <span
                class="tidy-table-button tidy-table-row-use-button disabled"
              >
                <img
                  class="item-image"
                  src={effect.img ?? effect.effect.icon}
                  alt={effect.name ?? ''}
                />
              </span>
              <TidyTableCell primary={true}>
                <a class="item-name" onclick={(ev) => toggleSummary()}>
                  <span class="cell-text">
                    <span class="cell-name">{effect.name}</span>
                  </span>
                  <span class="row-detail-expand-indicator">
                    <i
                      class="fa-solid fa-angle-right expand-indicator"
                      class:expanded
                    >
                    </i>
                  </span>
                </a>
              </TidyTableCell>
              <TidyTableCell {...columnSpecs.source}>
                {#if effect.source}
                  <!-- TODO: this is a stopgap; use dnd5e's more sophisticated action handler for this -->
                  <a
                    onclick={async () =>
                      (await fromUuid(effect.source.name))?.sheet.render({
                        force: true,
                      })}
                  >
                    {effect.source.name ?? ''}
                  </a>
                {:else}
                  <span class="color-text-disabled"> &mdash; </span>
                {/if}
              </TidyTableCell>
              <TidyTableCell {...columnSpecs.duration}>
                {effect.effect.duration.label ?? ''}
              </TidyTableCell>
              <TidyTableCell
                {...columnSpecs.actions}
                class="tidy-table-actions"
              >
                {#each tableActions as action}
                  {@const args = { data: effect, section }}

                  {#if action.condition?.(args) ?? true}
                    {@const props = action.props(args)}
                    <action.component {...props} />
                  {/if}
                {/each}
                <MenuButton targetSelector="[data-context-menu]" />
              </TidyTableCell>
            {/snippet}
          </TidyEffectTableRow>
        {/each}
      {/snippet}
    </TidyTable>
  {/if}
{/each}
