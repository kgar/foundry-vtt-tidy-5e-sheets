<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import InventoryTables from '../../shared/InventoryTables.svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getContext, type Component } from 'svelte';
  import type { ContainerContents, Item5e } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import type { MessageBus } from 'src/types/types';
  import { Tidy5eContainerSheetQuadrone } from '../../Tidy5eContainerSheetQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/api';

  interface Props {
    container: Item5e;
    containerContents: ContainerContents;
    editable: boolean;
    inlineToggleService: InlineToggleService;
    searchCriteria: string;
    sheetDocument: any;
  }

  let {
    container,
    containerContents,
    editable,
    inlineToggleService,
    searchCriteria,
    sheetDocument,
  }: Props = $props();

  let currencies = $derived(containerContents.currencies);

  let toggleServiceMap = $derived(inlineToggleService.map);

  const searchResults = getSearchResultsContext();

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let messageBus = getContext<MessageBus>(CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS);

  async function onDrop(
    event: DragEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    const sheet = new Tidy5eContainerSheetQuadrone({ document: container });

    sheet._onDrop(
      event as DragEvent & {
        currentTarget: EventTarget & HTMLElement;
        target: HTMLElement;
      },
    );

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  $effect(() => {
    if (
      messageBus?.message?.tabId === tabId &&
      messageBus?.message?.message === CONSTANTS.MESSAGE_BUS_EXPAND_ALL &&
      messageBus?.message?.options?.includeInlineToggles
    ) {
      inlineToggleService.toggle(tabId, container.id, true);
    }
    if (
      messageBus?.message?.tabId === tabId &&
      messageBus?.message?.message === CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL &&
      messageBus?.message?.options?.includeInlineToggles
    ) {
      inlineToggleService.toggle(tabId, container.id, false);
    }
  });

  let inventory = $derived(
    SheetSections.configureInventory(
      containerContents.contents,
      tabId,
      UserSheetPreferencesService.getByType(sheetDocument.type),
      TidyFlags.sectionConfig.get(container)?.[tabId],
    ),
  );

  // Check if container has any currency to transfer
  let hasCurrency = $derived(currencies.some((c) => c.value > 0));

  // Transfer all currency from container to parent actor
  async function transferCurrencyToParent() {
    if (!sheetDocument || !hasCurrency) return;

    const currencyKeys = Object.keys(CONFIG.DND5E.currencies);

    // Build update objects for both documents
    const containerUpdate: Record<string, number> = {};
    const actorUpdate: Record<string, number> = {};

    for (const key of currencyKeys) {
      const containerValue = container.system.currency[key] ?? 0;
      const actorValue = sheetDocument.system.currency[key] ?? 0;

      if (containerValue > 0) {
        containerUpdate[`system.currency.${key}`] = 0;
        actorUpdate[`system.currency.${key}`] = actorValue + containerValue;
      }
    }

    // Update both documents
    await Promise.all([
      container.update(containerUpdate),
      sheetDocument.update(actorUpdate),
    ]);
  }
</script>

<ExpandableContainer
  expanded={toggleServiceMap.get(tabId)?.has(container.id) === true}
  class={!searchResults.show(container.uuid) ? 'hidden' : ''}
  deferRendering
>
  <div class="inline-content-view full-height">
    <div
      class="flex-column extra-small-gap flex-1 inline-container-view"
      data-tidy-container-id={container.id}
      ondrop={onDrop}
    >
      <InventoryTables
        sections={inventory}
        {container}
        {editable}
        itemContext={containerContents.itemContext}
        {inlineToggleService}
        {searchCriteria}
        {sheetDocument}
      />
      {#if !containerContents.contents.some((c) => c.items.length > 0)}
        <div class="empty-container">
          <span class="empty-container-text"
            >{FoundryAdapter.localize('TIDY5E.EmptyContainer')}</span
          >
        </div>
      {/if}
    </div>

    <div
      class="currency-container flexrow flex1 extra-small-gap align-items-center"
    >
      {#each currencies as currency (currency.key)}
        <label class="input-group">
          <i class="currency {currency.key}" aria-label={currency.key}></i>
          <TextInputQuadrone
            document={container}
            field="system.currency.{currency.key}"
            id="{container.id}-system.currency.{currency.key}"
            value={currency.value}
            enableDeltaChanges={true}
            selectOnFocus={true}
            disabled={!editable}
            class="currency-item uninput currency-{currency.key}"
            placeholder="0"
          />
          <span class="denomination {currency.key}" data-denom={currency.key}>
            {currency.abbr}
          </span>
        </label>
      {/each}
      {#if editable && hasCurrency}
        <a
          role="button"
          tabindex="0"
          class="button button-secondary transfer-currency flexshrink"
          onclick={transferCurrencyToParent}
          title={FoundryAdapter.localize(
            'DND5E.CurrencyManager.Transfer.Label',
          )}
          data-tooltip={FoundryAdapter.localize(
            'TIDY5E.Containers.TransferCurrencyToParent.Tooltip',
          )}
        >
          <i class="fas fa-person-arrow-up-from-line"></i>
          {FoundryAdapter.localize('DND5E.CurrencyManager.Transfer.Label')}
        </a>
      {/if}
    </div>
  </div>
</ExpandableContainer>
