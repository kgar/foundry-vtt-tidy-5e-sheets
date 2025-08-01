<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ItemNameHeaderOrchestrator from './parts/ItemNameHeaderOrchestrator.svelte';
  import Sidebar from './parts/Sidebar.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import ItemName from './parts/header/ItemName.svelte';
  import { isNil } from 'src/utils/data';
  import SpellcastingSidebarPills from './parts/SpellcastingSidebarPills.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  const localize = FoundryAdapter.localize;

  let selectedTabId: string = $derived(context.currentTabId);

  let itemNameEl: HTMLElement | undefined = $state();

  let subtitle = $derived.by(() => {
    if (!context.item.parent) {
      return undefined;
    }

    let result: string[] = [
      localize('DND5E.LevelCount', {
        ordinal: context.item.system.levels.ordinalString(),
      }),
    ];

    if (context.item.isOriginalClass) {
      result.push(localize('DND5E.ClassOriginal'));
    }

    return result.join(', ');
  });

  let primaryAbilities = $derived(
    Array.from<string>(context.item.system.primaryAbility.value)
      .map((x: string) => CONFIG.DND5E.abilities[x]?.label ?? x)
      .join(', '),
  );
</script>

<ItemNameHeaderOrchestrator {itemNameEl} />

<Sidebar>
  {#snippet belowStateSwitches()}
    <div>
      <h4>{localize('TYPES.Item.class')}</h4>
      <ul class="pills stacked">
        <li>
          <span class="pill centered wrapped">
            <span class="text-normal">
              {localize('DND5E.CLASS.FIELDS.hd.label')}
            </span>
            <span class="hyphens-auto">
              {context.item.system.hd?.denomination}
            </span>
          </span>
        </li>
        <SpellcastingSidebarPills />
        {#if !isNil(primaryAbilities, '')}
          <li>
            <span class="pill centered wrapped">
              <span class="text-normal">
                {localize('DND5E.CLASS.FIELDS.primaryAbility.value.label')}
              </span>
              <span>
                {primaryAbilities}
              </span>
            </span>
          </li>
        {/if}
        <li>
          <a
            class="pill interactive centered wrapped copy-to-clipboard"
            onclick={() => {
              const value = context.item.system.identifier;
              game.clipboard.copyPlainText(value);
              ui.notifications.info(
                game.i18n.format('DND5E.Copied', { value }),
                { console: false },
              );
            }}
          >
            <span class="text-normal">
              {localize('DND5E.Identifier')}
            </span>
            <span class="hyphens-auto">
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
      {#if subtitle}
        <div class="subtitle">
          {subtitle}
          {#if context.item.isOriginalClass}
            <i class="fas fa-chess-queen advancement-class-indicator"></i>
          {/if}
        </div>
      {/if}
    </div>
    {#if !context.unlocked && context.item.parent}
      <div class="common-fields">
        <div
          class="level-badge badge theme-dark"
          aria-label={localize('DND5E.LevelNumber', {
            level: context.system.levels,
          })}
        >
          {context.system.levels}
        </div>
      </div>
    {/if}
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
