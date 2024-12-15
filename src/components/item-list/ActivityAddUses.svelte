<script lang="ts">
  import type { Activity5e } from 'src/foundry/dnd5e.types';
  import { settings } from 'src/settings/settings.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    activity: Activity5e;
  }

  let { activity }: Props = $props();

  function onAddUses() {
    let data: Record<string, unknown> = {};
    data['uses.spent'] = 0;
    data['uses.max'] = 1;

    activity.update(data);
  }

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="activity-add-uses item-list-button"
  onclick={() => onAddUses()}
  disabled={!activity.item.isOwner}
  tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
>
  <span class="placeholder">—</span>
  <span class="add-prompt">{localize('DND5E.Add')}</span>
</button>

<style lang="scss">
  .activity-add-uses {
    display: block;
    width: 100%;
    height: 100%;
    text-align: center;
    opacity: 0.5;
    transition: opacity 0.5s ease;
    display: flex;
    justify-content: center;
    align-items: center;

    .add-prompt {
      display: none;
    }

    &:hover {
      opacity: 1;
      color: var(--t5e-secondary-color);

      .add-prompt {
        display: block;
      }

      .placeholder {
        display: none;
      }
    }
  }
</style>
