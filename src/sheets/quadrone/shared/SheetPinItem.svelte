<script lang="ts">
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import { CONSTANTS } from 'src/constants';
  import { Activities } from 'src/features/activities/activities';
  import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getActorSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { SheetPinItemContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { coalesce } from 'src/utils/formatting';
  import CapacityBar from '../container/parts/CapacityBar.svelte';
  import ContainerCapacityTooltip from 'src/tooltips/ContainerCapacityTooltip.svelte';
  import SpellPipsQuadrone from 'src/components/pips/SpellPipsQuadrone.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    ctx: SheetPinItemContext;
  }

  const { ctx }: Props = $props();

  const context = $derived(getActorSheetQuadroneContext());

  let isEditing = $state(false);

  let visibleActivities = $derived(
    context.itemContext[ctx.document.id]?.activities?.map(
      (activityCtx) => activityCtx.activity,
    ) ??
      Activities.getVisibleActivities(
        ctx.document,
        ctx.document.system.activities ?? [],
      ),
  );

  const { usesDocument, valueProp, spentProp, maxProp, value, maxText, uses } =
    $derived.by(() => {
      if (ctx.linkedUses) {
        return {
          usesDocument: ctx.linkedUses.doc,
          maxProp: ctx.linkedUses.maxProp,
          maxText: isNil(ctx.linkedUses.max, '')
            ? '—'
            : ctx.linkedUses.max.toString(),
          spentProp: ctx.linkedUses.spentProp,
          uses: ctx.linkedUses,
          value: ctx.linkedUses.value,
          valueProp: ctx.linkedUses.valueProp,
        };
      }

      const primaryActivity = visibleActivities[0];
      const usePrimaryActivity =
        ctx.document.system.uses.max === '' &&
        !isNil(primaryActivity?.uses?.max, '');
      const uses = usePrimaryActivity
        ? primaryActivity.uses
        : ctx.document.system.uses;

      return {
        usesDocument: usePrimaryActivity ? primaryActivity : ctx.document,
        uses: uses,
        value: (uses.max ?? 0) - uses.spent,
        maxText: isNil(uses.max, '') ? '—' : uses.max.toString(),
        valueProp: usePrimaryActivity ? 'uses.value' : 'system.uses.value',
        spentProp: usePrimaryActivity ? 'uses.spent' : 'system.uses.spent',
        maxProp: usePrimaryActivity ? 'uses.max' : 'system.uses.max',
      };
    });

  const spellSlotTrackerMode = $derived(
    'spellSlotTrackerMode' in context &&
      context.spellSlotTrackerMode === CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
      ? 'spell-slots-pips'
      : 'spell-slots',
  );
  const spellcastingSection = $derived(
    ctx.document.parent.system.spells['spell' + ctx.document.system.level],
  );

  const localize = FoundryAdapter.localize;

  let containerCapacityTooltip: ContainerCapacityTooltip | undefined = $state();

  function getRollIcon(): ClassValue {
    let classValue: ClassValue[] = ['fa'];

    if (ctx.presentation === 'container') {
      classValue.push('fa-box-open');
    } else if (ctx.document.type === CONSTANTS.ITEM_TYPE_SPELL) {
      classValue.push(FoundryAdapter.getSpellIcon(ctx.document));
    } else {
      classValue.push('fa-dice-d20');
    }
    return classValue;
  }
</script>

