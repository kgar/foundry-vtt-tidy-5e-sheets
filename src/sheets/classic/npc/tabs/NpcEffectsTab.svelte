<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type ActorSheetContextV1,
    type NpcSheetContext,
    type RenderableClassicControl,
  } from 'src/types/types';
  import ItemTable from '../../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../../components/item-list/v1/ItemTableRow.svelte';
  import ItemTableColumn from '../../../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableFooter from '../../../../components/item-list/ItemTableFooter.svelte';
  import ItemImage from '../../../../components/item-list/ItemImage.svelte';
  import ItemTableCell from '../../../../components/item-list/v1/ItemTableCell.svelte';
  import ItemControl from '../../../../components/item-list/controls/ItemControl.svelte';
  import Notice from 'src/components/notice/Notice.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import ActorConditions from '../../actor/ActorConditions.svelte';
  import ClassicControls from 'src/sheets/classic/shared/ClassicControls.svelte';
  import ActorEffectToggleControl from 'src/components/item-list/controls/ActorEffectToggleControl.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import EffectTableRow from 'src/components/item-list/v1/EffectTableRow.svelte';

  let context = $derived(getSheetContext<NpcSheetContext>());

  const localize = FoundryAdapter.localize;

  let effectSections = $derived(Object.values<any>(context.effects));

  let noEffects = $derived(
    effectSections.some((section: any) => section.effects.length > 0) === false,
  );

  declareLocation('effects');

  let controls: RenderableClassicControl<{ effect: any }>[] = $derived.by(
    () => {
      let result: RenderableClassicControl<{ effect: any }>[] = [];
      result.push(
        {
          component: ActorEffectToggleControl,
          props: ({ effect }) => ({
            effect: effect,
          }),
        },
        {
          component: ItemControl,
          props: ({ effect }) => ({
            onclick: () =>
              FoundryAdapter.getEffect({
                document: context.actor,
                effectId: effect.id,
                parentId: effect.parentId,
              }).sheet.render(true),
            title: localize('DND5E.EffectEdit'),
            iconCssClass: 'fas fa-edit',
          }),
        },
      );

      if (context.unlocked) {
        result.push({
          component: ItemControl,
          props: ({ effect }) => ({
            onclick: () =>
              FoundryAdapter.getEffect({
                document: context.actor,
                effectId: effect.id,
                parentId: effect.parentId,
              }).deleteDialog(),
            title: localize('DND5E.EffectDelete'),
            iconCssClass: 'fas fa-trash',
          }),
        });
      }

      return result;
    },
  );

  let classicControlsIconWidth = 1.25;

  let classicControlsColumnWidth = $derived(
    `${classicControlsIconWidth * controls.length}rem`,
  );
</script>

<div class="scroll-container flex-column small-gap">
  {#if !context.allowEffectsManagement && context.unlocked}
    <Notice>{localize('TIDY5E.GMOnlyEdit')}</Notice>
  {/if}

  {#if noEffects && !context.unlocked && context.allowEffectsManagement}
    <Notice>{localize('TIDY5E.EmptySection')}</Notice>
  {:else}
    {#each effectSections as section}
      {#if !section.hidden}
        {#if (context.unlocked && context.allowEffectsManagement) || section.effects.length > 0}
          <ItemTable key={section.label}>
            {#snippet header()}
              <ItemTableHeaderRow>
                <ItemTableColumn primary={true}>
                  {localize(section.label)}
                  <span class="item-table-count">{section.effects.length}</span>
                </ItemTableColumn>
                <ItemTableColumn baseWidth="12.5rem">
                  {localize('DND5E.SOURCE.FIELDS.source.label')}
                </ItemTableColumn>
                <ItemTableColumn baseWidth="7.5rem">
                  {localize('DND5E.Duration')}
                </ItemTableColumn>
                {#if context.editable && context.useClassicControls && context.allowEffectsManagement}
                  <ItemTableColumn baseWidth={classicControlsColumnWidth} />
                {/if}
              </ItemTableHeaderRow>
            {/snippet}
            {#snippet body()}
              {#each section.effects as effectContext}
                <EffectTableRow
                  activeEffect={effectContext}
                  attributes={{
                    'data-info-card': 'effect',
                    'data-info-card-entity-uuid': effectContext.uuid,
                  }}
                >
                  {#snippet children({ toggleSummary })}
                    <ItemTableCell
                      primary={true}
                      attributes={{
                        'data-tidy-effect-name-container': true,
                        'data-effect-id': effectContext.id,
                      }}
                    >
                      <ItemImage src={effectContext.img} />
                      <a
                        onclick={(ev) => toggleSummary()}
                        class="truncate flex-row align-items-center flex-1"
                      >
                        <span
                          class="align-self-center truncate flex-1"
                          data-tidy-effect-name={effectContext.name}
                          title={effectContext.name}>{effectContext.name}</span
                        >
                      </a>
                    </ItemTableCell>
                    <ItemTableCell baseWidth="12.5rem">
                      <span
                        class="truncate"
                        title={effectContext.source?.name ?? ''}
                        >{effectContext.source?.name ?? ''}</span
                      >
                    </ItemTableCell>
                    <ItemTableCell baseWidth="7.5rem">
                      <span
                        class="truncate"
                        title={effectContext.duration?.label ?? ''}
                        >{effectContext.duration?.label ?? ''}</span
                      >
                    </ItemTableCell>
                    {#if context.editable && context.useClassicControls && context.allowEffectsManagement}
                      <ItemTableCell baseWidth={classicControlsColumnWidth}>
                        <ClassicControls
                          {controls}
                          params={{ effect: effectContext }}
                        />
                      </ItemTableCell>
                    {/if}
                  {/snippet}
                </EffectTableRow>
              {/each}
              {#if context.unlocked && context.allowEffectsManagement}
                <ItemTableFooter
                  actor={context.actor}
                  {section}
                  create={() =>
                    FoundryAdapter.addEffect(section.type, context.actor)}
                  isItem={false}
                />
              {/if}
            {/snippet}
          </ItemTable>
        {/if}
      {/if}
    {/each}
  {/if}
  {#if context.conditions}
    <ActorConditions conditions={context.conditions} />
  {/if}
</div>
