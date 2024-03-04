<script lang="ts">
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ThemeSelectorButtonMenuCommand from '../shared/ThemeSelectorButtonMenuCommand.svelte';
  import TabSelectionFormApplication from 'src/applications/tab-selection/TabSelectionFormApplication';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContext } from 'src/types/types';
  import { ApplicationsManager } from 'src/applications/ApplicationsManager';
  import { settingStore } from 'src/settings/settings';
  import SheetMigrationsFormApplication from 'src/applications/sheet-migrations/SheetMigrationsFormApplication';
  import { CONSTANTS } from 'src/constants';
  export let defaultSettingsTab: string | undefined = undefined;

  const localize = FoundryAdapter.localize;

  let context = getContext<Readable<ActorSheetContext>>('context');

  $: showSheetMigrationsOption =
    (FoundryAdapter.userIsGm() &&
      $settingStore.showSheetMigrationsMenu ===
        CONSTANTS.SHEET_SETTINGS_OPTION_GM_ONLY) ||
    ($context.owner &&
      $settingStore.showSheetMigrationsMenu ===
        CONSTANTS.SHEET_SETTINGS_OPTION_GM_AND_OWNERS);
</script>

<ButtonMenu
  position="bottom"
  anchor="right"
  ariaLabel={localize('TIDY5E.SheetMenu.label')}
  title={localize('TIDY5E.SheetMenu.label')}
  iconClass="fas fa-ellipsis-vertical"
>
  <ThemeSelectorButtonMenuCommand />
  <ButtonMenuDivider />
  <ButtonMenuCommand
    on:click={() => ApplicationsManager.openUserSettings(defaultSettingsTab)}
    iconClass="fas fa-cog"
  >
    {localize('TIDY5E.UserSettings.Menu.label')}
  </ButtonMenuCommand>
  <ButtonMenuCommand
    on:click={() => ApplicationsManager.openThemeSettings()}
    iconClass="fas fa-palette"
  >
    {localize('TIDY5E.ThemeSettings.SheetMenu.buttonLabel')}
  </ButtonMenuCommand>
  {#if $context.owner}
    <ButtonMenuCommand
      on:click={() =>
        new TabSelectionFormApplication($context.actor).render(true)}
      iconClass="fas fa-file-invoice"
      disabled={!$context.editable}
    >
      {localize('TIDY5E.TabSelection.MenuOptionText')}
    </ButtonMenuCommand>
  {/if}
  {#if showSheetMigrationsOption}
    <ButtonMenuCommand
      on:click={() =>
        new SheetMigrationsFormApplication($context.actor).render(true)}
      iconClass="fa-solid fa-right-left"
    >
      {localize('TIDY5E.SheetMigrations.MenuOptionText')}
    </ButtonMenuCommand>
  {/if}
</ButtonMenu>
