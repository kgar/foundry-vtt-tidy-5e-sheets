<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<ActorSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<section class="items-list">
  <div class="item-section card">
    <div class="items-header header">
      <h3 class="item-name">{localize('DND5E.Conditions')}</h3>
    </div>
    <ul class="conditions-list unlist">
      {#each $context.conditions as condition}
        <li
          class="condition"
          class:active={!condition.disabled}
          data-uuid={condition.reference}
          data-condition-id={condition.id}
          on:click={ev => FoundryAdapter.toggleCondition($context.actor, condition)}
        >
          <div class="icon">
            <dnd5e-icon src={condition.icon}></dnd5e-icon>
          </div>
          <div class="name-stacked">
            <span class="title">{condition.name}</span>
          </div>
          {#if condition.disabled}
            <i class="fas fa-toggle-off"></i>
          {:else}
            <i class="fas fa-toggle-on"></i>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</section>
