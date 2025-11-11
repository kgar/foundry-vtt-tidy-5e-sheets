<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getNpcSheetContext());

  let isLinked = $derived(
    context.actor.token?.actorLink ?? context.actor.prototypeToken.actorLink,
  );

  let showUnlinked = $derived(
    ['unlinked', 'both'].includes(settings.value.showNpcActorLinkMarker),
  );

  let showLinked = $derived(settings.value.showNpcActorLinkMarker === 'both');

  async function togglePrototypeLinkState() {
    const isNowLinked = context.actor.prototypeToken.actorLink;
    await context.actor.prototypeToken.update({ actorLink: !isNowLinked });
  }

  async function tryUnlink() {
    if (context.actor.sheet.token) {
      await context.actor.sheet.token.update({ actorLink: false });
      const newToken = context.actor.sheet.token;
      await context.actor.sheet.close();
      newToken.actor.sheet.render(true);
    } else {
      await togglePrototypeLinkState();
    }
  }

  async function tryLink() {
    await togglePrototypeLinkState();
  }

  let canLink = $derived(!context.actor.token);

  const localize = FoundryAdapter.localize;
</script>

{#if showLinked && isLinked}
  <a
    class="link-state-button"
    onclick={() => tryUnlink()}
    class:disabled={!context.unlocked}
  >
    <i class="link-state fas fa-link" title={localize('TIDY5E.TokenLinked')}
    ></i>
  </a>
{:else if showUnlinked && !isLinked}
  <a
    class="link-state-button"
    class:disabled={!context.unlocked || !canLink}
    onclick={() => canLink && tryLink()}
  >
    <i class="link-state fas fa-unlink" title={localize('TIDY5E.TokenUnlinked')}
    ></i>
  </a>
{/if}

<style lang="less">
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
