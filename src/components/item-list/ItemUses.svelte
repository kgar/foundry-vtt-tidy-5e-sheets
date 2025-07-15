<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    item: any;
  }

  let { item }: Props = $props();

  function onUsesMaxChanged(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    item: any,
  ) {
    let uses = parseInt(event.currentTarget.value ?? item.system.uses.max ?? 0);

    if (isNaN(uses)) {
      uses = 0;
    }

    return item.update({ 'system.uses.max': uses });
  }
</script>

<div class="inline-item-uses">
  <input
    class="uses-value"
    type="text"
    value={item.system.uses.value}
    onchange={(event) => {
      FoundryAdapter.handleItemUsesChanged(event, item);
    }}
    disabled={!item.isOwner}
    {@attach InputAttachments.selectOnFocus}
    data-tidy-field="system.uses.value"
  />
  /
  <input
    class="uses-max"
    type="text"
    value={item.system.uses.max}
    onchange={(event) => {
      event.preventDefault();
      event.stopPropagation();
      onUsesMaxChanged(event, item);
    }}
    disabled={!item.isOwner}
    {@attach InputAttachments.selectOnFocus}
    data-tidy-field="system.uses.max"
  />
</div>
