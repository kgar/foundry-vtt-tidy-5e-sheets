<script lang="ts">
  import SkillsList from 'src/components/attributes/SkillsList.svelte';
  import Traits from '../actor/Traits.svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { NpcSheetContext } from 'src/types/types';
  import Currency from '../actor/Currency.svelte';
  import ItemTableHeaderRow from 'src/components/items/ItemTableHeaderRow.svelte';
  import ItemTable from 'src/components/items/ItemTable.svelte';
  import ItemTableColumn from 'src/components/items/ItemTableColumn.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemTableRow from 'src/components/items/ItemTableRow.svelte';
  import ItemTableCell from 'src/components/items/ItemTableCell.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemUseButton from 'src/components/items/ItemUseButton.svelte';
  import ItemName from 'src/components/items/ItemName.svelte';
  import ListItemQuantity from '../actor/ListItemQuantity.svelte';

  let store = getContext<Readable<NpcSheetContext>>('store');

  let attacksSection: any,
    actionsSection: any,
    featuresSection: any,
    inventorySection: any;

  $: {
    for (let section of $store.features) {
      switch (section.dataset?.type) {
        case 'weapon':
          attacksSection = section;
          break;
        case 'feat':
          if (section.dataset['activation.type'] === 'action') {
            actionsSection = section;
          } else {
            featuresSection = section;
          }
          break;
        case 'loot':
          inventorySection = section;
          break;
      }
    }
  }

  const localize = FoundryAdapter.localize;
</script>

<section class="npc-abilities-content">
  <div class="side-panel">
    <SkillsList
      actor={$store.actor}
      toggleable={!SettingsProvider.settings.skillsAlwaysShownNpc.get()}
    />
    <Traits
      toggleable={!SettingsProvider.settings.traitsAlwaysShownNpc.get()}
    />
  </div>
  <div class="main-panel">
    {#each $store.features as section}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {localize(section.label)}
          </ItemTableColumn>
          {#if section.hasActions}
            <ItemTableColumn baseWidth="3.125rem">
              {localize('DND5E.Uses')}
            </ItemTableColumn>
            <ItemTableColumn baseWidth="7.5rem">
              {localize('DND5E.Usage')}
            </ItemTableColumn>
          {/if}
          <ItemTableColumn baseWidth="7.5rem" />
        </ItemTableHeaderRow>
        {#each section.items as item}
          {@const ctx = $store.itemContext}
          <ItemTableRow
            let:toggleSummary
            on:mousedown={(event) =>
              FoundryAdapter.editOnMiddleClick(event.detail, item)}
            contextMenu={{
              type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
              id: item.id,
            }}
            {item}
            cssClass={FoundryAdapter.getInventoryRowClasses(item, ctx)}
          >
            <ItemTableCell primary={true}>
              <ItemUseButton {item} />
              <ItemName
                on:click={(event) => toggleSummary(event.detail, $store.actor)}
                cssClass="extra-small-gap"
              >
                <span class="truncate">{item.name}</span>
                <ListItemQuantity {item} {ctx} />
              </ItemName>
            </ItemTableCell>
            {#if section.hasActions}
              {#if item.hasUses}
                <ItemTableCell baseWidth="3.125rem">
                  {#if ctx?.isOnCooldown}
                    <a
                      title={item.labels.recharge}
                      role="button"
                      tabindex="0"
                      on:click={() => item.rollRecharge()}
                    >
                      <i class="fas fa-dice-six" />
                      {item.system.recharge
                        .value}{#if item.system.recharge.value !== 6}+{/if}</a
                    >
                  {:else if item.system.recharge.value}
                    <i class="fas fa-bolt" title={localize('DND5E.Charged')} />
                  {:else if ctx?.hasUses}
                    <ItemUses {item} />
                  {:else}
                    <ItemAddUses {item} />
                  {/if}
                </ItemTableCell>
              {/if}
              <ItemTableCell baseWidth="7.5rem">
                <!-- Usage -->
              </ItemTableCell>
            {/if}
            <ItemTableCell baseWidth="7.5rem">
              <!-- Controles -->
            </ItemTableCell>
          </ItemTableRow>
        {/each}
      </ItemTable>
    {/each}
  </div>
</section>
<footer>
  <Currency actor={$store.actor} />
</footer>

<style lang="scss">
  .npc-abilities-content {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    overflow-y: scroll;

    > .side-panel {
      flex: 0 0 13.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    > .main-panel {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
      padding: 0;
      height: auto;
      overflow-x: auto;
    }
  }

  footer {
    background-color: var(--t5e-header-background);
    display: flex;
    flex-direction: row;
    justify-content: center;
    box-shadow: 0 0 0.1875rem 0 var(--t5e-tertiary-color);

    margin: 0 -0.25rem -1rem -1rem;

    :global(> *) {
      flex-basis: 30rem;
    }
  }
</style>
