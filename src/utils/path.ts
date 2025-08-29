export function isFullUrl(path: string) {
  return (
    path.toLowerCase().startsWith('http://') ||
    path.toLowerCase().startsWith('https://') ||
    path.toLowerCase().startsWith('//')
  );
}

export function formatResourcePathForCss(path: string) {
  const prefix = isFullUrl(path)
    ? ''
    : // This backs the file directory location out of the Tidy module
      '../../';

  return prefix + path;
}