{#snippet spellSlots(section: any, slotKey: string, cssClass: string)}
  {#if spellSlotTrackerMode === 'spell-slots'}
    <span class="inline-uses {cssClass}">
      <span class="{cssClass}-value">{section?.value}</span>
      <span class="divider">/</span>
      <span class="{cssClass}-max">{section?.max}</span>
    </span>
  {:else if spellSlotTrackerMode === 'spell-slots-pips'}
    <SpellPipsQuadrone
      max={section?.max}
      prop="system.spells.{slotKey}.value"
      uses={section?.value}
    />
  {/if}
{/snippet}

{#snippet pinName()}
  <button
    type="button"
    class="button button-borderless font-label-medium pin-name truncate flex1"
    data-action={context.unlocked ? 'editDocument' : 'showDocument'}
    data-uuid={ctx.document.uuid}
  >
    {coalesce(ctx.alias, ctx.document.name)}
  </button>
{/snippet}

<div
  role="button"
  tabindex="0"
  class="sheet-pin"
  data-tidy-draggable
  data-item-id={ctx.document.id}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
  data-pin-id={ctx.id}
>
  <div class="pin-document-image">
    <!-- svelte-ignore a11y_missing_attribute -->
    <a
      role="button"
      tabindex="0"
      class={[
        'tidy-table-row-use-button',
        { disabled: !context.editable && ctx.presentation !== 'container' },
      ]}
      data-action={ctx.presentation === 'container' ? 'showDocument' : 'use'}
      data-uuid={ctx.presentation === 'container'
        ? ctx.document.uuid
        : undefined}
      data-has-roll-modes={ctx.presentation === 'container' ? undefined : true}
      aria-label={ctx.document.name}
    >
      <img class="item-image" alt={ctx.document.name} src={ctx.document.img} />
      <span class="roll-prompt">
        {const rollIconClass = $derived(getRollIcon())}
        <i class={rollIconClass}></i>
      </span>
    </a>
  </div>
  <!-- TODO: Save alias changes. -->
  <!-- TODO: Drag and drop to the pins list without removing from sections. -->
  <!-- TODO: Figure out layout in edit mode. Bigger cards? -->
  <div class="pin-details">
    {#if context.unlocked && isEditing}
      <div class="pin-name-container flexrow" title={ctx.document.name}>
        {let input = $state<HTMLInputElement>()}
        <input
          bind:this={input}
          type="text"
          class="pin-name"
          value={ctx.alias}
          placeholder={ctx.document.name}
        />
        <button
          type="button"
          class="button button-icon-only flexshrink save-name-button"
          aria-label="Save Alias"
          onclick={(ev) => {
            const tabId = CONFIG.TIDY5E.utils.getTabIdFromEvent(ev);

            if (input && tabId) {
              SheetPinsProvider.setAlias(ctx.document, tabId, input.value);
            }
            isEditing = false;
            return false;
          }}
        >
          <i class="fa-solid fa-save"></i>
        </button>
      </div>
    {:else}
      <div class="pin-name-container flexrow" title={ctx.document.name}>
        {#if context.unlocked}
          {@render pinName()}
          <button
            type="button"
            aria-label="Edit Alias"
            class="button button-borderless button-icon-only flexshrink edit-name-button"
            onclick={(ev) => {
              isEditing = true;
              return false;
            }}
          >
            <i class="fa-solid fa-pencil"></i>
          </button>
        {:else}
          {@render pinName()}
        {/if}
      </div>

      {#if ctx.presentation === 'container'}
        {const capacity = $derived(
          context.itemContext[ctx.document.id].containerCapacity,
        )}
        {#if capacity}
          <ContainerCapacityTooltip
            bind:this={containerCapacityTooltip}
            container={ctx.document}
            {capacity}
            showIcon={false}
          />

          <div
            class="pin-container"
            onmouseover={(ev) => containerCapacityTooltip?.tryShow(ev)}
            onfocus={(ev) => containerCapacityTooltip?.tryShow(ev)}
          >
            <CapacityBar
              container={ctx.document}
              showTracker={false}
              {capacity}
              showWeightDistributionTooltip={false}
            />
          </div>
        {/if}
      {:else if ctx.presentation !== 'none'}
        <!-- TODO:
        * Hide if 0 max charges.
        * Hide if innate/atwill spell slot.
        * Switch to spell slot uses if spell.
        * Switch spell slots to pips if active?
        -->
        <div class="pin-counter {ctx.resource}">
          {#if ctx.presentation === 'limited-uses-recharging'}
            <RechargeControl document={ctx.document} {uses} />
          {:else if ctx.presentation === 'limited-uses-recharged'}
            <span class="inline-uses color-text-default charged-text">
              <input
                type="text"
                inputmode="numeric"
                class={['uninput uses-value', { diminished: value < 1 }]}
                data-name={valueProp}
                {@attach InputAttachments.selectOnFocus}
                {value}
              />
              <span class="divider color-text-gold-emphasis">/</span>
              <span class="uses-max">{maxText}</span>
              <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
            </span>
          {:else if ctx.presentation === 'spell-slots'}
            {@render spellSlots(
              spellcastingSection,
              `spell${ctx.document.system.level}`,
              'spell-slots',
            )}
          {:else if ctx.presentation === 'spell-slots-pact'}
            {@render spellSlots(
              ctx.document.parent.system.spells['pact'],
              'pact',
              'spell-slots-pact',
            )}
          {:else if ctx.presentation === 'limited-uses'}
            <span class="inline-uses color-text-default">
              <input
                type="text"
                inputmode="numeric"
                class={['uninput uses-value', { diminished: value < 1 }]}
                data-name={valueProp}
                {@attach InputAttachments.selectOnFocus}
                {value}
              />
              <span class="divider color-text-gold-emphasis">/</span>
              <span class="uses-max">{maxText}</span>
            </span>
          {:else if ctx.presentation === 'quantity'}
            <input
              type="text"
              class={['uninput uses-value centered', { diminished: value < 1 }]}
              data-name={'system.quantity'}
              inputmode="numeric"
              value={ctx.document.system.quantity}
              {@attach InputAttachments.selectOnFocus}
            />
          {/if}
        </div>
      {:else if visibleActivities.length > 0}
        <div class="pin-counter {ctx.resource}">
          <span class="subtitle font-default-medium color-text-lighter"
            >{visibleActivities.length}
            {localize(
              visibleActivities.length === 1
                ? 'DND5E.ACTIVITY.Title.one'
                : 'DND5E.ACTIVITY.Title.other',
            )}</span
          >
        </div>
      {/if}
    {/if}
  </div>
  {#if context.unlocked && !isEditing}
    <a
      class="button button-icon-only button-borderless highlight-on-hover"
      data-action="showContextMenu"
      data-target-selector="[data-item-id]"
    >
      <i class="fas fa-ellipsis-vertical"></i>
    </a>
  {/if}
</div>
