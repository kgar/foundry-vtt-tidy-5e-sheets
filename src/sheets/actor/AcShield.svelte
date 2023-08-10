<script lang="ts">
  import type { Actor5e } from 'src/types/actor';

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

<div class="ac-display {cssClass}">
  <div class="ac-shield">
    <svg
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 90 100"
      xml:space="preserve"
    >
      <path
        d="M45,100C-2.6,79.3,0,12.6,0,12.6c0-2.2,1.8-4,4.4-4.6l39.1-7.9C44,0,44.5,0,45,0c0.5,0,1,0,1.4,0.1L85.5,8
                c2.6,0.5,4.4,2.4,4.4,4.6C90,12.6,92.6,79.3,45,100L45,100z"
      />
    </svg>
  </div>
  <a
    on:click={() =>
      new dnd5e.applications.actor.ActorArmorConfig(actor).render(true)}
    cssClass="align-self-flex-start"
    on:mouseover={(ev) => actor.sheet._onPropertyAttribution(ev)}
    class="config-button attribute-value"
    data-attribution="attributes.ac"
    data-attribution-caption="DND5E.ArmorClass"
    data-tooltip-direction="DOWN">{ac}</a
  >
</div>

<style lang="scss">
  .ac-display {
    position: relative;

    .ac-shield {
      width: 3.75rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      svg {
        path {
          fill: var(--t5e-light-color);
        }
      }
      margin: 0 auto;
    }

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
  }
</style>
