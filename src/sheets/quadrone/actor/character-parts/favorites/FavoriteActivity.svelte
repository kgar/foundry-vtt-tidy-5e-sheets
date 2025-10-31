<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { CONSTANTS } from 'src/constants';
  import { Activities } from 'src/features/activities/activities';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ActivityFavoriteContextEntry } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { getModifierData } from 'src/utils/formatting';
  import FavoriteRollButton from './parts/FavoriteRollButton.svelte';
  import { firstOfSet } from 'src/utils/set';

  interface Props {
    favorite: ActivityFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let configurable = $derived(Activities.isConfigurable(favorite.activity));

  let subtitle = $derived(
    [
      favorite.activity.labels.activation,
      favorite.activity.labels.recovery,
      favorite.activity.item.name,
    ].filterJoin(` <div class="divider-dot"></div> `),
  );

  let range = $derived(favorite.activity.range);

  let uses = $derived({ ...favorite.activity.uses, field: 'uses.value' });

  let modifier = $derived(favorite.activity.labels.modifier);

  let save = $derived(favorite.activity.save);
</script>

<div
  role="button"
  tabindex="0"
  class="list-entry favorite"
  data-favorite-type="activity"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES}
  data-item-id={favorite.activity.item?.id}
  data-activity-id={favorite.activity.id}
  data-configurable={configurable}
  data-tidy-draggable
  data-favorite-id={favorite.id}
  onmousedown={(event) =>
    FoundryAdapter.editOnMiddleClick(event, favorite.activity)}
  data-tidy-sheet-part="favorite-entry"
>
  <FavoriteRollButton
    {favorite}
    img={favorite.activity.img}
    title={favorite.activity.name}
    onUse={async (event) => await favorite.activity.use({ event })}
    name={favorite.activity.name}
    {subtitle}
  />
  <div class="favorite-context stacked">
    <span class="primary">
      {#if uses.max}
        <span class="inline-uses">
          {#if context.owner}
            <TextInputQuadrone
              document={favorite.activity}
              id={`favorite-activity-${favorite.activity.id}`}
              field={uses.field}
              enableDeltaChanges={true}
              class="uninput uses-value"
              value={uses.value}
              selectOnFocus={true}
              onSaveChange={(event) => {
                const el = event.currentTarget;
                FoundryAdapter.handleActivityUsesChanged(
                  event,
                  favorite.activity,
                ).then(() => {
                  el?.select();
                });

                return false;
              }}
            />
          {:else}
            <span class="uses-value color-text-default">
              {uses.value}
            </span>
          {/if}
          <span class="divider color-text-gold">/</span>
          <span class="uses-max color-text-lighter">
            {uses.max}
          </span>
        </span>
      {:else if !isNil(modifier)}
        {@const mod = getModifierData(modifier)}
        <span class="modifier">
          <span class="sign font-label-medium color-text-lighter">
            {mod.sign}
          </span>
          <span class="value font-data-medium color-text-default">
            {mod.value}
          </span>
        </span>
      {:else if save?.dc?.value}
        <span class="save flexrow">
          <span class="ability font-label-medium color-text-gold-emphasis">
            {save.ability?.size > 1
              ? FoundryAdapter.localize('DND5E.AbbreviationDC')
              : save.ability?.size
                ? firstOfSet(save.ability)
                : save.ability}
          </span>
          <span class="value font-data-medium color-text-default">
            {save.dc.value}
          </span>
        </span>
      {/if}
    </span>
    <span class="secondary font-default-medium">
      {#if range?.value}
        {@const units =
          CONFIG.DND5E.movementUnits[range.units]?.abbreviation ?? range.units}
        <span class="range">
          <span class="value color-text-default">
            {range.value}
          </span>
          {#if range.long}&sol; {range.long}{/if}
          <span class="units color-text-lighter">
            {units}
          </span>
        </span>
      {:else if range?.reach}
        {@const units =
          CONFIG.DND5E.movementUnits[range.units]?.abbreviation ?? range.units}
        <span class="range">
          <span class="value color-text-default">
            {range.reach}
          </span>
          <span class="units color-text-lighter">
            {units}
          </span>
        </span>
      {/if}
    </span>
  </div>
</div>
