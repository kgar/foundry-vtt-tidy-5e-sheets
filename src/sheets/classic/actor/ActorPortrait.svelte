<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/types';
  import type {
    ActorSheetContextV1,
    ActorSheetClassicContextV2,
  } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import { debug, error } from 'src/utils/logging';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import type { ContextMenuEntry } from 'src/foundry/foundry.types';
  import FloatingContextMenu from 'src/context-menu/FloatingContextMenu';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    actor: Actor5e;
    useHpOverlay: boolean;
  }

  let { actor, useHpOverlay }: Props = $props();

  let context =
    $derived(
      getSheetContext<ActorSheetContextV1 | ActorSheetClassicContextV2<any>>(),
    );

  const localize = FoundryAdapter.localize;

  let actorImageTitle = $derived(
    context.unlocked
      ? `${localize('TIDY5E.EditSheetImageHint')} / ${localize('TIDY5E.SheetImageOptionsHint')}`
      : `${localize('TIDY5E.PreviewSheetImageHint')} / ${localize('TIDY5E.SheetImageOptionsHint')}`,
  );

  function openPortraitPicker(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    if (!TidyHooks.tidy5eSheetsPreOpenActorPortraitFilePicker(context, event)) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const current = actor.img;
    const fp = new foundry.applications.apps.FilePicker({
      type: 'image',
      current,
      callback: (path: string) => {
        actor.update({ img: path });
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });
    return fp.browse();
  }

  let portraitContainer: HTMLElement;

  // TODO: Consider sending context menu options down through document context in the first place.
  let contextMenuOptions: ContextMenuEntry[] = $derived.by(() => {
    try {
      return context.actorPortraitCommands.map((c) => ({
        name: c.label ?? '',
        icon: !isNil(c.iconClass, '') ? `<i class="${c.iconClass}"></i>` : '',
        callback: () => c.execute?.({ actor, context: context }),
      }));
    } catch (e) {
      error('An error occurred while getting context menu options', false, e);
      debug('Context menu option error troubleshooting info', {
        portraitContainer,
        commands: context.actorPortraitCommands,
      });
    }

    return [];
  });

  $effect(() => {
    new FloatingContextMenu(
      portraitContainer,
      `[data-tidy-sheet-part=${CONSTANTS.SHEET_PARTS.ACTOR_PORTRAIT_CONTAINER}]`,
      [],
      {
        onOpen: () => {
          ui.context.menuItems = contextMenuOptions;
        },
        jQuery: false,
        layout: CONSTANTS.SHEET_LAYOUT_CLASSIC,
      },
    );
  });
</script>

<div
  bind:this={portraitContainer}
  class="portrait"
  class:round-portrait={context.useRoundedPortraitStyle}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTOR_PORTRAIT_CONTAINER}
>
  <div
    class="actor-image-wrap"
    class:overlay={useHpOverlay}
    style="--overlay-height: calc(100% - {context.healthPercentage}%)"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTOR_PORTRAIT_HEALTH_OVERLAY}
  >
    <img
      class="actor-image"
      src={actor.img}
      alt={actor.name}
      title={actorImageTitle}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTOR_PORTRAIT_IMAGE}
      data-action={context.unlocked ? 'editImage' : 'showPortraitArtwork'}
      data-edit={context.actor.isToken ? '' : 'img'}
    />
  </div>
</div>

<style lang="scss">
  .portrait,
  .actor-image-wrap,
  .actor-image {
    width: 100%;
    height: 100%;
  }

  .portrait {
    border-radius: 0.3125rem;
    overflow: hidden;
  }

  .actor-image-wrap {
    position: relative;
    overflow: hidden;
  }

  .actor-image-wrap.overlay::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: var(--t5e-hp-overlay-background);
    transition: height 0.5s ease-in-out;
    mix-blend-mode: multiply;
    height: var(--overlay-height);
  }

  .actor-image {
    background: var(--t5e-icon-background);
    box-shadow: 0 0 0.625rem var(--t5e-icon-shadow-color) inset;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }

  .portrait,
  .portrait .actor-image-wrap,
  .portrait .actor-image {
    border-radius: 0.3125rem;
  }

  .portrait.round-portrait,
  .portrait.round-portrait .actor-image-wrap,
  .portrait.round-portrait .actor-image {
    border-radius: 50%;
  }
</style>
