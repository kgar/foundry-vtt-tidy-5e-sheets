<script lang="ts">
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  const [send, receive] = crossfade({});

  type TItem = $$Generic;
  interface Props {
    items: TItem[];
    labelProp: keyof TItem;
    valueProp: keyof TItem;
    selectedItemIndex?: number | null;
    draggable?: boolean;
    itemTemplate?: import('svelte').Snippet<[any]>;
    [key: string]: any;
  }

  let {
    items = $bindable([]),
    labelProp,
    valueProp,
    selectedItemIndex = $bindable(null),
    draggable = false,
    itemTemplate,
    ...rest
  }: Props = $props();

  interface $$Slots {
    itemTemplate: { item: TItem };
  }

  let idRandomizer = Math.random().toString().substring(2);

  const dispatcher = createEventDispatcher<{
    select: number;
    keydown: KeyboardEvent & { currentTarget: HTMLElement };
    dragstart: { item: TItem; index: number; event: DragEvent };
    dragend: { item: TItem; index: number; event: DragEvent };
    listboxDrop: { event: DragEvent };
    drop: { item: TItem; index: number; event: DragEvent };
    dragover: { item: TItem; index: number; event: DragEvent };
    dragenter: { item: TItem; index: number; event: DragEvent };
    dragleave: { item: TItem; index: number; event: DragEvent };
  }>();

  let listbox: HTMLElement;

  function handleListboxKeyDown(
    ev: KeyboardEvent & { currentTarget: HTMLElement },
  ) {
    if (items.length) {
      const currentIndex = selectedItemIndex ?? -1;

      if (ev.key === 'ArrowUp' && !ev.altKey) {
        selectItemAt(Math.max(0, currentIndex - 1));
        ev.preventDefault();
      } else if (ev.key === 'ArrowDown' && !ev.altKey) {
        selectItemAt(Math.min(items.length - 1, currentIndex + 1));
        ev.preventDefault();
      } else if (ev.key === 'Home') {
        selectItemAt(0);
        ev.preventDefault();
      } else if (ev.key === 'End') {
        selectItemAt(items.length - 1);
        ev.preventDefault();
      }

      listbox
        .querySelector(`#listbox-item-${selectedItemIndex}-${idRandomizer}`)
        ?.scrollIntoView({ block: 'nearest' });
    }

    dispatcher('keydown', ev);
  }

  function selectItemAt(index: number) {
    selectedItemIndex = index;
    dispatcher('select', index);
  }
</script>

<ul
  bind:this={listbox}
  role="listbox"
  class="listbox {rest.class ?? ''}"
  aria-activedescendant={selectedItemIndex !== null
    ? `listbox-item-${selectedItemIndex}-${idRandomizer}`
    : null}
  tabindex="0"
  onkeydown={handleListboxKeyDown}
  ondrop={(ev) => dispatcher('listboxDrop', { event: ev })}
>
  {#each items as item, i (item[valueProp])}
    <li
      id="listbox-item-{i}-{idRandomizer}"
      role="option"
      aria-selected={selectedItemIndex === i}
      class:focused={selectedItemIndex === i}
      class="flex-row small-gap align-items-center"
      onclick={() => selectItemAt(i)}
      onkeydown={(ev) => handleListboxKeyDown(ev)}
      {draggable}
      ondragstart={(ev) =>
        dispatcher('dragstart', { event: ev, item, index: i })}
      ondragend={(ev) => dispatcher('dragend', { event: ev, item, index: i })}
      ondrop={(ev) => dispatcher('drop', { event: ev, item, index: i })}
      ondragover={(ev) => dispatcher('dragover', { event: ev, item, index: i })}
      ondragenter={(ev) =>
        dispatcher('dragenter', { event: ev, item, index: i })}
      ondragleave={(ev) =>
        dispatcher('dragleave', { event: ev, item, index: i })}
      animate:flip={{ duration: 150 }}
      in:receive={{ key: item[valueProp] }}
      out:send={{ key: item[valueProp] }}
    >
      {#if draggable}
        <i class="drag-grip fa-solid fa-grip-lines fa-fw"></i>
      {/if}
      {#if itemTemplate}{@render itemTemplate({ item })}{:else}
        {item[labelProp]}
      {/if}
    </li>
  {/each}
</ul>
