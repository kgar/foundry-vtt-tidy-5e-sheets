<script lang="ts">
  import { TidyFlags } from 'src/api';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import { tick, type Snippet } from 'svelte';

  type Props = {
    expanded?: boolean;
    inCard?: boolean;
    legend?: Snippet;
  };

  let { expanded = true, inCard = true, legend }: Props = $props();

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  const localize = FoundryAdapter.localize;
</script>

<div class="use-ability-header flexrow">
  <button
    type="button"
    class={['button button-borderless skill-expand-button']}
    onclick={async () => {
      const newValue = !expanded;
      expanded = newValue;
      await tick();

      if (context.editable) {
        await TidyFlags.skillsExpanded.set(context.actor, newValue);
      }
    }}
  >
    <i class="fa-solid fa-briefcase {inCard ?? 'color-icon-diminished'}"></i>
    <h3 class="font-label-medium">
      {localize('DND5E.Skills')}

      <i class={['fa-solid', 'fa-angle-right', { expanded }]}></i>
    </h3>
    <span class="modifier-label color-text-lightest font-default-medium">
      {#if legend}
        {@render legend()}
      {/if}
    </span>
  </button>
</div>
