<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store =
    getContext<Readable<ItemSheetContext | ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<ol class="items-list effects-list">
  {#each Object.entries($store.effects) as [_, section]}
    {#if !section.hidden}
      <li class="items-header flexrow" data-effect-type={section.type}>
        <h3 class="item-name effect-name flexrow">{localize(section.label)}</h3>
        <div class="effect-source">{localize('DND5E.Source')}</div>
        <div class="effect-source">{localize('DND5E.Duration')}</div>
        <div class="item-controls effect-controls flexrow">
          {#if $store.editable}
            <a
              class="effect-control"
              data-action="create"
              data-tooltip="DND5E.EffectCreate"
            >
              <i class="fas fa-plus" />
              {localize('DND5E.Add')}
            </a>
          {/if}
        </div>
      </li>

      {#if section.info}
        <ol class="info">
          {#each $store.section.info as info}
            <li class="notification info">{info}</li>
          {/each}
        </ol>
      {/if}

      <ol class="item-list">
        {#each section.effects as effect}
          <li class="item effect flexrow" data-effect-id={effect.id}>
            <div class="item-name effect-name flexrow">
              <img class="item-image" src={effect.icon} />
              <h4>{effect.label}</h4>
            </div>
            <div class="effect-source">{effect.sourceName}</div>
            <div class="effect-duration">{effect.duration.label}</div>
            <div class="item-controls effect-controls flexrow">
              {#if $store.editable}
                <a
                  class="effect-control"
                  data-action="toggle"
                  data-tooltip={effect.disabled
                    ? 'DND5E.EffectEnable'
                    : 'DND5E.EffectDisable'}
                >
                  <i
                    class="fas"
                    class:fa-check={effect.disabled}
                    class:fa-times={!effect.disabled}
                  />
                </a>
                <a
                  class="effect-control"
                  data-action="edit"
                  data-tooltip="DND5E.EffectEdit"
                >
                  <i class="fas fa-edit" />
                </a>
                <a
                  class="effect-control"
                  data-action="delete"
                  data-tooltip="DND5E.EffectDelete"
                >
                  <i class="fas fa-trash" />
                </a>
              {/if}
            </div>
          </li>
        {/each}
      </ol>
    {/if}
  {/each}
</ol>
