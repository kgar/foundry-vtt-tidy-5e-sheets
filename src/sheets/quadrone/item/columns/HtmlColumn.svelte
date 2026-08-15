<script lang="ts">
  import SafeHtml from 'src/attachments/SafeHtml.svelte';

  type Props = {
    html: string;
  };

  let { html }: Props = $props();
</script>

<SafeHtml {html} />
