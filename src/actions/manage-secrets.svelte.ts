export function manageSecrets(node: HTMLElement, options: { document: any }) {
  if (!options.document.isOwner) {
    return;
  }

  const secret = new HTMLSecret({
    parentSelector: `[data-field]`,
    callbacks: {
      content: (secret: HTMLElement) =>
        foundry.utils.getProperty(
          options.document.toObject(),
          secret.closest<HTMLElement>('[data-field]')!.dataset.field
        ),
      update: (secret: HTMLElement, content: string) =>
        options.document.update({
          [secret.closest<HTMLElement>('[data-field]')!.dataset.field!]:
            content,
        }),
    },
  });

  queueMicrotask(() => {
    secret.bind(node);
  });
}
