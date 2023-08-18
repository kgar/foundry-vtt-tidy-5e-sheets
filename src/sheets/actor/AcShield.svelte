<script lang="ts">
  import type { Actor5e } from 'src/types/actor';
  import AcShieldBase from './AcShieldBase.svelte';

  /**
   * The Armor Class value.
   */
  export let ac: string | number = '0';

  /**
   * Optional CSS class list string to apply to the AC Shield container element.
   */
  export let cssClass: string = '';

  /**
   * The actor to whom this AC shield refers.
   */
  export let actor: Actor5e;
</script>

<AcShieldBase {cssClass}>
  <a
    on:click={() =>
      new dnd5e.applications.actor.ActorArmorConfig(actor).render(true)}
    on:mouseover={(ev) => actor.sheet._onPropertyAttribution(ev)}
    class="config-button attribute-value"
    data-attribution="attributes.ac"
    data-attribution-caption="DND5E.ArmorClass"
    data-tooltip-direction="DOWN">{ac}</a
  >
</AcShieldBase>

<style lang="scss">
  .attribute-value {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 2.25rem;
    font-weight: 700;
  }
</style>
