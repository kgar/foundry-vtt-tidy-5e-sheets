<script lang="ts">
  import InlineSvg from 'src/components/utility/InlineSvg.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>('context');

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
    $context.toggleAdvancementLock();
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
  {#if $context.editable}
    <li class="items-header main-controls advancement">
      <div class="item-controls configuration-mode-control">
        {#if $context.owner && $context.isEmbedded}
          {#if $context.advancementEditable}
            <button
              class="inline-icon-button"
              on:click={() => toggleAdvancementLock($context.item)}
              title={localize("DND5E.AdvancementConfigurationActionDisable")}
            >
              <i class="fas fa-lock-open" />
              {localize('DND5E.AdvancementConfigurationModeEnabled')}
            </button>
          {:else}
            <button
              type="button"
              class="inline-icon-button"
              on:click={() => toggleAdvancementLock($context.item)}
              title={localize("DND5E.AdvancementConfigurationActionEnable")}
            >
              <i class="fas fa-lock" />
              {localize('DND5E.AdvancementConfigurationModeDisabled')}
            </button>
          {/if}
        {/if}
      </div>
      {#if $context.owner && $context.advancementEditable}
        <div class="item-controls add-button">
          <button
            type="button"
            class="inline-icon-button"
            title={localize('DND5E.AdvancementControlCreate')}
            on:click={() =>
              game.dnd5e.applications.advancement.AdvancementSelection.createDialog(
                $context.item
              )}
          >
            <i class="fas fa-plus" />
            {localize('DND5E.Add')}
          </button>
        </div>
      {:else}
        <div role="presentation" />
      {/if}
    </li>
  {/if}

  {#each Object.entries($context.advancement) as [level, data]}
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

      {#if $context.owner && $context.editable && data.configured && level !== 'unconfigured'}
        <div>
          <button
            type="button"
            class="inline-transparent-button"
            on:click={() => modifyChoices(level, $context.item)}
          >
            {localize('DND5E.AdvancementModifyChoices')}
          </button>
        </div>
      {/if}

      {#if data.configured === 'full'}
        <div
          class="item-checkmark"
          title={localize('DND5E.AdvancementConfiguredComplete')}
        >
          <i class="fas fa-check-circle" />
        </div>
      {:else if data.configured === 'partial'}
        <div
          class="item-warning"
          title={localize('DND5E.AdvancementConfiguredIncomplete')}
        >
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
          {#if $context.advancementEditable || !$context.isEmbedded}
            <div class="flexrow">
              {#if advancementItem.classRestriction === 'primary'}
                {localize('DND5E.AdvancementClassRestrictionPrimary')}
              {:else if advancementItem.classRestriction === 'secondary'}
                {localize('DND5E.AdvancementClassRestrictionSecondary')}
              {/if}
            </div>
          {/if}
          {#if $context.owner && $context.advancementEditable}
            <div class="item-controls flexrow">
              <button
                type="button"
                class="inline-icon-button"
                title={localize('DND5E.AdvancementControlEdit')}
                on:click={() =>
                  editAdvancement(advancementItem.id, $context.item)}
              >
                <i class="fas fa-edit" />
              </button>
              <button
                type="button"
                class="inline-icon-button"
                title={localize('DND5E.AdvancementControlDelete')}
                on:click={() =>
                  deleteAdvancement(advancementItem.id, $context.item)}
              >
                <i class="fas fa-trash" />
              </button>
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
