<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  const localize = FoundryAdapter.localize;

  interface Props {
    label?: string;
    labelFor?: string;
    units?: string;
    hint?: string;
    rootId?: string;
    groupClasses?: ClassValue;
    stacked?: boolean;
    hidden?: boolean | 'until-found';
    localize?: boolean;
    children?: Snippet;
  }
  let props: Props = $props();

  let label = $derived<string>(props.label ?? '');
</script>

<div
  class={[
    'form-group',
    {
      stacked: props.stacked,
      hidden: props.hidden,
    },
    props.groupClasses,
  ]}
>
  <label for={props.labelFor}>
    {props.localize ? localize(label) : label}
    {#if props.units}
      <span class="units">{localize(props.units)}</span>
    {/if}
  </label>
  <div class="form-fields">
    {#if props.children}
      {@render props.children()}
    {/if}
  </div>
  {#if props.hint}
    <p class="hint">
      {@html props.localize ? localize(props.hint) : props.hint}
    </p>
  {/if}
</div>
