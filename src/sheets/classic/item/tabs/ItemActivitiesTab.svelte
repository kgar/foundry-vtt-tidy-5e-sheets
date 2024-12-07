<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { settingStore } from 'src/settings/settings';
  import { Activities } from 'src/features/activities/activities';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let appId = $derived($context.document.id);

  const localize = FoundryAdapter.localize;

  function handleDragStart(ev: DragEvent, activityId: string) {
    const activity = $context.item.system.activities?.get(activityId);

    ev.dataTransfer?.setData(
      'text/plain',
      JSON.stringify(activity.toDragData()),
    );
  }
</script>

<section class="flex-1 flex-column extra-small-gap">
  <header class="header">
    {#if $context.editable}
      <button
        type="button"
        class="add-activity-button"
        onclick={() => $context.item.sheet.addActivity()}
        tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      >
        <i class="fas fa-plus"></i>
        {localize('DND5E.Add')}
      </button>
    {/if}
  </header>
  <div class="scroll-container activities">
    {#each $context.activities as activity (activity.id)}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="activity card"
        data-activity-id={activity.id}
        data-configurable={Activities.isConfigurable(activity)}
        draggable="true"
        ondragstart={(ev) => handleDragStart(ev, activity.id)}
        data-info-card="activity"
        data-info-card-entity-uuid={activity.uuid}
      >
        <div class="icon" class:svg={activity.img.svg}>
          {#if activity.img.svg}
            <Dnd5eIcon src={activity.img.src} />
          {:else}
            <img
              src={activity.img.src}
              class="activity-icon"
              alt={activity.name}
            />
          {/if}
        </div>
        <button
          type="button"
          class="transparent-button highlight-on-hover name"
          onclick={() =>
            $context.system.activities?.get(activity.id).sheet.render(true)}
          disabled={!$context.editable}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          {activity.name}
        </button>
        {#if $context.editable}
          <button
            type="button"
            class="inline-icon-button"
            title={localize('DND5E.ACTIVITY.Action.Delete')}
            onclick={() =>
              $context.system.activities?.get(activity.id)?.deleteDialog()}
            tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
          >
            <i class="fas fa-trash"></i>
          </button>
        {/if}
      </div>
    {/each}
  </div>
</section>

<style lang="scss">
  .add-activity-button {
    background: var(--t5e-faintest-color);
  }

  .card {
    border: 0.0625rem solid var(--t5e-separator-color);
    border-radius: 0.25rem;
  }

  .activities {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.625rem;
  }

  .activity {
    padding: 0.375rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    box-shadow: 0 0 6px var(--dnd5e-shadow-15);

    & > .icon {
      --icon-size: 1.5rem;
      --icon-fill: var(--t5e-primary-font-color);
      flex: 0 0 50px;
      height: 1.5rem;

      .activity-icon {
        width: var(--icon-size);
        height: var(--icon-fill);
        object-fit: cover;
      }
    }

    .name {
      flex: 1;
      text-align: center;
    }
  }
</style>
