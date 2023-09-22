export function downloadTextFile(filename: string, text: string) {
  const a = document.createElement('a');
  const blob = new Blob([text], { type: 'text/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}

export function getSingleFileFromDropEvent(
  ev: DragEvent & {
    currentTarget: EventTarget & HTMLElement;
  }
): File | null {
  ev.preventDefault();

  let file: File | null = null;
  if (ev.dataTransfer?.items) {
    file = ev.dataTransfer.items[0]?.getAsFile();
  } else if (ev.dataTransfer?.files) {
    file = ev.dataTransfer.files[0];
  }

  return file;
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (event) => {
      try {
        const result = event.target?.result?.toString();
        resolve(result ?? '');
      } catch (e) {
        reject(e);
      }
    });

    fileReader.readAsText(file);
  });
}
