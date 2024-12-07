<script lang="ts">
  import ButtonMenuItem from 'src/components/button-menu/ButtonMenuItem.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings.svelte';
  import { getCoreThemes } from 'src/theme/theme-reference';

  const themes = Object.entries(getCoreThemes(true));

  const idSuffix = Date.now().toString();

  function setTheme(value: string) {
    FoundryAdapter.setTidySetting('colorScheme', value);
  }

  const localize = FoundryAdapter.localize;
</script>

<ButtonMenuItem cssClass="flex-column extra-small-gap">
  <label class="theme-label" for="sheet-menu-{idSuffix}">
    {localize('TIDY5E.SheetMenu.themeLabel')}
  </label>
  <select
    id="sheet-menu-{idSuffix}"
    onchange={(ev) => setTheme(ev.currentTarget.value)}
    value={$settingStore.colorScheme}
  >
    {#each themes as [key, value]}
      <option value={key}>{localize(value)}</option>
    {/each}
  </select>
</ButtonMenuItem>

<style lang="scss">
  .theme-label {
    font-weight: 600;
    margin-top: -0.5rem;
    font-size: 0.875rem;
  }

  select {
    font-size: 0.875rem;
  }
</style>
