import type { Attachment } from 'svelte/attachments';
import type { HTMLAttributes } from 'svelte/elements';

/**
 * With Foundry detachable windows, the `@html` directive is not safe to use for custom
 * Foundry HTML Elements. This attachment ensures the HTML is created
 * against the window.document instead of the current node's owner document.
 * Otherwise, elements like the Secret Block element will crash on re-render
 * while detached, with an error such as
 * "custom element constructors must call super() first and must not return a different object".
 */
function safeInnerHtml(html: string): Attachment<HTMLElement> {
  const range = document.createRange();
  const content = range.createContextualFragment(html);
  
  return (element) => {
    element.replaceChildren(...content.children);
  };
}

export const UtilityAttachments = {
  safeInnerHtml,
};
