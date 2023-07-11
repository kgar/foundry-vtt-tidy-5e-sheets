export function mapDatasetToDataAttributes(
  dataset: Record<string, unknown> | undefined | null
) {
  if (!dataset) {
    return [];
  }

  let data = {};
  for (let key in dataset) {
    data = { ...data, ['data-' + key]: dataset[key] };
  }
  return data;
}
