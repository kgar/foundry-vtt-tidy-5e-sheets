<script lang="ts" generics="TSection extends TidySectionBase">
  import { TidyFlags } from 'src/api';

  import type {
    Actor5e,
    CustomSectionOptions,
    TidySectionBase,
  } from 'src/types/types';
  import ItemCreateButton from '../item-list/ItemCreateButton.svelte';
  import { ActorItemRuntime } from 'src/runtime/ActorItemRuntime';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';

  export let section: TSection;
  export let actor: Actor5e;
  export let canCreate = true;
  /**
   * Override for the underlying create button's `create()` function.
   */
  export let create: (() => void) | undefined = undefined;
  export let isItem: boolean;

  let customCommands = isItem
    ? ActorItemRuntime.getActorItemSectionCommands({ actor, section })
    : [];

  function createForCustom(custom: CustomSectionOptions) {
    // TODO: Support fast-forwarding item creation when there's only one type available.
    // This will require a breaking model change to `dataset`.
    Item.implementation.createDialog(
      { ...section.dataset },
      {
        parent: actor,
        pack: actor.pack,
        types: custom.creationItemTypes,
      },
    );
  }

  const localize = FoundryAdapter.localize;
</script>

<footer class="item-table-footer-row">
  <!-- TODO: Handle custom section item creation -->
  {#if canCreate}
    {@const custom = section.custom}
    {#if custom}
      <ItemCreateButton
        dataset={section.dataset}
        {actor}
        create={() => createForCustom(custom)}
      />
    {:else}
      <ItemCreateButton dataset={section.dataset} {actor} {create} />
    {/if}
  {/if}
  {#each customCommands as command}
    <button
      type="button"
      class="item-list-footer-button"
      on:click={(ev) => command.execute?.({ section, event: ev, actor: actor })}
      title={localize(command.tooltip ?? '')}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
    >
      {#if (command.iconClass ?? '') !== ''}
        <i class={command.iconClass} />
      {/if}
      {localize(command.label ?? '')}
    </button>
  {/each}
</footer>

<style lang="scss">
  .item-table-footer-row {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    margin-left: 0.5rem;
    border-radius: 0 0 0.3125rem 0.3125rem;
  }
</style>
