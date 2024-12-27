// only required for dev
// in prod, foundry loads tidy5e-sheet.js from dist, which is compiled by vite/rollup
// in dev, foundry loads this tidy5e-sheet.js file, which loads main.svelte.ts

window.global = window;
import * as TIDY5EKGAR from './main.svelte.ts';
