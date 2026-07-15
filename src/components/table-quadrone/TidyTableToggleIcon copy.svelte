<script lang="ts">
  interface Props {
    expanded?: boolean;
  }

  let { expanded = true }: Props = $props();
</script>

<div class={['button', 'expand-button', expanded ? 'expanded' : 'collapsed']}>
  <i class="fas fa-chevron-right"></i>
</div>
