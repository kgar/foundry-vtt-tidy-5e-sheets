<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let spell: any;

  const spellAbbreviationMap = FoundryAdapter.getSpellAbbreviationMap();
</script>

{#each spell.labels.components.all as component}
  <span
    class="spell-component {component.tag ? component.abbr : ''}"
    title={spellAbbreviationMap.get(component.abbr)}>{component.abbr}</span
  >
{/each}

<style lang="scss">
  .spell-component.C,
  .spell-component.R {
    color: var(--t5ek-background);
    background: var(--t5ek-tertiary-color);
    border-radius: 0.125rem;
    padding: 0.0625rem 0.0625rem 0 0.0625rem;
    margin: 0 0 0 0.0625rem;
    line-height: 0.75rem;
  }
</style>
