import type { TidyPublicUtils } from 'src/types/registry.types';

const getTabIdFromElement: TidyPublicUtils['getTabIdFromElement'] = (
  element,
) => {
  return (
    element
      ?.closest<HTMLElement>('[data-tab-id]')
      ?.getAttribute('data-tab-id') ?? null
  );
};

const getTabIdFromEvent: TidyPublicUtils['getTabIdFromEvent'] = (event) => {
  return getTabIdFromElement(event.currentTarget);
};

export function getUtils(): TidyPublicUtils {
  return {
    getTabIdFromElement,
    getTabIdFromEvent,
  };
}
