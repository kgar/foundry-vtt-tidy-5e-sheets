import { Tidy5eSheetsApi } from './Tidy5eSheetsApi';

let instance: Tidy5eSheetsApi;

export function getApi(): Tidy5eSheetsApi {
  if (!instance) {
    instance = new Tidy5eSheetsApi();
  }
  return instance;
}
