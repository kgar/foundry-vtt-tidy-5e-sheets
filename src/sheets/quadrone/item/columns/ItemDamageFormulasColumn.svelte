<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { Actions } from 'src/features/actions/actions.svelte';
  import { error } from 'src/utils/logging';
  import { firstOfSet } from 'src/utils/set';
  import { isNil } from 'src/utils/data';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import type { MessageBus } from 'src/types/types';

  let { rowDocument, rowContext }: ColumnCellProps = $props();

  const damageHealingTypeIcons = Actions.damageAndHealingTypesIconSrcMap;

  let messageBus = $derived(
    getContext<MessageBus>(CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS),
  );

  let tabId = $derived(getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID));

  function getTrimmedExpression(formula: string) {
    try {
      return new Roll(formula).terms.map((t: any) => t.expression).join(' ');
    } catch (e) {
      error(
        'An error occurred while preparing a damage formula for the formula column',
        false,
        { error: e, rowDocument, rowContext },
      );
    }
    return formula;
  }

  let primaryDamage = $derived.by(() => {
    let damageFormula = rowDocument.system.damage?.base?.formula;

    if (!damageFormula) {
      return null;
    }

    let damageTypes = rowDocument.system.damage?.base?.types;
    let damageType = (
      damageTypes?.size === 1 ? firstOfSet(damageTypes) : undefined
    ) as string | undefined;

    let damageHealingIcon = !isNil(damageType)
      ? damageHealingTypeIcons[damageType]
      : undefined;

    return {
      formula: getTrimmedExpression(damageFormula),
      damageHealingIcon,
      label: damageFormula.label,
    };
  });

  let hasActivityDamages = $derived(rowDocument.labels.damages?.length > 0);

  let showDamageUi = $derived(!!primaryDamage || hasActivityDamages);
</script>

<div>
  {#if showDamageUi}
    <span class="flexrow damage-formula-container">
      {#if primaryDamage}
        <span class="flexshrink damage-formula">{primaryDamage.formula}</span>
        {#if primaryDamage.damageHealingIcon}
          <span class="flexshrink damage-icon" aria-label={primaryDamage.label}>
            <Dnd5eIcon src={primaryDamage.damageHealingIcon} />
          </span>
        {/if}
      {/if}
      {#if hasActivityDamages}
        <button
          type="button"
          class="button button-borderless button-icon-only"
          onclick={(ev) => {
            messageBus.message = {
              message: 'expand-item',
              tabId,
              uuid: rowDocument.uuid,
            };
          }}
        >
          ...
        </button>
      {/if}
    </span>
  {:else}
    <span class="color-text-disabled">&mdash;</span>
  {/if}
</div>
