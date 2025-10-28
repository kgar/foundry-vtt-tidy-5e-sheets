<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  type Props = {
    document: any;
    field: string;
    value?: string[];
    disabled?: boolean;
    id?: string;
    placeholder?: string;
  };

  let { document, field, disabled, value, id, placeholder }: Props = $props();

  let fieldValue = $derived(new Set(value ?? []));

  let tag = $state('');

  const localize = FoundryAdapter.localize;

  async function addTag() {
    try {
      tag = tag.trim();

      validateTag();

      fieldValue.add(tag);

      const result = await document.update({
        [field]: Array.from(fieldValue),
      });

      if (!result) {
        fieldValue.delete(tag);
      }
    } catch (e: any) {
      ui.notifications.error(e.message);
    } finally {
      tag = '';
    }
  }

  function validateTag() {
    if (!tag) {
      throw new Error(game.i18n.localize('ELEMENTS.TAGS.ErrorBlank'));
    }

    if (fieldValue.has(tag)) {
      throw new Error(
        game.i18n.format('ELEMENTS.TAGS.ErrorNonUnique', { tag }),
      );
    }
  }

  async function removeTag(selected: string) {
    fieldValue.delete(selected);

    await document.update({
      [field]: Array.from(fieldValue),
    });
  }

  function handleKeydown(
    event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    return addTag();
  }
</script>

<span class="string-tags">
  <span class="string-tags-control">
    <input
      {placeholder}
      {id}
      {disabled}
      type="text"
      bind:value={tag}
      onkeydown={handleKeydown}
    />
    <button
      {disabled}
      type="button"
      class="button"
      onclick={addTag}
      aria-label={localize('ELEMENTS.TAGS.Add')}
      data-tooltip
    >
      <i class="fa-solid fa-add"></i>
      {localize('DND5E.Add')}
    </button>
  </span>
  {#if fieldValue.size > 0}
    <span class="string-tags-selected pills">
      {#each Array.from(fieldValue) as selected}
        <span
          class={[
            'pill',
            {
              'text-color-disabled': disabled,
            },
          ]}
        >
          <span>{selected}</span>
          <button
            type="button"
            class="button button-borderless button-icon-only"
            onclick={() => removeTag(selected)}
            aria-label={localize('ELEMENTS.TAGS.Remove')}
            data-tooltip
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </span>
      {/each}
    </span>
  {/if}
</span>
