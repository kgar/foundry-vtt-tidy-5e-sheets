<script lang="ts">
  import ButtonMenu from 'src/components/button-menu/ButtonMenu.svelte';
  import ButtonMenuCommand from 'src/components/button-menu/ButtonMenuCommand.svelte';
  import ButtonMenuDivider from 'src/components/button-menu/ButtonMenuDivider.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ThemeSelectorButtonMenuCommand from '../shared/ThemeSelectorButtonMenuCommand.svelte';
  import TabSelectionFormApplication from 'src/applications/tab-selection/TabSelectionFormApplication.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { ApplicationsManager } from 'src/applications/ApplicationsManager';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    defaultSettingsTab?: string | undefined;
  }

  let { defaultSettingsTab = undefined }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = $derived(getSheetContext<ActorSheetContextV1>());
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
  {#if context.owner}
    <ButtonMenuCommand
      onMenuClick={() =>
        new TabSelectionFormApplication(context.actor).render(true)}
      iconClass="fas fa-file-invoice"
      disabled={!context.editable}
    >
      {localize('TIDY5E.TabSelection.MenuOptionText')}
    </ButtonMenuCommand>
  {/if}
  {#if context.isCharacter || context.isNPC}
    <ButtonMenuCommand
      onMenuClick={() =>
        new dnd5e.applications.actor.ActorSheetFlags(context.actor).render(
          true,
        )}
      iconClass="fa-solid fa-star"
      disabled={!context.editable}
    >
      {localize('DND5E.SpecialTraits')}
    </ButtonMenuCommand>
  {/if}
</ButtonMenu>
