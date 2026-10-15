<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';

  interface Props {
    fullWidth?: boolean;
    context: ItemSheetQuadroneContext;
  }

  let { context, fullWidth }: Props = $props();

  let localize = FoundryAdapter.localize;

  let spellCastTimeText = $derived(
    [
      context.labels.activation,
      context.item.system.properties.has(CONSTANTS.SPELL_PROPERTY_RITUAL)
        ? FoundryAdapter.localize('DND5E.ITEM.Property.Ritual')
        : undefined,
    ]
      .filter((x) => x)
      .join(', '),
  );
</script>

<ul class="spell-block unlist" class:full-width={fullWidth}>
  <li>
    <label>
      {localize('DND5E.SpellCastTime')}:
    </label>
    <span class="value">
      {spellCastTimeText}
      {#if !fullWidth && context.system.activation?.condition}
        <span class="condition">
          ({context.system.activation.condition})
        </span>
      {/if}
    </span>
  </li>
  <li>
    <label>
      {localize('DND5E.Range')}:
    </label>
    <span class="value">
      {context.labels.range}
    </span>
  </li>
  {#if context.labels.target}
    <li>
      <label>{localize('DND5E.Target')}:</label>
      <span class="value">{context.labels.target}</span>
    </li>
  {/if}
  <li>
    <label>{localize('DND5E.Components')}:</label>
    <span class="value">
      {context.labels.components.vsm}
      {#if !fullWidth && context.labels.materials}
        <span class="materials">({context.labels.materials})</span>
      {/if}
    </span>
  </li>
  <li>
    <label>{localize('DND5E.Duration')}:</label>
    <span class="value">{context.labels.concentrationDuration}</span>
  </li>
  {#if fullWidth && context.system.activation.condition}
    <li class="paragraph">
      <label>{localize('DND5E.Trigger')}:</label>
      <span class="value">{context.system.activation.condition}</span>
    </li>
  {/if}
  {#if fullWidth && context.labels.materials}
    <li class="paragraph">
      <label>{localize('DND5E.Materials')}:</label>
      <span class="value">{context.labels.materials}</span>
    </li>
  {/if}
</ul>
