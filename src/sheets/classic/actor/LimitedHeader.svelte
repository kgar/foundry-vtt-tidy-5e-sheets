<script lang="ts">
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    rounded: boolean;
  }

  let { rounded }: Props = $props();

  let context = $derived(getVehicleSheetContext());
</script>

<header>
  <div class="profile">
    <div class="portrait" class:rounded>
      <img src={context.actor.img} alt={context.actor.name} data-path="img" />
    </div>
  </div>
  <h1>{context.actor.name}</h1>
</header>

<style lang="scss">
  header {
    --t5e-portrait-size: 9.375rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 1rem;
    background: var(--t5e-header-background);

    .profile {
      flex: 0 0 auto;

      .portrait {
        width: 100%;
        height: 100%;
        border-radius: 0.3125rem;
        overflow: hidden;
        border: 0.0625rem solid var(--t5e-icon-outline-color);

        &.rounded {
          border-radius: 50%;
        }

        img {
          background: var(--t5e-icon-background);
        }
      }
    }
  }
</style>
