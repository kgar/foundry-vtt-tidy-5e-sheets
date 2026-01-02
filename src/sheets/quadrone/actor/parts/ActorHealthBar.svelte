<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
    VehicleSheetQuadroneContext,
  } from 'src/types/types';

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext | VehicleSheetQuadroneContext
      >(),
    );

  let appId = $derived(context.actor.uuid.slugify());

  let localize = FoundryAdapter.localize;

  let hpValueInputFocused = $state(false);
  let hpTempInputFocused = $state(false);
  let hpOverlayOpen = $state(false);
  let hpOverlayFocusTarget = $state<'temp' | 'tempmax'>('temp');
  let hpOverlayCloseOnBlur = $state(false);

  let hpValueInput = $state<TextInputQuadrone>();
  let hpTempInput = $state<TextInputQuadrone>();
  let hpTempMaxInput = $state<TextInputQuadrone>();

  let hpValue = $derived(context.system.attributes?.hp?.value ?? 0);
  let effectiveMaxHp = $derived(
    context.system.attributes?.hp?.effectiveMax ?? 0,
  );
  let hpMax = $derived(context.system.attributes?.hp?.max ?? 0);
  let hpPct = $derived(
    effectiveMaxHp < hpMax
      ? ((hpValue / hpMax) * 100).toFixed(0)
      : (context.system.attributes?.hp?.pct ?? 0).toFixed(0),
  );
  let hpAdjustedPct = $derived(
    (((hpMax - effectiveMaxHp) / effectiveMaxHp) * 100).toFixed(0),
  );
  let hpTemp = $derived(context.system.attributes?.hp?.temp ?? 0);
  let hpTempMax = $derived(context.system.attributes?.hp?.tempmax ?? 0);

  let hdPct = $derived(context.system.attributes?.hd?.pct ?? 0);

  // Focus the appropriate input when the HP overlay opens
  $effect(() => {
    if (hpOverlayOpen) {
      if (hpOverlayFocusTarget === 'temp') {
        hpTempInput?.selectText();
      } else {
        hpTempMaxInput?.selectText();
      }
    }
  });
</script>

