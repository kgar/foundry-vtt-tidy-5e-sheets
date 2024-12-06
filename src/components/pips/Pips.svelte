<script lang="ts">
  interface Props {
    total?: number;
    selected?: number;
    onChange?: (change: number) => void;
  }

  let { total = 5, selected = 0, onChange }: Props = $props();

  function onPipClick(index: number) {
    if (selected === index + 1) {
      onChange?.(selected - 1);

      return;
    }

    onChange?.(index + 1);
  }

  let pipArray = $derived(Array(total));
</script>

<div class="pips">
  {#each pipArray, i}
    <button
      type="button"
      class="pip"
      class:inactive={selected < i + 1}
      class:active={selected >= i + 1}
      class:last-selected={selected === i + 1}
      onclick={() => onPipClick(i)}><i></i></button
    >
  {/each}

  <span aria-hidden="true" style="display: none" class="pip-end"></span>
</div>
