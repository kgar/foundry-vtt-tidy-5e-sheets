<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: isLinked =
    $context.actor.token?.actorLink ?? $context.actor.prototypeToken.actorLink;

  $: showUnlinked = ['unlinked', 'both'].includes(
    SettingsProvider.settings.showNpcActorLinkMarker.get(),
  );

  $: showLinked =
    SettingsProvider.settings.showNpcActorLinkMarker.get() === 'both';

  async function togglePrototypeLinkState() {
    const isNowLinked = $context.actor.prototypeToken.actorLink;
    await $context.actor.prototypeToken.update({ actorLink: !isNowLinked });
  }

  async function tryUnlink() {
    if ($context.actor.sheet.token) {
      await $context.actor.sheet.token.update({ actorLink: false });
      const newToken = $context.actor.sheet.token;
      await $context.actor.sheet.close();
      newToken.actor.sheet.render(true);
    } else {
      await togglePrototypeLinkState();
    }
  }

  async function tryLink() {
    await togglePrototypeLinkState();
  }

  $: canLink = !$context.actor.token;

  const localize = FoundryAdapter.localize;
</script>

{#if showLinked && isLinked}
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <a
    class="link-state-button"
    on:click={(ev) => tryUnlink()}
    class:disabled={!$context.unlocked}
  >
    <i class="link-state fas fa-link" title={localize('TIDY5E.TokenLinked')} />
  </a>
{:else if showUnlinked && !isLinked}
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <a
    class="link-state-button"
    class:disabled={!$context.unlocked || !canLink}
    on:click={(ev) => canLink && tryLink()}
  >
    <i
      class="link-state fas fa-unlink"
      title={localize('TIDY5E.TokenUnlinked')}
    />
  </a>
{/if}

<style lang="scss">
  .link-state-button {
    cursor: pointer;

    &.disabled {
      cursor: unset;
    }
  }

  .link-state {
    padding: 0.25rem 0.1875rem 0.1875rem 0.25rem;
    margin-top: -0.0625rem;
    border-radius: 0.3125rem;
  }

  .link-state.fa-link {
    background: var(--t5e-linked-light-color);
  }

  .link-state.fa-unlink {
    background: var(--t5e-unlinked-light-color);
  }
</style>
