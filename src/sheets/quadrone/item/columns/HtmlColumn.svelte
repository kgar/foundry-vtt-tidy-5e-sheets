<script lang="ts">
  type Props = {
    html: string;
  };

  let { html }: Props = $props();
</script>

{@html html}
