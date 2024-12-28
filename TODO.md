DRAFT
```
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { CustomContent, Tab } from 'src/types/types';
import { delay } from 'src/utils/asynchrony';
import {
  getCustomContentGroupIdSelector,
  wrapCustomHtmlForRendering,
} from 'src/utils/content';
import { isNil } from 'src/utils/data';
import { processInputChangeDelta } from 'src/utils/form';
import { debug, error, warn } from 'src/utils/logging';

type CustomContentRenderParams = {
  app: any;
  element: any; // jQuery
  data: any;
  tabs: Tab[];
  isFullRender: boolean;
  superActivateListeners: any;
  customContent: CustomContent[];
};

export class CustomContentRenderer {
  static async render(params: CustomContentRenderParams) {
    const {
      app,
      tabs,
      element,
      data,
      isFullRender,
      superActivateListeners,
      customContent,
    } = params;

    const htmlElement = FoundryAdapter.getElementFromAppV1OrV2(element);
    if (!htmlElement) {
      debug('Element not available when it normally should be', params);
      return;
    }

    htmlElement
      .querySelectorAll<HTMLElement>(
        CONSTANTS.HTML_DYNAMIC_RENDERING_ATTRIBUTE_SELECTOR
      )
      .forEach((el: HTMLElement) => el.remove());

    const sheetEl = htmlElement;
    await CustomContentRenderer._renderTabs(
      tabs,
      sheetEl,
      isFullRender,
      app,
      data,
      params
    );

    for (let c of customContent) {
      try {
        CustomContentRenderer._renderContent(
          sheetEl,
          c,
          app,
          data,
          isFullRender,
          superActivateListeners
        );
      } catch (e) {
        error('Unable to render custom content', false, e);
        debug('Custom content render failure context', {
          content: c,
          app,
          data,
          isFullRender,
        });
      }
    }
  }

  private static _renderTabs(
    tabs: Tab[],
    sheetEl: HTMLElement,
    isFullRender: boolean,
    app: any,
    data: any,
    args: CustomContentRenderParams
  ): Promise<unknown> {
    const promises = tabs.map(async (tab) => {
      try {
        let tabEl = sheetEl.querySelector<HTMLElement>(
          `[data-tab-contents-for="${tab.id}"]`
        );

        if (!tabEl) {
          // This content was added during a non-forced render (e.g., tab selection changes); wait a tick and re-attempt to set its HTML
          await delay(0);
          tabEl = sheetEl.querySelector<HTMLElement>(
            `[data-tab-contents-for="${tab.id}"]`
          );
        }

        if (!tabEl) {
          debug('Unable to find custom tab content container for render');
          return;
        }

        if (
          tab.content.type === 'html' &&
          (isFullRender || tab.content.renderScheme === 'handlebars')
        ) {
          tabEl.innerHTML = tab.content.html;
        }

        if (tab.onRender) {
          tab.onRender({
            app: app,
            data: data,
            element: sheetEl,
            tabContentsElement: tabEl,
            isFullRender: isFullRender,
          });
        }
      } catch (e) {
        error('Failed to render custom content due to an error', false, e);
        debug('Custom content error debug details', {
          error: e,
          erroredTab: tab,
          args: args,
        });
      }
    });
    return Promise.all(promises);
  }

  private static _renderContent(
    sheetEl: any,
    customContent: CustomContent,
    app: any,
    data: any,
    isFullRender: boolean,
    superActivateListeners: any
  ) {
    const groupId = foundry.utils.randomID();

    let contentHtml = '';
    try {
      contentHtml =
        typeof customContent.content.html === 'function'
          ? customContent.content.html(data)
          : customContent.content.html;
    } catch (e) {
      error('Failed to render custom HTML', false, { e, customContent });
    }

    const wrappedContent = wrapCustomHtmlForRendering(
      contentHtml,
      customContent.content.renderScheme,
      groupId,
      customContent.activateDefaultSheetListeners
    );

    if (customContent.onContentReady) {
      customContent.onContentReady({
        app: app,
        data: data,
        element: sheetEl,
        isFullRender: isFullRender,
        content: wrappedContent,
      });
    }

    if (!isNil(customContent.position)) {
      const targetElements = Array.from(
        sheetEl.querySelectorAll(customContent.selector)
      ) as HTMLElement[];

      if (!targetElements.length) {
        debug('No target elements were found for injecting custom content', {
          content: customContent,
        });
      }

      targetElements.forEach((el: HTMLElement) => {
        el.insertAdjacentHTML(
          customContent.position as InsertPosition,
          wrappedContent
        );
      });

      if (customContent.activateDefaultSheetListeners) {
        const groupSelector = getCustomContentGroupIdSelector(groupId);
        sheetEl
          .querySelectorAll(groupSelector)
          .forEach((el: HTMLElement) => superActivateListeners(el));
      }
    }

    if (customContent.onRender) {
      customContent.onRender({
        app: app,
        data: data,
        element: sheetEl,
        isFullRender: isFullRender,
      });
    }
  }

  static wireCompatibilityEventListeners(
    html: any,
    superActivateListeners: any,
    sheet: any
  ) {
    html
      .find('input[name], textarea[name], select[name]')
      .off('change.compatiblity-event-listeners')
      .on('change.compatiblity-event-listeners', function () {
        //@ts-expect-error
        if (!this.closest(CONSTANTS.CLASS_SELECTOR_TIDY_USE_CORE_LISTENERS)) {
          sheet.submit();
        }
      });

    html
      .find(CONSTANTS.CLASS_SELECTOR_TIDY_USE_CORE_LISTENERS)
      .each((_: number, el: HTMLElement) => {
        superActivateListeners.call(sheet, globalThis.$(el));
      });

    html
      .find('input[data-name], textarea[data-name], select[data-name]')
      .off('change.embedded-doc-compatiblity-event-listeners')
      .on('change.embedded-doc-compatiblity-event-listeners', function (event: any) {
        // TODO: is jquery giving me the raw event?
        _submitEmbeddedDocumentChange(event);
      });
  }
}

async function _submitEmbeddedDocumentChange(
  event: InputEvent & { target: HTMLInputElement }
) {
  const itemId =
    event.target.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
  if (itemId) {
    await _submitEmbeddedItemChange(event, itemId);
  }
}

async function _submitEmbeddedItemChange(
  event: InputEvent & { target: HTMLInputElement },
  itemId: string
) {
  event.stopImmediatePropagation();

  const item = await getItem(document, itemId);
  const field = event.target.getAttribute('data-name')!;

  let valueToSave: string | number = event.target.value;

  // For deltas, parse the resulting delta value
  if (event.target.matches('[inputmode="numeric"]')) {
    valueToSave = processInputChangeDelta(
      event.target.value,
      item,
      field
    )?.toString();
  }

  // For numeric changes, enforce min/max on the value to save
  if (event.target.matches('[inputmode="numeric"], [type="number"]')) {
    const minAttribute = event.target.getAttribute('min');
    const min = !isNil(minAttribute, '') ? Number(minAttribute) : -Infinity;

    const maxAttribute = event.target.getAttribute('max');
    const max = !isNil(maxAttribute, '') ? Number(maxAttribute) : Infinity;

    const valueAsNumber = Number(valueToSave);
    valueToSave = Math.clamp(valueAsNumber, min, max);

    if (item && !Number.isNaN(valueToSave)) {
      event.target.value = valueToSave?.toString();
    }
  }

  // Save the value to the document, whatever that value ultimately became
  item.update({ [field]: valueToSave });
}

async function getItem(document: any, id: string) {
  if (document.type === 'container')
    return document.system.getContainedItem(id);
  return document.items.get(id);
}

```

