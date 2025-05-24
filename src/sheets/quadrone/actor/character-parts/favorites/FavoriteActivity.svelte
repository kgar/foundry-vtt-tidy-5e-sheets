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
    ].filterJoin(` <span class="divider-dot"></span> `),
  );

  let range = $derived(favorite.activity.range);

  let uses = $derived({ ...favorite.activity.uses, field: 'uses.value' });

  let modifier = $derived(favorite.activity.labels.modifier);

  let save = $derived(favorite.activity.save);
</script>

<li
  class="favorite"
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
  <div class="name stacked">
    <span class="title">
      {favorite.activity.name}
    </span>
    <span class="subtitle">
      {@html subtitle}
    </span>
  </div>
  <div class="info">
    <div class="primary">
      {#if uses.max}
        <span class="uses">
          {#if context.owner}
            <TextInputQuadrone
              document={favorite.activity}
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
          <span class="divider">/</span>
          <span class="max">
            {uses.max}
          </span>
        </span>
      {:else if !isNil(modifier)}
        {@const mod = getModifierData(modifier)}
        <span class="modifier">
          <span class="sign">
            {mod.sign}
          </span>
          <span>
            {mod.value}
          </span>
        </span>
      {:else if save?.dc?.value}
        <span class="save">
          <span class="value">
            {save.dc.value}
          </span>
          <span class="ability">
            {save.ability}
          </span>
        </span>
      {/if}
    </div>
    <div class="secondary">
      {#if range?.value}
        <span class="range">
          {range.value}
          {#if range.long}&sol; {range.long}{/if}
          {range.units}
        </span>
      {:else if range?.reach}
        <span class="range">
          {range.reach}
          {range.units}
        </span>
      {/if}
    </div>
  </div>
</li>
