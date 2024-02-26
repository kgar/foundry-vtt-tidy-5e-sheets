export function mapPropertiesToSave(
  allProperties: any[],
  ev: Event & { currentTarget: HTMLInputElement },
  keyToSave: string
) {
  const propertiesToSave = Object.entries(allProperties)
    .filter(
      ([key, value]: [string, any]) => key !== keyToSave && value.selected
    )
    .map(([key, _]) => key);

  if (ev.currentTarget.checked) {
    propertiesToSave.push(keyToSave);
  }

  return {
    'system.properties': propertiesToSave,
  };
}
