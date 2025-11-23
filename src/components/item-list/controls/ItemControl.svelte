<script lang="ts">
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
    import type { ClassValue } from 'svelte/elements';

  interface Props {
    iconCssClass?: ClassValue;
    iconSrc?: string | undefined;
    title?: string | undefined;
    active?: boolean;
    onclick?:
      | ((
          ev: MouseEvent & {
            currentTarget: EventTarget & HTMLButtonElement;
          },
        ) => any)
      | undefined;
    [key: string]: any;
  }

  let {
    iconCssClass = undefined,
    iconSrc = undefined,
    title = undefined,
    active = true,
    onclick = undefined,
    ...rest
  }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<button
  type="button"
  class={['item-list-button', rest.class, { inactive: !active }]}
  {onclick}
  title={title !== undefined ? localize(title) : ''}
  tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
>
  {#if iconCssClass}
    <i class={iconCssClass}></i>
  {/if}
  {#if iconSrc}
    <Dnd5eIcon src={iconSrc} />
  {/if}
</button>

<style lang="less">
  .item-list-button {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
  }
</style>
