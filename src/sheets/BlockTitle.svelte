<script lang="ts">
  export let title: string | null = null;
  export let text: string;
</script>

<h4 class="block-title rollable" {title} on:click>
  {text}
</h4>

<style lang="scss">
  .block-title {
    position: relative;
    font-family: var(--t5e-modesto);
    font-size: 1.25rem;
    line-height: 1;
    margin: 0;
    text-transform: capitalize;
    text-align: center;

    &::after {
      display: block;
      content: '';
      height: 0;
      width: 60%;
      border-bottom: 1px solid var(--t5e-faint-color);
      position: absolute;
      left: 50%;
      bottom: -1px;
      transform: translate(-50%, 0);
    }
  }
</style>
