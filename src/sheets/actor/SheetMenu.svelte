<script lang="ts">
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import { getApi } from 'src/api/api';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ThemeSelectorButtonMenuCommand from '../shared/ThemeSelectorButtonMenuCommand.svelte';
  export let defaultSettingsTab: string | undefined = undefined;

  const localize = FoundryAdapter.localize;
  const api = getApi();
</script>

<ButtonMenu
  position="bottom"
  anchor="right"
  ariaLabel={localize('T5EK.SheetMenu.label')}
  title={localize('T5EK.SheetMenu.label')}
  iconClass="fas fa-ellipsis-vertical"
>
  <ThemeSelectorButtonMenuCommand />
  <ButtonMenuDivider />
  <ButtonMenuCommand
    on:click={() => api.openSheetSettings(defaultSettingsTab)}
    iconClass="fas fa-cog"
  >
    {localize('T5EK.Settings.SheetMenu.label')}
  </ButtonMenuCommand>
  <ButtonMenuCommand
    on:click={() => api.openThemeSettings()}
    iconClass="fas fa-palette"
  >
    {localize('T5EK.ThemeSettings.Sheet.title')}
  </ButtonMenuCommand>
</ButtonMenu>