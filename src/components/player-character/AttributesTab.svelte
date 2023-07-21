<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/actor';
  import type { CharacterSheetContext, SheetFunctions } from 'src/types/types';

  export let context: CharacterSheetContext;
  export let sheetFunctions: SheetFunctions;

  const skillRefs = Array.from(Object.entries(context.config.skills)).map(
    (s: [key: string, value: any]) => ({
      key: s[0],
      label: s[1]['label'],
      ability: s[1]['ability'],
      skill: getSkill(s[0]),
    })
  );
  const localize = FoundryAdapter.localize;

  function getSkill(key: string): unknown {
    if (key in context.actor.system.skills) {
      return context.actor.system.skills[
        key as keyof Actor5e['system']['skills']
      ];
    }

    return null;
  }
</script>

<section class="side-panel">
  <ul class="skills-list">
    {#each skillRefs as skill}
      <li class="proficiency-row skill">
        <a
          class="config-button"
          data-action="skill"
          data-tooltip={localize('DND5E.SkillConfigure')}
        >
          <i class="fas fa-cog" />
        </a>
      </li>
    {/each}
  </ul>
</section>
<section class="main-panel">Main panel</section>

<style lang="scss">
  .side-panel {
    display: flex;
    flex-wrap: wrap;
    width: 15rem;
  }

  .main-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: initial;
    padding: 0;
    margin-left: 1rem;
    height: auto;
    overflow-x: inherit;
  }
</style>
