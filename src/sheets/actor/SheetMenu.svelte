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
  export let defaultSettingsTab: string | undefined = undefined;

  const localize = FoundryAdapter.localize;

  let context = getContext<Readable<ActorSheetContext>>('context');
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
    on:click={() => ApplicationsManager.openSheetSettings(defaultSettingsTab)}
    iconClass="fas fa-cog"
  >
    {localize('T5EK.Settings.SheetMenu.label')}
  </ButtonMenuCommand>
  <ButtonMenuCommand
    on:click={() => ApplicationsManager.openThemeSettings()}
    iconClass="fas fa-palette"
  >
    {localize('T5EK.ThemeSettings.Sheet.title')}
  </ButtonMenuCommand>
  {#if $context.owner}
    <ButtonMenuCommand
      on:click={() =>
        new TabSelectionFormApplication($context.actor).render(true)}
      iconClass="fas fa-file-invoice"
      disabled={!$context.editable}
    >
      {localize('T5EK.TabSelection.MenuOptionText')}
    </ButtonMenuCommand>
  {/if}
</ButtonMenu>
