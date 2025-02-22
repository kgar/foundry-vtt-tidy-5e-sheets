<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { coalesce } from 'src/utils/formatting';
  import { settings } from 'src/settings/settings.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.StartingEquipment.Title')}
    {#if context.unlocked}
      <span>
        <button
          type="button"
          class="configure-starting-equipment inline-icon-button"
          title={localize('DND5E.StartingEquipment.Action.Configure')}
          aria-label={localize('DND5E.StartingEquipment.Action.Configure')}
          onclick={() =>
            FoundryAdapter.openStartingEquipmentConfig(context.item)}
          tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
        >
          <i class="fas fa-gear"></i>
        </button>
      </span>
    {/if}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="starting-equipment-text">
    {@html coalesce(
      context.system.startingEquipmentDescription,
      localize('None'),
    )}
  </div>

  <div class="form-group">
    <label for="{appId}-wealth"
      >{localize('DND5E.StartingEquipment.Wealth.Label')}</label
    >
    <div class="form-fields">
      <TextInputQuadrone
        id="{appId}-wealth"
        document={context.item}
        field="system.wealth"
        value={context.source.wealth}
        disabledValue={context.system.wealth}
        disabled={!context.unlocked}
      />
    </div>
    <p class="hint">{localize('DND5E.StartingEquipment.Wealth.Hint')}</p>
  </div>
</fieldset>

<!-- TODO: Put in global styles -->
<style lang="scss">
  span:has(:global(.configure-starting-equipment)) {
    font-size: 0.875rem;
  }

  .starting-equipment-text {
    line-height: 1.75;
  }
</style>
