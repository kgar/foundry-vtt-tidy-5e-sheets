<!--
  A Tidy button. It only builds the class list; buttons.css does the styling,
  so other modules get the same look by writing the classes by hand.

  Svelte:
    <Button variant="primary" icon="fas fa-save">Save</Button>
    <Button variant="borderless" iconOnly icon="fas fa-cog" aria-label="Configure" data-tooltip="" />
    <Button toggle active={isOn}>Option</Button>

  Equivalent HTML, for other modules injecting content into a Tidy sheet:
    <button type="button" class="button button-primary">
      <i class="fas fa-save"></i> Save
    </button>
    <button type="button" class="button button-borderless button-icon-only" aria-label="Configure" data-tooltip="">
      <i class="fas fa-cog"></i>
    </button>
    <button type="button" class="button button-toggle active">Option</button>

  Classes: `button` + one variant (`button-primary`, `button-secondary`,
  `button-tertiary`, `button-borderless`), optionally `button-icon-only`,
  `button-toggle`, `button-large`, and the `active` state.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'borderless';
    iconOnly?: boolean;
    size?: 'default' | 'large';
    toggle?: boolean;
    active?: boolean;
    /** Font Awesome classes for a leading icon, e.g. `fas fa-save`. */
    icon?: string;
    class?: ClassValue;
    children?: Snippet;
  }

  let {
    variant,
    iconOnly = false,
    size = 'default',
    toggle = false,
    active = false,
    icon,
    class: cssClass,
    children,
    ...rest
  }: Props = $props();
</script>

<button
  type="button"
  class={[
    'button',
    variant && `button-${variant}`,
    iconOnly && 'button-icon-only',
    toggle && 'button-toggle',
    size === 'large' && 'button-large',
    active && 'active',
    cssClass,
  ]}
  {...rest}
>
  {#if icon}<i class={icon}></i>{#if children}{' '}{/if}{/if}{@render children?.()}
</button>
