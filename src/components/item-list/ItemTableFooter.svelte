<script lang="ts" generics="TSection extends TidySectionBase">
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import type {
    Actor5e,
    CustomSectionOptions,
    TidySectionBase,
  } from 'src/types/types';
  import ItemCreateButton from '../item-list/ItemCreateButton.svelte';
  import { ActorItemRuntime } from 'src/runtime/ActorItemRuntime';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';

  interface Props {
    section: TSection;
    actor: Actor5e;
    canCreate?: boolean;
    /**
     * Override for the underlying create button's `create()` function.
     */
    create?: (() => void) | undefined;
    isItem: boolean;
  }

  let {
    section,
    actor,
    canCreate = true,
    create = undefined,
    isItem,
  }: Props = $props();

  let customCommands = isItem
    ? ActorItemRuntime.getActorItemSectionCommands({
        document: actor,
        section,
        unlocked: true,
      })
    : [];

  function createForCustom(custom: CustomSectionOptions) {
    if (!custom.creationItemTypes.length) {
      return;
    }

    if (custom.creationItemTypes.length === 1) {
      FoundryAdapter.createItem(
        { type: custom.creationItemTypes[0], ...section.dataset },
        actor,
      );
    } else {
      const createData = { ...section.dataset };

      if (
        !TidyHooks.tidy5eSheetsPreCreateItem(actor, createData, game.user.id)
      ) {
        return;
      }

      Item.implementation.createDialog(createData, {
        parent: actor,
        pack: actor.pack,
        types: custom.creationItemTypes,
      });
    }
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
      onclick={(ev) =>
        command.execute?.({ section, event: ev, document: actor })}
      title={localize(command.tooltip ?? '')}
    >
      {#if (command.iconClass ?? '') !== ''}
        <i class={command.iconClass}></i>
      {/if}
      {localize(command.label ?? '')}
    </button>
  {/each}
</footer>

<style lang="less">
  .item-table-footer-row {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    margin-left: 0.5rem;
    border-radius: 0 0 0.3125rem 0.3125rem;
  }
</style>
