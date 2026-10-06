<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemName from './parts/header/ItemName.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);

  let itemNameEl: HTMLElement | undefined = $state();
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
    <div>
      <h4>{localize('TYPES.Item.background')}</h4>
      <ul class="pills stacked">
        <li>
          <a
            role="button"
            tabindex="0"
            class="pill interactive centered wrapped copy-to-clipboard"
            data-action="copyValue"
            data-value={context.item.system.identifier}
            {@attach InputAttachments.triggerClickOnKeydown}
          >
            <span class="centered text-normal">
              {localize('DND5E.Identifier')}
            </span>
            <span class="hyphens-auto centered">
              {context.item.system.identifier}
            </span>
          </a>
        </li>
      </ul>
    </div>
  {/snippet}
</Sidebar>

<main class="item-content">
  <div class="sheet-header">
    <div class="identity-info">
      <div
        bind:this={itemNameEl}
        class="item-name-wrapper flex-row extra-small-gap align-items-center"
      >
        <ItemName />
      </div>
    </div>
  </div>

  <!-- Tab Strip -->
  <Tabs
    bind:selectedTabId
    tabs={context.tabs}
    cssClass="item-tabs"
    sheet={context.sheet}
    tabContext={{ context, item: context.item }}
  >
    {#snippet tabEnd()}
      {#if selectedTabId === CONSTANTS.TAB_DESCRIPTION && !context.unlocked}
        <span
          style="margin-inline-start: auto;"
          data-prop="system.description.value"
          data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_DESCRIPTIONS}
          data-description-selector="[data-tab-contents-for='description'] [data-target]"
        >
          <a
            class={[
              'button button-borderless button-icon-only flexshrink',
              'menu',
            ]}
            aria-label={localize('DND5E.AdditionalControls')}
            role="button"
            tabindex="0"
            {@attach InputAttachments.triggerClickOnKeydown}
            data-action="showContextMenu"
            data-target-selector="[data-context-menu]"
          >
            <i class="fa-solid fa-ellipsis-vertical fa-fw"></i>
          </a>
          <a
            class={[
              'button button-borderless button-icon-only flexshrink',
              'copy',
            ]}
            aria-label={localize('TIDY5E.COMMON.Action.CopyToClipboard')}
            data-tooltip=""
            role="button"
            tabindex="0"
            {@attach InputAttachments.triggerClickOnKeydown}
            data-action="copyData"
          >
            <i class="fa-solid fa-copy fa-fw"></i>
          </a>
        </span>
      {/if}
    {/snippet}
  </Tabs>

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
