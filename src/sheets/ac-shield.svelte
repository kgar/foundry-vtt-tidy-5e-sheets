<script lang="ts">
  export let ac: string | number;
</script>

<div class="ac-display">
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
    on:click
    class="config-button attribute-value"
    data-attribution="attributes.ac"
    data-attribution-caption="DND5E.ArmorClass"
    data-tooltip-direction="DOWN">{ac}</a
  >
</div>

<style lang="scss">
  .ac-display {
    position: relative;
    width: 3.75rem;

    .ac-shield {
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
    }

    .attribute-value {
      // z-index: 1;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // top: 40%;
      // left: 50%;
      // -webkit-transform: translate(-50%, -50%);
      // transform: translate(-50%, -50%);
      font-size: 2.25rem;
      // height: 1.5rem;
      font-weight: 700;
      // margin: 0 auto;
      // width: 2.75rem;
    }
  }
</style>
