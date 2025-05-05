<script lang="ts">
  type Props = {
    key: string;
    label: string;
    shortLabel: string;
    proficient: boolean;
    score: number;
    bonus: number;
    save: number;
    unlocked?: boolean;
  };
  let {
    key,
    label,
    shortLabel,
    proficient,
    score,
    bonus,
    save,
    unlocked = true,
  }: Props = $props();
</script>

<div class="ability {key}">
  <div class="bonus-container" class:proficient={proficient}>
    <span class="label font-label-medium color-text-gold">{shortLabel}</span>
    <div class="flexrow">
      <span class="modifier font-label-xlarge color-text-lightest">{bonus >= 0 ? '+' : '-'}</span>
      <span class="value bonus font-data-xlarge color-text-default">{bonus >= 0 ? bonus : bonus * -1}</span>
    </div>
    {#if unlocked}
    <button
      aria-label="Configure {label}"
      type="button"
      class="button button-borderless button-icon-only button-config">
      <i class="fas fa-cog"></i>
    </button>
    {/if}
  </div>
  <div class="ability-score">
    <span class="font-title-small color-text-default">{score}</span>
  </div>
  <div class="ability-save flexrow">
    <span class="modifier font-label-medium color-text-lightest">{save >= 0 ? '+' : '-'}</span>
    <span class="value save font-data-medium color-text-default">{save >= 0 ? save : save * -1}</span>
    <span class="icon"><i class="fas fa-shield-heart"></i></span>
  </div>
</div>
