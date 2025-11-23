<script lang="ts">
  interface Props {
    borderColor?: 'faint' | 'light' | 'separator';
    [key: string]: any;
  }

  let { borderColor = 'faint', ...rest }: Props = $props();
</script>

<div
  aria-hidden="true"
  role="presentation"
  class="horizontal-line-separator {borderColor} {rest.class ?? ''}"
></div>

<style lang="less">
  .horizontal-line-separator {
    height: 0.0625rem;
    flex: 0 0 auto;
  }

  .faint {
    background: var(--t5e-faint-color);
  }

  .light {
    background: var(--t5e-separator-color);
  }

  .separator {
    background: var(--t5e-separator-color);
  }
</style>
