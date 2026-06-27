import { settings } from 'src/settings/settings.svelte';
import type { SettingsEditor } from './settings-editors.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type HomebrewConfigContext = {
  enableBankedInspiration: boolean;
  bankedInspirationGmOnly: boolean;
  swapAbilityScoreAndBonus: boolean;
};

export type HomebrewSettingsEditor = SettingsEditor<HomebrewConfigContext>;

export function getHomebrewSettingsEditor(): HomebrewSettingsEditor {
  const current = $state<HomebrewConfigContext>(getConfig());

  let initialSnapshot = $state<string>(JSON.stringify(snapshotConfig(current)));

  const hasChanges = $derived(JSON.stringify(current) !== initialSnapshot);

  function snapshotConfig(config: HomebrewConfigContext) {
    return $state.snapshot(config);
  }

  function getConfig() {
    return {
      enableBankedInspiration: settings.value.enableBankedInspiration,
      bankedInspirationGmOnly: settings.value.bankedInspirationGmOnly,
      swapAbilityScoreAndBonus: settings.value.swapAbilityScoreAndBonus,
    };
  }

  return {
    get hasChanges() {
      return hasChanges;
    },

    resetToDefault() {
      this.value = {
        bankedInspirationGmOnly: false,
        enableBankedInspiration: false,
        swapAbilityScoreAndBonus: false,
      };
    },

    async save() {
      await FoundryAdapter.setTidySetting(
        'enableBankedInspiration',
        this.value.enableBankedInspiration,
      );
      await FoundryAdapter.setTidySetting(
        'bankedInspirationGmOnly',
        this.value.bankedInspirationGmOnly,
      );
      await FoundryAdapter.setTidySetting(
        'swapAbilityScoreAndBonus',
        this.value.swapAbilityScoreAndBonus,
      );

      initialSnapshot = JSON.stringify(snapshotConfig(this.value));
    },

    undoChanges() {
      this.value = JSON.parse(initialSnapshot);
    },

    get canUndo() {
      return this.hasChanges;
    },

    canUseDefault: true,

    useDefaultLabel: undefined,

    async useDefault() {
      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: {
          title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
        },
        content: `<p>${FoundryAdapter.localize(
          'TIDY5E.UseDefaultDialog.text',
        )}</p>`,
      });

      if (!proceed) {
        return;
      }

      this.resetToDefault();
    },

    get value() {
      return current;
    },

    set value(value) {
      const keys = Object.keys(current) as (keyof HomebrewConfigContext)[];

      for (const key of keys) {
        delete current[key];
      }

      Object.assign(current, value);
    },
  };
}
