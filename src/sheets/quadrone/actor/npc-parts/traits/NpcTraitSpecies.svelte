<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { EventHelper } from 'src/utils/events';

  let context = $derived(getCharacterSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let species = $derived(context.species);

  let speciesItem = $derived(
    species ? context.actor.items.get(species.id) : null,
  );
</script>

<!-- Species -->
<div
  class="list-entry"
  role="listitem"
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-item-id={species?.id}
  data-tidy-draggable
>
  <div class="list-label">
    <h4 class="font-weight-label">
      {localize('TYPES.Item.race')}
    </h4>
  </div>
  <div class="list-content">
    {#if species}
      <!-- svelte-ignore a11y_missing_attribute -->
      <a
        role="button"
        tabindex="0"
        aria-label={localize('DND5E.DescriptionView', {
          description: localize('TYPES.Item.race'),
        })}
        data-keyboard-focus
        class="list-values trait-item"
        data-action="showDocument"
        data-uuid={speciesItem?.uuid}
        onmousedown={(event) =>
          FoundryAdapter.editOnMiddleClick(event, speciesItem)}
      >
        <!-- svelte-ignore a11y_missing_attribute -->
        <span
          aria-label={localize('DND5E.DescriptionView', {
            description: localize('TYPES.Item.race'),
          })}
          class="item-image-link"
        >
          <img src={species.img} alt={species.name} class="item-image flex0" />
        </span>
        <span class="font-weight-label trait-name">
          {species.name}
        </span>
      </a>

      {#if context.unlocked}
        <div class="list-controls">
          <button
            aria-label={localize('DND5E.ItemEdit')}
            data-tooltip=""
            type="button"
            class="button button-borderless button-icon-only"
            data-action="editDocument"
            data-uuid={speciesItem?.uuid}
          >
            <i class="fa-solid fa-edit"></i>
          </button>
          <button
            aria-label="{localize('TYPES.Item.race')} Context Menu"
            type="button"
            class="button button-borderless button-icon-only"
            data-action="showContextMenu"
            data-target-selector="[data-item-id]"
          >
            <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
          </button>
        </div>
      {/if}
    {:else}
      <button
        aria-label={localize('TIDY5E.CompendiumBrowser', {
          name: localize('TYPES.Item.race'),
        })}
        type="button"
        class="button button-primary"
        data-tooltip={localize('TIDY5E.CompendiumBrowser', {
          name: localize('TYPES.Item.race'),
        })}
        data-action="findItem"
        data-item-type="race"
      >
        <i class="fa-solid fa-book-atlas"></i>
        {localize('DND5E.Species.Add')}
      </button>
      <button
        aria-label={localize('TIDY5E.AddCustom', {
          name: localize('TYPES.Item.race'),
        })}
        type="button"
        class="button button-secondary"
        onclick={(ev) =>
          FoundryAdapter.createItem({ type: 'race' }, context.actor)}
      >
        {localize('TIDY5E.AddCustom', {
          name: localize('TYPES.Item.race'),
        })}
      </button>
    {/if}
  </div>
</div>
