<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e } from 'src/types/item.types';

  let context = $derived(getItemSheetContext());

  let advancements = $derived(
    Object.entries(context.advancement) as Iterable<[string, any]>,
  );

  const localize = FoundryAdapter.localize;

  function toggleAdvancementLock(item: Item5e) {
    context.toggleAdvancementLock();
  }

  const basicSvgFilePathRegex = /\.svg$/i;

  function isSvg(iconPath: string) {
    return basicSvgFilePathRegex.test(iconPath?.trim());
  }

  function handleAdvancementDragStart(event: DragEvent, advancement: any) {
    if (!advancement) {
      return;
    }

    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragData =
      context.item.advancement.byId[advancement.id]?.toDragData();
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }
</script>

<ol class="items-list flex-1">
  {#if context.editable}
    <li
      class="items-header main-controls advancement flex-row justify-content-space-between"
    >
      <div class="item-controls configuration-mode-control">
        {#if context.editable && context.isEmbedded}
          <button
            type="button"
            class="inline-icon-button"
            onclick={() => toggleAdvancementLock(context.item)}
            title={localize('DND5E.AdvancementConfigurationActionDisable')}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
          >
            {#if context.advancementEditable}
              <i class="fas fa-lock-open"></i>
              {localize('DND5E.AdvancementConfigurationModeEnabled')}
            {:else}
              <i class="fas fa-lock"></i>
              {localize('DND5E.AdvancementConfigurationModeDisabled')}
            {/if}
          </button>
        {/if}
      </div>
      {#if context.editable && context.advancementEditable}
        <div class="item-controls add-button">
          <button
            type="button"
            class="inline-icon-button"
            title={localize('DND5E.ADVANCEMENT.Action.Create')}
            aria-label={localize('DND5E.ADVANCEMENT.Action.Create')}
            onclick={() =>
              FoundryAdapter.createAdvancementSelectionDialog(context.item)}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
          >
            <i class="fas fa-plus"></i>
            {localize('DND5E.Add')}
          </button>
        </div>
      {:else}
        <div role="presentation"></div>
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

      {#if context.editable && data.configured && level !== 'unconfigured'}
        <div>
          <button
            type="button"
            class="inline-transparent-button"
            onclick={() =>
              FoundryAdapter.modifyAdvancementChoices(level, context.item)}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
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
          <i class="fas fa-check-circle"></i>
        </div>
      {:else if data.configured === 'partial'}
        <div
          class="item-warning"
          title={localize('DND5E.AdvancementConfiguredIncomplete')}
        >
          <i class="fas fa-exclamation-triangle"></i>
        </div>
      {/if}
    </li>
    <ol class="item-list">
      {#each data.items as advancement}
        {@const isSvgIcon = isSvg(advancement.icon)}
        <li
          class="advancement-item item flexrow"
          data-tidy-always-draggable
          data-id={advancement.id}
          ondragstart={(ev) => handleAdvancementDragStart(ev, advancement)}
        >
          <div class="item-name flexrow">
            <div class="item-image" class:svg={isSvgIcon}>
              <img src={advancement.icon} alt="" />
            </div>
            <span class="title truncate" title={advancement.title}
              >{@html advancement.title}</span
            >
          </div>
          {#if context.advancementEditable || !context.isEmbedded}
            <div class="flexrow">
              {#if advancement.classRestriction === 'primary'}
                {localize('DND5E.AdvancementClassRestrictionPrimary')}
              {:else if advancement.classRestriction === 'secondary'}
                {localize('DND5E.AdvancementClassRestrictionSecondary')}
              {/if}
            </div>
          {/if}
          {#if context.editable && context.advancementEditable}
            <div class="item-controls flexrow">
              <button
                type="button"
                class="inline-icon-button"
                title={localize('DND5E.ADVANCEMENT.Action.Edit')}
                aria-label={localize('DND5E.ADVANCEMENT.Action.Edit')}
                onclick={() =>
                  FoundryAdapter.editAdvancement(advancement.id, context.item)}
                tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                type="button"
                class="inline-icon-button"
                title={localize('DND5E.ADVANCEMENT.Action.Delete')}
                aria-label={localize('DND5E.ADVANCEMENT.Action.Delete')}
                onclick={() =>
                  FoundryAdapter.deleteAdvancement(
                    advancement.id,
                    context.item,
                  )}
                tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
              >
                <i class="fas fa-trash"></i>
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
