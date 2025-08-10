<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Ref } from 'src/features/reactivity/reactivity.types';
  import { foundryCoreSettings } from 'src/settings/settings.svelte';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ApplicationPosition } from 'src/types/application.types';
  import { getContext, type Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    children?: Snippet;
    collapsedAbilityThresholdRems: number;
    constantHorizontalSpaceRems: number;
    smallerAbilityThresholdRems: number;
  }

  let {
    children,
    collapsedAbilityThresholdRems,
    constantHorizontalSpaceRems,
    smallerAbilityThresholdRems,
  }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let position = $derived(
    getContext<Ref<ApplicationPosition & { width: number; height: number }>>(
      CONSTANTS.SVELTE_CONTEXT.POSITION_REF,
    ).value,
  );

  let widthRems = $derived(
    position.width / foundryCoreSettings.value.fontSizePx,
  );

  let abilitySmallerRems = $derived(
    context.abilities.length * smallerAbilityThresholdRems +
      constantHorizontalSpaceRems,
  );
  let abilityCollapsedRems = $derived(
    context.abilities.length * collapsedAbilityThresholdRems +
      constantHorizontalSpaceRems,
  );

  let responsiveClasses: ClassValue = $derived({
    'ability-smaller':
      widthRems >= abilityCollapsedRems && widthRems < abilitySmallerRems,
    'ability-collapsed': widthRems < abilityCollapsedRems,
  });
</script>

<div
  class={[
    'abilities-container',
    responsiveClasses,
    { ['abilities-overflow']: context.abilities.length > 6 },
  ]}
>
  <div class="abilities-container-inner flexrow">
    {@render children?.()}
  </div>
</div>