test:
```
<script lang="ts">
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type { Actor5e, InventorySection } from 'src/types/types';
  import ItemDeleteControl from 'src/components/item-list/controls/ItemDeleteControl.svelte';
  import ItemEditControl from 'src/components/item-list/controls/ItemEditControl.svelte';
  import ItemTableRowV2 from 'src/components/item-list/v2/ItemTableRowV2.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
  import ItemUseButton from 'src/components/item-list/ItemUseButton.svelte';
  import ItemName from 'src/components/item-list/ItemName.svelte';
  import InlineFavoriteIcon from 'src/components/item-list/InlineFavoriteIcon.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { getContext, type Component } from 'svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import InlineContainerView from './InlineContainerView.svelte';
  import InlineActivitiesList from 'src/components/item-list/InlineActivitiesList.svelte';
  import ItemUses from 'src/components/item-list/ItemUses.svelte';
  import ItemAddUses from 'src/components/item-list/ItemAddUses.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';

  interface Props {
    contents: InventorySection[];
    container: Item5e;
    editable: boolean;
    itemContext: Record<string, ContainerItemContext>;
    inlineToggleService: InlineToggleService;
    lockItemQuantity: boolean;
    /** The sheet which is rendering this recursive set of container contents. */
    sheetDocument: Actor5e | Item5e;
    unlocked?: boolean;
  }

  let {
    contents,
    container,
    editable,
    itemContext,
    inlineToggleService,
    lockItemQuantity,
    sheetDocument,
    unlocked = true,
  }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let configuredContents = $derived(
    SheetSections.configureInventory(
      contents.filter((i) => i.items.length),
      tabId,
      SheetPreferencesService.getByType(sheetDocument.type),
      TidyFlags.sectionConfig.get(container)?.[
        CONSTANTS.TAB_CONTAINER_CONTENTS
      ],
    ),
  );

  const searchResults = getSearchResultsContext();

  let classicControls: {
    component: Component<any>;
    getProps: (item: Item5e) => any;
  }[] = $derived.by(() => {
    let result: {
      component: Component<any>;
      getProps: (item: Item5e) => any;
    }[] = [];

    result.push({
      component: ItemEditControl,
      getProps: (item: Item5e) => ({ item }),
    });

    if (unlocked) {
      result.push({
        component: ItemDeleteControl,
        getProps: (item: Item5e) => ({
          item,
          deleteFn: () => item.deleteDialog(),
        }),
      });
    }

    return result;
  });

  const weightUnit = FoundryAdapter.getWeightUnit();

  const classicControlWidthRems = 1.5;

  let useClassicControls = $derived(
    FoundryAdapter.useClassicControls(container),
  );

  let classicControlsWidth = $derived(
    useClassicControls
      ? `/* Controls */ ${classicControlWidthRems * classicControls.length}rem`
      : '',
  );

  let gridTemplateColumns = $derived(
    `/* Name */ 1fr /* Uses */ 3.125rem /* Weight */ 3rem /* Quantity */ 3rem ${classicControlsWidth}`,
  );

  const localize = FoundryAdapter.localize;
</script>

{#each configuredContents as section (section.key)}
  {#if section.show}
    {@const itemEntries = section.items.map((item) => ({
      item,
      ctx: itemContext[item.id],
    }))}

    <section class="container-contents-list-section">
      <TidyTable
        key={section.key}
        data-custom-section={section.custom ? true : null}
        {gridTemplateColumns}
      >
        {#snippet header()}
          <TidyTableHeaderRow>
            <TidyTableHeaderCell primary={true}>
              {localize(section.label)} ({itemEntries.length})
            </TidyTableHeaderCell>
            <TidyTableHeaderCell title={localize('DND5E.Charges')}>
              <i class="fas fa-bolt"></i>
            </TidyTableHeaderCell>
            <TidyTableHeaderCell>
              {localize('DND5E.Weight')}
            </TidyTableHeaderCell>
            <TidyTableHeaderCell>
              {localize('DND5E.QuantityAbbr')}
            </TidyTableHeaderCell>
            {#if editable && useClassicControls}
              <TidyTableHeaderCell></TidyTableHeaderCell>
            {/if}
          </TidyTableHeaderRow>
        {/snippet}
        {#snippet body()}
          {#each itemEntries as { item, ctx } (item.id)}
            {@const weight = ctx?.totalWeight ?? item.system.weight.value}

            <ItemTableRowV2
              {item}
              hidden={!searchResults.show(item.uuid)}
              rowClass={FoundryAdapter.getInventoryRowClasses(
                item,
                itemContext[item.id]?.attunement,
              )}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                uuid: item.uuid,
              }}
              draggable={editable}
            >
              {#snippet children({ toggleSummary })}
                <TidyTableCell class="flex-row extra-small-gap" primary={true}>
                  <ItemUseButton
                    disabled={!FoundryAdapter.canUseItem(item)}
                    {item}
                  />
                  {#if ('containerContents' in ctx && !!ctx.containerContents) || (ctx.activities?.length ?? 0) > 1}
                    <InlineToggleControl
                      entityId={item.id}
                      {inlineToggleService}
                    />
                  {/if}
                  <!-- This is generally what we want in Tidy Tables / Item Table V2; consider breaking off ItemNameV2 to propagate and replace the old ItemName gradually. -->
                  <ItemName
                    onToggle={() => toggleSummary()}
                    cssClass="align-self-stretch flex-row align-items-center"
                    {item}
                  >
                    <span
                      class="truncate flex-1"
                      data-tidy-item-name={item.name}
                      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                      >{item.name}</span
                    >
                  </ItemName>

                  <input type="text" data-name="name" value={item.name} />

                  <input
                    type="text"
                    inputmode="numeric"
                    data-name="system.quantity"
                    value={item.system.quantity}
                  />

                  <input
                    type="number"
                    data-name="system.quantity"
                    value={item.system.quantity}
                  />

                  {#if !FoundryAdapter.concealDetails(item)}
                    {@const attunementContext =
                      FoundryAdapter.getAttunementContext(item)}

                    {#if attunementContext}
                      <i
                        style="margin-left: auto; align-self: center;"
                        class="item-state-icon fas {attunementContext.icon} {attunementContext.cls} fa-fw"
                        title={localize(attunementContext.title)}
                      ></i>
                    {/if}
                  {/if}
                  {#if !!ctx.favoriteId}
                    <InlineFavoriteIcon />
                  {/if}
                </TidyTableCell>
                <TidyTableCell>
                  {#if item.hasLimitedUses}
                    <ItemUses {item} />
                  {:else}
                    <ItemAddUses {item} />
                  {/if}
                </TidyTableCell>
                <TidyTableCell
                  title={localize('TIDY5E.Inventory.Weight.Text', {
                    weight: weight,
                    weightUnit: weightUnit,
                  })}
                >
                  <span class="truncate">
                    {weight}
                  </span>
                </TidyTableCell>
                <TidyTableCell>
                  <!-- Qty -->
                  <TextInput
                    document={item}
                    field="system.quantity"
                    value={item.system.quantity}
                    selectOnFocus={true}
                    disabled={!editable || lockItemQuantity}
                    placeholder="0"
                    allowDeltaChanges={true}
                  />
                </TidyTableCell>
                {#if editable && useClassicControls}
                  <TidyTableCell>
                    {#each classicControls as control}
                      <control.component
                        {...control.getProps(item)}
                        class="tidy-table-control"
                      ></control.component>
                    {/each}
                  </TidyTableCell>
                {/if}
              {/snippet}
            </ItemTableRowV2>
            {#if 'containerContents' in ctx && !!ctx.containerContents}
              <InlineContainerView
                container={item}
                containerContents={ctx.containerContents}
                {editable}
                {inlineToggleService}
                {lockItemQuantity}
                {sheetDocument}
                {unlocked}
              />
            {:else if (ctx.activities?.length ?? 0) > 1}
              <InlineActivitiesList
                {item}
                activities={ctx.activities}
                {inlineToggleService}
              />
            {/if}
          {/each}
        {/snippet}
      </TidyTable>
    </section>
  {/if}
{/each}

```