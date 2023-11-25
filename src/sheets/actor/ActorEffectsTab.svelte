<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import ItemTable from '../../components/item-list/ItemTable.svelte';
  import ItemTableHeaderRow from '../../components/item-list/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../components/item-list/ItemTableRow.svelte';
  import ItemTableColumn from '../../components/item-list/ItemTableColumn.svelte';
  import ItemTableFooter from '../../components/item-list/ItemTableFooter.svelte';
  import ItemImage from '../../components/item-list/ItemImage.svelte';
  import ItemTableCell from '../../components/item-list/ItemTableCell.svelte';
  import ItemControl from '../../components/item-list/controls/ItemControl.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemControls from '../../components/item-list/controls/ItemControls.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Notice from 'src/components/notice/Notice.svelte';

  let context = getContext<Readable<ActorSheetContext>>('context');

  const localize = FoundryAdapter.localize;

  $: effectSections = Object.values<any>($context.effects);
  $: classicControlsBaseWidth = $context.editable ? '7.5rem' : '5.3125rem';

  $: noEffects =
    effectSections.some((section: any) => section.effects.length > 0) === false;
</script>

<div class="scroll-container flex-column small-gap">
  {#if !$context.allowEffectsManagement && $context.editable}
    <Notice>{localize('T5EK.GMOnlyEdit')}</Notice>
  {/if}

  {#if noEffects && !$context.editable && $context.allowEffectsManagement}
    <Notice>{localize('T5EK.EmptySection')}</Notice>
  {:else}
    {#each effectSections as section}
      {#if ($context.editable && $context.allowEffectsManagement) || section.effects.length > 0}
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
            {#if $context.owner && $context.useClassicControls && $context.allowEffectsManagement}
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
              {effect}
            >
              <ItemTableCell primary={true}>
                <ItemImage src={effect.icon} />
                <span class="align-self-center">{effect.name}</span>
              </ItemTableCell>
              <ItemTableCell baseWidth="12.5rem"
                >{effect.sourceName ?? ''}</ItemTableCell
              >
              <ItemTableCell baseWidth="7.5rem"
                >{effect.duration.label ?? ''}</ItemTableCell
              >

              {#if $context.owner && $context.useClassicControls && $context.allowEffectsManagement}
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

                    {#if $context.editable}
                      <ItemControl
                        on:click={() => effect.deleteDialog()}
                        title={localize('DND5E.EffectDelete')}
                        iconCssClass="fas fa-trash"
                      />
                    {/if}
                  </ItemControls>
                </ItemTableCell>
              {/if}
            </ItemTableRow>
          {/each}
          {#if $context.owner && $context.editable && $context.allowEffectsManagement}
            <ItemTableFooter
              actor={$context.actor}
              dataset={section.dataset}
              create={() =>
                FoundryAdapter.addEffect(section.type, $context.actor)}
            />
          {/if}
        </ItemTable>
      {/if}
    {/each}
  {/if}
</div>