<div class="hp-row flexrow">
  <div
    class="meter progress hit-points"
    style={effectiveMaxHp < hpMax
      ? `--bar-percentage: ${hpPct}%; --bar-adjusted: ${hpAdjustedPct}%; --adjusted-darker: var(--t5e-color-palette-green-21); --adjusted-lighter: var(--t5e-color-palette-green-43);`
      : `--bar-percentage: ${hpPct}%`}
  >
    <button
      type="button"
      class="label pointer"
      hidden={hpValueInputFocused}
      onclick={async (ev) => {
        hpValueInputFocused = true;
        hpValueInput?.selectText();
      }}
      disabled={!context.editable}
    >
      <div
        class="value"
        aria-label={localize('DND5E.HitPointsCurrent')}
      >
        {hpValue}
      </div>
      <div class="separator">/</div>
      <div class="max" aria-label={localize('DND5E.HitPointsMax')}>
        {effectiveMaxHp}
      </div>
      {#if effectiveMaxHp !== hpMax}
        <div class="max-hp-override-container">
          <span class="font-default-small color-text-lighter">
            {hpTempMax < 0 ? '-' : '+'}
          </span>
          <span class="font-default-small color-text-lighter">
            {hpTempMax}
          </span>
        </div>
        <!-- TODO: hightouch - relatively positioned tiny pencil to denote altered max HP -->
      {/if}
    </button>
    <TextInputQuadrone
      bind:this={hpValueInput}
      id="{appId}-system-attributes-hp"
      document={context.actor}
      field="system.attributes.hp.value"
      class="hp-input"
      value={hpValue}
      selectOnFocus={true}
      enableDeltaChanges={true}
      onfocus={() => (hpValueInputFocused = true)}
      onblur={() => (hpValueInputFocused = false)}
      blurAfterChange={true}
      hidden={!hpValueInputFocused}
    />
  </div>

  {#if !context.unlocked}
    {#if hpTemp > 0}
      <!-- TODO: Convert to buttons -->
      <div
        class="temp-hp label pointer"
        onclick={() => {
          hpOverlayFocusTarget = 'temp';
          hpOverlayOpen = true;
        }}
        oncontextmenu={(ev) => {
          ev.preventDefault();
          hpOverlayFocusTarget = 'tempmax';
          hpOverlayOpen = true;
        }}
      >
        <span class="modifier font-label-large color-text-lighter"
          >+</span
        >
        <span
          class="value font-data-large color-text-default"
          data-tooltip="DND5E.HitPointsTemp">{hpTemp}</span
        >
      </div>
    {:else if context.editable}
      <button
        aria-label={localize('DND5E.HitPointsTemp')}
        data-tooltip="DND5E.HitPointsTemp"
        type="button"
        class="button button-borderless button-icon-only temp-hp"
        onclick={() => {
          hpOverlayFocusTarget = 'temp';
          hpOverlayOpen = true;
        }}
        oncontextmenu={(ev) => {
          ev.preventDefault();
          hpOverlayFocusTarget = 'tempmax';
          hpOverlayOpen = true;
        }}
        disabled={!context.editable}
      >
        <i class="fas fa-hand-holding-heart"></i>
      </button>
    {/if}
  {:else if context.editable}
    <button
      onclick={() =>
        FoundryAdapter.renderHitPointsDialog(context.actor)}
      aria-label={localize('DND5E.HitPointsConfig')}
      data-tooltip="DND5E.HitPointsConfig"
      type="button"
      class={[
        'button',
        'button-borderless',
        'button-icon-only',
        'button-config',
        { editMode: context.unlocked },
      ]}
    >
      <i class="fas fa-cog"></i>
    </button>
  {/if}
  {#if hpOverlayOpen}
    <div class="hp-overlay-bar flexrow">
      <span class="font-label-medium color-text-gold">Max</span>
      <TextInputQuadrone
        bind:this={hpTempMaxInput}
        id="{appId}-system-attributes-hp-tempmax"
        document={context.actor}
        field="system.attributes.hp.tempmax"
        class="hp-temp-input"
        value={hpTempMax}
        selectOnFocus={true}
        enableDeltaChanges={false}
        onkeydown={(ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            hpOverlayCloseOnBlur = true;
          }
        }}
        onfocus={() => {
          hpOverlayOpen = true;
        }}
        onblur={() => {
          if (hpOverlayCloseOnBlur) {
            hpOverlayOpen = false;
            hpOverlayCloseOnBlur = false;
          }
        }}
        blurAfterChange={true}
      />
      <span class="font-label-medium color-text-gold">Temp</span>
      <TextInputQuadrone
        bind:this={hpTempInput}
        id="{appId}-system-attributes-hp-temp"
        document={context.actor}
        field="system.attributes.hp.temp"
        class="hp-temp-input"
        value={hpTemp}
        selectOnFocus={true}
        enableDeltaChanges={true}
        onkeydown={(ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            hpOverlayCloseOnBlur = true;
          }
        }}
        onfocus={() => {
          hpOverlayOpen = true;
        }}
        onblur={() => {
          if (hpOverlayCloseOnBlur) {
            hpOverlayOpen = false;
            hpOverlayCloseOnBlur = false;
          }
        }}
        blurAfterChange={true}
      />
      <button
        aria-label="Close HP overlay"
        type="button"
        class="button-borderless button-icon-only"
        onclick={() => (hpOverlayOpen = false)}
      >
        <i class="fas fa-times"></i>
      </button>
      <button
        onclick={() =>
          FoundryAdapter.renderHitPointsDialog(context.actor)}
        aria-label={localize('DND5E.HitPointsConfig')}
        data-tooltip="DND5E.HitPointsConfig"
        type="button"
        class={[
          'button-borderless',
          'button-icon-only',
          'button-config',
          { editMode: context.unlocked },
        ]}
      >
        <i class="fas fa-cog"></i>
      </button>
    </div>
  {/if}
</div>