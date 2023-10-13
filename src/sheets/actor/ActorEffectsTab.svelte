<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import ItemTable from '../../components/items/ItemTable.svelte';
  import ItemTableHeaderRow from '../../components/items/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../components/items/ItemTableRow.svelte';
  import ItemTableColumn from '../../components/items/ItemTableColumn.svelte';
  import ItemTableFooter from '../../components/items/ItemTableFooter.svelte';
  import ItemImage from '../../components/items/ItemImage.svelte';
  import ItemTableCell from '../../components/items/ItemTableCell.svelte';
  import ItemControl from '../../components/items/ItemControl.svelte';
  import { CONSTANTS } from 'src/constants';
  import ListContainer from '../../components/layout/ListContainer.svelte';
  import ItemControls from '../../components/items/ItemControls.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Notice from 'src/components/shared/Notice.svelte';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  $: effectSections = Object.values<any>($store.effects);
  $: classicControlsBaseWidth = $store.editable ? '7.5rem' : '5.3125rem';

  $: noEffects =
    effectSections.some((section: any) => section.effects.length > 0) === false;
</script>

<ListContainer cssClass="flex-column small-gap">
  {#if !$store.allowEffectsManagement && $store.editable}
    <Notice>{localize('T5EK.GmOnlyEdit')}</Notice>
  {/if}

  {#if noEffects && !$store.editable && $store.allowEffectsManagement}
    <Notice>{localize('T5EK.EmptySection')}</Notice>
  {:else}
    {#each effectSections as section}
      {#if ($store.editable && $store.allowEffectsManagement) || section.effects.length > 0}
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
            {#if $store.owner && $store.classicControlsEnabled && $store.allowEffectsManagement}
              <ItemTableColumn baseWidth={classicControlsBaseWidth} />
            {/if}
          </ItemTableHeaderRow>
          {#each section.effects as effect}
            <ItemTableRow
              on:mousedown={(event) =>
                FoundryAdapter.editOnMiddleClick(event.detail, effect)}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS,
                id: effect.id,
              }}
            >
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

              {#if $store.owner && $store.classicControlsEnabled && $store.allowEffectsManagement}
                <ItemTableCell baseWidth={classicControlsBaseWidth}>
                  <ItemControls>
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

                    {#if $store.editable}
                      <ItemControl
                        on:click={() => effect.delete()}
                        title={localize('DND5E.EffectDelete')}
                        iconCssClass="fas fa-trash"
                      />
                    {/if}
                  </ItemControls>
                </ItemTableCell>
              {/if}
            </ItemTableRow>
          {/each}
          {#if $store.owner && $store.editable && $store.allowEffectsManagement}
            <ItemTableFooter
              actor={$store.actor}
              dataset={section.dataset}
              create={() =>
                FoundryAdapter.addEffect(section.type, $store.actor)}
            />
          {/if}
        </ItemTable>
      {/if}
    {/each}
  {/if}
</ListContainer>
