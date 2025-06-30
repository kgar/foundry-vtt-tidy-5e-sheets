<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ComponentWithProps } from 'src/utils/component';
    import type { ClassValue } from 'svelte/elements';

  const localize = FoundryAdapter.localize;

  interface Props {
    label?: string;
    units?: string;
    hint?: string;
    rootId?: string;
    groupClasses?: ClassValue;
    stacked?: boolean;
    hidden?: boolean | 'until-found';
    // widget?: ComponentWithProps<any>[];
    localize?: boolean;
    inputs: ComponentWithProps<any>[];
  }
  let props: Props = $props();

  let label = $derived<string>(props.label ?? '');
  let labelFor = $derived(
    props.inputs.length === 1 ? props.inputs[0].props.id : undefined,
  );
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
  <label for={labelFor}>
    {props.localize ? localize(label) : label}
    {#if props.units}
      <span class="units">{localize(props.units)}</span>
    {/if}
  </label>
  <div class="form-fields">
    <!-- Put the input(s) here -->
    {#each props.inputs as input}
      <input.component {...input.props} />
    {/each}
  </div>
  {#if props.hint}
    <p class="hint">
      {props.localize ? localize(props.hint) : props.hint}
    </p>
  {/if}
</div>
