<script lang="ts" generics="TItem">
  import type { Snippet } from 'svelte';
  import { flip } from 'svelte/animate';
  import type { ClassValue } from 'svelte/elements';
  import { crossfade } from 'svelte/transition';

  const [send, receive] = crossfade({});

  interface Props {
    selectedItemClasses?: ClassValue;
    items: TItem[];
    labelProp: keyof TItem;
    valueProp: keyof TItem;
    selectedItemIndex?: number | null;
    draggable?: boolean;
    listItemClasses?: ClassValue;
    itemTemplate?: Snippet<[any]>;
    onselect?: (selectedIndex: number) => void;
    onkeydown?: (event: KeyboardEvent & { currentTarget: HTMLElement }) => void;
    ondragstart?: (detail: {
      item: TItem;
      index: number;
      event: DragEvent;
    }) => void;
    ondragend?: (detail: {
      item: TItem;
      index: number;
      event: DragEvent;
    }) => void;
    onlistboxDrop?: (event: DragEvent) => void;
    ondrop?: (detail: { item: TItem; index: number; event: DragEvent }) => void;
    ondragover?: (detail: {
      item: TItem;
      index: number;
      event: DragEvent;
    }) => void;
    ondragenter?: (detail: {
      item: TItem;
      index: number;
      event: DragEvent;
    }) => void;
    ondragleave?: (detail: {
      item: TItem;
      index: number;
      event: DragEvent;
    }) => void;
    [key: string]: any;
  }

  let {
    selectedItemClasses,
    items = $bindable([]),
    labelProp,
    valueProp,
    listItemClasses,
    selectedItemIndex = $bindable(null),
    draggable = false,
    itemTemplate,
    onselect,
    onkeydown,
    ondragstart,
    ondragend,
    onlistboxDrop,
    ondrop,
    ondragover,
    ondragenter,
    ondragleave,
    ...rest
  }: Props = $props();

  interface $$Slots {
    itemTemplate: { item: TItem };
  }

  let idRandomizer = Math.random().toString().substring(2);

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

    onkeydown?.(ev);
  }

  function selectItemAt(index: number) {
    selectedItemIndex = index;
    onselect?.(index);
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
  ondrop={(ev) => onlistboxDrop?.(ev)}
>
  {#each items as item, i (item[valueProp])}
    {@const isSelected = selectedItemIndex === i}
    <li
      id="listbox-item-{i}-{idRandomizer}"
      role="option"
      aria-selected={selectedItemIndex === i}
      class={[
        'flex-row',
        'small-gap',
        'align-items-center',
        'listbox-item',
        listItemClasses,
        {
          focused: isSelected,
        },
        isSelected ? selectedItemClasses : undefined,
      ]}
      onclick={() => selectItemAt(i)}
      onkeydown={(ev) => handleListboxKeyDown(ev)}
      {draggable}
      ondragstart={(ev) => ondragstart?.({ event: ev, item, index: i })}
      ondragend={(ev) => ondragend?.({ event: ev, item, index: i })}
      ondrop={(ev) => ondrop?.({ event: ev, item, index: i })}
      ondragover={(ev) => ondragover?.({ event: ev, item, index: i })}
      ondragenter={(ev) => ondragenter?.({ event: ev, item, index: i })}
      ondragleave={(ev) => ondragleave?.({ event: ev, item, index: i })}
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
