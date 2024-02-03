import fs from 'fs';

export const loadJSON = (relativePath: string) => {
  const data = loadText(relativePath);
  return JSON.parse(data);
};

export const loadText = (relativePath: string) => {
  const data = fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  return data;
};
