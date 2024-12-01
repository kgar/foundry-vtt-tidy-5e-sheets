<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  type EditorOptions =
    any /*foundry.applications.elements.HTMLProseMirrorElement.ProseMirrorInputConfig*/;

  interface Props {
    field: string;
    content: string;
    enriched?: string | null;
    editorOptions?: EditorOptions;
    documentUuid: string;
    manageSecrets?: boolean;
    [key: string]: any;
  }

  let {
    field,
    content,
    enriched = null,
    editorOptions = {},
    documentUuid,
    manageSecrets = false,
    ...rest
  }: Props = $props();

  let proseMirrorContainerEl: HTMLElement = $state();

  let actualEditorOptions = $derived(
    foundry.utils.mergeObject(
      {
        name: field,
        collaborate: false,
        compact: false,
        documentUUID: documentUuid,
        editable: true,
        height: 200,
        toggled: true,
        value: content,
        enriched: enriched ?? content,
      },
      editorOptions,
    ) as EditorOptions,
  );

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
    if (!manageSecrets || !actualEditorOptions.toggled) {
      return;
    }

    const secret = new HTMLSecret({
      parentSelector: `prose-mirror`,
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
      secret.bind(proseMirrorContainerEl);
    });
  }

  // Create Editor element and put it in the contents element.
  onMount(() => {
    const element =
      foundry.applications.elements.HTMLProseMirrorElement.create(
        actualEditorOptions,
      );

    proseMirrorContainerEl.innerHTML = element.outerHTML;

    bindSecretUi();
  });
</script>

<div
  style="display: contents;"
  class={rest.class ?? ''}
  bind:this={proseMirrorContainerEl}
  use:onEditorActivation
></div>
