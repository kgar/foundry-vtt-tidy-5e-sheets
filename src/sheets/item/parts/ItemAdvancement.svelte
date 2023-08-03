<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ItemSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<ol class="items-list">
  {#if $store.editable}
    <li class="items-header flexrow main-controls">
      <div class="item-controls flexrow configuration-mode-control">
        {#if $store.isEmbedded}
          {#if $store.advancementEditable}
            <a
              class="item-control"
              data-action="toggle-configuration"
              data-tooltip="DND5E.AdvancementConfigurationActionDisable"
            >
              <i class="fas fa-lock-open" />
              {localize('DND5E.AdvancementConfigurationModeEnabled')}
            </a>
          {:else}
            <a
              class="item-control"
              data-action="toggle-configuration"
              data-tooltip="DND5E.AdvancementConfigurationActionEnable"
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
            class="item-control"
            data-action="add"
            data-tooltip="DND5E.AdvancementControlCreate"
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
          <a class="item-control" data-action="modify-choices"
            >{localize('DND5E.AdvancementModifyChoices')}</a
          >
        </div>
      {/if}

      {#if data.configured === 'full'}
        <div
          class="item-checkmark"
          data-tooltip="DND5E.AdvancementConfiguredComplete"
        >
          <i class="fas fa-check-circle" />
        </div>
      {:else if data.configured === 'partial'}
        <div
          class="item-warning"
          data-tooltip="DND5E.AdvancementConfiguredIncomplete"
        >
          <i class="fas fa-exclamation-triangle" />
        </div>
      {/if}
    </li>
    <ol class="item-list">
      {#each data.items as item}
        <li class="advancement-item item flexrow" data-id={item.id}>
          <div class="item-name flexrow">
            <div
              class="item-image"
              style="background-image: url('{item.icon}')"
            />
            <h4>{item.title}</h4>
          </div>
          {#if $store.advancementEditable || !$store.isEmbedded}
            <div class="flexrow">
              {#if item.classRestriction === 'primary'}
                {localize('DND5E.AdvancementClassRestrictionPrimary')}
              {:else if item.classRestriction === 'secondary'}
                {localize('DND5E.AdvancementClassRestrictionSecondary')}
              {/if}
            </div>
          {/if}
          {#if $store.advancementEditable}
            <div class="item-controls flexrow">
              <a
                class="item-control"
                data-action="edit"
                data-tooltip="DND5E.AdvancementControlEdit"
              >
                <i class="fas fa-edit" />
              </a>
              <a
                class="item-control"
                data-action="delete"
                data-tooltip="DND5E.AdvancementControlDelete"
              >
                <i class="fas fa-trash" />
              </a>
            </div>
          {/if}
          {#if item.summary}
            <div class="item-summary">
              {@html item.summary}
            </div>
          {/if}
        </li>
      {/each}
    </ol>
  {/each}
</ol>
