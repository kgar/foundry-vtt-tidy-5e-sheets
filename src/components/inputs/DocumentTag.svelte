<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';

  type Props = {
    document: any;
    field: string;
    value?: string;
    disabled?: boolean;
    id?: string;
    type?: string;
  };

  let { document, field, disabled, value, id, type }: Props = $props();

  let uuid = $state('');

  let docPromise = $derived(fromUuid(value));

  let placeholder = $derived(
    game.i18n.format('HTMLDocumentTagsElement.PLACEHOLDER', {
      type: game.i18n.localize(
        type ? getDocumentClass(type).metadata.label : 'DOCUMENT.Document',
      ),
    }),
  );

  const localize = FoundryAdapter.localize;

  async function setTag() {
    try {
      uuid = uuid.trim();

      validateInput();

      await document.update({
        [field]: uuid,
      });
    } catch (e: any) {
      ui.notifications.error(e.message);
    } finally {
      uuid = '';
    }
  }

  function validateInput() {
    // Require the UUID to be theoretically valid
    const {
      type: submittedDocumentType,
      id,
      collection,
    } = foundry.utils.parseUuid(uuid) ?? {};
    if (!collection || !foundry.data.validators.isValidId(id)) {
      throw new Error(
        `Provided UUID "${uuid}" does not contain a valid document ID "${id}"`,
      );
    }

    // Require specific Document type
    if (type && submittedDocumentType !== type) {
      throw new Error(
        `Incorrect document type "${submittedDocumentType}" provided to document tag field which requires` +
          `"${type}" documents.`,
      );
    }
  }

  async function removeTag() {
    await document.update({
      [field]: null,
    });
  }

  function handleKeydown(
    event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    if (event.key !== 'Enter') {
      return;
    }

    return setTag();
  }

  function handleDrop(
    event: DragEvent & { currentTarget: EventTarget & HTMLSpanElement },
  ) {
    const data = foundry.applications.ux.TextEditor.getDragEventData(event);

    if (!data.uuid) {
      return;
    }

    uuid = data.uuid;

    setTag();
  }
</script>

<!-- Handle ondrop, enforce type -->
<span class="string-tags" ondrop={handleDrop}>
  <span class="string-tags-control">
    <input
      {placeholder}
      {id}
      {disabled}
      type="text"
      bind:value={uuid}
      onkeydown={handleKeydown}
    />
    <button {disabled} type="button" class="button" onclick={setTag}>
      <i class="fa-solid fa-add"></i>
      {localize('DND5E.Add')}
    </button>
  </span>
  {#if !isNil(value)}
    <span class="string-tags-selected pills">
      <span
        class={[
          'pill',
          {
            'text-color-disabled': disabled,
          },
        ]}
      >
        <span>
          {#await docPromise}
            {value}
          {:then maybeDoc}
            {maybeDoc?.name ?? value}
          {/await}
        </span>
        <button
          type="button"
          class="button button-borderless button-icon-only"
          onclick={(ev) => removeTag()}
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
    </span>
  {/if}
</span>
