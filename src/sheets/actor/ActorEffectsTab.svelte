<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type ActorSheetContext,
    type RenderableClassicControl,
  } from 'src/types/types';
  import ItemTable from '../../components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from '../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../components/item-list/v1/ItemTableRow.svelte';
  import ItemTableColumn from '../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableFooter from '../../components/item-list/ItemTableFooter.svelte';
  import ItemImage from '../../components/item-list/ItemImage.svelte';
  import ItemTableCell from '../../components/item-list/v1/ItemTableCell.svelte';
  import ItemControl from '../../components/item-list/controls/ItemControl.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Notice from 'src/components/notice/Notice.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import ClassicControls from '../shared/ClassicControls.svelte';
  import ActorEffectToggleControl from 'src/components/item-list/controls/ActorEffectToggleControl.svelte';

  let context = getContext<Readable<ActorSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;

  $: effectSections = Object.values<any>($context.effects);

  $: noEffects =
    effectSections.some((section: any) => section.effects.length > 0) === false;

  declareLocation('effects');

  let controls: RenderableClassicControl<{ effect: any }>[] = [];

  $: {
    controls = [];

    controls.push(
      {
        component: ActorEffectToggleControl,
        props: ({ effect }) => ({
          effect: effect,
        }),
      },
      {
        component: ItemControl,
        props: ({ effect }) => ({
          onclick: () => effect.sheet.render(true),
          title: localize('DND5E.EffectEdit'),
          iconCssClass: 'fas fa-edit',
        }),
      },
    );

    if ($context.unlocked) {
      controls.push({
        component: ItemControl,
        props: ({ effect }) => ({
          onclick: () => effect.deleteDialog(),
          title: localize('DND5E.EffectDelete'),
          iconCssClass: 'fas fa-trash',
        }),
      });
    }
  }

  let classicControlsIconWidth = 1.25;

  $: classicControlsColumnWidth = `${classicControlsIconWidth * controls.length}rem`;
</script>

<div class="scroll-container flex-column small-gap">
  {#if !$context.allowEffectsManagement && $context.unlocked}
    <Notice>{localize('TIDY5E.GMOnlyEdit')}</Notice>
  {/if}

  {#if noEffects && !$context.unlocked && $context.allowEffectsManagement}
    <Notice>{localize('TIDY5E.EmptySection')}</Notice>
  {:else}
    {#each effectSections as section}
      {#if !section.hidden}
        {#if ($context.unlocked && $context.allowEffectsManagement) || section.effects.length > 0}
          <ItemTable key={section.label}>
            <svelte:fragment slot="header">
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
                {#if $context.editable && $context.useClassicControls && $context.allowEffectsManagement}
                  <ItemTableColumn baseWidth={classicControlsColumnWidth} />
                {/if}
              </ItemTableHeaderRow>
            </svelte:fragment>
            <svelte:fragment slot="body">
              {#each section.effects as effect}
                <ItemTableRow
                  on:mousedown={(event) =>
                    FoundryAdapter.editOnMiddleClick(event.detail, effect)}
                  contextMenu={{
                    type: CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS,
                    uuid: effect.uuid,
                  }}
                  {effect}
                >
                  <ItemTableCell
                    primary={true}
                    attributes={{
                      'data-tidy-effect-name-container': true,
                      'data-effect-id': effect.id,
                    }}
                  >
                    <ItemImage src={effect.img ?? effect.icon} />
                    <span
                      class="align-self-center truncate"
                      data-tidy-effect-name={effect.name}>{effect.name}</span
                    >
                  </ItemTableCell>
                  <ItemTableCell baseWidth="12.5rem"
                    >{effect.sourceName ?? ''}</ItemTableCell
                  >
                  <ItemTableCell baseWidth="7.5rem"
                    >{effect.duration.label ?? ''}</ItemTableCell
                  >
                  {#if $context.editable && $context.useClassicControls && $context.allowEffectsManagement}
                    <ItemTableCell baseWidth={classicControlsColumnWidth}>
                      <ClassicControls {controls} params={{ effect: effect }} />
                    </ItemTableCell>
                  {/if}
                </ItemTableRow>
              {/each}
              {#if $context.unlocked && $context.allowEffectsManagement}
                <ItemTableFooter
                  actor={$context.actor}
                  {section}
                  create={() =>
                    FoundryAdapter.addEffect(section.type, $context.actor)}
                  isItem={false}
                />
              {/if}
            </svelte:fragment>
          </ItemTable>
        {/if}
      {/if}
    {/each}
  {/if}
</div>
