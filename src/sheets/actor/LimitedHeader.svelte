<script lang="ts">
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { SettingsProvider } from 'src/settings/settings';

  export let rounded: boolean;

  let store = getContext<Readable<VehicleSheetContext>>('store');
</script>

<header>
  <div class="profile">
    <div class="portrait" class:rounded>
      <img src={$store.actor.img} alt={$store.actor.name} data-edit="img" />
    </div>
  </div>
  <h1>{$store.actor.name}</h1>
</header>

<style lang="scss">
  header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 1rem;
    background: var(--t5ek-header-background);

    .profile {
      width: 9.375rem;
      height: 9.375rem;
      flex: 0 0 auto;

      .portrait {
        width: 100%;
        height: 100%;
        border-radius: 0.3125rem;
        overflow: hidden;
        border: 1px solid var(--t5ek-icon-outline);

        &.rounded {
          border-radius: 50%;
        }

        img {
          background: var(--t5ek-icon-background);
        }
      }
    }
  }
</style>
