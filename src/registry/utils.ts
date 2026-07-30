import type { TidyPublicUtils } from 'src/types/registry.types';

const getTabIdFromElement: TidyPublicUtils['getTabIdFromElement'] = (
  element,
) => {
  const tabDataEl = element?.closest<HTMLElement>(
    '[data-tab-contents-for], [data-tab-id]',
  );

  return (
    tabDataEl?.getAttribute('data-tab-contents-for') ??
    tabDataEl?.getAttribute('data-tab-id') ??
    null
  );
};

const getTabIdFromEvent: TidyPublicUtils['getTabIdFromEvent'] = (event) => {
  // svelte likes to eschew event.target, but we need it here
  return getTabIdFromElement((event as Event & { target: HTMLElement }).target);
};

export function getUtils(): TidyPublicUtils {
  return {
    getTabIdFromElement,
    getTabIdFromEvent,
  };
}
