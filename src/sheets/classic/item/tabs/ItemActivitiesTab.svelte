<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { Activities } from 'src/features/activities/activities';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;

  function handleDragStart(event: DragEvent, activityId: string) {
    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const activity = context.item.system.activities?.get(activityId);

    event.dataTransfer?.setData(
      'text/plain',
      JSON.stringify(activity.toDragData()),
    );
  }
</script>

<section class="flex-1 flex-column extra-small-gap">
  <header class="header">
    {#if context.editable}
      <button
        type="button"
        class="add-activity-button w-100"
        onclick={() => context.sheet.addActivity()}
        tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
      >
        <i class="fas fa-plus"></i>
        {localize('DND5E.Add')}
      </button>
    {/if}
  </header>
  <div class="scroll-container activities">
    {#each context.activities as activity (activity.id)}
      <div
        class="activity card"
        data-tidy-always-draggable
        data-activity-id={activity.id}
        data-configurable={Activities.isConfigurable(activity)}
        data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES}
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
            context.system.activities?.get(activity.id).sheet.render(true)}
          disabled={!context.editable}
          tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
        >
          {activity.name}
        </button>
        {#if context.editable}
          <button
            type="button"
            class="inline-icon-button"
            title={localize('DND5E.ACTIVITY.Action.Delete')}
            onclick={() =>
              context.system.activities?.get(activity.id)?.deleteDialog()}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
          >
            <i class="fas fa-trash"></i>
          </button>
        {/if}
      </div>
    {/each}
  </div>
</section>

<style lang="less">
  .add-activity-button {
    background: var(--t5e-faintest-color);
    height: 1.5rem;
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
