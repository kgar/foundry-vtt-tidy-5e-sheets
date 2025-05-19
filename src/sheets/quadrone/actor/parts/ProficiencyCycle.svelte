<script module>
  let onOffValues = [0, 1];
  let skillToolValues = [0, 0.5, 1, 2];
</script>

<script lang="ts">
  import type { Actor5e } from 'src/types/types';
  import type { ClassValue, HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLButtonElement> {
    actor: Actor5e;
    class?: ClassValue;
    path: string;
    type: 'skill' | 'ability' | 'tool';
    value: number;
    disabled: boolean;
  }

  let {
    actor,
    class: classValue,
    path,
    type,
    value,
    disabled,
    ...rest
  }: Props = $props();

  let validValues = $derived(
    type === 'ability' ? onOffValues : skillToolValues,
  );

  async function step(up: boolean) {
    const idx = validValues.indexOf(value);
    const next = idx + (up ? 1 : validValues.length - 1);
    return await actor.update({
      [path]: validValues[next % validValues.length],
    });
  }
</script>

<button
  type="button"
  class={['button', 'button-borderless', 'button-icon-only', 'proficiency', classValue]}
  {...rest}
  onclick={() => step(true)}
  oncontextmenu={() => step(false)}
  data-proficiency={value.toString()}
  {disabled}
>
</button>
