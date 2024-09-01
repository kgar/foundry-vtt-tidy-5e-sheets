<script lang="ts">
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';
  import ActorName from '../actor/ActorName.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SheetEditModeToggle from '../actor/SheetEditModeToggle.svelte';
  import { settingStore } from 'src/settings/settings';
  import ActorProfile from '../actor/ActorProfile.svelte';
  import ActorMovement from '../actor/ActorMovement.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';

  const context = getContext<Readable<GroupSheetClassicContext>>('context');

  const localize = FoundryAdapter.localize;

  let selectedTabId = $context.tabs[0].id;
</script>

<header class="tidy5e-sheet-header flex-row">
  <div class="flex-0">
    <ActorProfile useHpOverlay={false} size="small" />
  </div>
  <div class="flex-grow-1">
    <div
      class="flex-row justify-content-space-between align-items-center small-gap"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_HEADER_ROW}
    >
      <div
        class="actor-name"
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_CONTAINER}
      >
        <ActorName />
      </div>

      <!-- Any other content adjacent to Actor Name -->
    </div>
    <div
      class="flex-row align-items-center header-line-margin"
      style="margin-top: 0;"
    >
      <span class="flex-1 fs-sm text-body-secondary">{$context.summary}</span>
      {#if $context.unlocked}
        <Select
          document={$context.actor}
          value={$context.system.type.value}
          field="system.type.value"
          blankValue=""
          class="flex-grow-0 flex-shrink-0 flex-basis-max-content"
        >
          <SelectOptions
            data={$context.config.groupTypes}
            blank={localize('DND5E.Group.TypeGeneric')}
          />
        </Select>
      {:else}
        <strong class="text-body-secondary">
          {$context.config.groupTypes[$context.system.type.value] ??
            localize('DND5E.Group.TypeGeneric')}
        </strong>
      {/if}
    </div>
    <HorizontalLineSeparator class="header-line-margin-left" />
    <div class="flex-row header-line-margin">
      <ActorMovement movementLabelKey="DND5E.Movement" />
    </div>
    <HorizontalLineSeparator class="header-line-margin-left" />
  </div>
</header>

<Tabs tabs={$context.tabs} bind:selectedTabId>
  <svelte:fragment slot="tab-end">
    {#if $context.editable}
      <SheetEditModeToggle
        hint={$settingStore.permanentlyUnlockCharacterSheetForGm &&
        FoundryAdapter.userIsGm()
          ? localize(
              'TIDY5E.Settings.PermanentlyUnlockCharacterSheetForGM.title',
            )
          : null}
      />
    {/if}
  </svelte:fragment>
</Tabs>

<section class="tidy-sheet-body">
  <TabContents tabs={$context.tabs} {selectedTabId} />
</section>
