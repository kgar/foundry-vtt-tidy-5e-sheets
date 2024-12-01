<script lang="ts">
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ThemeSelectorButtonMenuCommand from '../shared/ThemeSelectorButtonMenuCommand.svelte';
  import TabSelectionFormApplication from 'src/applications/tab-selection/TabSelectionFormApplication';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { ApplicationsManager } from 'src/applications/ApplicationsManager';
  import { CONSTANTS } from 'src/constants';
  interface Props {
    defaultSettingsTab?: string | undefined;
  }

  let { defaultSettingsTab = undefined }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
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
    onMenuClick={() => ApplicationsManager.openUserSettings(defaultSettingsTab)}
    iconClass="fas fa-cog"
  >
    {localize('TIDY5E.UserSettings.Menu.label')}
  </ButtonMenuCommand>
  <ButtonMenuCommand
    onMenuClick={() => ApplicationsManager.openThemeSettings()}
    iconClass="fas fa-palette"
  >
    {localize('TIDY5E.ThemeSettings.SheetMenu.buttonLabel')}
  </ButtonMenuCommand>
  {#if $context.owner}
    <ButtonMenuCommand
      onMenuClick={() =>
        new TabSelectionFormApplication($context.actor).render(true)}
      iconClass="fas fa-file-invoice"
      disabled={!$context.editable}
    >
      {localize('TIDY5E.TabSelection.MenuOptionText')}
    </ButtonMenuCommand>
  {/if}
</ButtonMenu>
