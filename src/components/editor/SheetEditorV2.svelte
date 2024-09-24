<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import type { Readable } from 'svelte/store';

  type EditorOptions =
    any /*foundry.applications.elements.HTMLProseMirrorElement.ProseMirrorInputConfig*/;

  export let field: string;
  export let content: string;
  export let enriched: string | null = null;
  export let editorOptions: EditorOptions = {};
  export let documentUuid: string;
  export let manageSecrets: boolean = false;

  let editorContainerId = `editor-${foundry.utils.randomID()}`;

  // Build Options
  editorOptions = foundry.utils.mergeObject(
    {
      name: field,
      collaborate: false,
      compact: false,
      documentUUID: documentUuid,
      editable: true,
      height: 200,
      toggled: true,
      value: content,
    },
    editorOptions,
  ) as EditorOptions;

  let proseMirrorContainerEl: HTMLElement;

  let dispatcher = createEventDispatcher<{
    save: void;
  }>();

  function onEditorActivation(node: HTMLElement) {
    node.addEventListener('click', (ev: MouseEvent) => {
      if (
        ev.target instanceof HTMLElement &&
        ev.target.matches('[data-action="save"]')
      ) {
        onSave();
      }
    });
    node.addEventListener('keydown', (event) => {
      if (
        game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.CONTROL) &&
        event.key === 's'
      ) {
        onSave();
      }
    });
  }

  function onSave() {
    dispatcher('save');
    bindSecretUi();
  }

  function bindSecretUi() {
    if (!manageSecrets) {
      return;
    }

    const secret = new HTMLSecret({
      parentSelector: `#${editorContainerId}`,
      callbacks: {
        content: (_secret: HTMLElement) => content,
        update: (secret: HTMLElement, content: string) => {
          secret.closest<HTMLElement & { value: string }>(
            'prose-mirror',
          )!.value = content;
        },
      },
    });

    queueMicrotask(() => {
      secret.bind(proseMirrorContainerEl.parentElement);
    });
  }

  // Create Editor element and put it in the contents element.
  onMount(() => {
    const element = foundry.applications.elements.HTMLProseMirrorElement.create(
      foundry.utils.mergeObject(editorOptions, {
        enriched: enriched ?? content,
      }),
    );

    proseMirrorContainerEl.innerHTML = element.outerHTML;

    bindSecretUi();
  });
</script>

<div
  id={editorContainerId}
  style="display: contents;"
  class={$$restProps.class ?? ''}
  bind:this={proseMirrorContainerEl}
  use:onEditorActivation
></div>
