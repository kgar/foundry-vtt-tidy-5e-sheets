<script lang="ts">
  interface Props {
    spell: any;
    spellComponentLabels: Record<string, string>;
  }

  let { spell, spellComponentLabels }: Props = $props();
</script>

{#each spell.labels.components.all as component}
  <span
    class="spell-component"
    class:spell-tag={component.tag}
    title={spellComponentLabels[component.abbr] ?? component.abbr}
    >{component.abbr}</span
  >
{/each}

<style lang="less">
  .spell-component.spell-tag {
    color: var(--t5e-background);
    background: var(--t5e-tertiary-color);
    border-radius: 0.125rem;
    padding: 0.0625rem 0.0625rem 0 0.0625rem;
    margin: 0 0 0 0.0625rem;
    line-height: 0.75rem;
  }
</style>
