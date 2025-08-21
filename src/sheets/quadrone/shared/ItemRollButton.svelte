<script lang="ts">
  interface Props {
    image: string;
    name: string;
    onclick: (ev: MouseEvent) => void;
    roll?: boolean;
  }

  let {
    image,
    name,
    onclick,
    roll = true,
  }: Props = $props();

  let diminished = $state(false);
  let disabled = $state(false);
  
</script>

{#if !disabled}
  <a
    class={['tidy-table-row-use-button', diminished && 'diminished']}
    onclick={onclick}
    onkeydown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && onclick(ev as unknown as MouseEvent)}
    aria-label={name}
    tabindex="0"
    role="button"
  >
    <img class="item-image" alt={name} src={image} />
    <span class="roll-prompt">
      <i class="fa {roll ? 'fa-dice-d20' : 'fa-file-magnifying-glass'}"></i>
    </span>
  </a>
{:else}

{/if}
