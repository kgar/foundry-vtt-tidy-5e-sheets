<script lang="ts">
  interface Props {
    name: string;
    uuid: string;
  }

  let { name, uuid }: Props = $props();
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<a
  role="button"
  tabindex="0"
  class="bastion-facility-name truncate"
  data-action="showDocument"
  data-uuid={uuid}
  data-tooltip={name}
  onclick={() => {
    const document = game.documents.get(uuid);
    if (document) {
      document.render(true);
    }
  }}
  onkeydown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      const document = game.documents.get(uuid);
      if (document) {
        document.render(true);
      }
    }
  }}
>
  {name}
</a>
