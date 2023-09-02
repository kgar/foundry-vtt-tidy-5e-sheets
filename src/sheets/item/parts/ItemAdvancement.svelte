<script lang="ts">
  import InlineSvg from 'src/components/utility/InlineSvg.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  function editAdvancement(advancementItemId: string, item: Item5e) {
    const advancement = item.advancement.byId[advancementItemId];

    return new advancement.constructor.metadata.apps.config(advancement).render(
      true
    );
  }

  function deleteAdvancement(advancementItemId: string, item: Item5e) {
    if (item.isEmbedded && !game.settings.get('dnd5e', 'disableAdvancements')) {
      let manager =
        dnd5e.applications.advancement.AdvancementManager.forDeletedAdvancement(
          item.actor,
          item.id,
          advancementItemId
        );
      if (manager.steps.length) return manager.render(true);
    }
    return item.deleteAdvancement(advancementItemId);
  }

  function toggleAdvancementLock(item: Item5e) {
    $store.toggleAdvancementLock();
  }

  function modifyChoices(advancementLevel: string, item: Item5e) {
    let manager =
      dnd5e.applications.advancement.AdvancementManager.forModifyChoices(
        item.actor,
        item.id,
        Number(advancementLevel)
      );

    if (manager.steps.length) {
      manager.render(true);
    }
  }
</script>

<ol class="items-list">
  {#if $store.editable}
    <li class="items-header flexrow main-controls">
      <div class="item-controls flexrow configuration-mode-control">
        {#if $store.isEmbedded}
          {#if $store.advancementEditable}
            <a
              on:click={() => toggleAdvancementLock($store.item)}
              title="DND5E.AdvancementConfigurationActionDisable"
            >
              <i class="fas fa-lock-open" />
              {localize('DND5E.AdvancementConfigurationModeEnabled')}
            </a>
          {:else}
            <a
              on:click={() => toggleAdvancementLock($store.item)}
              title="DND5E.AdvancementConfigurationActionEnable"
            >
              <i class="fas fa-lock" />
              {localize('DND5E.AdvancementConfigurationModeDisabled')}
            </a>
          {/if}
        {/if}
      </div>
      {#if $store.advancementEditable}
        <div class="item-controls flexrow add-button">
          <a
            title="DND5E.AdvancementControlCreate"
            on:click={() =>
              game.dnd5e.applications.advancement.AdvancementSelection.createDialog(
                $store.item
              )}
          >
            <i class="fas fa-plus" />
          </a>
        </div>
      {/if}
    </li>
  {/if}

  {#each Object.entries($store.advancement) as [level, data]}
    <li class="items-header flexrow" data-level={level}>
      <h3 class="item-name flexrow">
        {#if level === '0'}
          {localize('DND5E.AdvancementLevelAnyHeader')}
        {:else if level === 'unconfigured'}
          {localize('DND5E.AdvancementLevelNoneHeader')}
        {:else}
          {localize('DND5E.AdvancementLevelHeader', { level })}
        {/if}
      </h3>

      {#if $store.editable && data.configured && level !== 'unconfigured'}
        <div>
          <a on:click={() => modifyChoices(level, $store.item)}
            >{localize('DND5E.AdvancementModifyChoices')}</a
          >
        </div>
      {/if}

      {#if data.configured === 'full'}
        <div class="item-checkmark" title="DND5E.AdvancementConfiguredComplete">
          <i class="fas fa-check-circle" />
        </div>
      {:else if data.configured === 'partial'}
        <div class="item-warning" title="DND5E.AdvancementConfiguredIncomplete">
          <i class="fas fa-exclamation-triangle" />
        </div>
      {/if}
    </li>
    <ol class="item-list">
      {#each data.items as advancementItem}
        <li class="advancement-item item flexrow" data-id={advancementItem.id}>
          <div class="item-name flexrow">
            <div class="item-image">
              <InlineSvg svgUrl={advancementItem.icon} />
            </div>
            <h4>{@html advancementItem.title}</h4>
          </div>
          {#if $store.advancementEditable || !$store.isEmbedded}
            <div class="flexrow">
              {#if advancementItem.classRestriction === 'primary'}
                {localize('DND5E.AdvancementClassRestrictionPrimary')}
              {:else if advancementItem.classRestriction === 'secondary'}
                {localize('DND5E.AdvancementClassRestrictionSecondary')}
              {/if}
            </div>
          {/if}
          {#if $store.advancementEditable}
            <div class="item-controls flexrow">
              <a
                title="DND5E.AdvancementControlEdit"
                on:click={() =>
                  editAdvancement(advancementItem.id, $store.item)}
              >
                <i class="fas fa-edit" />
              </a>
              <a
                title="DND5E.AdvancementControlDelete"
                on:click={() =>
                  deleteAdvancement(advancementItem.id, $store.item)}
              >
                <i class="fas fa-trash" />
              </a>
            </div>
          {/if}
          {#if advancementItem.summary}
            <div class="item-summary">
              {@html advancementItem.summary}
            </div>
          {/if}
        </li>
      {/each}
    </ol>
  {/each}
</ol>
