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
    color: var(--t5e-background);
    background: var(--t5e-tertiary-color);
    border-radius: 2px;
    padding: 1px 1px 0 1px;
    margin: 0px 0 0 1px;
    line-height: 12px;
  }
</style>
