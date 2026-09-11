<script lang="ts">
  interface Props {
    /** 
     * Mostly used to turn on the gradient of gradientColors`. Solid
     * color if nothing is supplied.
    */
    gradientId?: string;
    gradientColors?: string[];
  }

  let { gradientId, gradientColors }: Props = $props();
  let useGradient = $derived(!!gradientId && !!gradientColors?.length);

  let stroke = $derived(
    useGradient
      ? `url(#${gradientId})`
      : 'var(--filigree-border-color, var(--t5e-color-gold))',
  );
</script>

<div class="item-image-border">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 112 107"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
  >
    {#if useGradient}
      <defs>
        <!--
          MUST USE `userSpaceOnUse` so that we style the entire filigree, not
          each individual piece separately. 0,0 -> 112,107 is ~= 135 degrees.
        -->
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="112"
          y2="107"
        >
          {#each gradientColors! as color, i}
            <stop
              offset={gradientColors!.length > 1
                ? i / (gradientColors!.length - 1)
                : 0}
              stop-color={color}
            />
          {/each}
        </linearGradient>
      </defs>
    {/if}
    <path d="M111.5 98.5V7.5L105 1H102" {stroke} />
    <path d="M0.5 98.5V7.5L7 1H10" {stroke} />
    <path d="M0.500009 8.5L0.500001 99.5L7 106L10 106" {stroke} />
    <path d="M111.5 8.5L111.5 99.5L105 106L102 106" {stroke} />
    <path
      d="M3 8.5L10 1.5H102L109 8.5V98.5L102 105.5H10L3 98.5V8.5Z"
      {stroke}
      stroke-width="2"
    />
    <path
      d="M101.5 1C105.5 4 110.5 2.5 110.5 2.5C110.5 2.5 109.5 5 109.5 10"
      {stroke}
    />
    <path d="M10.5 1C6.5 4 1.5 2.5 1.5 2.5C1.5 2.5 2.5 5 2.5 10" {stroke} />
    <path
      d="M101.5 106C105.5 103 110.5 104.5 110.5 104.5C110.5 104.5 109.5 102 109.5 97"
      {stroke}
    />
    <path
      d="M10.5 106C6.5 103 1.5 104.5 1.5 104.5C1.5 104.5 2.5 102 2.5 97"
      {stroke}
    />
  </svg>
</div>
