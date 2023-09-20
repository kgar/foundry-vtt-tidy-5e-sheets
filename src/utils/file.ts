export function downloadTextFile(filename: string, text: string) {
  const a = document.createElement('a');
  const blob = new Blob([text], { type: 'text/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}
