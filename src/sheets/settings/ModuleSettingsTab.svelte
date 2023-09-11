<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from './parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';

  let store = getContext<Writable<CurrentSettings>>('store');
  const appId = getContext<string>('appId');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

{#if userIsGm}
  <h2>{localize('T5EK.Settings.TabModules.header')}</h2>

  <h3>{localize('T5EK.Settings.TabModules.labelActionsFavorites')}</h3>
  <article class="setting group">
    <section>
      <div class="description">
        <label for="defaultActionsTab-{appId}">
          {localize('T5EK.Settings.DefaultActionsTab.name')}
        </label>
        <p class="notes">{localize('T5EK.Settings.DefaultActionsTab.hint')}</p>
      </div>
      <div class="settings-group">
        <select
          id="defaultActionsTab-{appId}"
          bind:value={$store.defaultActionsTab}
        >
          <option value="default">
            {localize('T5EK.Settings.DefaultActionsTab.default')}
          </option>
          <option value="attributes">
            {localize('T5EK.Settings.DefaultActionsTab.attributes')}
          </option>
          <option value="inventory">
            {localize('T5EK.Settings.DefaultActionsTab.inventory')}
          </option>
          <option value="spellbook">
            {localize('T5EK.Settings.DefaultActionsTab.spellbook')}
          </option>
          <option value="features">
            {localize('T5EK.Settings.DefaultActionsTab.features')}
          </option>
          <option value="effects">
            {localize('T5EK.Settings.DefaultActionsTab.effects')}
          </option>
          <option value="biography">
            {localize('T5EK.Settings.DefaultActionsTab.biography')}
          </option>
          <option value="journal">
            {localize('T5EK.Settings.DefaultActionsTab.journal')}
          </option>
          <option value="actions">
            {localize('T5EK.Settings.DefaultActionsTab.actions')}
          </option>
        </select>
      </div>
    </section>
  </article>

  <h3>{localize('T5EK.Settings.TabModules.labelMidiQoL')}</h3>

  <CheckboxSetting
    bind:value={$store.contextRollButtons}
    name={'T5EK.Settings.RollButtonsToCard.name'}
    hint={'T5EK.Settings.RollButtonsToCard.hint'}
    id="contextRollButtons"
  />

  <CheckboxSetting
    bind:value={$store.activeEffectsMarker}
    name={'T5EK.Settings.ActiveEffectsMarker.name'}
    hint={'T5EK.Settings.ActiveEffectsMarker.hint'}
    id="activeEffectsMarker"
  />

  <h3>{localize('T5EK.Settings.TabModules.labelLazyMoney')}</h3>

  <CheckboxSetting
    bind:value={$store.lazyMoneyEnable}
    name={'T5EK.Settings.LazyMoneyEnable.name'}
    hint={'T5EK.Settings.LazyMoneyEnable.hint'}
    id="lazyMoneyEnable"
  />

  <CheckboxSetting
    bind:value={$store.lazyMoneyAddConvert}
    name={'T5EK.Settings.LazyMoneyAddConvert.name'}
    hint={'T5EK.Settings.LazyMoneyAddConvert.hint'}
    id="lazyMoneyAddConvert"
  />

  <CheckboxSetting
    bind:value={$store.lazyMoneyIgnoreElectrum}
    name={'T5EK.Settings.LazyMoneyIgnoreElectrum.name'}
    hint={'T5EK.Settings.LazyMoneyIgnoreElectrum.hint'}
    id="lazyMoneyIgnoreElectrum"
  />

  <CheckboxSetting
    bind:value={$store.lazyMoneyChatLog}
    name={'T5EK.Settings.LazyMoneyChatLog.name'}
    hint={'T5EK.Settings.LazyMoneyChatLog.hint'}
    id="lazyMoneyChatLog"
  />
{/if}
