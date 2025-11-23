<script lang="ts">
  import Notice from 'src/components/notice/Notice.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';

  interface Props {
    editable: boolean;
    cssClass?: string | null;
  }

  let { editable, cssClass = null }: Props = $props();

  let context = $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  const localize = FoundryAdapter.localize;
</script>

<div class="no-spells-container {cssClass}">
  <Notice>{localize('DND5E.NoSpellLevels')}</Notice>
  {#if context.editable && editable}
    <button
      type="button"
      class="create-spell-btn flex-row align-items-center extra-small-gap"
      onclick={() =>
        FoundryAdapter.createItem({ type: 'spell', level: '' }, context.actor)}
      tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <i class="fas fa-plus-circle"></i>
      {localize('DND5E.SpellCreate')}
    </button>
  {/if}
</div>

<style lang="less">
  .no-spells-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .create-spell-btn {
      text-align: center;
      min-width: 7.5rem;
      align-self: center;
      font-size: 0.75rem;
      border-radius: 0.3125rem;
      line-height: 1.5;
      width: auto;
      padding: 0.125rem 1.5rem;
      border: none;
      color: var(--t5e-secondary-color);
      background-color: var(--t5e-faintest-color);

      &:hover {
        background-color: var(--t5e-light-color);
      }
    }
  }
</style>
