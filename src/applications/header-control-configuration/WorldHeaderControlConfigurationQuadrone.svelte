<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    WorldHeaderControlConfigContext,
    WorldHeaderControlConfigurationQuadroneApplication,
  } from './WorldHeaderControlConfigurationQuadroneApplication.svelte';
  import { settings } from 'src/settings/settings.svelte';

  interface Props {
    app: WorldHeaderControlConfigurationQuadroneApplication;
    context: WorldHeaderControlConfigContext;
  }

  let { context = $bindable(), app }: Props = $props();

  const localize = FoundryAdapter.localize;

  const menuOptionText = localize(
    'TIDY5E.HeaderControlConfiguration.LocationMenu',
  );
  const headerOptionText = localize(
    'TIDY5E.HeaderControlConfiguration.LocationHeader',
  );
</script>

<div class="dialog-content-container flexcol">
  {#each context as config}
    <h2>{config.title}</h2>

    <fieldset>
      {#each config.controlSettings as setting, i}
        {@const formControlId = `${app.id}-${setting.title.slugify()}`}
        <div class="form-group">
          <label for={formControlId}>
            <i class={setting.icon}></i>
            {setting.title}
          </label>
          <div
            class="form-fields"
            style="flex-start; gap: 1.5rem; flex-grow: 0;"
          >
            <label class="radio">
              <input
                type="radio"
                checked={setting.location === 'menu'}
                onclick={(ev) => {
                  setting.location = 'menu';
                }}
              />
              {menuOptionText}
            </label>
            <label class="radio">
              <input
                type="radio"
                checked={setting.location === 'header'}
                onclick={(ev) => {
                  setting.location = 'header';
                }}
              />
              {headerOptionText}
            </label>
          </div>
        </div>
      {/each}
    </fieldset>
  {/each}
</div>
<div class="button-bar">
  <button
    type="button"
    class="button button-primary save-changes-btn"
    onclick={() => app.save()}
  >
    {localize('TIDY5E.SaveChanges')}
  </button>
  <button
    type="button"
    class="button button-secondary use-default-btn"
    onclick={() => app.useDefault()}
  >
    {localize('TIDY5E.UseDefault')}
  </button>
</div>
