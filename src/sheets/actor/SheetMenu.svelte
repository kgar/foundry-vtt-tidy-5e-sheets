<script lang="ts">
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import { getApi } from 'src/api/api';
  import ButtonMenuItem from 'src/components/button-menu/ButtonMenuItem.svelte';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCoreThemes } from 'src/theme/theme-reference';

  export let defaultSettingsTab: string | undefined = undefined;

  const sheetMenuIdSuffix = Date.now().toString();
  const localize = FoundryAdapter.localize;
  const api = getApi();

  const themes = Object.entries(getCoreThemes(true));

  function setTheme(value: string) {
    FoundryAdapter.setGameSetting('colorScheme', value);
  }
</script>

<ButtonMenu
  position="bottom"
  anchor="right"
  ariaLabel={localize('T5EK.Settings.SheetMenu.label')}
  title={localize('T5EK.Settings.SheetMenu.label')}
  iconClass="fas fa-ellipsis-vertical"
>
  <ButtonMenuItem cssClass="flex-column extra-small-gap">
    <label for="sheet-menu-{sheetMenuIdSuffix}" />
    <select
      id="sheet-menu-{sheetMenuIdSuffix}"
      on:change={(ev) => setTheme(ev.currentTarget.value)}
    >
      {#each themes as [key, value]}
        <option value={key}>{localize(value)}</option>
      {/each}
    </select>
  </ButtonMenuItem>
  <ButtonMenuDivider />
  <ButtonMenuCommand on:click={() => api.openSheetSettings(defaultSettingsTab)}>
    <i class="fas fa-cog" />
    {localize('T5EK.Settings.SheetMenu.label')}
  </ButtonMenuCommand>
  <ButtonMenuCommand on:click={() => api.openThemeSettings()}>
    <i class="fas fa-palette" />
    {localize('T5EK.ThemeSettings.Sheet.title')}
  </ButtonMenuCommand>
</ButtonMenu>
