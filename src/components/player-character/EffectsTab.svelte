<script lang="ts">
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import { createEventDispatcher, onMount } from 'svelte';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../items/ItemTableRow.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import ItemTableFooter from '../items/ItemTableFooter.svelte';
  import ItemImage from '../items/ItemImage.svelte';
  import ItemTableCell from '../items/ItemTableCell.svelte';
  import ItemControl from '../items/ItemControl.svelte';

  export let context: CharacterSheetContext;
  export let scrollTop: number;

  const localize = FoundryAdapter.localize;

  const effectSections = Object.values<any>(context.effects);
  const allowEdit = FoundryAdapter.tryGetFlag<boolean>(
    context.actor,
    'allow-edit'
  );
  const classicControlsEnabled =
    SettingsProvider.settings.classicControlsEnabled.get();

  const dispatcher = createEventDispatcher<{
    scrollTopChanged: { top: number };
  }>();

  let scrollView: HTMLElement;

  onMount(() => {
    scrollView.scrollTop = scrollTop ?? 0;
  });
</script>

<div
  class="effect-list"
  on:scroll={(event) =>
    dispatcher('scrollTopChanged', { top: event.currentTarget.scrollTop })}
  bind:this={scrollView}
>
  {#each effectSections as section}
    {#if allowEdit || section.effects.length > 0}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(section.label)}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="12.5rem">
            {localize('DND5E.Source')}
          </ItemTableColumn>
          <ItemTableColumn baseWidth="7.5rem">
            {localize('DND5E.Duration')}
          </ItemTableColumn>
          {#if context.owner && classicControlsEnabled}
            <ItemTableColumn baseWidth="5.3125rem" />
          {/if}
        </ItemTableHeaderRow>
        {#each section.effects as effect}
          <ItemTableRow>
            <ItemTableCell primary={true}>
              <ItemImage src={effect.icon} />
              <span class="align-self-center">{effect.label}</span>
            </ItemTableCell>
            <ItemTableCell baseWidth="12.5rem"
              >{effect.sourceName}</ItemTableCell
            >
            <ItemTableCell baseWidth="7.5rem"
              >{effect.duration.label}</ItemTableCell
            >

            {#if context.owner && classicControlsEnabled}
              <ItemTableCell baseWidth="5.3125rem">
                <div class="effect-controls">
                  <ItemControl
                    on:click={() =>
                      effect.update({ disabled: !effect.disabled })}
                    title={effect.disabled
                      ? localize('DND5E.EffectEnable')
                      : localize('DND5E.EffectDisable')}
                    iconCssClass="fas {effect.disabled
                      ? 'fa-check'
                      : 'fa-times'}"
                  />
                  <ItemControl
                    on:click={() => effect.sheet.render(true)}
                    title={localize('DND5E.EffectEdit')}
                    iconCssClass="fas fa-edit"
                  />

                  {#if allowEdit}
                    <ItemControl
                      on:click={() => effect.delete()}
                      title={localize('DND5E.EffectDelete')}
                      iconCssClass="fas fa-trash"
                    />
                  {/if}
                </div>
              </ItemTableCell>
            {/if}
          </ItemTableRow>
        {/each}
        {#if context.owner && allowEdit && context.editable}
          <ItemTableFooter
            actor={context.actor}
            dataset={section.dataset}
            create={() => FoundryAdapter.addEffect(section.type, context.actor)}
          />
        {/if}
      </ItemTable>
    {/if}
  {/each}
</div>

<style lang="scss">
  .effect-list {
    flex: 1;
    padding: 0 9px 8px 0;
    overflow-y: scroll;
  }

  .effect-controls {
    align-self: stretch;
    display: flex;
    justify-content: flex-end;
    min-width: 5.3125rem;
    font-size: 0.75rem;
    padding: 0 0.125rem;

    :global(> *) {
      flex: 1;
    }
  }
</style>
