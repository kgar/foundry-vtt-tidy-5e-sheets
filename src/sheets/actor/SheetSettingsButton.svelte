<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { Tidy5eKgarSettingsSheet } from '../settings/Tidy5eKgarSettingsSheet';

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class="sheet-settings-btn"
  title={localize('T5EK.Settings.SheetMenu.label')}
  on:click={() => new Tidy5eKgarSettingsSheet({}, undefined).render(true)}
  ><i class="fas fa-cog" /></button
>

<style lang="scss">
  button.sheet-settings-btn {
    & {
      line-height: initial;
      padding: 0.125rem 0.25rem;
      border-radius: 0.1875rem;
      color: var(--t5ek-secondary-color);
      border: none;
      text-align: center;
      background: var(--t5ek-faint-color);

      &:hover {
        color: var(--t5ek-primary-color);
      }
    }

    i {
      margin: 0;
    }
  }
</style>
