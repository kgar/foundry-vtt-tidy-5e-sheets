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
  />

  <hr class="golden-fade" />

  <!-- Tab Contents -->
  <TabContents tabs={context.tabs} {selectedTabId} />
</main>
