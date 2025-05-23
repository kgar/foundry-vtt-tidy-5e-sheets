<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemFavoriteContextEntry } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { getModifierData } from 'src/utils/formatting';

  interface Props {
    favorite: ItemFavoriteContextEntry;
  }

  let { favorite }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let subtitle = 'todo';

  let uses = $derived({
    ...favorite.item.system.uses,
    field: 'system.uses.value',
  });

  async function handleClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
  ) {
    if (context.editable) {
      FoundryAdapter.actorTryUseItem(favorite.item, event);
    }
  }
</script>

<li
  class="favorite"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES}
  data-item-id={favorite.item.id}
>
  <a
    class={['item-use-button', { disabled: !context.editable }]}
    onclick={handleClick}
  >
    <img src={favorite.item.img} alt={favorite.item.name} class="item-image" />
    <span class="roll-prompt">
      <i class="fa fa-dice-d20"></i>
    </span>
  </a>
  <div class="name stacked">
    <span class="title">
      {favorite.item.name}
    </span>
    <span class="subtitle">
      {subtitle}
    </span>
  </div>
  <div class="info">
    <span class="primary">
      {#if uses.max}
        <span class="uses">
          {#if context.owner}
            <TextInputQuadrone
              document={favorite.item}
              field={uses.field}
              enableDeltaChanges={true}
              class="value"
              value={uses.value}
              selectOnFocus={true}
              onSaveChange={(event) => {
                const el = event.currentTarget;
                FoundryAdapter.handleItemUsesChanged(event, favorite.item).then(
                  () => {
                    el?.select();
                  },
                );

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
      {:else if !isNil(value)}
        <!-- TODO -->
      {:else if quantity}
        <!-- TODO -->
      {/if}
    </span>
    <span class="secondary">
      {#if uses && quantity}
        <!-- TODO -->
      {:else if range?.value}
        <!-- TODO -->
      {:else if range?.reach}
        <!-- TODO -->
      {/if}
    </span>
  </div>
</li>
