<script lang="ts">
  import InlineSvg from 'src/components/utility/InlineSvg.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ItemSheetContext>>('context');

  $: advancements = Object.entries($context.advancement) as Iterable<
    [string, any]
  >;

  const localize = FoundryAdapter.localize;

  function toggleAdvancementLock(item: Item5e) {
    $context.toggleAdvancementLock();
  }

  const basicSvgFilePathRegex = /\.svg$/i;

  function isSvg(iconPath: string) {
    return basicSvgFilePathRegex.test(iconPath?.trim());
  }

  function handleAdvancementDragStart(event: DragEvent, advancement: any) {
    if (!advancement) {
      return;
    }

    const dragData =
      $context.item.advancement.byId[advancement.id]?.toDragData();
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }
</script>

<ol
  class="items-list flex-1"
  on:drop={(ev) => $context.owner && $context.item.sheet._onDrop(ev)}
>
  {#if $context.editable}
    <li
      class="items-header main-controls advancement flex-row justify-content-space-between"
    >
      <div class="item-controls configuration-mode-control">
        {#if $context.editable && $context.isEmbedded}
          <button
            class="inline-icon-button"
            on:click={() => toggleAdvancementLock($context.item)}
            title={localize('DND5E.AdvancementConfigurationActionDisable')}
          >
            {#if $context.advancementEditable}
              <i class="fas fa-lock-open" />
              {localize('DND5E.AdvancementConfigurationModeEnabled')}
            {:else}
              <i class="fas fa-lock" />
              {localize('DND5E.AdvancementConfigurationModeDisabled')}
            {/if}
          </button>
        {/if}
      </div>
      {#if $context.editable && $context.advancementEditable}
        <div class="item-controls add-button">
          <button
            type="button"
            class="inline-icon-button"
            title={localize('DND5E.AdvancementControlCreate')}
            on:click={() =>
              FoundryAdapter.createAdvancementSelectionDialog($context.item)}
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

  {#each advancements as [level, data]}
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

      {#if $context.editable && data.configured && level !== 'unconfigured'}
        <div>
          <button
            type="button"
            class="inline-transparent-button"
            on:click={() =>
              FoundryAdapter.modifyAdvancementChoices(level, $context.item)}
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
      {#each data.items as advancement}
        {@const isSvgIcon = isSvg(advancement.icon)}
        <li
          class="advancement-item item flexrow"
          data-id={advancement.id}
          on:dragstart={(ev) => handleAdvancementDragStart(ev, advancement)}
          draggable={$context.owner}
        >
          <div class="item-name flexrow">
            <div class="item-image" class:svg={isSvgIcon}>
              {#if isSvgIcon}
                <InlineSvg svgUrl={advancement.icon} />
              {:else}
                <img src={advancement.icon} alt="" />
              {/if}
            </div>
            <h4>{@html advancement.title}</h4>
          </div>
          {#if $context.advancementEditable || !$context.isEmbedded}
            <div class="flexrow">
              {#if advancement.classRestriction === 'primary'}
                {localize('DND5E.AdvancementClassRestrictionPrimary')}
              {:else if advancement.classRestriction === 'secondary'}
                {localize('DND5E.AdvancementClassRestrictionSecondary')}
              {/if}
            </div>
          {/if}
          {#if $context.editable && $context.advancementEditable}
            <div class="item-controls flexrow">
              <button
                type="button"
                class="inline-icon-button"
                title={localize('DND5E.AdvancementControlEdit')}
                on:click={() =>
                  FoundryAdapter.editAdvancement(advancement.id, $context.item)}
              >
                <i class="fas fa-edit" />
              </button>
              <button
                type="button"
                class="inline-icon-button"
                title={localize('DND5E.AdvancementControlDelete')}
                on:click={() =>
                  FoundryAdapter.deleteAdvancement(
                    advancement.id,
                    $context.item,
                  )}
              >
                <i class="fas fa-trash" />
              </button>
            </div>
          {/if}
          {#if advancement.summary}
            <div class="item-summary">
              {@html advancement.summary}
            </div>
          {/if}
        </li>
      {/each}
    </ol>
  {/each}
</ol>
