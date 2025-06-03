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
    ].filterJoin(` <div class="divider-dot"></div> `),
  );

  let range = $derived(favorite.activity.range);

  let uses = $derived({ ...favorite.activity.uses, field: 'uses.value' });

  let modifier = $derived(favorite.activity.labels.modifier);

  let save = $derived(favorite.activity.save);
</script>

<div
  class="list-entry favorite"
  data-favorite-type="activity"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES}
  data-item-id={favorite.activity.item?.id}
  data-activity-id={favorite.activity.id}
  data-configurable={configurable}
>
  <FavoriteRollButton
    {favorite}
    img={favorite.activity.img}
    title={favorite.activity.name}
    onUse={async (event) => await favorite.activity.use({ event })}
  />
  <div class="item-name-container">
    <label for={`favorite-activity-${favorite.activity.id}`} class="item-name stacked">
      <span class="title">
        {favorite.activity.name}
      </span>
      <span class="subtitle flexrow color-text-lighter font-default-small">
        {@html subtitle}
      </span>
    </label>
  </div>
  <div class="">
    <div class="primary">
      {#if uses.max}
        <span class="uses">
          {#if context.owner}
            <TextInputQuadrone
              document={favorite.activity}
              id={`favorite-activity-${favorite.activity.id}`}
              field={uses.field}
              enableDeltaChanges={true}
              class="value"
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
            <span class="value">
              {uses.value}
            </span>
          {/if}
          <span class="divider color-text-gold">/</span>
          <span class="max color-text-lighter">
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
        <span class="save">
          <span class="value font-data-medium color-text-default">
            {save.dc.value}
          </span>
          <span class="ability font-label-medium color-text-gold">
            {save.ability}
          </span>
        </span>
      {/if}
    </div>
    <div class="secondary">
      {#if range?.value}
        <span class="range">
          <span class="value font-data-medium color-text-default">
            {range.value}
          </span>
          {#if range.long}&sol; {range.long}{/if}
          <span class="units font-default-medium color-text-lighter">
            {range.units}
          </span>
        </span>
      {:else if range?.reach}
        <span class="range">
          <span class="value font-data-medium color-text-default">
            {range.reach}
          </span>
          <span class="units font-default-medium color-text-lighter">
            {range.units}
          </span>
        </span>
      {/if}
    </div>
  </div>
</div>
